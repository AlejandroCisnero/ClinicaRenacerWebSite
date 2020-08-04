const path = require('path');

module.exports = (app)=>{
  const port = process.env.PORT || 8080;
  app.engine('html',require('ejs').renderFile);//asignar el motor de plantillas EJS a archivos ".html"
  app.set('view engine','ejs');//estableciendo la propiedad view engine para el objeto app, con el valor ejs, que es el motor de plantilla
  app.set('views',path.join(__dirname,'/views'));//estableciendo la propiedad views para el objeto app, con el valor de una ruta, que ubica las vistas
}
