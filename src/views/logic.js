'use strict'
var pestaña=null;
/*Funcion para deter la ejecucucion de la pagina, muy importante por la naturaleza asincrona de JavaScript
No seria necesaria si se usara algun framework como JQuery*/
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
/*Esta funcion se ejecuta cuando la pagina cargue completamente, lo dispara la ultima linea "window.addEventListener('load',start,false);",
contiene el llamado a las funciones en dependencia de los clicks*/
function start(){
  document.querySelector("#citas").addEventListener("click",showCitas,false);
  document.querySelector("#registro").addEventListener("click",showRegister,false);
  document.querySelector("#doctor").addEventListener("click",showDoctor,false);
  document.querySelector("#paciente").addEventListener("click",showPro,false);
  var plantilla = document.querySelector("#mainCanvas").innerHTML;
  var compile = handlebars.compile(plantilla);
  var data = {
    verdadero: true
  }
  var compiledHTML = compile(data);
  document.querySelector("#mainCanvas2").innerHTML +=compiledHTML;
}
/*Esta funcion elimina la 5 opcion que se agrega una vez que se clickea en la pestaña Citas, reduce las 5 opciones a 4*/
function deleteOption(){
  var indexNavElements = document.querySelectorAll(".indexTextOption");
  if(indexNavElements.length>4){
    var lastP = document.querySelector("ul > .indexTextBar:last-child");
    var ulBar = lastP.parentNode;
    ulBar.removeChild(lastP);
  }
}
/*Esta funcion cambia el color de la barra superior de opciones de azul turkquesa a verde y luego a azul turquesa nuevamente
con un pequeño delay, provocando una pequeña animacion,
denotando que se dio click en una opcion*/
function BarAnimation(){
    showNav();
    var bar = document.querySelector("#navigationBar");
    bar.style.backgroundColor="#46e366";
    sleep(200).then(() => {
    bar.style.backgroundColor="#34d0eb";
    })
}

function selectedTab(pestaña){
  if(pestaña==50){
    let plantillaCitas=``;
    document.write(plantillaCitas);
    sleep(200).then(() => {

  })
  }
}
/*Esta funcion despliegua con un pequeño delay la barra inferior hacia abajo, simulando una animacion de despliegue*/
function showNav(){
  let values;
  document.querySelector("nav[id='indexNavigationBar']").style.height="75%";
  let indexNavElements = document.querySelectorAll(".indexTextOption");
  console.log(indexNavElements);
  for(values in indexNavElements){
    if(typeof indexNavElements[values].textContent =='string'){
      indexNavElements[values].style.opacity="1";
    }
  }
}
/*Esta funcion edita el texto de las opciones para colocar las que la pestaña citas necesita*/
function showCitas(){
  let value;
  var indexNavElements = document.querySelectorAll(".indexTextOption");
  var optionsCita= ["Nueva","Busqueda","Pendientes","Reprogramar", "Eliminar"];
  console.log(indexNavElements);
  if(indexNavElements.length==4){
    let optionBar = document.createElement("li");
    optionBar.setAttribute("class","indexTextBar");
    let newOption = document.createElement("p");
    newOption.setAttribute("class","indexTextOption");
    optionBar.appendChild(newOption);
    document.querySelector("#indexNavigationBar > ul").appendChild(optionBar);
  }
  indexNavElements = document.querySelectorAll(".indexTextOption");
  for(var values=0; values<indexNavElements.length;values++){
    if(typeof indexNavElements[values].textContent =='string'){
        indexNavElements[values].innerHTML=optionsCita[values];
        indexNavElements[values].style.fontFamily="Ubuntu";
    }
  }
  sleep(0.1).then(() => {
  BarAnimation();
  })
}
/*Esta funcion edita el texto de las opciones para colocar las que la pestaña Pacientes necesita*/
function showRegister(){
  BarAnimation();
  deleteOption();
  var optionsRegistro= ["Nuevo","Modificar","Eliminar","Mostrar"];
  var indexNavElements = document.querySelectorAll(".indexTextOption");
  for(var values=0; values<indexNavElements.length;values++){
    if(typeof indexNavElements[values].textContent =='string'){
        indexNavElements[values].innerHTML=optionsRegistro[values];
        document.querySelector("li[class='indexTextBar'] > p").style.fontFamily="Ubuntu";
    }
  }
    showNav();
}
/*Esta funcion edita el texto de las opciones para colocar las que la pestaña Doctor necesita*/
function showDoctor(){
  BarAnimation();
  deleteOption();
  var optionsDoctor= ["Agregar","Modificar","Eliminar","Mostrar"];
  var indexNavElements = document.querySelectorAll(".indexTextOption");
  for(var values=0; values<indexNavElements.length;values++){
    if(typeof indexNavElements[values].textContent =='string'){
      console.log(indexNavElements);
      console.log(optionsDoctor);
      console.log(document.querySelector("li[class='indexTextBar'] > p"));
        indexNavElements[values].innerHTML=optionsDoctor[values];
        document.querySelector("li[class='indexTextBar'] > p").style.fontFamily="Ubuntu";
    }
  }
    showNav();
}
/*Esta funcion edita el texto de las opciones para colocar las que la pestaña Inventario necesita*/
function showPro(){
  deleteOption();
  BarAnimation();
  var optionsDoctor= ["Agregar","Modificar","Eliminar","Mostrar"];
  var indexNavElements = document.querySelectorAll(".indexTextOption");
  for(var values=0; values<indexNavElements.length;values++){
    if(typeof indexNavElements[values].textContent =='string'){
      console.log(indexNavElements);
      console.log(optionsDoctor);
      console.log(document.querySelector("li[class='indexTextBar'] > p"));
        indexNavElements[values].innerHTML=optionsDoctor[values];
        document.querySelector("li[class='indexTextBar'] > p").style.fontFamily="Ubuntu";
    }
  }
    showNav();
}

window.addEventListener('load',start,false);// Esta linea espera a que la pagina cargue por completo e invoca la funcion "start"
