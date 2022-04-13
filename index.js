'use strict'
//Constants

//Read app properties from file
let PropertiesReader = require('properties-reader');
let properties = PropertiesReader('./env/app.properties');
let port = properties.get('main.app.port');
let host = properties.get('main.app.host');
let start = properties.get('main.app.static');
let filestore = properties.get('main.app.filestore');

//Nodejs modules
const express = require('express');
const app = express();

//Local modules
var filsto = require('./public/scripts-be/filestore.js');
var drwjso = require('./public/scripts-be/drawjson.js');

//Start reading index.html from directory start defined in properties file
app.use(express.static(start));

app.get ('/imgshow', function (req, res) {
  console.log("circles");
  res.sendFile(`${__dirname}\\public\\imgshow.html`);    
});

app.get ('/artjson', function (req, res) {
    console.log("dots");
    res.sendFile(`${__dirname}\\public\\artjson.html`);
 });

app.get('/reqnex', function(req, res) {
  console.log ("reqnex ");
  
  res.send(JSON.stringify(drwjso.drawToJson()));
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
  
app.listen(port, host);
console.log('web server at port '+port+' host '+host+' is running..')
filsto.getStorageLocation(filestore);

