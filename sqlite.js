const sqlite3 = require("sqlite3").verbose();

let db;

function openDBConnection() {
    db = new sqlite3.Database('./seelsorge.db', (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Connected to the chinook database.|');
        }
    });
}

function closeDBConnection() {
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

function insertDataToDB(dataObj, table) {
    let keys = [];
    let values = [];
    Object.keys(dataObj).forEach(function(key){
        keys.push(key);
        if (isNaN(dataObj[key]) || dataObj[key].length >= 0) {
            values.push("'"+dataObj[key]+"'");
        } else {
            values.push(dataObj[key]);
        }
        
    });

    let insertQuery = "INSERT INTO " + table + " ("+keys.join(',')+") VALUES (" + values.join(',')+")";
    console.log(insertQuery);
    /*
        if(null == err){
            // row inserted successfully
            console.log(this.lastID);
            return this.lastID;
        } else {
            //Oops something went wrong
            console.log(err);
        }
    });*/
    query(insertQuery, 'get');
}

function query (command, method = 'all') {
    return new Promise((resolve, reject) => {
      db[method](command, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

function getLastInsertID(table) {
    let command = "SELECT rowid AS 'ID' FROM "+table;
    let row = db.run(command, 'get');
    console.log(command);
console.log("Last insert id: " + row.ID);
    return row.ID;
}

module.exports = {
    closeDBConnection: closeDBConnection,
    openDBConnection: openDBConnection,
    insertDataToDB: insertDataToDB,
    query: query,
    getLastInsertID: getLastInsertID,
}