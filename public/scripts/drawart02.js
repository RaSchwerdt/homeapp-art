//Constants ---------------------------------------------------------------
const FILE_NAME = "drawart02.txt";
let loopInterval = null;
let loopCount = 0;
let params = {
    file: FILE_NAME,
    speed: 2000,
    numParts: 10,
    partSize: 1,
    impactFactor: 0.99,
    clearTrace: 0,
}
let part = {
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
  let parts = [];
  

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
document.getElementById("speed").onchange = function () {
    params.speed = parseInt(document.getElementById('speed').value);
    console.log ("speed "+params.speed);
    clearCanvas();
};
document.getElementById("num-parts").onchange = function () {
    params.numParts = parseInt(document.getElementById('num-parts').value);
    console.log ("num-parts "+params.numParts);
    clearCanvas();
};
document.getElementById("part-size").onchange = function () {
    params.partSize = parseInt(document.getElementById('part-size').value);
    console.log ("part-size "+params.partSize);
    clearCanvas();
};
document.getElementById("impact-factor").onchange = function () {
    params.impactFactor = parseFloat(document.getElementById('impact-factor').value);
    console.log ("impact-factor "+params.impactFactor);
    clearCanvas();
};
document.getElementById("clear-trace").onchange = function () {
  params.clearTrace = parseInt(document.getElementById('clear-trace').value);
  console.log ("clear-trace "+params.clearTrace);
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
            "#0095DD",
            params.partSize*3,
            )
            if (parts[i].x<parts[i].rad) {parts[i].x += parts[i].rad;}
            if (parts[i].x>artCanvas.width-parts[i].rad) {parts[i].x -= parts[i].rad;}
            if (parts[i].y<parts[i].rad) {parts[i].y += parts[i].rad;}
            if (parts[i].y>artCanvas.height-parts[i].rad) {parts[i].y -= parts[i].rad;}
        }  
      }
      
    if (loopInterval == null) {
      loopInterval = setInterval(drawToCanvas, params.speed);  
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
        document.getElementById("speed").value = params.speed;
        document.getElementById("num-parts").value = res.numParts;
        document.getElementById("part-size").value = params.partSize;
        document.getElementById("impact-factor").value = params.impactFactor;
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
        //parts crashed - create one bigger part
        obj1.rad += obj2.rad;
        obj1.mass += obj2.mass;
        obj1.dx += obj2.mass*(obj1.x-obj2.x);
        obj1.dy += obj2.mass*(obj1.y-obj2.y);

        //Remove the other
        parts.splice(j,1);
      }
      else {
        let moveFactor = obj1.mass * obj2.mass / Math.pow(distance, 2);
        //console.log("Distance "+distance+" Factor "+moveFactor);
        obj1.dx += obj1.mass*(obj2.x-obj1.x) / Math.pow(distance, 2);
        obj1.dy += obj1.mass*(obj2.y-obj1.y) / Math.pow(distance, 2);  

        obj2.dx += obj2.mass*(obj1.x-obj2.x) / Math.pow(distance, 2);
        obj2.dy += obj2.mass*(obj1.y-obj2.y) / Math.pow(distance, 2);  


        //New part position
        /*
        if(obj1.rad>obj2.rad) {
          obj2.dx += moveFactor*(obj1.x-obj2.x);
          obj2.dy += moveFactor*(obj1.y-obj2.y);  
        } else {
          obj1.dx += moveFactor*(obj2.x-obj1.x);
          obj1.dy += moveFactor*(obj2.y-obj1.y);  
        }*/
        //console.log ("after move obj1 x "+obj1.x+" y "+obj1.y);

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

  