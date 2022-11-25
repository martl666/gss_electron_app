'use strict';

const db = require('../controller/dbConnector').getDB();
const TABLE = "institute";
let updateHelperController = require('../controller/updateHelperController');

function updateInstitute(updateObject, memberId) {
    if (memberId === '') {
        return false;
    }
    let updateQuerySQL = "UPDATE "+TABLE+" SET " + updateHelperController.createSetForUpdateDB(updateObject).join(',') + " WHERE customer_id = ?";
    const updateQuery = db.prepare(updateQuerySQL);
    const returnValue = updateQuery.run(memberId);

    if (returnValue.changes >= 1) {
        return true;
    }

    return false;
}

function getInstituteId(memberId) {
    let query = "SELECT ID FROM "+TABLE+" WHERE customer_id = ?";
    let result = db.prepare(query).get(memberId);

    return result;
}

function addInstitute(data, newCustomerID) {
    data['customer_id'] = newCustomerID;
    let insertInto = updateHelperController.getInsertIntoSQL(data);
    let insertIntoQuery = "INSERT INTO "+TABLE+" ("+insertInto.keys.join(',')+") VALUES ("+insertInto.values.join(',')+")";
    console.log("Institute: " + insertIntoQuery);
    let returnValue = db.prepare(insertIntoQuery).run();

    if (returnValue.changes >= 1) {
        return returnValue.lastInsertRowid;
    }

    return false;
}

module.exports = {
    getInstituteId: getInstituteId,
    updateInstitute: updateInstitute,
    addInstitute: addInstitute,
}