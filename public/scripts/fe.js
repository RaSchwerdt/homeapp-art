//Constants
const artCanvas = document.getElementById('art-canvas');
const ctx = artCanvas.getContext('2d');
let lastCityName = "";

//Functions
function openMenu(cityName) {
  // Declare all variables
  var i, tablinks;

  if (cityName.length >0) {
    console.log("City ",cityName)
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    lastCityName = cityName;
  } else if (lastCityName.length > 0) {
    //Resize event
    console.log("Window resize");
    cityName = lastCityName;
  } 

  //Resize canvas
  artCanvas.setAttribute ('width', getCanvaseWidth());
  artCanvas.setAttribute ('height', getCanvaseHeight()); 
  
    //Call draw function
    switch (cityName) {
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

  for (let i=0; i< 30; i++) {
    console.log ("Draw dots");
    let x = Math.floor(Math.random() * getCanvaseWidth());
    let y = Math.floor(Math.random() * getCanvaseHeight());
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.strokeStyle = 'black';
    ctx.stroke();  
  }
}
