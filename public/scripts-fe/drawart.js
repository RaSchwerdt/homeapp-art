//Constants
const MAX_BALLS = 5;
let loopInterval;
let artCanvas = null;
let ctx = null;
/*
let x = artCanvas.width/2;
let y = artCanvas.height-30;
let dx = 2;
let dy = -2;
let ballRadius = 10;
*/
let ball = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  rad: 0,
  col: null,
  init: function (x, y, dx, dy, rad, col) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.rad = rad;
    this.col = col;
  },
}

let balls = [];

function loadArt () {
  console.log("loadArt");
  artCanvas = document.getElementById('art-canvas');
  artCanvas.setAttribute ('width', window.innerWidth * 0.95);
  artCanvas.setAttribute ('height', window.innerHeight * 0.9); 
  ctx = artCanvas.getContext('2d');
  
  for (let i=0; i< MAX_BALLS; i++) {
    console.log("ball "+i);
    balls[i] = new ball.init ( 
      Math.floor(Math.random()*artCanvas.width), 
      Math.floor(Math.random()*artCanvas.height),
      2,
      2,
      10,
      "#0095DD",
      )
  }  
  console.log ("ball0 x"+balls[0].x+" y "+balls[0].y+" dx "+balls[0].dx+" dy "+balls[0].dy+" rad "+balls[0].rad+" col "+balls[0].col);
}


//Functions
function startLoop () {
  console.log("startLoop");
  loopInterval = setInterval(drawToCanvas, 20);
}

function stopLoop () {
  console.log("stopLoop");
  clearInterval(loopInterval);
}

function drawToCanvas () {
  //console.log ("Draw to canvas");
  ctx.clearRect(0, 0, artCanvas.width, artCanvas.height);
  drawBalls();
  bounceOffWalls();
  detectCollisions();
  moveBalls();
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
    for (let j=i+1; j< balls.length; j++) {
      obj2 = balls[j];
      if (circleIntersect(obj1.x, obj1.y, obj1.rad, obj2.x, obj2.y, obj2.rad)) {
        //console.log("collsion detect at "+obj1.x)
        obj1.col = "#225588";
        obj2.col = "#225588";
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
      balls[i].dx = -balls[i].dx;
    }
    if(balls[i].y + balls[i].dy > artCanvas.height-balls[i].rad || balls[i].y + balls[i].dy < balls[i].rad) {
      balls[i].dy = -balls[i].dy;
    }   
  }
}

/*
function drawBall () {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();

}*/