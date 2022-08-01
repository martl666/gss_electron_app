'use strict';

const fs = require('fs');
const path = require('path');

let dbStorageDir = __dirname  + path.sep + ['..', 'db_storage', ''].join(path.sep);

function createBackup() {
    let currentDate = new Date();
    let dateVersion = currentDate.toISOString().replace(/-/g, '').replace(/:/g, '').replace('.','');
    fs.copyFileSync(__dirname + path.sep + '..\\seelsorge.db', dbStorageDir + 'seelsorgeBackup_'+dateVersion+'.db');
}

function checkIsNewVersionOnline() {
    console.log("download new file");
}

module.exports =  {
    createBackup: createBackup,
    checkIsNewVersionOnline: checkIsNewVersionOnline,
}