const FILE_NAME = "drawart06.txt";
let loopInterval = null;
let loopCount = 0;
let params = {
    file: FILE_NAME,
    simulationSpeed: 2000,
    timeInterval: 0.1,
    numParts: 10,
    partSize: 1,
    massFactor: 1,
    smoothingFactor: 2,
    gravityFactor: 1,
    partsCrash: false,
    clearTrace: true,
}
let part = {
    x: 0,
    y: 0,
    rad: 0,
    mass: 0,
    col: null,
    ax: 0.0,
    ay: 0.0,
    vx: 0.0,
    vy: 0.0,
    init: function (x, y, dx, dy, rad, mass) {
      this.x = x;
      this.y = y;
      this.rad = rad;
      this.mass = mass;
      this.col = partColors[Math.floor(Math.random() * partColors.length)];
      this.ax = 0.0;
      this.ay = 0.0;
      this.vx = 0.0;
      this.vy = 0.0;
    },
  };
  let parts = [];
  let partColors = [
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
    let gravityCenter = {
        sx: 0,
        sy: 0,
        mg: 0,
    }
    let ePot = 0.0;
    let eKin = 0.0;
    
  

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
  

//Input elements
document.getElementById("simulation-speed").oninput = function () {
    params.simulationSpeed = parseInt(document.getElementById('simulation-speed').value);
    document.getElementById("simulation-speed-value").innerHTML = "("+params.simulationSpeed+")";
    //console.log ("simulation-speed "+params.simulationSpeed);
    clearCanvas();
};
document.getElementById("time-interval").oninput = function () {
    params.timeInterval = parseFloat(document.getElementById('time-interval').value);
    document.getElementById("time-interval-value").innerHTML = "("+params.timeInterval+")";
    //console.log ("time-interval "+params.timeInterval);
    clearCanvas();
  };
document.getElementById("num-parts").oninput = function () {
    params.numParts = parseInt(document.getElementById('num-parts').value);
    document.getElementById("num-parts-value").innerHTML = "("+params.numParts+")";
    //console.log ("num-parts "+params.numParts);
    clearCanvas();
};
document.getElementById("part-size").oninput = function () {
    params.partSize = parseInt(document.getElementById('part-size').value);
    document.getElementById("part-size-value").innerHTML = "("+params.partSize+")";
    //console.log ("part-size "+params.partSize);
    clearCanvas();
};
document.getElementById("mass-factor").oninput = function () {
    params.massFactor = parseInt(document.getElementById('mass-factor').value);
    document.getElementById("mass-factor-value").innerHTML = "("+params.massFactor+")";
    //console.log ("mass-factor "+params.massFactor);
    clearCanvas();
};
document.getElementById("gravity-factor").oninput = function () {
    params.gravityFactor = parseInt(document.getElementById('gravity-factor').value);
    document.getElementById("gravity-factor-value").innerHTML = "("+params.gravityFactor+")";
    //console.log ("gravity-factor "+params.gravityFactor);
    clearCanvas();
};
document.getElementById("smoothing-factor").oninput = function () {
    params.smoothingFactor = parseInt(document.getElementById('smoothing-factor').value);
    document.getElementById("smoothing-factor-value").innerHTML = "("+params.smoothingFactor+")";
    //console.log ("smoothing-factor "+params.gravityFactor);
    clearCanvas();
};
document.getElementById("parts-crash").onchange = function () {
    params.partsCrash = document.getElementById('parts-crash').checked;
    //console.log ("parts-crash "+params.partsCrash);
    clearCanvas();
};
document.getElementById("clear-trace").onchange = function () {
    params.clearTrace = document.getElementById('clear-trace').checked;
    //console.log ("clear-trace "+params.clearTrace);
    clearCanvas();
};

function startLoop () {
    //Create randomly distributed parts.
    console.log("startLoop");
    if (parts.length==0) {

        console.log ("Init parts "+params.numParts);
        for (let i=0; i< params.numParts; i++) {
            parts[i] = new part.init ( 
            Math.floor(Math.random()*artCanvas.width), 
            Math.floor(Math.random()*artCanvas.height),
            0,
            0,
            params.partSize,
            params.partSize*params.massFactor,
            )
            if (parts[i].x<parts[i].rad) {parts[i].x += parts[i].rad;}
            if (parts[i].x>artCanvas.width-parts[i].rad) {parts[i].x -= parts[i].rad;}
            if (parts[i].y<parts[i].rad) {parts[i].y += parts[i].rad;}
            if (parts[i].y>artCanvas.height-parts[i].rad) {parts[i].y -= parts[i].rad;}
        } 
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
        console.log ("Response "+dynRequest.responseText);
        var res = JSON.parse(dynRequest.responseText);

        //Init param values
        params.simulationSpeed = res.simulationSpeed;
        params.timeInterval = res.timeInterval;
        params.numParts = res.numParts;
        params.partSize = res.partSize;
        params.massFactor = res.massFactor;
        params.smoothingFactor = res.smoothingFactor;
        params.gravityFactor = res.gravityFactor;
        params.partsCrash = res.partsCrash;
        params.clearTrace = res.clearTrace;

        //Init drop down display
        document.getElementById("simulation-speed").value = params.simulationSpeed;
        document.getElementById("simulation-speed-value").innerHTML = "("+params.simulationSpeed+")";
        document.getElementById("time-interval").value = params.timeInterval;
        document.getElementById("time-interval-value").innerHTML = "("+params.timeInterval+")";
        document.getElementById("num-parts").value = res.numParts;
        document.getElementById("num-parts-value").innerHTML = "("+params.numParts+")";
        document.getElementById("part-size").value = params.partSize;
        document.getElementById("part-size-value").innerHTML = "("+params.partSize+")";
        document.getElementById("mass-factor").value = params.massFactor;
        document.getElementById("mass-factor-value").innerHTML = "("+params.massFactor+")";
        document.getElementById("smoothing-factor").value = params.smoothingFactor;
        document.getElementById("smoothing-factor-value").innerHTML = "("+params.smoothingFactor+")";
        document.getElementById("gravity-factor").value = params.gravityFactor;
        document.getElementById("gravity-factor-value").innerHTML = "("+params.gravityFactor+")";
        document.getElementById("parts-crash").checked = params.partsCrash;
        document.getElementById("clear-trace").checked = params.clearTrace;
    }
  }

  dynRequest.open ('GET', '/parread?file='+FILE_NAME, true);
  dynRequest.send();
}
  
//Drawing ---------------------------------------------------------------
function clearCanvas () {
    console.log("Clear canvas");
    ctx.clearRect(0, 0, artCanvas.width, artCanvas.height);
    parts = [];
    clearInterval(loopInterval);
    loopInterval = null;
  }

function drawToCanvas () {
  //console.log ("Draw to canvas");
  if (params.clearTrace==true) {
    ctx.clearRect(0, 0, artCanvas.width, artCanvas.height);
  }
  calculateGravityCenter();
  drawParts();
  drawGravityCenter();
  calculatePartAcceleration();
  moveEuler();

  if (loopCount % 10 == 0) {
    calculateEnergie();
    //logParts();
    //console.log("sx "+gravityCenter.sx+" sy "+gravityCenter.sy+" mg "+gravityCenter.mg);     

  }
  
  loopCount++;
}

function drawParts () {
    //Draw all parts
    for (let i=0; i< parts.length; i++) {
        obj = parts[i];
        if (params.clearTrace==false) {
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, 1, 0, Math.PI*2);
            ctx.fillStyle = obj.col;
            ctx.fill();
            ctx.closePath();          
          } else {
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.rad, 0, Math.PI*2);
            ctx.fillStyle = obj.col;
            ctx.fill();
            ctx.closePath();            
          }     
    }
}

function drawGravityCenter () {
    //Draw gravity center
    if (params.clearTrace==false) {
        ctx.beginPath();
        ctx.arc(gravityCenter.sx, gravityCenter.sy, 1, 0, Math.PI*2);
        ctx.fillStyle = "#ff0000";
        ctx.fill();
        ctx.closePath();          
    } else {
        ctx.beginPath();
        ctx.arc(gravityCenter.sx, gravityCenter.sy, 5, 0, Math.PI*2);
        ctx.setLineDash([]);
        ctx.strokeStyle = "#ff0000";
        ctx.stroke();
        ctx.closePath();
    }
}

function calculateGravityCenter () {
    //Initialize grabity center
    gravityCenter.sx=0;
    gravityCenter.sy=0;
    gravityCenter.mg=0;

    for (let i=0; i< parts.length; i++) {
        //Add to gravity center
        gravityCenter.sx += parts[i].mass * parts[i].x;
        gravityCenter.sy += parts[i].mass * parts[i].y;
        gravityCenter.mg += parts[i].mass;    
    }
    gravityCenter.sx = Math.floor(gravityCenter.sx/gravityCenter.mg);
    gravityCenter.sy = Math.floor(gravityCenter.sy/gravityCenter.mg);
    //console.log("sx "+gravityCenter.sx+" sy "+gravityCenter.sy+" mg "+gravityCenter.mg);     
}


function calculatePartAcceleration () {
    for (let i=0; i< parts.length; i++) {
        let obj1 = parts[i];

        //Acceleration based on other parts
        for (let j=0; j< parts.length; j++) {

            if (j != i) {
                let obj2 = parts[j];
                let epsilon = (obj1.rad+obj2.rad)*params.smoothingFactor;
                
                //Determine distance obj1-obj2
                let dx = obj2.x-obj1.x;
                let dy = obj2.y-obj1.y;
                let d = Math.sqrt(dx * dx + dy * dy);
                if ((d < obj1.rad+obj2.rad) && (params.partsCrash==true)) {
                    //Crash
                    obj1.rad += obj2.rad;
                    obj1.mass += obj2.mass;
            
                    //Remove the other
                    parts.splice(j,1);
                } else if (d < 2 * epsilon) {
                    //Reduce acceleration, if two parts get too close
                    let d2 = Math.pow (d, 2) + 4 * epsilon;
                    let d6 = Math.pow (d2, 3);
                    obj1.ax += parseFloat(params.gravityFactor * obj2.mass * 64 * epsilon * dx / d6);
                    obj1.ay += parseFloat(params.gravityFactor * obj2.mass * 64 * epsilon * dy / d6);     
                } else {
                    //Caluculate acceleration on obj1
                    let d3 = Math.pow(d, 3); 
                    obj1.ax += parseFloat(params.gravityFactor * obj2.mass * dx / d3);
                    obj1.ay += parseFloat(params.gravityFactor * obj2.mass * dy / d3);     
                } 
                //console.log ("dx "+dx+" dy "+dy+" d "+d+" d3 "+d3+" ax "+obj1.ax+" ay "+obj1.ay+" d/d3 "+(d/d3));
            }
        }
        //console.log ("i "+i+" x "+obj1.x+" y "+obj1.y+" ax "+obj1.ax+" ay "+obj1.ay);
    }
}

function moveEuler () {

    for (let i=0; i< parts.length; i++) {
        let obj = parts[i];

        //Calculate new position
        obj.x += Math.floor(obj.vx * params.timeInterval);
        obj.y += Math.floor(obj.vy * params.timeInterval);

        //Calculate new velocity
        obj.vx += obj.ax * params.timeInterval;
        obj.vy += obj.ay * params.timeInterval;
    }

}

function calculateEnergie () {
    eKin = 0.0;
    ePot = 0.0;

    for (let i=0; i< parts.length; i++) {
        let obj1 = parts[i];

        eKin += obj1.mass * Math.pow(Math.sqrt(obj1.vx * obj1.vx + obj1.vy * obj1.vy), 2) / 2;

        for (let j=i+1; j< parts.length; j++) {
            let obj2 = parts[j];

            let dx = obj2.x-obj1.x;
            let dy = obj2.y-obj1.y;
            let d = Math.sqrt(dx * dx + dy * dy); 

            ePot -= params.gravityFactor * obj1.mass * obj2.mass / 2;
        }
    }
    console.log ("eKin "+eKin+" ePot "+ePot);
}

function logParts () {

    for (let i=0; i< parts.length; i++) {
        let obj = parts[i];
        console.log ("i "+i+" x "+obj.x+" y "+obj.y);
    }
}