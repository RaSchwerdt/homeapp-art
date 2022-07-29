//Constants ---------------------------------------------------------------
const FILE_NAME = "drawart05.txt";
let loopInterval = null;
let loopCount = 0;
let CRASH_COLOR = "#2d862d";
let GRAVITY_COLOR = "#666666"
let gravityField = {
  dist: 0, //distance from center
  start: 0, //angle in radians 0-360
  size: 0, //size of planet
  speed: 0, //Angle velocity
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  mass: 0,
  col: null,
  init: function (dist, start, size, speed) {
    //console.log ("Ini "+dist+", "+start+", "+size+", "+speed)
    this.dist = dist;
    this.start = start;
    this.size = size;
    this.speed = speed;
    this.mass = size*params.gravityFactor;
  },
}
let params = {
    file: FILE_NAME,
    simulationSpeed: 80,
    pushFactor: 1.0,
    ballSpeed: 0,
    numBalls: 10,
    minSize: 10,
    maxSize: 10,
    gravityFactor: 5,
    ellipseFactor: 1.0,
    clearTrace: true,
    fields: [],
}
let modParam = {
  dist: 0,
  start: 0,
  size:5,
  speed:0,
} 
let ball = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  rad: 0,
  col: null,
  mass: 0,
  crash: false,
  init: function (x, y, dx, dy, rad) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.rad = rad;
    this.col = ballColors[Math.floor(Math.random() * ballColors.length)];
    this.mass = this.rad;
  },
};
let balls = [];
let ballColors = [
    "#b3ecff",
    "#cceeff",
    "#ccd9ff",
    "#e0ebeb",
    "#fff2cc",
    "#ccfff5",
    "#b3ccff",
    "#b3ccff",
    "#b3ffe6",
    "#ccb3ff",
    "#d9b3ff",
];
  

//Screen interaction ---------------------------------------------------------------
let artCanvas = document.getElementById('art-canvas');
artCanvas.setAttribute ('width', screen.availWidth/3);
artCanvas.setAttribute ('height', screen.availHeight/3); 
artCanvas.style.backgroundColor= '#00131a';
let ctx = artCanvas.getContext('2d');
document.body.onload = function () {
    readParams ();
}
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
  document.getElementById("gravity-modal").style.display = "block";
  document.getElementById('modal-distance').value = modParam.dist;
  document.getElementById('modal-start').value = modParam.start;
  document.getElementById('modal-size').value = modParam.size;
  document.getElementById('modal-speed').value = modParam.speed;
};
document.getElementById("modal-save").onclick = function () {
    console.log ("Params "+modParam.dist+", "+modParam.start+", "+modParam.speed+", "+modParam.size+", "+modParam.speed);
    params.fields.push(new gravityField.init(modParam.dist, modParam.start, modParam.size, modParam.speed));
    listGravityFields(params.fields);
  document.getElementById("gravity-modal").style.display = "none";
  clearCanvas();
};
document.getElementById("modal-remove").onclick = function () {
  params.fields.pop();
  //console.log ("modal-remove "+params.planets.length);
  listGravityFields(params.fields);
  clearCanvas();
};
document.getElementById("modal-close").onclick = function () {
  document.getElementById("gravity-modal").style.display = "none";
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
document.getElementById("modal-speed").oninput = function () {
  modParam.speed = parseInt(document.getElementById('modal-speed').value);
  document.getElementById("modal-speed-value").innerHTML = "("+modParam.speed+")";
};

//Input elements
document.getElementById("simulation-speed").oninput = function () {
    params.simulationSpeed = parseInt(document.getElementById('simulation-speed').value);
    document.getElementById("simulation-speed-value").innerHTML = "("+params.simulationSpeed+")";
    //console.log ("simulation-speed "+params.simulationSpeed);
    clearCanvas();
};
document.getElementById("push-factor").oninput = function () {
    params.pushFactor = parseFloat(document.getElementById('push-factor').value);
    document.getElementById("push-factor-value").innerHTML = "("+params.pushFactor+")";
    //console.log ("push-factor "+params.pushFactor);
    clearCanvas();
};
document.getElementById("ball-speed").oninput = function () {
  params.ballSpeed = parseFloat(document.getElementById('ball-speed').value);
  document.getElementById("ball-speed-value").innerHTML = "("+params.ballSpeed+")";
  //console.log ("ball-speed "+params.ballSpeed);
  clearCanvas();
};
document.getElementById("num-balls").oninput = function () {
    params.numBalls = parseInt(document.getElementById('num-balls').value);
    document.getElementById("num-balls-value").innerHTML = "("+params.numBalls+")";
    //console.log ("num-balls "+params.numBalls);
    clearCanvas();
};
document.getElementById("min-size").oninput = function () {
    params.minSize = parseInt(document.getElementById('min-size').value);
    document.getElementById("min-size-value").innerHTML = "("+params.minSize+")";
    //console.log ("min-size "+params.minSize);
    clearCanvas();
};
document.getElementById("max-size").oninput = function () {
    params.maxSize = parseInt(document.getElementById('max-size').value);
    document.getElementById("max-size-value").innerHTML = "("+params.maxSize+")";
    //console.log ("max-size "+params.maxSize);
    clearCanvas();
};
document.getElementById("gravity-factor").oninput = function () {
    params.gravityFactor = parseFloat(document.getElementById('gravity-factor').value);
    document.getElementById("gravity-factor-value").innerHTML = "("+params.gravityFactor+")";
    //console.log ("gravity-factor "+params.gravityFactor);
    clearCanvas();
};
document.getElementById("ellipse-factor").oninput = function () {
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
  

function startLoop () {
  console.log("startLoop");

  //Calculate initial positions of gravity fields
  for (i=0; i < params.fields.length; i++) {

    let obj = params.fields[i];
    obj.x = artCanvas.width/2 + obj.dist * params.ellipseFactor * Math.cos(obj.start*2*Math.PI/360);
    obj.y = artCanvas.height/2 + obj.dist * Math.sin(obj.start*2*Math.PI/360);
    obj.col = GRAVITY_COLOR;
    console.log ("field "+(i)+" dist "+obj.dist+" start "+obj.start+" size "+obj.size+" x "+obj.x+" y "+obj.y+" speed "+obj.speed+" col "+obj.col);

  }

  //Create balls
  if (balls.length==0) {
    console.log ("Init balls "+params.ballSize);
  
    for (let i=0; i< params.numBalls; i++) {
      //console.log("ball "+i);
      balls[i] = new ball.init ( 
        Math.floor(Math.random()*artCanvas.width), 
        Math.floor(Math.random()*artCanvas.height),
        Math.floor(Math.random()*params.ballSpeed)-params.ballSpeed/2,
        Math.floor(Math.random()*params.ballSpeed)-params.ballSpeed/2,
        Math.floor(Math.random() * (params.maxSize-params.minSize))+params.minSize,
        )
        if (balls[i].x<balls[i].rad) {balls[i].x += balls[i].rad;}
        if (balls[i].x>artCanvas.width-balls[i].rad) {balls[i].x -= balls[i].rad;}
        if (balls[i].y<balls[i].rad) {balls[i].y += balls[i].rad;}
        if (balls[i].y>artCanvas.height-balls[i].rad) {balls[i].y -= balls[i].rad;}
    }  
    console.log ("ball0 x"+balls[0].x+" y "+balls[0].y+" dx "+balls[0].dx+" dy "+balls[0].dy+" rad "+balls[0].rad+" col "+balls[0].col);
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
        params.pushFactor = res.pushFactor;
        params.ballSpeed = res.ballSpeed;
        params.numBalls = res.numBalls;
        params.minSize = res.minSize;
        params.maxSize = res.maxSize;
        params.gravityFactor = res.gravityFactor;
        params.ellipseFactor = res.ellipseFactor;
        params.clearTrace = res.clearTrace;
        params.fields = res.fields;

        //Init drop down display
        document.getElementById("simulation-speed").value = params.simulationSpeed;
        document.getElementById("simulation-speed-value").innerHTML = "("+params.simulationSpeed+")";
        document.getElementById("push-factor").value = params.pushFactor;
        document.getElementById("push-factor-value").innerHTML = "("+params.pushFactor+")";
        document.getElementById("push-factor").value = params.ballSpeed;
        document.getElementById("push-factor-value").innerHTML = "("+params.ballSpeed+")";
        document.getElementById("num-balls").value = res.numBalls;
        document.getElementById("num-balls-value").innerHTML = "("+params.numBalls+")";
        document.getElementById("min-size").value = params.minSize;
        document.getElementById("min-size-value").innerHTML = "("+params.minSize+")";
        document.getElementById("max-size").value = params.maxSize;
        document.getElementById("max-size-value").innerHTML = "("+params.maxSize+")";
        document.getElementById("gravity-factor").value = params.gravityFactor;
        document.getElementById("gravity-factor-value").innerHTML = "("+params.gravityFactor+")";
        document.getElementById("ellipse-factor").value = params.ellipseFactor;
        document.getElementById("ellipse-factor-value").innerHTML = "("+params.ellipseFactor+")";
        document.getElementById("clear-trace").checked = params.clearTrace;
        listGravityFields(params.fields);
    }
  }

  dynRequest.open ('GET', '/parread?file='+FILE_NAME, true);
  dynRequest.send();
}
function listGravityFields (arr) {
  let list = document.getElementById("list-gravity-fields")
  while (list.hasChildNodes()) {
    //console.log ("Remove childs");
    list.removeChild(list.firstChild);
  }
  for (i=0; i <arr.length; i++) {
    let gravityString = "Gravity field "+(i+1)+": Distance from center "+arr[i].dist+", Start angle "+arr[i].start+", Gravity power "+arr[i].size+", Angle speed "+arr[i].speed;
    //console.log (planetString);
    let listItem = document.createElement("li")
    listItem.setAttribute('class', 'list-group-item')
    listItem.innerHTML = gravityString;
    list.appendChild(listItem);
  }
}


//Drawing ---------------------------------------------------------------
function clearCanvas () {
    console.log("Clear canvas");
    ctx.clearRect(0, 0, artCanvas.width, artCanvas.height);
    balls = [];
    clearInterval(loopInterval);
    loopInterval = null;
  }

  function drawToCanvas () {
    //console.log ("Draw to canvas "+params.clearTrace);
    if (params.clearTrace==true) {
      ctx.clearRect(0, 0, artCanvas.width, artCanvas.height);
    }
  
    drawGravityFields();
    drawBalls();
    calculateGravityImpact();
    detectCollisions();
    bounceOffWalls();
    moveBalls();
    if (loopCount % 1000 == 0) {
      calculateEnergy();
    }

    loopCount++;
    //console.log("Loop count "+loopCount+"Asteroid appearance "+params.asteroidAppearance);
  }
  

function drawGravityFields () {

  for (let i=0; i< params.fields.length; i++) {

    obj = params.fields[i];

    //Draw planet
    //console.log("Field "+i+" x "+obj.x+" y "+obj.y+" size "+obj.size+" start "+obj.start+" speed "+obj.speed);
    if (params.clearTrace==false) {
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, 1, 0, Math.PI*2);
      ctx.fillStyle = obj.col;
      ctx.fill();
      ctx.closePath();          
    } else {
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, obj.size, 0, Math.PI*2);
      ctx.setLineDash([]);
      ctx.strokeStyle = obj.col;
      ctx.stroke();
      ctx.closePath();

    }     
  }

}

function drawBalls () {
  for (let i=0; i< balls.length; i++) {
    //console.log("draw ball "+i);
    if (params.clearTrace==true) {
        ctx.beginPath();
        ctx.arc(balls[i].x, balls[i].y, balls[i].rad, 0, Math.PI*2);
        if (balls[i].crash == true) {
            ctx.fillStyle = CRASH_COLOR;
            balls[i].crash = false;
        } else {
            ctx.fillStyle = balls[i].col;
        }  
        ctx.fill();
        ctx.closePath();      
    } else {
        ctx.beginPath();
        ctx.arc(balls[i].x, balls[i].y, balls[i].rad, 0, Math.PI*2);
        if (balls[i].crash == true) {
            ctx.strokeStyle = CRASH_COLOR;
            balls[i].crash = false;
        } else {
            ctx.strokeStyle = balls[i].col;
        }  
        ctx.stroke();
        ctx.closePath();      
    }
  }
}

function moveBalls () {
  for (let i=0; i< balls.length; i++) {
    //console.log("move ball "+i);
    balls[i].x += balls[i].dx;
    balls[i].y += balls[i].dy;
  }
}

function calculateGravityImpact () {

  for (let i=0; i< balls.length; i++) {
    //console.log ("i "+i);
    let obj1 = balls[i];

    for (let j=0; j< params.fields.length; j++) {
      //console.log ("j "+j);
      let obj2 = params.fields[j];

      let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
        obj1.dx += obj2.mass*(obj2.x-obj1.x) / Math.pow(distance, 2);
        obj1.dy += obj2.mass*(obj2.y-obj1.y) / Math.pow(distance, 2);  
    }
  }

}


function detectCollisions () {
  for (let i=0; i< balls.length; i++) {
    let obj1 = balls[i];
    //console.log ("obj1 x, y, rad"+obj1.x+", "+obj1.y+", "+obj1.rad)
    for (let j=i+1; j< balls.length; j++) {
      let obj2 = balls[j];
      //console.log ("obj2 x, y, rad"+obj2.x+", "+obj2.y+", "+obj2.rad)
      if (circleIntersect(obj1.x, obj1.y, obj1.rad, obj2.x, obj2.y, obj2.rad)) {
        //console.log("collsion detect at "+obj1.x+" i "+i+" j "+j)
        obj1.crash = true;
        obj2.crash = true;

        let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
        let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
        let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
        let vRelativeVelocity = {x: obj1.dx - obj2.dx, y: obj1.dy - obj2.dy};
        let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
        //console.log("vCollision-x "+vCollision.x+" vCollision-y "+vCollision.y);
        //console.log("distance "+distance);
        //console.log("vCollisionNorm-x "+vCollisionNorm.x+" vCollisionNorm-y "+vCollisionNorm.y);
        //console.log("vRelativeVelocity-x "+vRelativeVelocity.x+" vRelativeVelocity-y.y "+vRelativeVelocity.y);
        //console.log("speed "+speed);


        if (speed < 0) {
            break;
        }

        //console.log("New speed "+speed);
        let impulse = 2 * speed * params.pushFactor / (obj1.mass + obj2.mass);
        obj1.dx -= (impulse * obj2.mass * vCollisionNorm.x);
        obj1.dy -= (impulse * obj2.mass * vCollisionNorm.y);
        obj2.dx += (impulse * obj1.mass * vCollisionNorm.x);
        obj2.dy += (impulse * obj1.mass * vCollisionNorm.y);

      }
    }
  }

}

function circleIntersect (x1, y1, r1, x2, y2, r2) {
  //console.log ("x1 "+x1+" y1 "+y1+" x2 "+x2+" y2 "+y2);
  //console.log ("r1 "+r1+" r2 "+r2);
  let squareDistance = (x1-x2)*(x1-x2) + (y1 -y2)*(y1 -y2);
  //console.log ("squareDistance "+squareDistance);
  let radDistance = (r1+r2)*(r1+r2);
  //console.log ("radDistance "+radDistance);

  return squareDistance <= radDistance;
}


function bounceOffWalls () {
  for (let i=0; i< balls.length; i++) {
    //console.log("bounce of ball "+i);
    if(balls[i].x + balls[i].dx > artCanvas.width-balls[i].rad || balls[i].x + balls[i].dx < balls[i].rad) {
      balls[i].dx = -balls[i].dx * params.pushFactor;
    }
    if(balls[i].y + balls[i].dy > artCanvas.height-balls[i].rad || balls[i].y + balls[i].dy < balls[i].rad) {
      balls[i].dy = -balls[i].dy * params.pushFactor;
    }   
  }
}

function calculateEnergy () {
  let totalEnergy = 0.0;
  for (let i=0; i< balls.length; i++) {
    //console.log("move ball "+i);
    let vel = Math.sqrt(balls[i].dx*balls[i].dx + balls[i].dy*balls[i].dy);
    totalEnergy += vel*vel*balls[i].mass/2;
  }
  console.log("Total energy "+totalEnergy);
}