//Module constants

//Module variables
//let artCanvas ="";
let canvasWidth = 100;
let canvasHeight = 50;

//Functions
function createCanvas () {

    //Link to frame of canvas and remove all elements in it
    let artContainer = document.getElementById('art-container');

    //Add canvas
    let artCanvas = document.createElement('canvas');
    artCanvas.setAttribute('id', 'artCanvas');
    artCanvas.setAttribute('width', canvasWidth);
    artCanvas.setAttribute('height', canvasHeight);
    artCanvas.setAttribute('style', 'border:1px solid #000000;');
    let noCanvasSupport = document.createTextNode('Your browser does not support canvas');
    artCanvas.appendChild(noCanvasSupport);
    artContainer.appendChild(artCanvas);

    //Get canvas context
    drawCircle(artCanvas,100, 50, 30);
    const ctx = artCanvas.getContext('2d');
    ctx.clearRect (0, 0, artCanvas.width, artCanvas.height);
    drawCircle(artCanvas,100, 60, 30);
    //const ctx = artCanvas.getContext('2d');
    //ctx.beginPath();
    //ctx.arc(100, 50, 30, 0, 2 * Math.PI);
    //ctx.strokeStyle = 'black';
    //ctx.stroke();

}

function drawCircle (artCanvas, x, y, size) {
    const ctx = artCanvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.strokeStyle = 'black';
    ctx.stroke();
}



//<canvas id="myCanvas" width="200" height="100" style="border:1px solid #000000;">
//Your browser does not support canvas</canvas>           
//</div>
