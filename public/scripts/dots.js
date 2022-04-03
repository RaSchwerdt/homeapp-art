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

function drawDots () {

    console.log ("Draw dots");
    for (let i=0; i< 30; i++) {
      let x = Math.floor(Math.random() * canvasWidth);
      let y = Math.floor(Math.random() * canvasHeight);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.strokeStyle = 'black';
      ctx.stroke();  
    }
  }