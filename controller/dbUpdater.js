'use strict';

const fs = require('fs');
const path = require('path');

let dbStorageDir = __dirname  + path.sep + ['..', 'db_storage', ''].join(path.sep);

function createBackup() {
    createStorageDir();
    let currentDate = new Date();
    let dateVersion = currentDate.toISOString().replace(/-/g, '').replace(/:/g, '').replace('.','');
    fs.copyFileSync(__dirname + path.sep + '../seelsorge.db', dbStorageDir + 'seelsorgeBackup_'+dateVersion+'.db');
}

function checkIsNewVersionOnline() {
    console.log("download new file");
}

function createStorageDir() {
    const dirPath = "./db_storage";
    if (!fs.existsSync(dirPath)) {
        fs.mkdir(dirPath, (err) => {
            if (err) {
                return console.error(err);
            }
            fs.chmod(dirPath, 0o777, (err) => {
                if (err) throw err;
                console.log('The permissions set for dir: db_storage');
              });
            console.log(dirPath + ' Directory created successfully!');
        });
    }
}

module.exports =  {
    createBackup: createBackup,
    checkIsNewVersionOnline: checkIsNewVersionOnline,
}