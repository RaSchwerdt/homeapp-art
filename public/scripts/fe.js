//Constants
const artCanvas = document.getElementById('art-canvas');
const ctx = artCanvas.getContext('2d');

//Functions
function openMenu(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";

    //Determine the windows size and init  canvas size
    let canvasWidth = window.innerWidth * 0.95;
    let canvasHeight = window.innerHeight * 0.9;
    artCanvas.setAttribute ('width', window.innerWidth * 0.95);
    artCanvas.setAttribute ('height', window.innerHeight * 0.9); 

    if (cityName == "Circles") {
      //Draw circle
      let x = canvasWidth / 2;
      let y = canvasHeight / 2;
      let size = canvasWidth / 20;
      drawCircle(x, y, size);     
    }
  }


function drawCircle (x, y, size) {
  console.log("Deaw circle x"+x+" y "+y)
  ctx.beginPath();
  ctx.arc(x, y, size, 0, 2 * Math.PI);
  ctx.strokeStyle = 'black';
  ctx.stroke();
}