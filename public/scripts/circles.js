//Constants
const artCanvas = document.getElementById('art-canvas');
const ctx = artCanvas.getContext('2d');
let canvasWidth = 0;
let canvasHeight = 0;

//Functions
function setCanvasSize () {
    canvasWidth = window.innerWidth * 0.95;
    canvasHeight = window.innerHeight * 0.9;
    
    //Resize canvas
    artCanvas.setAttribute ('width', canvasWidth);
    artCanvas.setAttribute ('height', canvasHeight); 
}

function drawCircles () {
    let x = Math.floor(canvasWidth / 2);
    let y = Math.floor(canvasHeight / 2);
    let size = Math.floor(canvasWidth / 20);
    console.log("Draw circle x "+x+" y "+y+ " size "+size);
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }
  