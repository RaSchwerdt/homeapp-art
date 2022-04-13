//Constants
let loopInterval;

//Functions
function startLoop () {
  console.log("startLoop");
  loopInterval = setInterval(requestNext, 3000);
}

function stopLoop () {
  console.log("stopLoop");
  clearInterval(loopInterval);
}

function requestNext () {
  console.log("requestNext");            
  //Create object for request
  let dynRequest = new XMLHttpRequest();

  //Receive data
  dynRequest.onreadystatechange = function () {
    if (dynRequest.readyState==4 && dynRequest.status==200) {        
        //Receive JSON string
        //let jsonResponse = JSON.parse(dynRequest.responseText);

        //Display content
        console.log ("Response "+dynRequest.responseText);
        drawToCanvas(dynRequest.responseText);

    }
  }

  //Send request
  dynRequest.open ('GET', '/reqnex', true);
  dynRequest.send();
}

function drawToCanvas (text) {
  console.log ("Draw to canvas");
  document.getElementById('art-span').innerHTML = text;
}

