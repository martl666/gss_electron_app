'use strict';

const fs = require('fs');
const path = require('path');

let paths = {
    documentsPath: '',
    seelsorgePath: '',
    exports: '',
    imports: '',
};

let writeConfigFile = false;

let configFile = __dirname + path.sep + '../config/config.json';

function writeDataToFile(data, fileName, type) {
    createDirs();
    let pathToSave = paths.exports + path.sep + fileName;
    console.log(pathToSave);
    let firstRow = '';
    if (type === 'csv') {
        firstRow = 'Mitglieder-ID,Vorname,Nachname,Titel,,,,,,,,,,,,,Adresse,Adresse,ID,JVA,Bistum,Privates Telefon,Geschäftlich Telefon, Primäre Email, Email 2, Email 3,Email 4,,,,,,,\n';
    }
    fs.writeFileSync(pathToSave, firstRow);
    for (let i = 0; i < data.length; i++) {
        let toAppend;
        let delimiter = '; ';
        if (type === 'csv') {
            toAppend = data[i];
            delimiter = '\n';
        } else {
            toAppend = data[i].contact_data;
        }
        
        fs.appendFileSync(pathToSave, toAppend + delimiter);
        if (i % 100 == 0  && i > 0 && type !== 'csv') {
            fs.appendFileSync(pathToSave, '\n\n');
        }
    }
}

function createDirs() {
    let currentDirArr = __dirname.split(path.sep);

    if (__dirname.split(path.sep).indexOf('Users') !== -1) {
        let usersDirNumber = currentDirArr.indexOf('Users');
        console.log(usersDirNumber);
        let documentDir = "Documents";
        let savePath = [];
        for (let i = 0; i < currentDirArr.length; i++) {
            if (i === usersDirNumber) {
                savePath.push(currentDirArr[i]);
                savePath.push(currentDirArr[i+1]);
                savePath.push(documentDir);
                i = currentDirArr.length+1;
            } else {
                console.log(currentDirArr[i]);
                savePath.push(currentDirArr[i]);
            }
        }

        let documentsPath = savePath.join(path.sep);
        if (fs.existsSync(documentsPath)) {
            paths.documentsPath = documentsPath;
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

    if (writeConfigFile) {
        writeConfigJsonFile();
    }
}

function createDir(dirPath, name) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdir(dirPath, (err) => {
            if (err) {
                return console.error(err);
            }
            fs.chmod(dirPath, 0o777, (err) => {
                if (err) throw err;
                console.log('The permissions set for dirs');
              });
            console.log(name + ' Directory created successfully!');
            if (!fs.existsSync(configFile)) {
                writeConfigFile = true;
            }
        });
    } else {
        if (fs.existsSync(configFile)) {
            let configJson = JSON.parse(fs.readFileSync(configFile));
            if (configJson.documentsPath !== undefined) {
                paths.documentsPath = configJson.documentsPath;
                paths.seelsorgePath = configJson.seelsorgePath;
                paths.exports = configJson.exports;
                paths.imports = configJson.imports;
            }
        } else {
            writeConfigFile = true;
            switch (name) {
                case 'Gefängnisseelsorge':
                    paths.seelsorgePath = dirPath;
                    break;
                case 'Gefängnisseelsorge/exports':
                    paths.exports = dirPath;
                    break;
                case 'Gefängnisseelsorge/imports':
                    paths.imports = dirPath;
                    break;
                default:
                    break;
            }
        }
    }
}

function writeConfigJsonFile() {
    fs.writeFileSync(configFile, JSON.stringify(paths, '\t', 4));
}

module.exports = {
    writeDataToFile: writeDataToFile,
}