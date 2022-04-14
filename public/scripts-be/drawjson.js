var filsto = require('./filestore.js')

const width = 1600
const height = 900

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

    if (filsto.fileExists() == true) {
        //Read last saved drawing
        console.log ("drawToJson read file");
        let drawObj = filsto.readObject();

        //Modify drawing
        drawObj.circles[0].x++;
        console.log("Cricle [0]"+drawObj.circles[0].x);

        //Save modified drawing
        filsto.writeObject(drawObj);

        return (drawObj);
    }

    //No drawing stored - create initial drawing
    console.log ("drawToJson write file");
    circle.x = 800;
    circle.y = 450;
    circle.size = 20;
    drawing.circles.push (circle);
    filsto.writeObject(drawing);

    return drawing;
}

module.exports = {
    drawToJson: drawToJson,
};
