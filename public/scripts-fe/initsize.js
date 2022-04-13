//Constants

//Functions
function initSize (elementID) {
    const htmlElement = document.getElementById(elementID);
    htmlElement.setAttribute ('width', window.innerWidth * 0.95);
    htmlElement.setAttribute ('height', window.innerHeight * 0.9); 
}
