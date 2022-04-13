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
        console.log ("drawImage read file");
        let drawObj = filsto.readObject();
        //drawObj.circle.x++;
        //filsto.writeObject(drawObj);

        return (drawObj);
    }

    console.log ("drawImage write file");
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
