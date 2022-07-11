//Constants ---------------------------------------------------------------
const FILE_NAME = "drawart03.txt";
let loopInterval = null;
let loopCount = 0;
let params = {
    file: FILE_NAME,
    simulationSpeed: 2000,
    centralGravity: 10,
    asteroidSpeed: 10,
}
let planet = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    rad: 0,
    col: null,
    mass: 0,
    init: function (x, y, dx, dy, rad, col, mass) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.rad = rad;
      this.col = col;
      this.mass = mass;
    },
};
let asteroids = [];

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
    params.speed = parseInt(document.getElementById('simulation-speed').value);
    console.log ("simulation-speed "+params.simulationSpeed);
    clearCanvas();
};
document.getElementById("central-gravity").onchange = function () {
    params.speed = parseInt(document.getElementById('central-gravity').value);
    console.log ("central-gravity "+params.centralGravity);
    clearCanvas();
};
document.getElementById("asteroid-speed").onchange = function () {
    params.speed = parseInt(document.getElementById('asteroid-speed').value);
    console.log ("asteroid-speed "+params.asteroidSpeed);
    clearCanvas();
};

function startLoop () {
    console.log("startLoop");
      
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
        params.centralGravity = res.centralGravity;
        params.asteroidSpeed = res.asteroidSpeed;

        //Init drop down display
        document.getElementById("speed").value = params.centralGravity;
        document.getElementById("num-parts").value = res.asteroidSpeed;
    }
  }

  dynRequest.open ('GET', '/parread?file='+FILE_NAME, true);
  dynRequest.send();
}

//Drawing ---------------------------------------------------------------
function clearCanvas () {
    console.log("Clear canvas");
    ctx.clearRect(0, 0, artCanvas.width, artCanvas.height);

    clearInterval(loopInterval);
    loopInterval = null;
  }

function drawToCanvas () {
  //console.log ("Draw to canvas");
  ctx.clearRect(0, 0, artCanvas.width, artCanvas.height);
  
  loopCount++;
}

function drawCentral () {
    ctx.beginPath();
    ctx.arc(parts[i].x, parts[i].y, parts[i].rad, 0, Math.PI*2);
    ctx.fillStyle = parts[i].col;
    ctx.fill();
    ctx.closePath();  
}

