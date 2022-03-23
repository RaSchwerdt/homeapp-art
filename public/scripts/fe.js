//Module constants

//Module variables
//let artCanvas ="";
const artCanvas = document.getElementById('art-canvas');
const ctx = artCanvas.getContext('2d');

//Functions
function initCanvas () {
    //Get actual windows size
    let canvasWidth = window.innerWidth * 0.95;
    let canvasHeight = window.innerHeight * 0.95;

    //Resize canvas according to windows size
    artCanvas.setAttribute ('width', window.innerWidth * 0.95);
    artCanvas.setAttribute ('height', window.innerHeight * 0.95);

    //Draw circle
    let x = canvasWidth / 2;
    let y = canvasHeight / 2;
    let size = canvasWidth / 20;
    drawCircle(x, y, size);

}

function drawCircle (x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.strokeStyle = 'black';
    ctx.stroke();
}


//<canvas id="myCanvas" width="200" height="100" style="border:1px solid #000000;">
//Your browser does not support canvas</canvas>           
//</div>
