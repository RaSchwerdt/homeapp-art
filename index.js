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
var filsto = require('./filestore.js');

//Start reading index.html from directory start defined in properties file
app.use(express.static(process.env.static));
app.use('/img', express.static(process.env.imgpath));

// index page
app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/parread', function(req, res) {
  let fileName = req.url.slice(req.url.indexOf("=")+1, req.url.length);
  console.log ("parread name="+fileName);
  res.send(filsto.readObject(fileName));
});


app.post('/parsave', function(req, res) {
  console.log ("save ");
  var content = "";
  req.on ("data", function (chunk){
    content += chunk;
    //console.log (JSON.parse(content));
    //console.log (JSON.parse(content).file);
    filsto.writeObject(JSON.parse(content).file, JSON.parse(content));
  });


  req.on ("end", function() {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(content);
  })
});

app.get ('/drawart01', function (req, res) {
  //let param = req.url.slice(req.url.indexOf("=")+1, req.url.length);
  console.log ("drawart01");
  res.render ('pages/drawart01');
}); 

app.get ('/drawart02', function (req, res) {
  console.log ("drawart02");
  res.render ('pages/drawart02');
}); 

app.get ('/drawart03', function (req, res) {
  console.log ("drawart03");
  res.render ('pages/drawart03');
}); 

app.get ('/drawart04', function (req, res) {
  console.log ("drawart04");
  res.render ('pages/drawart04');
}); 

app.get ('/drawart05', function (req, res) {
  console.log ("drawart05");
  res.render ('pages/drawart05');
}); 

app.get ('/drawart06', function (req, res) {
  console.log ("drawart06");
  res.render ('pages/drawart06');
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
      res.render('pages/error', {
        status: err.statusCode,
        message: err.message
      }) // Renders a myErrorPage.html for the user
    } else {
      res.status(err.statusCode).send(err.message); // If shouldRedirect is not defined in our error, sends our original err data
}});  
  
app.listen(process.env.port, process.env.host);
filsto.getStorageLocation(process.env.filestore);
console.log('web server at port '+process.env.port+' host '+process.env.host+' is running..')
}) ();