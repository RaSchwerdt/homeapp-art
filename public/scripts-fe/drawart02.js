//Constants
const MAX_BALLS = 10;
let loopInterval;
let artCanvas = document.getElementById('art-canvas');
let ctx = artCanvas.getContext('2d');
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
  init: function (x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
};
let crashes = [];


//Functions
function startLoop () {
  console.log("startLoop");
  if (balls.length==0) {
    console.log ("Init balls");
  
    for (let i=0; i< MAX_BALLS; i++) {
      console.log("ball "+i);
      balls[i] = new ball.init ( 
        Math.floor(Math.random()*artCanvas.width), 
        Math.floor(Math.random()*artCanvas.height),
        2,
        2,
        10,
        "#0095DD",
        10,
        )
        if (balls[i].x<balls[i].rad) {balls[i].x += balls[i].rad;}
        if (balls[i].x>artCanvas.width-balls[i].rad) {balls[i].x -= balls[i].rad;}
        if (balls[i].y<balls[i].rad) {balls[i].y += balls[i].rad;}
        if (balls[i].y>artCanvas.height-balls[i].rad) {balls[i].y -= balls[i].rad;}
    }  
    console.log ("ball0 x"+balls[0].x+" y "+balls[0].y+" dx "+balls[0].dx+" dy "+balls[0].dy+" rad "+balls[0].rad+" col "+balls[0].col);
  
  }
  loopInterval = setInterval(drawToCanvas, 20);
}

function stopLoop () {
  console.log("stopLoop");
  clearInterval(loopInterval);
}

function drawToCanvas () {
  //console.log ("Draw to canvas");
  ctx.clearRect(0, 0, artCanvas.width, artCanvas.height);
  drawCrashes();
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

function drawCrashes () {
  //console.log("drawCrashes");
  for (let i=0; i< crashes.length; i++) {
    ctx.beginPath();
    ctx.arc(crashes[i].x, crashes[i].y, crashes[i].r, 0, Math.PI*2);
    ctx.fillStyle = "#999999"
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
        obj1.col = "#DE1C1C";
        obj2.col = "#DE1C1C";

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

        crashes.push (new crash.init(Math.floor(obj1.x), Math.floor(obj1.y), Math.floor(distance)));

        //console.log("New speed "+speed);
        let impulse = 2 * speed / (obj1.mass + obj2.mass);
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
      balls[i].dx = -balls[i].dx;
    }
    if(balls[i].y + balls[i].dy > artCanvas.height-balls[i].rad || balls[i].y + balls[i].dy < balls[i].rad) {
      balls[i].dy = -balls[i].dy;
    }   
  }
}
