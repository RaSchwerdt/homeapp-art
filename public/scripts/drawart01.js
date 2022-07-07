//Constants ---------------------------------------------------------------
const FILE_NAME = "drawart01.txt";
const MAX_BALLS = 20;
let loopInterval = null;
let ball = {
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
let balls = [];
let crash = {
  x: 0,
  y: 0,
  r: 0,
  col: "",
  init: function (x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.col = crashColors[Math.floor(Math.random() * crashColors.length)];
  }
};
let crashes = [];
let crashColors = [
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
let loopCount = 0;
let pushFactor = 1.0;
let params = {
  file: FILE_NAME,
  ballSpeed: 80,
  numBalls: 10,
  ballSize: 5,
  pushAmp: 0.0,
  pushChange: 2000,
  crashShrink: 1,
  shrinkInterval: 2000,
  crashScale: 5,
}

//Screen interaction ---------------------------------------------------------------
let artCanvas = document.getElementById('art-canvas');
artCanvas.setAttribute ('width', screen.availWidth/3);
artCanvas.setAttribute ('height', screen.availHeight/3); 
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
document.getElementById("read-button").onclick = function () {
  readParams ();
};
document.getElementById("ball-speed").onchange = function () {
    params.ballSpeed = parseInt(document.getElementById('ball-speed').value);
    console.log ("ball-speed "+params.ballSpeed);
    clearCanvas();
};
document.getElementById("num-balls").onchange = function () {
    params.numBalls = parseInt(document.getElementById('num-balls').value);
    console.log ("num-balls "+params.numBalls);
    clearCanvas();
};
document.getElementById("ball-size").onchange = function () {
    params.ballSize = parseInt(document.getElementById('ball-size').value);
    console.log ("ball-size "+params.ballSize);
    clearCanvas();
};
document.getElementById("push-amp").onchange = function () {
    params.pushAmp = parseFloat(document.getElementById('push-amp').value);
    console.log ("push-amp "+params.pushAmp);
    clearCanvas();
};
document.getElementById("push-change").onchange = function () {
  params.pushChange = parseFloat(document.getElementById('push-change').value);
  console.log ("push-amp "+params.pushChange);
  clearCanvas();
};
document.getElementById("crash-shrink").onchange = function () {
  params.crashShrink = parseInt(document.getElementById('crash-shrink').value);
  console.log ("crash-shrink "+params.crashShrink);
  clearCanvas();
};
document.getElementById("shrink-interval").onchange = function () {
  params.shrinkInterval = parseInt(document.getElementById('shrink-interval').value);
  console.log ("shrink-interval "+params.shrinkInterval);
  clearCanvas();
};
document.getElementById("crash-scale").onchange = function () {
  params.crashScale = parseInt(document.getElementById('crash-scale').value);
  console.log ("crash-scale "+params.crashScale);
  clearCanvas();
};

function startLoop () {
  console.log("startLoop");
  if (balls.length==0) {
    console.log ("Init balls "+params.ballSize);
  
    for (let i=0; i< params.numBalls; i++) {
      //console.log("ball "+i);
      balls[i] = new ball.init ( 
        Math.floor(Math.random()*artCanvas.width), 
        Math.floor(Math.random()*artCanvas.height),
        Math.floor(Math.random()*6)-3,
        Math.floor(Math.random()*4)-2,
        params.ballSize,
        "#0095DD",
        params.ballSize,
        )
        if (balls[i].x<balls[i].rad) {balls[i].x += balls[i].rad;}
        if (balls[i].x>artCanvas.width-balls[i].rad) {balls[i].x -= balls[i].rad;}
        if (balls[i].y<balls[i].rad) {balls[i].y += balls[i].rad;}
        if (balls[i].y>artCanvas.height-balls[i].rad) {balls[i].y -= balls[i].rad;}
    }  
    //console.log ("ball0 x"+balls[0].x+" y "+balls[0].y+" dx "+balls[0].dx+" dy "+balls[0].dy+" rad "+balls[0].rad+" col "+balls[0].col);
  }

  if (loopInterval == null) {
    loopInterval = setInterval(drawToCanvas, params.ballSpeed);  
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
        params.ballSpeed = res.ballSpeed;
        params.numBalls = res.numBalls;
        params.ballSize = res.ballSize;
        params.pushAmp = res.pushAmp;
        params.pushChange = res.pushChange;
        params.crashShrink = res.crashShrink;
        params.shrinkInterval = res.shrinkInterval;
        params.crashScale = res.crashScale;
        pushFactor = 1.0 - params.pushAmp;

        //Init drop down display
        document.getElementById("ball-speed").value = params.ballSpeed;
        document.getElementById("num-balls").value = res.numBalls;
        document.getElementById("ball-size").value = params.ballSize;
        document.getElementById("push-amp").value = params.pushAmp;
        document.getElementById("push-change").value = params.pushChange;
        document.getElementById("crash-shrink").value = params.crashShrink;
        document.getElementById("shrink-interval").value = params.shrinkInterval;
        document.getElementById("crash-scale").value = params.crashScale;
    }
  }

  dynRequest.open ('GET', '/parread?file='+FILE_NAME, true);
  dynRequest.send();
}

//Drawing ---------------------------------------------------------------
function clearCanvas () {
    console.log("Clear canvas");
    ctx.clearRect(0, 0, artCanvas.width, artCanvas.height);
    balls = [];
    crashes = [];
    clearInterval(loopInterval);
    loopInterval = null;
  }

function drawToCanvas () {
  //console.log ("Draw to canvas");
  ctx.clearRect(0, 0, artCanvas.width, artCanvas.height);
  drawCrashes();
  drawBalls();
  bounceOffWalls();
  detectCollisions();
  moveBalls();
  if (loopCount % 1000 == 0) {
    calculateEnergy();
  }
  if (loopCount % params.shrinkInterval == 0) {
    reduceCrashes();
  }
  if (loopCount % params.pushChange == 0) {
    if (pushFactor>=1.0) {
      pushFactor = 1.0 - params.pushAmp;
    } else {
      pushFactor = 1.0 + params.pushAmp;
    }
    console.log ("Push factor "+pushFactor);    
  }

  loopCount++;
}

function drawBalls () {
  for (let i=0; i< balls.length; i++) {
    //console.log("draw ball "+i);
    ctx.beginPath();
    ctx.arc(balls[i].x, balls[i].y, balls[i].rad, 0, Math.PI*2);
    ctx.fillStyle = balls[i].col;
    ctx.fill();
    ctx.closePath();  
  }
}

function reduceCrashes () {
  let cntReduce = 0;
  let cntRemove = 0;
  //Remove crash size or remove crash
  for (let i=0; i < crashes.length; i++) {
    if (crashes[i].r - params.crashShrink <0) {
        //console.log ("Remove crash "+i);
        cntRemove++;
        crashes.splice(i, 1); 
    } else {
        //console.log ("Reduce crash "+i);
        cntReduce++;
        crashes[i].r = crashes[i].r - params.crashShrink;
    }
  }    
  console.log ("Reduce "+cntReduce+" Remove "+cntRemove);
}

function drawCrashes () {
  //console.log("drawCrashes ");

  //Draw crashes
  for (let i=0; i< crashes.length; i++) {
    ctx.beginPath();
    ctx.arc(crashes[i].x, crashes[i].y, crashes[i].r, 0, Math.PI*2);
    //ctx.fillStyle = "#999999"
    //console.log ("i "+i+" Crash color "+ crashes[i].col);
    ctx.fillStyle = crashes[i].col;
    ctx.fill();
    ctx.closePath();
  }  
}

function moveBalls () {
  for (let i=0; i< balls.length; i++) {
    //console.log("move ball "+i);
    balls[i].x += balls[i].dx;
    balls[i].y += balls[i].dy;
  }
}

function detectCollisions () {
  for (let i=0; i< balls.length; i++) {
    balls[i].col = "#0095DD";
  }

  for (let i=0; i< balls.length; i++) {
    obj1 = balls[i];
    //console.log ("obj1 x, y, rad"+obj1.x+", "+obj1.y+", "+obj1.rad)
    for (let j=i+1; j< balls.length; j++) {
      obj2 = balls[j];
      //console.log ("obj2 x, y, rad"+obj2.x+", "+obj2.y+", "+obj2.rad)
      if (circleIntersect(obj1.x, obj1.y, obj1.rad, obj2.x, obj2.y, obj2.rad)) {
        //console.log("collsion detect at "+obj1.x+" i "+i+" j "+j)
        obj1.col = "#DE1C1C";
        obj2.col = "#DE1C1D";

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

        let crashSize = Math.floor(speed*Math.floor(Math.random() * params.crashScale));
        if (crashSize > 0) {
          //console.log ("Crash size "+crashSize+" i "+i+" j "+j);
          crashes.push (new crash.init(Math.floor(obj1.x), Math.floor(obj1.y), crashSize));  
        }

        //console.log("New speed "+speed);
        let impulse = 2 * speed * pushFactor / (obj1.mass + obj2.mass);
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
      balls[i].dx = -balls[i].dx * pushFactor;
    }
    if(balls[i].y + balls[i].dy > artCanvas.height-balls[i].rad || balls[i].y + balls[i].dy < balls[i].rad) {
      balls[i].dy = -balls[i].dy * pushFactor;
    }   
  }
}

function calculateEnergy () {
  let totalEnergy = 0.0;
  for (let i=0; i< balls.length; i++) {
    //console.log("move ball "+i);
    vel = Math.sqrt(balls[i].dx*balls[i].dx + balls[i].dy*balls[i].dy);
    totalEnergy += vel*vel*balls[i].mass/2;
  }
  console.log("Total energy "+totalEnergy);
}