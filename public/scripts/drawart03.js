//Constants ---------------------------------------------------------------
const FILE_NAME = "drawart03.txt";
const MASS_FACTOR = 5;
let loopInterval = null;
let loopCount = 0;
let params = {
    file: FILE_NAME,
    simulationSpeed: 2000,
    asteroidAppearance: 50,
    centralGravity: 10,
    asteroidSize: 2,
    clearTrace: 0,
}
let gravityField = {
  x: 0,
  y: 0,
  a: 0, //angle in radians 0-360
  dist: 0, //distance from center
  da: 0, //angle velocity in radians 0-360
  rad: 0, //size of planet
  mass: 0,
  col: null,
  init: function (a, dist, da, rad) {
    this.a = a;
    this.dist = dist;
    this.da = da;
    this.rad = rad;
    this.mass = rad*MASS_FACTOR;
    this.col = "#2f2f2f";
  },
}
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
artCanvas.style.backgroundColor= '#010101';
let ctx = artCanvas.getContext('2d');
document.body.onload = function () {
  readParams ();
};
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
document.getElementById("simulation-speed").onchange = function () {
    params.simulationSpeed = parseInt(document.getElementById('simulation-speed').value);
    console.log ("simulation-speed "+params.simulationSpeed);
    clearCanvas();
};
document.getElementById("asteroid-appearance").onchange = function () {
  params.asteroidAppearance = parseInt(document.getElementById('asteroid-appearance').value);
  console.log ("asteroid-appearance "+params.asteroidAppearance);
  clearCanvas();
};
document.getElementById("central-gravity").onchange = function () {
    params.centralGravity = parseInt(document.getElementById('central-gravity').value);
    console.log ("central-gravity "+params.centralGravity);
    clearCanvas();
};
document.getElementById("asteroid-size").onchange = function () {
    params.asteroidSize = parseInt(document.getElementById('asteroid-size').value);
    console.log ("asteroid-size "+params.asteroidSize);
    clearCanvas();
};
document.getElementById("clear-trace").onchange = function () {
  params.clearTrace = parseInt(document.getElementById('clear-trace').value);
  console.log ("clear-trace "+params.clearTrace);
  clearCanvas();
};

function startLoop () {
    console.log("startLoop");

    //Create the gravity field
    //gravityFields.push(new gravityField.init(artCanvas.width/2, artCanvas.height/2, params.centralGravity));
    gravityFields[0] = new gravityField.init(0, 0, 0, params.centralGravity);
    gravityFields[0].x = artCanvas.width/2 + gravityFields[0].dist * Math.cos(gravityFields[0].a);
    gravityFields[0].y = artCanvas.height/2 + gravityFields[0].dist * Math.sin(gravityFields[0].a);
    gravityFields[1] = new gravityField.init(0, 50, 5, params.centralGravity-10);
    gravityFields[1].x = artCanvas.width/2 + gravityFields[1].dist * Math.cos(gravityFields[1].a);
    gravityFields[1].y = artCanvas.height/2 + gravityFields[1].dist * Math.sin(gravityFields[1].a);
    gravityFields[2] = new gravityField.init(0, 100, 3, params.centralGravity-8);
    gravityFields[2].x = artCanvas.width/2 + gravityFields[1].dist * Math.cos(gravityFields[1].a);
    gravityFields[2].y = artCanvas.height/2 + gravityFields[1].dist * Math.sin(gravityFields[1].a);
    gravityFields[3] = new gravityField.init(0, 200, 1, params.centralGravity-2);
    gravityFields[3].x = artCanvas.width/2 + gravityFields[1].dist * Math.cos(gravityFields[1].a);
    gravityFields[3].y = artCanvas.height/2 + gravityFields[1].dist * Math.sin(gravityFields[1].a);

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
        params.asteroidAppearance = res.asteroidAppearance;
        params.centralGravity = res.centralGravity;
        params.asteroidSize = res.asteroidSize;
        params.clearTrace = res.clearTrace;

        //Init drop down display
        document.getElementById("simulation-speed").value = params.simulationSpeed;
        document.getElementById("central-gravity").value = params.asteroidAppearance;
        document.getElementById("central-gravity").value = params.centralGravity;
        document.getElementById("asteroid-size").value = params.asteroidSize;
        document.getElementById("clear-trace").value = params.clearTrace;
    }
  }

  dynRequest.open ('GET', '/parread?file='+FILE_NAME, true);
  dynRequest.send();
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
  drawGravityFields();
  drawAsteroids();
  calculateAsteroidVelocity();
  moveGravityFields();
  moveAsteroids();
  if (loopCount % params.asteroidAppearance == 0) {
    addAsteroid();
  }
  
  loopCount++;
  //console.log("Loop count "+loopCount+"Asteroid appearance "+params.asteroidAppearance);
}


function drawGravityFields () {
  for (let i=0; i< gravityFields.length; i++) {
      //console.log("draw gravity field "+i+" x "+gravityFields[i].x+" y "+gravityFields[i].y+" rad "+gravityFields[i].rad+" col "+gravityFields[i].col);
      ctx.beginPath();
      ctx.arc(gravityFields[i].x, gravityFields[i].y, gravityFields[i].rad, 0, Math.PI*2);
      ctx.fillStyle = gravityFields[i].col;
      ctx.fill();
      ctx.closePath();  
  }
  
}

function moveGravityFields () {
  for (let i=0; i< gravityFields.length; i++) {
    gravityFields[i].a += gravityFields[i].da;
    if (gravityFields[i].a>360) {
      gravityFields[i].a -= 360;
    }
    gravityFields[i].x = artCanvas.width/2 + gravityFields[i].dist * Math.cos(gravityFields[i].a*2*Math.PI/360);
    gravityFields[i].y = artCanvas.height/2 + gravityFields[i].dist * Math.sin(gravityFields[i].a*2*Math.PI/360);
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
      if (distance < obj2.rad) {
        asteroids.splice(0,1);
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
    if (asteroids[i].x <0) {
      leftSpace = true;
    } else if (asteroids[i].x>artCanvas.width) {
      leftSpace = true;
    } else if (asteroids[i].y <0) {
      leftSpace = true;
    } else if (asteroids[i].y>artCanvas.height) {
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
  //console.log("Add asteroid ");
  asteroids.push( new asteroid.init(artCanvas.width-20, 
    Math.floor(Math.random()*artCanvas.height), 
    Math.floor(Math.random()*6)-3,
    Math.floor(Math.random()*4)-2,
    params.asteroidSize));
}