//Constants ---------------------------------------------------------------
const FILE_NAME = "drawart03.txt";
const BACK_COLOR = '#010101';
const CRASH_COLOR = '#ff004c';
const X_SPACE_EXTEND = 200;
const Y_SPACE_EXTEND = 100;
let loopInterval = null;
let loopCount = 0;
let modalparams = {
  dist: 40,
  start: 0,
  size:5,
}
let planet = {
  dist: 0,
  start: 0,
  size: 5,  
  init: function (dist, start, size) {
    this.dist = dist;
    this.start = start;
    this.size = size;
  }
}
let params = {
    file: FILE_NAME,
    simulationSpeed: 2000,
    centralSize: 20,
    gravityFactor: 1,
    ellipseFactor: 1.0,
    asteroidAppearance: 50,
    asteroidSize: 2,
    clearTrace: true,
    planetImpact: false,
    planets: [],
}
let gravityField = {
  dist: 0, //distance from center
  start: 0, //angle in radians 0-360
  size: 0, //size of planet
  x: 0,
  y: 0,
  speed: 0, //angle velocity in radians 0-360
  dx: 0,
  dy: 0,
  mass: 0,
  col: null,
  crash: false,
  init: function (dist, start, size) {
    this.dist = dist;
    this.start = start;
    this.size = size;
    this.mass = size*params.gravityFactor;
    this.col = planetColors[Math.floor(Math.random() * planetColors.length)];
  },
}
let planetColors = [
  "#ffe6ff",
  "#ffe6b3",
  "#cceeff",
  "#f2e6ff",
  "#ffe6cc",
  "#e0ebeb",
  "#ccccff",
  "#ccffcc",
  "#ffffe6",
  ];

let gravityFields = [];
let asteroid = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  rad: 0,
  col: null,
  init: function (x, y, dx, dy, rad) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.rad = rad;
    this.mass = rad;
    this.col = asteroidColors[Math.floor(Math.random() * asteroidColors.length)];
  },
};
let asteroids = [];
let asteroidColors = [
  "#4b7f9d",
  "#6898b4",
  "#8cb8d3",
  "#4292c2",
  "#289bdf",
  "#7fcaf6",
  "#81c2e8",
  "#5f7f92",
  "#426b84",
  "#506775"
  ];

//Screen interaction ---------------------------------------------------------------
let artCanvas = document.getElementById('art-canvas');
artCanvas.setAttribute ('width', screen.availWidth/3);
artCanvas.setAttribute ('height', screen.availHeight/3); 
artCanvas.style.backgroundColor = BACK_COLOR;
let ctx = artCanvas.getContext('2d');
document.body.onload = function () {
  readParams ();
};

//Buttons
document.getElementById("start-button").onclick = function () {
    startLoop();
};
document.getElementById("stop-button").onclick = function () {
    stopLoop();
};
document.getElementById("clear-button").onclick = function () {
    clearCanvas();
};
document.getElementById("full-button").onclick = function () {
    artCanvas.requestFullscreen();
};
document.getElementById("save-button").onclick = function () {
  saveParams ();
};

//Modal window
document.getElementById("modal-button").onclick = function () {
  document.getElementById("planet-modal").style.display = "block";
  document.getElementById('modal-distance').value = modalparams.dist;
  document.getElementById('modal-start').value = modalparams.start;
  document.getElementById('modal-size').value = modalparams.size;
};
document.getElementById("modal-save").onclick = function () {
  params.planets.push(new planet.init(modalparams.dist, modalparams.start, modalparams.size));
  //console.log ("modal-save "+params.planets.length);
  listPlanets(params.planets);
  document.getElementById("planet-modal").style.display = "none";
  clearCanvas();
};
document.getElementById("modal-remove").onclick = function () {
  params.planets.pop();
  //console.log ("modal-remove "+params.planets.length);
  listPlanets(params.planets);
};
document.getElementById("modal-close").onclick = function () {
  document.getElementById("planet-modal").style.display = "none";
};
document.getElementById("modal-distance").oninput = function () {
  modalparams.dist = document.getElementById('modal-distance').value;
  document.getElementById("modal-distance-value").innerHTML = "("+modalparams.dist+")";
};
document.getElementById("modal-start").oninput = function () {
  modalparams.start = document.getElementById('modal-start').value;
  document.getElementById("modal-start-value").innerHTML = "("+modalparams.start+")";
};
document.getElementById("modal-size").oninput = function () {
  modalparams.size = document.getElementById('modal-size').value;
  document.getElementById("modal-size-value").innerHTML = "("+modalparams.size+")";
};

//Input elements
document.getElementById("simulation-speed").oninput = function () {
    params.simulationSpeed = parseInt(document.getElementById('simulation-speed').value);
    document.getElementById("simulation-speed-value").innerHTML = "("+params.simulationSpeed+")";
    //console.log ("simulation-speed "+params.simulationSpeed);
    clearCanvas();
};
document.getElementById("gravity-factor").onchange = function () {
  params.gravityFactor = parseFloat(document.getElementById('gravity-factor').value);
  document.getElementById("gravity-factor-value").innerHTML = "("+params.gravityFactor+")";
  //console.log ("gravity-factor "+params.gravityFactor);
  clearCanvas();
};
document.getElementById("central-size").onchange = function () {
  params.centralSize = parseInt(document.getElementById('central-size').value);
  document.getElementById("central-size-value").innerHTML = "("+params.centralSize+")";
  //console.log ("central-size "+params.centralSize);
  clearCanvas();
};
document.getElementById("ellipse-factor").onchange = function () {
  params.ellipseFactor = parseFloat(document.getElementById('ellipse-factor').value);
  document.getElementById("ellipse-factor-value").innerHTML = "("+params.ellipseFactor+")";
  //console.log ("ellipse-factor "+params.ellipseFactor);
  clearCanvas();
};
document.getElementById("asteroid-appearance").oninput = function () {
  params.asteroidAppearance = parseInt(document.getElementById('asteroid-appearance').value);
  document.getElementById("asteroid-appearance-value").innerHTML = "("+params.asteroidAppearance+")";
  //console.log ("asteroid-appearance "+params.asteroidAppearance);
  clearCanvas();
};
document.getElementById("asteroid-size").onchange = function () {
    params.asteroidSize = parseInt(document.getElementById('asteroid-size').value);
    document.getElementById("asteroid-size-value").innerHTML = "("+params.asteroidSize+")";
    //console.log ("asteroid-size "+params.asteroidSize);
    clearCanvas();
};
document.getElementById("clear-trace").onchange = function () {
  params.clearTrace = document.getElementById('clear-trace').checked;
  //console.log ("clear-trace "+params.clearTrace);
  clearCanvas();
};
document.getElementById("planet-impact").onchange = function () {
  params.planetImpact = document.getElementById('planet-impact').checked;
  //console.log ("planet-impact "+params.planetImpact);
  clearCanvas();
};


function startLoop () {
    console.log("startLoop");
    //params.testSlider = parseInt(document.getElementById('test-slider').value);
    //console.log ("test-slider "+params.testSlider);
  
    //Create the gravity field
    //gravityFields.push(new gravityField.init(artCanvas.width/2, artCanvas.height/2, params.centralSize));
    gravityFields[0] = new gravityField.init(0, 0, params.centralSize);
    gravityFields[0].x = artCanvas.width/2;
    gravityFields[0].y = artCanvas.height/2;
    gravityFields[0].col = '#ffffe6';
    gravityFields[0].speed = 0;

    let arr = params.planets;
    for (i=0; i<arr.length; i++) {
      //console.log ("Planet "+(i+1)+" dist "+arr[i].dist+" start "+arr[i].start+" size "+arr[i].size);
      gravityFields[i+1] = new gravityField.init(parseInt(arr[i].dist), parseInt(arr[i].start), parseInt(arr[i].size));
      let obj = gravityFields[i+1];

      //Determine position and speed
      obj.x = artCanvas.width/2 + obj.dist * params.ellipseFactor * Math.cos(obj.start*2*Math.PI/360);
      obj.y = artCanvas.height/2 + obj.dist * Math.sin(obj.start*2*Math.PI/360);
      obj.speed = Math.sqrt(gravityFields[0].mass*params.gravityFactor/obj.dist);
      console.log ("planet "+(i+1)+" dist "+obj.dist+" start "+obj.start+" size "+obj.size+" x "+obj.x+" y "+obj.y+" speed "+obj.speed);  
    }

    //Create asteroid
    addAsteroid();
      
    if (loopInterval == null) {
      loopInterval = setInterval(drawToCanvas, params.simulationSpeed);  
    }
  
  }
  
function stopLoop () {
    console.log("stopLoop");
    clearInterval(loopInterval);
    loopInterval = null;
}
  
function saveParams () {
  let dynRequest = new XMLHttpRequest();

  //Receive data
  dynRequest.onreadystatechange = function () {
    if (dynRequest.readyState==4 && dynRequest.status==200) {    
        //console.log ("Response "+dynRequest.responseText);
    }
  }

  //console.log ("Send 2"+JSON.stringify(params));
  dynRequest.open ('POST', '/parsave', true);
  dynRequest.setRequestHeader("Accept", "application/json");
  dynRequest.setRequestHeader("Content-Type", "application/json");
  dynRequest.send(JSON.stringify(params));

}

function readParams () {
  let dynRequest = new XMLHttpRequest();

  //Receive data
  dynRequest.onreadystatechange = function () {
    if (dynRequest.readyState==4 && dynRequest.status==200) {    
        //console.log ("Response "+dynRequest.responseText);
        var res = JSON.parse(dynRequest.responseText);

        //Init param values
        params.simulationSpeed = res.simulationSpeed;
        params.centralSize = res.centralSize;
        params.gravityFactor = res.gravityFactor;
        params.ellipseFactor = res.ellipseFactor;
        params.asteroidAppearance = res.asteroidAppearance;
        params.asteroidSize = res.asteroidSize;
        params.clearTrace = res.clearTrace;
        params.planetImpact = res.planetImpact;
        params.planets = res.planets;

        //Init drop down display
        document.getElementById("simulation-speed").value = params.simulationSpeed;
        document.getElementById("simulation-speed-value").innerHTML = "("+params.simulationSpeed+")";
        document.getElementById("gravity-factor").value = params.gravityFactor;
        document.getElementById("gravity-factor-value").innerHTML = "("+params.gravityFactor+")";
        document.getElementById("central-size").value = params.centralSize;
        document.getElementById("central-size-value").innerHTML = "("+params.centralSize+")";
        document.getElementById("ellipse-factor").value = params.ellipseFactor;
        document.getElementById("ellipse-factor-value").innerHTML = "("+params.ellipseFactor+")";
        document.getElementById("asteroid-appearance").value = params.asteroidAppearance;
        document.getElementById("asteroid-appearance-value").innerHTML = "("+params.asteroidAppearance+")";
        document.getElementById("asteroid-size").value = params.asteroidSize;
        document.getElementById("asteroid-size-value").innerHTML = "("+params.asteroidSize+")";
        document.getElementById("clear-trace").checked = params.clearTrace;
        document.getElementById("planet-impact").checked = params.planetImpact;
        listPlanets(params.planets);
    }
  }

  dynRequest.open ('GET', '/parread?file='+FILE_NAME, true);
  dynRequest.send();
}

function listPlanets (arr) {
  let list = document.getElementById("list-planets")
  while (list.hasChildNodes()) {
    //console.log ("Remove childs");
    list.removeChild(list.firstChild);
  }
  for (i=0; i <arr.length; i++) {
    let planetString = "Planet "+(i+1)+": Distance from center "+arr[i].dist+", Start angle "+arr[i].start+", Planet size "+arr[i].size;
    //console.log (planetString);
    let listItem = document.createElement("li")
    listItem.setAttribute('class', 'list-group-item')
    listItem.innerHTML = planetString;
    list.appendChild(listItem);
  }
}

//Drawing ---------------------------------------------------------------
function clearCanvas () {
    console.log("Clear canvas");
    ctx.clearRect(0, 0, artCanvas.width, artCanvas.height);
    gravityFields = [];
    asteroids = [];

    clearInterval(loopInterval);
    loopInterval = null;
  }

function drawToCanvas () {
  //console.log ("Draw to canvas");
  if (params.clearTrace==1) {
    ctx.clearRect(0, 0, artCanvas.width, artCanvas.height);
  }

  calculateSpeed();
  movePlanets();
  drawGravityFields();
  drawAsteroidBeltEllipse();
  drawAsteroids();
  calculateAsteroidVelocity();
  moveAsteroids();
  if (loopCount % params.asteroidAppearance == 0) {
    addAsteroid();
  }
  
  loopCount++;
  //console.log("Loop count "+loopCount+"Asteroid appearance "+params.asteroidAppearance);
}


function drawGravityFields () {
  //draw sun
  ctx.beginPath();
  ctx.arc(gravityFields[0].x, gravityFields[0].y, gravityFields[0].size, 0, Math.PI*2);
  if (gravityFields[0].crash == true) {
    ctx.fillStyle = CRASH_COLOR;
    gravityFields[0].crash = false;
  } else {
    ctx.fillStyle = gravityFields[0].col;
  }
  ctx.fill();
  ctx.closePath();  
  
  for (let i=1; i< gravityFields.length; i++) {

    obj = gravityFields[i];

    //Draw planet curve
    ctx.beginPath();
    //ctx.arc(artCanvas.width/2, artCanvas.height/2, obj.dist, 0, Math.PI*2);
    ctx.ellipse(artCanvas.width/2, artCanvas.height/2, obj.dist * params.ellipseFactor, obj.dist, 0, 0, Math.PI*2);
    ctx.lineWidth = 1;  
    ctx.setLineDash([4, 8]);
    ctx.strokeStyle = '#2f2f2f';
    ctx.stroke();
    ctx.closePath();

    //Draw planet
    //console.log("Field "+i+" x "+obj.x+" y "+obj.y+" size "+obj.size+" col "+obj.col);
    let size = obj.size;
    if (params.clearTrace==false) {
      size = 1;
    }
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, size, 0, Math.PI*2);
    ctx.strokeStyle = BACK_COLOR;
    if (obj.crash == true) {
      ctx.fillStyle = CRASH_COLOR;
      obj.crash = false;
    } else {
      ctx.fillStyle = obj.col;
    }
    ctx.fill();
    ctx.closePath();  
  }
}

function calculateSpeed () {
  for (let i=1; i< gravityFields.length; i++) {
      let obj1 = gravityFields[i];
      //console.log ("i "+i+" angle "+obj.a+" speed "+obj.speed);

      //Calculate velocity
      obj1.start += obj1.speed;
      if (obj1.start>360) { obj1.start -= 360; }     
      obj1.dx = artCanvas.width/2 + obj1.dist * params.ellipseFactor * Math.cos(obj1.start*2*Math.PI/360) - obj1.x;
      obj1.dy = artCanvas.height/2 + obj1.dist * Math.sin(obj1.start*2*Math.PI/360) - obj1.y;
      if (params.planetImpact==true) {
        for (j=i+1; j < gravityFields.length; j++) {
          let obj2 = gravityFields[j];
          let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
          obj1.dx += obj2.mass*(obj2.x-obj1.x) / Math.pow(distance, 2);
          obj1.dy += obj2.mass*(obj2.y-obj1.y) / Math.pow(distance, 2);  

          obj2.dx += obj1.mass*(obj1.x-obj2.x) / Math.pow(distance, 2);
          obj2.dy += obj1.mass*(obj1.y-obj2.y) / Math.pow(distance, 2);  
          //console.log ("dx "+obj1.dx+" dy 2 "+obj1.dy);
        }         
        //console.log ("End dx "+obj1.dx+" dy "+obj1.dy);  
      }
  }
}

function movePlanets () {
  for (let i=1; i< gravityFields.length; i++) {
      let obj = gravityFields[i];
      obj.x += obj.dx;
      obj.y += obj.dy;
      //console.log ("Planet "+i+" x "+obj.x+" y "+obj.y);
  }
}

function drawAsteroids () {
  for (let i=0; i< asteroids.length; i++) {
      //console.log("draw asteroid "+i+" x "+asteroids[i].x+" y "+asteroids[i].y+" rad "+asteroids[i].rad+" col "+asteroids[i].col);
      ctx.beginPath();
      ctx.arc(asteroids[i].x, asteroids[i].y, asteroids[i].rad, 0, Math.PI*2);
      ctx.fillStyle = asteroids[i].col;
      ctx.fill();
      ctx.closePath();  
  }
  
}


function calculateAsteroidVelocity () {

  for (let i=0; i< asteroids.length; i++) {
    //console.log ("i "+i);
    let obj1 = asteroids[i];

    for (let j=0; j< gravityFields.length; j++) {
      //console.log ("j "+j);
      let obj2 = gravityFields[j];

      let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
      //console.log("Distance "+distance);
      if (distance < obj2.size) {
        obj2.crash = true;
        asteroids.splice(i,1);
      } else {
        obj1.dx += obj2.mass*(obj2.x-obj1.x) / Math.pow(distance, 2);
        obj1.dy += obj2.mass*(obj2.y-obj1.y) / Math.pow(distance, 2);  
        //console.log ("dx "+obj1.dx+" dy 2 "+obj1.dy);
      }
    }
  }

}

function moveAsteroids () {
  for (let i=0; i< asteroids.length; i++) {
    let leftSpace = false;
    if (asteroids[i].x < -X_SPACE_EXTEND) {
      leftSpace = true;
    } else if (asteroids[i].x>artCanvas.width+X_SPACE_EXTEND) {
      leftSpace = true;
    } else if (asteroids[i].y <-Y_SPACE_EXTEND) {
      leftSpace = true;
    } else if (asteroids[i].y>artCanvas.height+Y_SPACE_EXTEND) {
      leftSpace = true;
    }

    if (leftSpace == true) {
      //part has left the dsiplay space
      asteroids.splice(i,1);
    } else {
      asteroids[i].x += asteroids[i].dx;
      asteroids[i].y += asteroids[i].dy;  
    }
  }
}

function addAsteroid () {

  //Chose randomly a side (left or right), where asteroid is comning from
  let origin = artCanvas.width-20;
  if (Math.floor(Math.random()*2)==0) {
    origin = 20;
  }
  //console.log("Add asteroid "+origin);

  asteroids.push( new asteroid.init(origin, 
    Math.floor(Math.random()*artCanvas.height), 
    Math.floor(Math.random()*6)-3,
    Math.floor(Math.random()*4)-2,
    params.asteroidSize));
}


function drawAsteroidBeltEllipse () {

  //console.log ("width "+(artCanvas.width)+" height "+(artCanvas.height));
  for (let i=0; i<artCanvas.height; i=i+7) {
    for (let j=0; j <3; j++) {

      let y = artCanvas.height/2 - i;
      let x = Math.sqrt(Math.pow(artCanvas.width/2, 2) - Math.pow(y, 2));

      if (i < 5) {
        //console.log (" x "+((artCanvas.width/2+x)+" y "+(artCanvas.height/2+y)));
      }

      ctx.beginPath();
      ctx.arc(artCanvas.width/2+x-Math.floor(Math.random()*20), artCanvas.height/2+y, Math.floor(Math.random()*2)+1, 0, Math.PI*2);
      ctx.fillStyle = asteroidColors[Math.floor(Math.random() * asteroidColors.length)];
      ctx.fill();
      ctx.closePath();  

      ctx.beginPath();
      ctx.arc(artCanvas.width/2-x+Math.floor(Math.random()*20), artCanvas.height/2+y, Math.floor(Math.random()*2)+1, 0, Math.PI*2);
      ctx.fillStyle = asteroidColors[Math.floor(Math.random() * asteroidColors.length)];
      ctx.fill();
      ctx.closePath();  

    }
  }
}