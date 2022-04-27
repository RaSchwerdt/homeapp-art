//Constants
let loopInterval;
let artCanvas = document.getElementById('art-canvas');
let ctx = artCanvas.getContext('2d');
let x = artCanvas.width/2;
let y = artCanvas.height-30;
let dx = 2;
let dy = -2;
let ballRadius = 10;

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
  console.log ("Draw to canvas");
  ctx.clearRect(0, 0, artCanvas.width, artCanvas.height);
  drawBall();

  //Bounce off walls
  if(x + dx > artCanvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if(y + dy > artCanvas.height-ballRadius || y + dy < ballRadius) {
    dy = -dy;
  } 
  x += dx;
  y += dy;
}

function drawBall () {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();

}