const express = require('express');
const mssql=require('mssql');
const moment = require('moment');
const router = express.Router();
var pool = new mssql.ConnectionPool({
  user: 'admin',
  password:'E1o9m9u9r',
  server: 'localhost',
  port: 1444,
  database: 'dentalClinic',
  options:{
    "enableArithAbort": true
  }
})
var request = new mssql.Request(pool);

router.post("/userValidate",(req, res)=>{
  console.log(req.body);
  var pool = new mssql.ConnectionPool({
    user: req.body.user,
    password: req.body.password,
    server: 'localhost',
    port: 1444,
    database: 'dentalClinic',
    options:{
      "enableArithAbort": true
    }
  })
  pool.connect((err,result)=>{
    if (err) {
      console.log(result);
      res.render("index.html",{estado:'Failed',title:'Usuario sesion'})
    }else {
      res.render("index.html",{estado:'Success',title:'Usuario sesion'})

    }
  });
});
/*Handler de la ruta /home*/
router.get("/home",(req, res) => {
  console.log(req.connection.remoteAddress);
res.render("index.html",{estado:'neutral',title:'Usuario sesion'})
});

/*Controladores de rutas via GET o POST*/
router.get("/citas",(req, res) => {
  res.render('citas.html',{title:"Citas",ruta:req.url});/*funcion render del objeto res que devuelve el archivo index.ejs y lo evalua para colocarle la variable Contact en donde corresponda*/
});
router.get("/citas/add",(req, res) => {
  res.render('citas.html',{title:"Cita - Paciente",ruta:req.url,estado:'neutral',sujeto:null});/*funcion render del objeto res que devuelve el archivo index.ejs y lo evalua para colocarle la variable Contact en donde corresponda*/
});



router.get("/citas/search",(req,res)=>{
  res.render("citas.html",{ruta:req.url,title:'Citas - Paciente',sujeto:null,estado:'neutral'});
});
router.get('/citas/citaAgend/:identificacion',(req,res)=>{
    pool.connect((err, result)=>{
        if (err) {
          throw err;
        }else{
          request.query("select idP, nombre, identificacion, sexo, apellido from paciente where idP="+req.params.identificacion+"",(err,result)=>{
            if (err){
              throw err;
            }else{
              request.query("select id, nombre, apellido, especialidad from doctor",(err,resultDoc)=>{
              if(err){
                throw err;
              }else{
                res.render('citas.html',{estado:'neutral',ruta:'/citas/add',title:'Citas - Agenda',sujeto2:resultDoc,sujeto:result.recordset[0]});
                pool.close();
              }
            });
          }
        });
      }
    });
  });
router.post("/citas/search",(req,res)=>{
  pool.connect((err,result)=>{
    if (err){
      throw err;
    }else{
      request.query("select idP,nombre,apellido,sexo,identificacion,ciudad,barrio,telefono from paciente where nombre LIKE '%"+req.body.subject+"%' or identificacion LIKE '%"+req.body.subject+"%' or telefono LIKE '%"+req.body.subject+"%'",(err,result)=>{
        if(err){
          throw err;
        }else{
          res.render("citas.html",{ruta:req.url,title:"Citas - Agregar",sujeto:result,estado:'neutral'});
          pool.close();
        }
      });
    }
  });
});
router.get("/citas/lookup",(req,res)=>{
  res.render("citas.html",{estado:'neutral',sujeto:null,title:'Citas - Buscar',ruta:'/citas/lookup'});
});
router.post("/citas/lookup",(req,res)=>{
  pool.connect((err,result)=>{
    if (err){
      throw err;
    }else{
      request.query("select idP,nombre,apellido,sexo,identificacion,ciudad,barrio,telefono from paciente where nombre LIKE '%"+req.body.subject+"%' or identificacion LIKE '%"+req.body.subject+"%' or telefono LIKE '%"+req.body.subject+"%'",(err,result)=>{
        if(err){
          throw err;
        }else{
          //console.log(result);
          res.render("citas.html",{ruta:req.url,title:"Citas - Buscar",sujeto:result,estado:'neutral'});
          pool.close();
        }
      });
    }
  });
});
router.get("/citas/citasLookUp/:identificacion",(req,res)=>{
  pool.connect((err,result)=>{
    console.log(req.params.identificacion);
    if (err) {
      throw err;
    }else{
      request.query("select nombre from paciente where idP="+req.params.identificacion+"",(err,resultPac)=>{
        if (err) {
          throw err;
        }else{
          if (result.recordset==0) {
            res.render("citas.html",{sujeto2:null,ruta:"showCites",title:"Citas - Paciente"});
          }else{
            request.query("select nombrePac,apellidoPac,nombreDoc,concepto,fecha,hora from cita where nombrePac='"+resultPac.recordset[0].nombre+"'",(err,result)=>{
              if (err) {
                throw err;
              }else{

                console.log(result.recordset[0].fecha);
                res.render("citas.html",{sujeto2:result,ruta:"showCites",title:"Citas - Paciente",moment:moment});
                pool.close();
              }
            });

          }
        }
      });
    }
  });
});
router.post("/agendCita",(req,res)=>{
  console.log(req.body);
  pool.connect((err,result)=>{
    if(err){
      throw err;
    }else{
      request.query("select nombre from doctor where id="+req.body.docId+"",(err,result)=>{
        console.log(result);
        if (err) {
          throw err;
        }else{
          console.log(req.body.citaFecha);
          request.query("insert into cita(nombrePac,apellidoPac,nombreDoc,fecha,concepto,estado,hora) values('"+req.body.userName+"','"+req.body.userLastName+"','"+result.recordset[0].nombre+"','"+req.body.citaFecha+"','"+req.body.citaConcept+"',"+1+",'"+req.body.citaHora+"')",async (err,result)=>{
            if (err) {
              throw err
            }else{
              res.render("citas.html",{ruta:"/citas/search",title:"Citas - Añadida",sujeto:null,estado:'Success'});//Esta linea no se ejecuta en el servidor debido a JQuery, lo hace el en el navegador
              pool.close();
            }
          });
        }
      });
    }
  });
});
router.get("/citas/pendientes",(req, res)=>{
  res.render("citas.html",{ruta:req.url,title:"Citas - Pendientes",sujeto:null,estado:"neutral"});
});
router.post("/citas/pendientes",(req, res)=>{
  pool.connect((err, result)=>{
    if (err) {
      throw err;
    }else{
      request.query("select idP,nombre,apellido,sexo,identificacion,ciudad,barrio,telefono from paciente where nombre LIKE '%"+req.body.subject+"%' or identificacion LIKE '%"+req.body.subject+"%' or telefono LIKE '%"+req.body.subject+"%'",(err,result)=>{
        if (err) {
          throw err;
        }else{
          res.render("citas.html",{ruta:"/citas/pendientes",title:"Citas - Pendientes",sujeto:result,estado:'neutral'});
          pool.close();
        }
      });
    }
  });
});
router.get("/citas/citaPendient/:identificacion",(req,res)=>{
  pool.connect((err,result)=>{
    if (err) {
      throw err;
    }else{
      request.query("select nombre from paciente where idP="+req.params.identificacion+"",(err,resultPac)=>{
        if (err) {
          throw err;
        }else{
          if (result.recordset==0) {
            res.render("citas.html",{sujeto2:null,ruta:"showPendientCites",title:"Citas - Paciente"});
          }else{
            request.query("select nombrePac,apellidoPac,nombreDoc,concepto,fecha,hora, estado from cita where nombrePac='"+resultPac.recordset[0].nombre+"' and estado=1",(err,result)=>{
              if (err) {
                throw err;
              }else{
                res.render("citas.html",{sujeto2:result,ruta:"showPendientCites",title:"Citas - Paciente",moment:moment});
                pool.close();
              }
            });
          }
        }
      });
    }
  });
});
router.get("/citas/reprogramar",(req,res)=>{
  res.render("citas.html",{ruta:req.url,title:"Citas - Reprogramar",sujeto:null,estado:"neutral"});
});
router.post("/citas/reprogramar",(req, res)=>{
  pool.connect((err, result)=>{
    if (err) {
      throw err;
    }else{
      request.query("select idP,nombre,apellido,sexo,identificacion,ciudad,barrio,telefono from paciente where nombre LIKE '%"+req.body.subject+"%' or identificacion LIKE '%"+req.body.subject+"%' or telefono LIKE '%"+req.body.subject+"%'",(err,result)=>{
        if (err) {
          throw err;
        }else{
          res.render("citas.html",{ruta:"/citas/reprogramar",title:"Citas - Pendientes",sujeto:result,estado:'neutral'});
          pool.close();
        }
      });
    }
  });
});
router.get("/citas/citaRepro/:identificacion",(req ,res)=>{
  pool.connect((err,result)=>{
    if (err) {
      throw err;
    }else{
      request.query("select nombre from paciente where idP="+req.params.identificacion+"",(err,resultPac)=>{
        if (err) {
          throw err;
        }else{
          if (result.recordset==0) {
            res.render("citas.html",{sujeto2:null,ruta:"showPacientCitesR",title:"Citas - Paciente"});
          }else{
            request.query("select id, nombrePac,apellidoPac,nombreDoc,concepto,fecha,hora, estado from cita where nombrePac='"+resultPac.recordset[0].nombre+"'",(err,result)=>{
              if (err) {
                throw err;
              }else{
                res.render("citas.html",{sujeto2:result,ruta:"showPacientCitesR",title:"Citas - Paciente",moment:moment,estado:'neutral'});
                pool.close();
              }
            });
          }
        }
      });
    }
  });
});
router.get("/citarepro/:identificacion",(req, res)=>{
  pool.connect((err,result)=>{
    if (err) {
      throw err;
    }else {
      request.query("select id, nombrePac, nombreDoc, apellidoPac, concepto, hora, fecha from cita where id="+req.params.identificacion+"",(err, result)=>{
        if (err) {
          throw err;
        }else {
          console.log(result);
          request.query("select nombre, apellido, identificacion, sexo from paciente where nombre='"+result.recordset[0].nombrePac+"'",(err,result2)=>{
            if (err) {
              throw err;
            }else {
              request.query("select id, nombre, apellido, especialidad from doctor",(err,resultDoc)=>{
                res.render("citas.html",{ruta:'citasForEditCard',sujeto:result2.recordset[0],sujeto2:resultDoc,sujeto3:result.recordset[0],title:'Citas - Reprogramacion'});
                pool.close();
              });
            }
          });

        }

      });
    }
  });
});
router.post("/agendCitaUpdate",(req,res)=>{
  pool.connect((err,result)=>{
    if(err){
      throw err;
    }else{
      request.query("select nombre from doctor where id="+req.body.docId+"",(err,result)=>{
        console.log(result);
        if (err) {
          throw err;
        }else{
          console.log(req.body.citaFecha);
          request.query("update cita set nombrePac='"+req.body.userName+"',apellidoPac='"+req.body.userLastName+"',nombreDoc='"+result.recordset[0].nombre+"',fecha='"+req.body.citaFecha+"',concepto='"+req.body.citaConcept+"',estado=1,hora='"+req.body.citaHora+"' where id = "+req.body.citaId+"",(err,result)=>{
            if(err){
              throw err;
            }else{
              res.render("citas.html",{ruta:"/citas/reprogramar",title:"Citas - actualizada",sujeto:null,estado:'Success'});//Esta linea no se ejecuta en el servidor debido a JQuery, lo hace el en el navegador
              pool.close();
            }
          });
        }
      });
    }
  });
});
router.get("/citas/delete",(req, res)=>{
  res.render("citas.html",{ruta:req.url,sujeto:null,estado:'neutral',title:'Citas - Eliminar'});
});
router.post("/citas/delete",(req,res)=>{
  pool.connect((err,result)=>{
    if (err){
      throw err;
    }else{
      request.query("select idP,nombre,apellido,sexo,identificacion,ciudad,barrio,telefono from paciente where nombre LIKE '%"+req.body.subject+"%' or identificacion LIKE '%"+req.body.subject+"%' or telefono LIKE '%"+req.body.subject+"%'",(err,result)=>{
        if(err){
          throw err;
        }else{
          console.log(result);
          res.render("citas.html",{ruta:"/citas/delete",title:"Citas - Eliminar",sujeto:result, estado:'neutral'});
          pool.close();
        }
      });
    }
  });
});
router.get("/citas/citaDelete/:identificacion",(req,res)=>{
  pool.connect((err,result)=>{
    if (err) {
      throw err;
    }else{
      request.query("select nombre from paciente where idP="+req.params.identificacion+"",(err,resultPac)=>{
        if (err) {
          throw err;
        }else{
          if (result.recordset==0) {
            res.render("citas.html",{sujeto2:null,ruta:"citasDeleteShow",title:"Citas - Paciente"});
          }else{
            request.query("select id,nombrePac,apellidoPac,nombreDoc,concepto,fecha,hora, estado from cita where nombrePac='"+resultPac.recordset[0].nombre+"'",(err,result)=>{
              console.log(result.recordset[0].id);
              if (err) {
                throw err;
              }else{
                res.render("citas.html",{sujeto2:result,ruta:"citasDeleteShow",title:"Citas - Paciente",moment:moment});
                pool.close();
              }
            });
          }
        }
      });
    }
  });
});
router.get("/deleteCite/:identificacion",(req,res)=>{
  pool.connect((err,result)=>{
    request.query("delete cita where id="+req.params.identificacion+"",(err,result)=>{
      res.render("citas.html",{ruta:"/citas/delete", estado:'Success',sujeto:null,title:"Citas - Eliminada"});
    });
  });
});
router.get("/doctor",(req, res) => {
  res.render('doctor.html',{title:"Doctor",ruta:'/doctor'});/*funcion render del objeto res que devuelve el archivo index.ejs y lo evalua para colocarle la variable Contact en donde corresponda*/
});
router.get("/doctor/add",(req, res)=>{
  res.render("doctor.html",{estado:'neutral',ruta:req.url,title:'Doctor - Añadir'});
});
router.post("/newDoctor",(req, res)=>{
  pool.connect((err, result)=>{
    //const {userName,userLastName,userIde,userGender,userBirth,civil,userTel,userBarrio,userCiudad,userDomicilio}=req.body;
    if (err) {
      throw err;
    }else {
      //request.query("insert into paciente(nombre) values('"+req.body.userName+"')",(err, result) => {
      request.query("select nombre from doctor where nombre='"+req.body.userName+"'", (err, result) => {//Consulta para buscar al paciente
        console.log(result);
        if(err){
          throw err;
        }
        if(result.recordset.length > 0){
           res.render('doctor.html',{title:"Existe",ruta:'/doctor/add',estado: 'Failed'});//Renderiza la pagina con un mensaje de error
           pool.close();
        }else{//Si la consulta no retorna ningun registro, entonces no existe este paciente, y se puede añadir
          request.query("insert into doctor(nombre, apellido, cedula, sexo, fechNac, ciudad, telefono, domicilio, especialidad, salario) values('"+req.body.userName+"','"+req.body.userLastName+"','"+req.body.userIde+"','"+req.body.userGender+"','"+req.body.userBirth+"','"+req.body.userCiudad+"','"+req.body.userTel+"','"+req.body.userDomicilio+"','"+req.body.userEspec+"','"+req.body.userSal+"')", (err, result) => {//Inserta el paciente en la BD
            if (err){//Si se presentan errores durante la insercion
              throw err;
                res.render('doctor.html',{title:"Error",ruta:'/doctor/add',estado: 'Failed'});//Renderiza la pagina con un mensaje de error
                pool.close();
              }else{//Si no se presentan errores durante la insercion
                res.render('doctor.html',{title:"Doctor - Añadido",ruta:'/doctor/add',estado: 'Success'});//Renderiza la pagina con un mensaje de satisfactorio
                pool.close();
              }
          });
        }
      });
    //res.render('pacientes.html',{title:"Pacientes",ruta:req.url,estado: 'Conexion con SQL exitosa'});/*funcion render del objeto res que devuelve el archivo index.ejs y lo evalua para colocarle la variable Contact en donde corresponda*/
    }
  });
});
router.get("/doctor/delete",(req,res)=>{
  res.render("doctor.html",{ruta:req.url,estado:'neutral',title:'Doctro - Eliminar',sujeto:null});
});
router.post("/deleteDoctor",(req,res)=>{
  pool.connect((err,result)=>{
    if(err){
      throw err;
    }else{
      request.query("select id, nombre, apellido, cedula, sexo, ciudad, telefono from doctor where nombre LIKE '%"+req.body.subject+"%' or cedula LIKE '%"+req.body.subject+"%' or telefono LIKE '%"+req.body.subject+"%'", (err,result)=>{
        if (err){
          throw err;
        }else{
          console.log(result.recordset.length);
          res.render("doctor.html",{title:'Doctor - Lista',sujeto:result,ruta:req.url,estado:'neutral'});
          }
      });
    }
  });
});
router.get("/doctorDelete/:identificacion",(req, res)=>{
  pool.connect((err,result)=>{
    if (err){
      throw err;
    }else{
      console.log(req.params.identificacion);
      request.query("delete doctor where id='"+req.params.identificacion+"'",(err, result)=>{
        console.log(result.rowsAffected);
        if(err){
          throw err;
        }else if(result.rowsAffected>0){
        console.log("Doctor Eliminado");
        res.render("doctor.html",{title:"Doctor - Eliminar",ruta:"/deleteDoctor",estado:'Success',sujeto:null});
      }else if(result.rowsAffected==0){
        res.render("doctor.html",{title:"Doctor - Eliminar",ruta:"/deleteDoctor",estado:'Failed',sujeto:null});
      }
    });
}
});
});
router.get("/doctor/lookup",(req, res)=>{
  res.render("doctor.html",{ruta:req.url,title:"Doctor - Mostrar",sujeto:null});
});
router.post("/doctor/showAll",(req, res)=>{
  pool.connect((err,result)=>{
    if (err){
      throw err;
    }else{
      request.query("select id,nombre,apellido,sexo,cedula,ciudad,telefono from doctor where nombre LIKE '%"+req.body.subject+"%' or cedula LIKE '%"+req.body.subject+"%' or telefono LIKE '%"+req.body.subject+"%'",(err,result)=>{
        if(err){
          throw err;
        }else{
          console.log(result);
          res.render("doctor.html",{ruta:"/doctor/lookup",title:"Doctor - Mostrar",sujeto:result});
        }
      });
    }
  });
});
router.get("/modifyDoctor",(req, res)=>{
  pool.connect((err,result)=>{
    if(err){
      throw err;
    }else{
      //request.query("select nombre, apellido, identificacion, sexo, ciudad, telefono from paciente where nombre='"+req.body.subject+"' or identificacion='"+req.body.subject+"' or telefono='"+req.body.subject+"'", (err,result)=>{
      request.query("select id, nombre, apellido, cedula, sexo, ciudad, telefono from doctor where nombre LIKE '%"+req.body.subject+"%' or cedula LIKE '%"+req.body.subject+"%' or telefono LIKE '%"+req.body.subject+"%'", (err,result)=>{
        if (err){
          throw err;
        }else{
          console.log(result.recordset.length);
          res.render("doctor.html",{title:'Doctor - Lista',sujeto:result,ruta:req.url,estado:'neutral'});
          }
      });
    }
  });
});
router.post("/modifyDoctor",(req, res)=>{
  pool.connect((err,result)=>{
    if(err){
      throw err;
    }else{
      //request.query("select nombre, apellido, identificacion, sexo, ciudad, telefono from paciente where nombre='"+req.body.subject+"' or identificacion='"+req.body.subject+"' or telefono='"+req.body.subject+"'", (err,result)=>{
      request.query("select id, nombre, apellido, cedula, sexo, ciudad, telefono from doctor where nombre LIKE '%"+req.body.subject+"%' or cedula LIKE '%"+req.body.subject+"%' or telefono LIKE '%"+req.body.subject+"%'", (err,result)=>{
        if (err){
          throw err;
        }else{
          console.log(result.recordset.length);
          res.render("doctor.html",{title:'Doctor - Lista',sujeto:result,ruta:req.url,estado:'neutral'});
          pool.close();
          }
      });
    }
  });
});
router.get("/doctorModify/:identificacion",(req, res)=>{
  pool.connect((err, result)=>{
    //const {userName,userLastName,userIde,userGender,userBirth,civil,userTel,userBarrio,userCiudad,userDomicilio}=req.body;
    if (err) {
      throw err;
    }else {
      //request.query("insert into paciente(nombre) values('"+req.body.userName+"')",(err, result) => {
      request.query("select id, nombre, apellido, sexo, cedula, telefono, ciudad, domicilio, salario, especialidad from doctor where id='"+req.params.identificacion+"'", (err, result) => {//Consulta para buscar al paciente
        console.log(result);
        if(err){
          throw err;
        }else{
          res.render("doctor.html",{userInfo:result.recordset[0],title:"Doctor - Modificar",ruta:'userModify',estado:'neutral'});
        }
      });
    //res.render('pacientes.html',{title:"Pacientes",ruta:req.url,estado: 'Conexion con SQL exitosa'});/*funcion render del objeto res que devuelve el archivo index.ejs y lo evalua para colocarle la variable Contact en donde corresponda*/
    }
  });
});
router.post("/newDoctorModified/:id",(req,res)=>{
  pool.connect((err, result)=>{
    //const {userName,userLastName,userIde,userGender,userBirth,civil,userTel,userBarrio,userCiudad,userDomicilio}=req.body;
    if (err) {
      throw err;
    }else {
      request.query("update doctor set nombre='"+req.body.userName+"', apellido='"+req.body.userLastName+"', cedula='"+req.body.userIde+"', sexo='"+req.body.userGender+"', salario='"+req.body.userSal+"', ciudad='"+req.body.userCiudad+"', especialidad='"+req.body.userEspec+"', telefono='"+req.body.userTel+"', domicilio='"+req.body.userDomicilio+"' where id="+req.params.id+"", (err, result) => {//Inserta el paciente en la BD
        if (err){//Si se presentan errores durante la actualizacion
            res.render('doctor.html',{title:"Error",ruta:'/modifyDoctor',estado: 'Failed',sujeto:null});//Renderiza la pagina con un mensaje de error
            pool.close();
          }else{//Si no se presentan errores durante la actualizacion
            res.render('doctor.html',{title:"Doctor - Actualizado",ruta:'/modifyDoctor',estado: 'Success',sujeto:null});//Renderiza la pagina con un mensaje de satisfactorio
            pool.close();
          }
      });
    }
  });
});
router.get("/inventario",(req, res) => {
  res.render('inventario.html',{title:"Inventario"});/*funcion render del objeto res que devuelve el archivo index.ejs y lo evalua para colocarle la variable Contact en donde corresponda*/
});

/*Exportacion del objeto router, para su uso donde lo invoquen (index.js-src)*/
module.exports = router;
