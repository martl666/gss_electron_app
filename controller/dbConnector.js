'use strict';

const db = require('better-sqlite3')('./seelsorge.db');

function getDB() {
    return db;
}

module.exports = {
    getDB: getDB,
}