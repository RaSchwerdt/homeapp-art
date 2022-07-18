//Constants ---------------------------------------------------------------
const FILE_NAME = "drawart04.txt";
const BACK_COLOR = '#010101';
const CRASH_COLOR = '#ff004c';
let loopInterval = null;
let loopCount = 0;
let modParam = {
  dist: 0,
  start: 0,
  speed: 0,
  size:5,
}
let planet = {
    dist: 0,
    start: 0,
    speed: 0,
    size:5,
    init: function (dist, start, speed, size) {
      this.dist = dist;
      this.start = start;
      this.speed = speed;
      this.size = size;
  }
}  

let params = {
    file: FILE_NAME,
    simulationSpeed: 2000,
    gravityFactor: 1,
    clearTrace: true,
    planets: [],
}
let gravityField = {
  dist: 0, //distance from center
  start: 0, //angle in radians 0-360
  speed: 0, //angle velocity in radians 0-360
  size: 0, //size of planet
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  mass: 0,
  col: null,
  crash: false,
  init: function (dist, start, speed, size) {
    this.dist = dist;
    this.start = start;
    this.speed = speed;
    this.size = size;
    this.mass = size*params.gravityFactor;
    this.col = "#2f2f2f";
  },
}
let gravityFields = [];

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
document.getElementById("read-button").onclick = function () {
readParams ();
};

//Modal window
document.getElementById("modal-button").onclick = function () {
  document.getElementById("planet-modal").style.display = "block";
  document.getElementById('modal-distance').value = modParam.dist;
  document.getElementById('modal-start').value = modParam.start;
  document.getElementById('modal-speed').value = modParam.speed;
  document.getElementById('modal-size').value = modParam.size;
};
document.getElementById("modal-save").onclick = function () {
    console.log ("Params "+modParam.dist+", "+modParam.start+", "+modParam.speed+", "+modParam.size);
    params.planets.push(new planet.init(modParam.dist, modParam.start, modParam.speed, modParam.size));
  listPlanets(params.planets);
  document.getElementById("planet-modal").style.display = "none";
  clearCanvas();
};
document.getElementById("modal-remove").onclick = function () {
  params.planets.pop();
  //console.log ("modal-remove "+params.planets.length);
  listPlanets(params.planets);
  clearCanvas();
};
document.getElementById("modal-close").onclick = function () {
  document.getElementById("planet-modal").style.display = "none";
};
document.getElementById("modal-distance").oninput = function () {
  modParam.dist = document.getElementById('modal-distance').value;
  document.getElementById("modal-distance-value").innerHTML = "("+modParam.dist+")";
};
document.getElementById("modal-start").oninput = function () {
  modParam.start = document.getElementById('modal-start').value;
  document.getElementById("modal-start-value").innerHTML = "("+modParam.start+")";
};
document.getElementById("modal-speed").oninput = function () {
  modParam.speed = document.getElementById('modal-speed').value;
  document.getElementById("modal-speed-value").innerHTML = "("+ modParam.speed+")";
};
document.getElementById("modal-size").oninput = function () {
  modParam.size = document.getElementById('modal-size').value;
  document.getElementById("modal-size-value").innerHTML = "("+modParam.size+")";
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
document.getElementById("clear-trace").onchange = function () {
    params.clearTrace = document.getElementById('clear-trace').checked;
    //console.log ("clear-trace "+params.clearTrace);
    clearCanvas();
};
  

function startLoop () {
    console.log("startLoop");
    //params.testSlider = parseInt(document.getElementById('test-slider').value);
    //console.log ("test-slider "+params.testSlider);
  
    //Create the gravity field
    //gravityFields.push(new gravityField.init(artCanvas.width/2, artCanvas.height/2, params.centralSize));
    let arr = params.planets;
    for (i=0; i<arr.length; i++) {
      console.log ("Planet "+(i+1)+" dist "+arr[i].dist+" start "+arr[i].start+" speed "+arr[i].speed+" size "+arr[i].size);
      gravityFields[i] = new gravityField.init(parseInt(arr[i].dist), parseInt(arr[i].start), parseInt(arr[i].speed), parseInt(arr[i].size));
      gravityFields[i].x = artCanvas.width/2 + gravityFields[i].dist * Math.cos(gravityFields[i].start*2*Math.PI/360);
      gravityFields[i].y = artCanvas.height/2 + gravityFields[i].dist * Math.sin(gravityFields[i].start*2*Math.PI/360);
  
    }

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
        params.gravityFactor = res.gravityFactor;
        params.clearTrace = res.clearTrace;
        params.planets = res.planets;

        //Init drop down display
        document.getElementById("simulation-speed").value = params.simulationSpeed;
        document.getElementById("simulation-speed-value").innerHTML = "("+params.simulationSpeed+")";
        document.getElementById("gravity-factor").value = params.gravityFactor;
        document.getElementById("gravity-factor-value").innerHTML = "("+params.gravityFactor+")";
        document.getElementById("clear-trace").checked = params.clearTrace;
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
    let planetString = "Planet "+(i+1)+": Distance from center "+arr[i].dist+", Start angle "+arr[i].start+", Angle speed "+arr[i].speed+", Planet size "+arr[i].size;
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

    clearInterval(loopInterval);
    loopInterval = null;
  }

function drawToCanvas () {
  //console.log ("Draw to canvas "+params.clearTrace);
  if (params.clearTrace==true) {
    ctx.clearRect(0, 0, artCanvas.width, artCanvas.height);
  }

  drawGravityFields();
  calculateVelocity();
  movePlanets();

  loopCount++;
  //console.log("Loop count "+loopCount+"Asteroid appearance "+params.asteroidAppearance);
}


function drawGravityFields () {
  for (let i=0; i< gravityFields.length; i++) {

      obj = gravityFields[i];

      //Draw planet
      //console.log("draw gravity field "+i+" x "+obj.x+" y "+obj.y+" size "+obj.size+" start "+obj.start+" spped "+obj.spped);
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, obj.size, 0, Math.PI*2);
      ctx.strokeStyle = BACK_COLOR;
      ctx.fillStyle = obj.col;
      ctx.fill();
      ctx.closePath();  
  }
  
}

function calculateVelocity () {
    for (let i=0; i< gravityFields.length; i++) {
        let obj = gravityFields[i];
        //console.log ("I-1 "+i+" Angle "+gravityFields[i].a+" speed "+gravityFields[i].da);

        //Calculate velocity
        obj.start += obj.speed;
        if (obj.start>360) { obj.start -= 360; }     
        //console.log ("I-2 "+i+" Angle "+gravityFields[i].a+" speed "+gravityFields[i].da);
        obj.dx = artCanvas.width/2 + obj.dist * Math.cos(obj.start*2*Math.PI/360) - obj.x;
        obj.dy = artCanvas.height/2 + obj.dist * Math.sin(obj.start*2*Math.PI/360) - obj.y;
    }
}

function movePlanets () {
    for (let i=0; i< gravityFields.length; i++) {
        let obj = gravityFields[i];
        obj.x += obj.dx;
        obj.y += obj.dy;
    }
}

