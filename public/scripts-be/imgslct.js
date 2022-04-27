const fs = require('fs');
const path = require ('path');
const filsto = require('./filestore.js');

const imgjson = "images.txt";
let imagePath = "";

//Functions
function getImagePath (ip) {
    imagePath = ip;
}

function getAllImages (rootPath, dirPath, imgList) {
    //console.log("getAllImages");
    
    //Check for images in this path and add to list
    fs.readdirSync (dirPath).forEach (function (file) {
        let filePath = path.join(dirPath, file);
        let stat = fs.statSync(filePath);
        if (stat.isFile()) {
            imgList.push(filePath);
        }
    });

    //Check for directory in this path and call recursive
    fs.readdirSync (dirPath).forEach (function (file) {
        let filePath = path.join(dirPath, file);
        let stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            getAllImages (rootPath, filePath, imgList);
        }
    });

    return imgList;
}

function scanImages () {
    console.log ("scanImages");
    let imgList = getAllImages (imagePath, imagePath, []);
    filsto.writeObject(imgjson, imgList);
}

function selectImage () {
    let img = filsto.readObject(imgjson);
    let pos = Math.floor(Math.random() * img.length)
    let imgpos = img[pos].slice(imagePath.length);
    imgpos = "img"+imgpos.split(path.sep).join("/");
    //console.log ("pos "+pos+" Imgpos "+imgpos);
    return (imgpos);
}

module.exports = {
    scanImages: scanImages,
    getImagePath: getImagePath,
    selectImage: selectImage,
};
