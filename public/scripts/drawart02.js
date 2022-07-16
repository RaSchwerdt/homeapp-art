//Constants ---------------------------------------------------------------
const FILE_NAME = "drawart02.txt";
let loopInterval = null;
let loopCount = 0;
let params = {
    file: FILE_NAME,
    simulationSpeed: 2000,
    numParts: 10,
    partSize: 1,
    impactFactor: 0.99,
    clearTrace: true,
}
let part = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    rad: 0,
    col: null,
    mass: 0,
    init: function (x, y, dx, dy, rad, mass) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.rad = rad;
      this.col = partColors[Math.floor(Math.random() * partColors.length)];
      this.mass = mass;
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
document.getElementById("simulation-speed").oninput = function () {
  params.simulationSpeed = parseInt(document.getElementById('simulation-speed').value);
  document.getElementById("simulation-speed-value").innerHTML = "("+params.simulationSpeed+")";
  //console.log ("simulation-speed "+params.simulationSpeed);
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
document.getElementById("impact-factor").oninput = function () {
    params.impactFactor = parseFloat(document.getElementById('impact-factor').value);
    document.getElementById("impact-factor-value").innerHTML = "("+params.impactFactor+")";
    //console.log ("impact-factor "+params.impactFactor);
    clearCanvas();
};
document.getElementById("clear-trace").onchange = function () {
  params.clearTrace = document.getElementById('clear-trace').checked;
  //console.log ("clear-trace "+params.clearTrace);
  clearCanvas();
};

function startLoop () {
    console.log("startLoop");
    if (parts.length==0) {
        console.log ("Init parts "+params.partSize);
      
        for (let i=0; i< params.numParts; i++) {
            parts[i] = new part.init ( 
            Math.floor(Math.random()*artCanvas.width), 
            Math.floor(Math.random()*artCanvas.height),
            0,
            0,
            params.partSize,
            params.partSize*3,
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
        //console.log ("Response "+dynRequest.responseText);
        var res = JSON.parse(dynRequest.responseText);

        //Init param values
        params.speed = res.speed;
        params.numParts = res.numParts;
        params.partSize = res.partSize;
        params.impactFactor = res.impactFactor;
        params.clearTrace = res.clearTrace;

        //Init drop down display
        document.getElementById("simulation-speed").value = params.simulationSpeed;
        document.getElementById("simulation-speed-value").innerHTML = "("+params.simulationSpeed+")";
        document.getElementById("num-parts").value = res.numParts;
        document.getElementById("num-parts-value").innerHTML = "("+params.numParts+")";
        document.getElementById("part-size").value = params.partSize;
        document.getElementById("part-size-value").innerHTML = "("+params.partSize+")";
        document.getElementById("impact-factor").value = params.impactFactor;
        document.getElementById("impact-factor-value").innerHTML = "("+params.impactFactor+")";
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
  if (params.clearTrace==1) {
    ctx.clearRect(0, 0, artCanvas.width, artCanvas.height);
  }
  drawParts();
  calculateVelocities();
  moveParts();

  
  loopCount++;
}

function drawParts () {
    for (let i=0; i< parts.length; i++) {
        //console.log("draw ball "+i);
        ctx.beginPath();
        ctx.arc(parts[i].x, parts[i].y, parts[i].rad, 0, Math.PI*2);
        ctx.fillStyle = parts[i].col;
        ctx.fill();
        ctx.closePath();  
    }
    
}

function calculateVelocities () {
  
  for (let i=0; i< parts.length; i++) {
    let obj1 = parts[i];
    //console.log ("obj1 x "+obj1.x+" y "+obj1.y);

    for (let j=i+1; j< parts.length; j++) {
      let obj2 = parts[j];
      //console.log ("obj2 x "+obj2.x+" y "+obj2.y)

      //Calulate distance
      let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
      if (distance<=obj1.rad) {
        //parts crashed - create one bigger part velocity decreases because of deformation (*0.5)
        obj1.rad += obj2.rad;
        obj1.mass += obj2.mass;
        obj1.dx = (obj1.dx+obj2.mass*(obj1.x-obj2.x))*0.5;
        obj1.dy = (obj1.dy+obj2.mass*(obj1.y-obj2.y))*0.5;

        //Remove the other
        parts.splice(j,1);
      }
      else {
        //Spped change considering object mass
        obj1.dx += obj1.mass*(obj2.x-obj1.x) / Math.pow(distance, 2);
        obj1.dy += obj1.mass*(obj2.y-obj1.y) / Math.pow(distance, 2);  

        obj2.dx += obj2.mass*(obj1.x-obj2.x) / Math.pow(distance, 2);
        obj2.dy += obj2.mass*(obj1.y-obj2.y) / Math.pow(distance, 2);  
      }

    }
    //console.log ("after move obj1 x "+obj1.x+" y "+obj1.y);
  }
}

function moveParts () {
  for (let i=0; i< parts.length; i++) {
    let leftSpace = false;
    if (parts[i].x <0) {
      leftSpace = true;
    } else if (parts[i].x>artCanvas.width) {
      leftSpace = true;
    } else if (parts[i].y <0) {
      leftSpace = true;
    } else if (parts[i].y>artCanvas.height) {
      leftSpace = true;
    }

    if (leftSpace == true) {
      //part has left the dsiplay space
      parts.splice(i,1);
    } else {
      parts[i].x += parts[i].dx;
      parts[i].y += parts[i].dy;  
    }
  }
}

  