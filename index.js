(async () => {
'use strict'
//Constants

//Read app properties from file
require("dotenv").config();

//Nodejs modules
const express = require('express');
const app = express();
app.set('view engine', 'ejs');

//Local modules
var filsto = require('./public/scripts-be/filestore.js');
var imgslct = require('./public/scripts-be/imgslct.js');

//Start reading index.html from directory start defined in properties file
app.use(express.static(process.env.static));
app.use('/img', express.static(process.env.imgpath));

// index page
app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get ('/imgshow', function (req, res) {
  //console.log("imgshow");
  //res.sendFile(`${__dirname}\\public\\imgshow.html`);    
  res.render('pages/imgshow');
});

app.get('/drawslct', function(req, res) {
  let request="http://"+process.env.host+":"+process.env.port+"/drawart"
  res.render('pages/drawslct', {
    request: request
  });
});


app.get ('/drawart', function (req, res) {
  let param = req.url.slice(req.url.indexOf("=")+1, req.url.length);
   console.log ("drawart "+param);
   let scrptnm = 'scripts-fe/'+param+'.js';
   res.render ('pages/drawart', {
    scrptnm: scrptnm
   })
});


app.get('/reqneximg', function(req, res) {
  //console.log ("reqneximg ");
  res.send(imgslct.selectImage());
});
  

//Catch all requests which have no routing. identify IP
app.get('*', function(req, res, next) {
    let err = new Error(`${req.ip} tried to reach ${req.originalUrl}`); // Tells us which IP tried to reach a particular URL
    err.statusCode = 404;
    err.shouldRedirect = true; //New property on err so that our middleware will redirect
    next(err);
});
  
//Handle error
 app.use(function(err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500; // Sets a generic server error status code if none is part of the err
  
    if (err.shouldRedirect) {
      res.render('myErrorPage') // Renders a myErrorPage.html for the user
    } else {
      res.status(err.statusCode).send(err.message); // If shouldRedirect is not defined in our error, sends our original err data
}});  
  
app.listen(process.env.port, process.env.host);
console.log('web server at port '+process.env.port+' host '+process.env.host+' is running..')
filsto.getStorageLocation(process.env.filestore);
imgslct.getImagePath(process.env.imgpath);
imgslct.scanImages();

}) ();