//Constants ---------------------------------------------------------------
const FILE_NAME = "drawart04.txt";
const BACK_COLOR = '#010101';
const CRASH_COLOR = '#ff004c';
let loopInterval = null;
let loopCount = 0;
let modParam = {
  dist: 40,
  start: 0,
  size:5,
}
let planet = {
    dist: 0,
    start: 0,
    size:5,
    init: function (dist, start, size) {
      this.dist = dist;
      this.start = start;
      this.size = size;
  }
}  

let params = {
    file: FILE_NAME,
    simulationSpeed: 2000,
    gravityFactor: 1,
    centralSize: 20,
    ellipseFactor: 1.0,
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
  speed: 0, //Angle velocity
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
let gravityFields = [];
let planetColors = [
  "#ff0000",
  "#ff00ff",
  "#00cc00",
  "#0000ff",
  "#ff6600",
  "#ffff00",
  "#6600ff",
  "#cc3300",
  "#cccc00",
  "#3366cc"
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
  document.getElementById('modal-distance').value = modParam.dist;
  document.getElementById('modal-start').value = modParam.start;
  document.getElementById('modal-size').value = modParam.size;
};
document.getElementById("modal-save").onclick = function () {
    console.log ("Params "+modParam.dist+", "+modParam.start+", "+modParam.speed+", "+modParam.size);
    params.planets.push(new planet.init(modParam.dist, modParam.start, modParam.size));
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
  modParam.dist = parseInt(document.getElementById('modal-distance').value);
  document.getElementById("modal-distance-value").innerHTML = "("+modParam.dist+")";
};
document.getElementById("modal-start").oninput = function () {
  modParam.start = parseInt(document.getElementById('modal-start').value);
  document.getElementById("modal-start-value").innerHTML = "("+modParam.start+")";
};
document.getElementById("modal-size").oninput = function () {
  modParam.size = parseInt(document.getElementById('modal-size').value);
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

    //Central system
    gravityFields[0] = new gravityField.init(0, 0, params.centralSize);
    gravityFields[0].x = artCanvas.width/2;
    gravityFields[0].y = artCanvas.height/2;
    gravityFields[0].col = '#ffffe6';
    gravityFields[0].speed =  0;

    //Create the gravity field
    //gravityFields.push(new gravityField.init(artCanvas.width/2, artCanvas.height/2, params.centralSize));
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
        params.centralSize = res.centralSize;
        params.ellipseFactor = res.ellipseFactor;
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

    clearInterval(loopInterval);
    loopInterval = null;
  }

function drawToCanvas () {
  //console.log ("Draw to canvas "+params.clearTrace);
  if (params.clearTrace==true) {
    ctx.clearRect(0, 0, artCanvas.width, artCanvas.height);
  }

  drawGravityFields();
  calculateSpeed();
  movePlanets();

  loopCount++;
  //console.log("Loop count "+loopCount+"Asteroid appearance "+params.asteroidAppearance);
}


function drawGravityFields () {

  //draw sun
  ctx.beginPath();
  ctx.arc(gravityFields[0].x, gravityFields[0].y, gravityFields[0].size, 0, Math.PI*2);
  ctx.fillStyle = gravityFields[0].col;
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
      //console.log("Field "+i+" x "+obj.x+" y "+obj.y+" size "+obj.size+" start "+obj.start+" speed "+obj.speed);
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, 1, 0, Math.PI*2);
      ctx.fillStyle = obj.col;
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
        //console.log ("Start dx "+obj1.dx+" dy "+obj1.dy);

        if (params.planetImpact==true) {
          for (j=i+1; j < gravityFields.length; j++) {
            let obj2 = gravityFields[j];
            let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
            obj1.dx += obj2.mass*(obj2.x-obj1.x) / Math.pow(distance, 2);
            obj1.dy += obj2.mass*(obj2.y-obj1.y) / Math.pow(distance, 2);  
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

