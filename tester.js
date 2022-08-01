'use strict';

const fs = require('fs');
const path = require('path');

let currentDirArr = __dirname.split("\\");

if (__dirname.split("\\").indexOf('Users') !== -1) {
    let usersDirNumber = currentDirArr.indexOf('Users');
    let documentDir = "Documents";
    let savePath = [];
    for (let i = 0; i < currentDirArr.length; i++) {
        if (i === usersDirNumber) {
            savePath.push(currentDirArr[i]);
            savePath.push(currentDirArr[i+1]);
            savePath.push(documentDir);
            i = currentDirArr.length+1;
        } else {
            savePath.push(currentDirArr[i]);
        }
    }

    let documentsPath = savePath.join(path.sep);
    if (fs.existsSync(documentsPath)) {
        savePath.push('Gefängnisseelsorge');
        let mainDir = savePath.join(path.sep);
        createDir(mainDir, 'Gefängnisseelsorge');
        savePath.push('exports');
        createDir(savePath.join(path.sep), 'Gefängnisseelsorge/exports');
        savePath.pop();
        savePath.push('imports');
        createDir(savePath.join(path.sep), 'Gefängnisseelsorge/imports');
    }
}

function createDir(dirPath, name) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdir(dirPath, (err) => {
            if (err) {
                return console.error(err);
            }
            console.log(name + ' Directory created successfully!')
        });
    }
}