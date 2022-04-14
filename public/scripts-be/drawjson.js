const filsto = require('./filestore.js')

const width = 1600;
const height = 900;
const artjson = "drawing.txt";

let drawing = {
    imgwith: width,
    imgheight: height,
    circles : [], 
} 

let circle = {
    x : 0,
    y : 0,
    size: 0,
}

function drawToJson () {

    if (filsto.fileExists(artjson) == true) {
        //Read last saved drawing
        console.log ("drawToJson read file "+artjson);
        let drawObj = filsto.readObject(artjson);

        //Modify drawing
        drawObj.circles[0].x++;
        console.log("Cricle [0]"+drawObj.circles[0].x);

        //Save modified drawing
        filsto.writeObject(artjson, drawObj);

        return (drawObj);
    }

    //No drawing stored - create initial drawing
    console.log ("drawToJson write file "+artjson);
    circle.x = 800;
    circle.y = 450;
    circle.size = 20;
    drawing.circles.push (circle);
    filsto.writeObject(artjson, drawing);

    return drawing;
}

module.exports = {
    drawToJson: drawToJson,
};
