const fs = require('fs');
let filestore = "";

function getStorageLocation (stl) {
    console.log ("filestore "+stl);
    filestore = stl;
}

function writeObject (filename, o) {
    //console.log ("write file "+filestore+filename);
    fs.writeFileSync(filestore+filename, JSON.stringify(o), err => {
        if (err) {
            console.log(err);
            return
        }
    } );
}


function readObject (filename) {
    //console.log ("read file "+filestore+filename);
    let o = null;
    try {
        const jsonString = fs.readFileSync(filestore+filename);
        //console.log("File content json "+jsonString);
        o = JSON.parse(jsonString);

    } catch (err) {
        console.log(err);
    } 
    return o;
}

function fileExists (filename) {
    return fs.existsSync(filestore+filename);
}

module.exports = {
    'writeObject': writeObject,
    'readObject': readObject,
    'getStorageLocation': getStorageLocation,
    'fileExists': fileExists,
};
