const fs = require('fs');
let filestore = "";

function getStorageLocation (stl) {
    console.log ("filestore "+stl);
    filestore = stl;
}

function writeObject (o) {

    fs.writeFileSync(filestore, JSON.stringify(o), err => {
        if (err) {
            console.log(err);
            return
        }
    } );
}


function readObject () {
    console.log ("read file "+filestore);
    let o = null;
    try {
        const jsonString = fs.readFileSync(filestore);
        o = JSON.parse(jsonString);

    } catch (err) {
        console.log(err);
    } 
    return o;
}

function fileExists () {
    return fs.existsSync(filestore);
}

module.exports = {
    'writeObject': writeObject,
    'readObject': readObject,
    'getStorageLocation': getStorageLocation,
    'fileExists': fileExists,
};
