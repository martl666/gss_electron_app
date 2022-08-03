'use strict';

const fs = require('fs');
const path = require('path');

let dbStorageDir = __dirname  + path.sep + ['..', 'db_storage', ''].join(path.sep);

function createBackup() {
    let existsStorageDir = createStorageDir();
    if (existsStorageDir) {
        let currentDate = new Date();
        let dateVersion = currentDate.toISOString().replace(/-/g, '').replace(/:/g, '').replace('.','');
        fs.copyFileSync(__dirname + path.sep + '../seelsorge.db', dbStorageDir + 'seelsorgeBackup_'+dateVersion+'.db');
    }
}

function checkIsNewVersionOnline() {
    const Client = require('ssh2-sftp-client');
    let sftp = new Client();
    const sftpConfig = require('../config/sftp.json');

    sftp.connect({
        host: sftpConfig.host,
        port: sftpConfig.port,
        username: sftpConfig.user,
        password: sftpConfig.password
      }).then(() => {
        return sftp.list('/pathname');
      }).then(data => {
        console.log(data, 'the data info');
      }).catch(err => {
        console.log(err, 'catch error');
      });
}

function createStorageDir() {
    const dirPath = "./db_storage";
    if (!fs.existsSync(dirPath)) {
        fs.mkdir(dirPath, (err) => {
            if (err) {
                return false;
            }
            fs.chmod(dirPath, 0o777, (err) => {
                if (err) 
                    return false;
              });
            return true;
        });
    }

    return true;
}

module.exports =  {
    createBackup: createBackup,
    checkIsNewVersionOnline: checkIsNewVersionOnline,
}