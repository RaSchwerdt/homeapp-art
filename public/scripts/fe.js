//Constants
const artCanvas = document.getElementById('art-canvas');
const ctx = artCanvas.getContext('2d');
let selectedArt = "";

//Functions
function openMenu(selectedTab) {
  //Remember menu item 
  selectedArt = selectedTab;

  //Clear background color and set selected bacjgorund color
  let tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  document.getElementById(selectedArt).style.backgroundColor = 'lightgrey';

  //Clear canvas
  ctx.clearRect (0, 0, artCanvas.width, artCanvas.height );
    
}

function setCanvasSize () {
  
  //Undo menu selection
  selectedArt = "";
  let tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }

  //Resize canvas
  artCanvas.setAttribute ('width', getCanvaseWidth());
  artCanvas.setAttribute ('height', getCanvaseHeight()); 
}

function stepArt () {

    //Start function for selected menu item
    switch (selectedArt) {
      case "Circles":
        drawCircles ()
        break;
      case "Dots":
        drawDots ()
        break;
      default:
        break;
    }
}

function getCanvaseWidth () {
  return window.innerWidth * 0.95;
}

function getCanvaseHeight () {
  return window.innerHeight * 0.9;
}


function drawCircles () {
  let x = Math.floor(getCanvaseWidth() / 2);
  let y = Math.floor(getCanvaseHeight() / 2);
  let size = Math.floor(getCanvaseWidth() / 20);
  console.log("Draw circle x "+x+" y "+y+ " size "+size);
  ctx.beginPath();
  ctx.arc(x, y, size, 0, 2 * Math.PI);
  ctx.strokeStyle = 'black';
  ctx.stroke();
}

function drawDots () {

  console.log ("Draw dots");
  for (let i=0; i< 30; i++) {
    let x = Math.floor(Math.random() * getCanvaseWidth());
    let y = Math.floor(Math.random() * getCanvaseHeight());
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.strokeStyle = 'black';
    ctx.stroke();  
  }
}
