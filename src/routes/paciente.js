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

router.get("/pacientes",(req, res) => {
  res.render('pacientes.html',{title:"Pacientes",ruta:req.url,estado: 'neutral',sujeto:null});/*funcion render del objeto res que devuelve el archivo index.ejs y lo evalua para colocarle la variable Contact en donde corresponda*/
});
router.get("/pacientes/add",(req, res) => {
  res.render('pacientes.html',{title:"Pacientes",ruta:req.url,estado: ''});
});
router.post('/newPacient', (req, res) => {
  console.log(req.body);//Muestra los datos que fueron ingresados a travez de un JSON

  pool.connect((err, result)=>{
    //const {userName,userLastName,userIde,userGender,userBirth,civil,userTel,userBarrio,userCiudad,userDomicilio}=req.body;
    if (err) {
      throw err;
    }else {
      //request.query("insert into paciente(nombre) values('"+req.body.userName+"')",(err, result) => {
      console.log(req.body.userIde);
      request.query("select nombre from paciente where identificacion='"+req.body.userIde+"'", (err, result) => {//Consulta para buscar al paciente
        console.log(result);
        if(err){
          throw err;
        }
        if(result.recordset.length > 0){
           res.render('pacientes.html',{title:"Existe",ruta:'/pacientes/add',estado: 'Failed'});//Renderiza la pagina con un mensaje de error
           pool.close();
        }else{//Si la consulta no retorna ningun registro, entonces no existe este paciente, y se puede añadir
          request.query("insert into paciente(nombre, apellido, identificacion, sexo, fechaNac, ciudad, barrio, telefono, domicilio, estadoCivil) values('"+req.body.userName+"','"+req.body.userLastName+"','"+req.body.userIde+"','"+req.body.userGender+"','"+req.body.userBirth+"','"+req.body.userCiudad+"','"+req.body.userBarrio+"','"+req.body.userTel+"','"+req.body.userDomicilio+"','"+req.body.civil+"')", (err, result) => {//Inserta el paciente en la BD
            if (err){//Si se presentan errores durante la insercion
                res.render('pacientes.html',{title:"Error",ruta:'/pacientes/add',estado: 'Failed'});//Renderiza la pagina con un mensaje de error
                pool.close();
              }else{//Si no se presentan errores durante la insercion
                res.render('pacientes.html',{title:"Paciente - Añadido",ruta:'/pacientes/add',estado: 'Success'});//Renderiza la pagina con un mensaje de satisfactorio
                pool.close();
              }
          });
        }
      });
    //res.render('pacientes.html',{title:"Pacientes",ruta:req.url,estado: 'Conexion con SQL exitosa'});/*funcion render del objeto res que devuelve el archivo index.ejs y lo evalua para colocarle la variable Contact en donde corresponda*/
    }
  });
});
router.get("/pacientes/delete",(req,res)=>{
  res.render("pacientes.html",{title:"Paciente - Eliminar",ruta:req.url,sujeto:null,estado:'neutral'});
});
router.post("/deletePacient",(req, res)=>{
  pool.connect((err,result)=>{
    if(err){
      throw err;
    }else{
      request.query("select idP, nombre, apellido, identificacion, sexo, ciudad, telefono from paciente where nombre LIKE '%"+req.body.subject+"%' or identificacion LIKE '%"+req.body.subject+"%' or telefono LIKE '%"+req.body.subject+"%'", (err,result)=>{
        if (err){
          throw err;
        }else{
          console.log(result.recordset.length);
          res.render("pacientes.html",{title:'Pacientes - Lista',sujeto:result,ruta:req.url,estado:'neutral'});
          }
      });
    }
  });
});
router.get("/pacientDelete/:identificacion",(req, res)=>{
  pool.connect((err,result)=>{
    if (err){
      throw err;
    }else{
      console.log(req.params.identificacion);
      request.query("delete paciente where idP='"+req.params.identificacion+"'",(err, result)=>{
        console.log(result.rowsAffected);
        if(err){
          throw err;
        }else if(result.rowsAffected>0){
        console.log("Paciente Eliminado");
        res.render("pacientes.html",{title:"Paciente - Eliminar",ruta:"/deletePacient",estado:'Success',sujeto:null});
      }else if(result.rowsAffected==0){
        res.render("pacientes.html",{title:"Paciente - Eliminar",ruta:"/deletePacient",estado:'Failed',sujeto:null});
      }
    });
}
});
});
router.get("/modifyPacient",(req,res)=>{
  res.render("pacientes.html",{title:"Paciende - Modificar",ruta:req.url,estado:'neutral',sujeto:null});
});
router.post("/modifyPacient",(req, res)=>{
  pool.connect((err,result)=>{
    if(err){
      throw err;
    }else{
      //request.query("select nombre, apellido, identificacion, sexo, ciudad, telefono from paciente where nombre='"+req.body.subject+"' or identificacion='"+req.body.subject+"' or telefono='"+req.body.subject+"'", (err,result)=>{
      request.query("select idP, nombre, apellido, identificacion, sexo, ciudad, telefono from paciente where nombre LIKE '%"+req.body.subject+"%' or identificacion LIKE '%"+req.body.subject+"%' or telefono LIKE '%"+req.body.subject+"%'", (err,result)=>{
        if (err){
          throw err;
        }else{
          console.log(result.recordset.length);
          res.render("pacientes.html",{title:'Pacientes - Lista',sujeto:result,ruta:req.url,estado:'neutral'});
          }
      });
    }
  });
});
router.post("/newPacientModified/:idP",(req,res)=>{
  pool.connect((err, result)=>{
    //const {userName,userLastName,userIde,userGender,userBirth,civil,userTel,userBarrio,userCiudad,userDomicilio}=req.body;
    if (err) {
      throw err;
    }else {
      request.query("update paciente set nombre='"+req.body.userName+"', apellido='"+req.body.userLastName+"', identificacion='"+req.body.userIde+"', sexo='"+req.body.userGender+"', fechaNac='"+req.body.userBirth+"', ciudad='"+req.body.userCiudad+"', barrio='"+req.body.userBarrio+"', telefono='"+req.body.userTel+"', domicilio='"+req.body.userDomicilio+"', estadoCivil='"+req.body.civil+"' where idP="+req.params.idP+"", (err, result) => {//Inserta el paciente en la BD
        if (err){//Si se presentan errores durante la actualizacion
            res.render('pacientes.html',{title:"Error",ruta:'/modifyPacient',estado: 'Failed',sujeto:null});//Renderiza la pagina con un mensaje de error
            pool.close();
          }else{//Si no se presentan errores durante la actualizacion
            res.render('pacientes.html',{title:"al fin",ruta:'/modifyPacient',estado: 'Success',sujeto:null});//Renderiza la pagina con un mensaje de satisfactorio
            pool.close();
          }
      });
    }
  });
});
router.get("/pacientModify/:identificacion",(req, res)=>{
  pool.connect((err, result)=>{
    //const {userName,userLastName,userIde,userGender,userBirth,civil,userTel,userBarrio,userCiudad,userDomicilio}=req.body;
    if (err) {
      throw err;
    }else {
      //request.query("insert into paciente(nombre) values('"+req.body.userName+"')",(err, result) => {
      request.query("select idP, nombre, apellido, sexo, identificacion, estadoCivil,telefono, barrio, ciudad, domicilio from paciente where idP='"+req.params.identificacion+"'", (err, result) => {//Consulta para buscar al paciente
        console.log(result);
        if(err){
          throw err;
        }else{
          res.render("pacientes.html",{userInfo:result.recordset[0],title:"Paciente - Modificar",ruta:'userModify',estado:'neutral'});
        }
      });
    //res.render('pacientes.html',{title:"Pacientes",ruta:req.url,estado: 'Conexion con SQL exitosa'});/*funcion render del objeto res que devuelve el archivo index.ejs y lo evalua para colocarle la variable Contact en donde corresponda*/
    }
  });
});
router.get("/pacienteShowDown",(req, res)=>{
  res.render("pacientes.html",{ruta:req.url,title:"Paciente - Mostrar",sujeto:null});
});
router.post("/paciente/showAll",(req,res)=>{
  pool.connect((err,result)=>{
    if (err){
      throw err;
    }else{
      request.query("select idP,nombre,apellido,sexo,identificacion,ciudad,barrio,telefono from paciente where nombre LIKE '%"+req.body.subject+"%' or identificacion LIKE '%"+req.body.subject+"%' or telefono LIKE '%"+req.body.subject+"%'",(err,result)=>{
        if(err){
          throw err;
        }else{
          console.log(result);
          res.render("pacientes.html",{ruta:"/pacienteShowDown",title:"Paciente - Mostrar",sujeto:result});
        }
      });
    }
  });
});
module.exports=router;
