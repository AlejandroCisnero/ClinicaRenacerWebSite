const express = require('express');
const path = require('path');
var app = express();
const bodyParser = require('body-parser');

/*Connfiguracion de variables*/
const port = process.env.PORT || 8080;
app.engine('html',require('ejs').renderFile);//asignar el motor de plantillas EJS a archivos ".html"
app.set('view engine','ejs');//estableciendo la propiedad view engine para el objeto app, con el valor ejs, que es el motor de plantilla
app.set('views',path.join(__dirname,'/views'));//estableciendo la propiedad views para el objeto app, con el valor de una ruta, que ubica las vistas

/*MiddleWare*/
app.use(bodyParser.urlencoded({extended: false}));

/*static files*/
app.use(express.static(path.join(__dirname,'public')));

/*rutas*/
app.use(require('./routes'));
app.use(require('./routes/paciente'));
//app.use(require('./routes/'));
app.use('pacientes',require('./routes/paciente.js'));

/*server escuchando*/
app.listen(port,()=>{
  console.log(`Servidor escuchando en http://localhost:${port}`);
  });
