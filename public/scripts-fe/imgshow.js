//Constants
let loopInterval;

//Functions
function startLoop () {
  console.log("startLoop");
  loopInterval = setInterval(requestNextImage, 5000);
}

function stopLoop () {
  console.log("stopLoop");
  clearInterval(loopInterval);
}

function requestNextImage () {
  //console.log("requestNextImage");            
  //Create object for request
  let dynRequest = new XMLHttpRequest();

  //Receive data
  dynRequest.onreadystatechange = function () {
    if (dynRequest.readyState==4 && dynRequest.status==200) {        
        //Receive JSON string
        //let jsonResponse = JSON.parse(dynRequest.responseText);

        //Display content
        //console.log ("Response "+dynRequest.responseText);
        showImage(dynRequest.responseText);

    }
  }

  //Send request
  dynRequest.open ('GET', '/reqneximg', true);
  dynRequest.send();
}

function showImage (text) {
 
  //Show image
  let img = document.getElementById('img-show');
  img.setAttribute('src', text);

  //Display year of immage
  let pos2 = text.lastIndexOf("/");
  let pos1 = text.slice(0, pos2).lastIndexOf("/");
  let imgtxt = document.getElementById('img-text');
  imgtxt.innerHTML = text.slice(pos1+1, pos2);
}
  