'use strict'

const db = require('../controller/dbConnector').getDB();
const TABLE = "organizational_form";
let updateHelperController = require('../controller/updateHelperController');

function updateOrganizationalForm(updateObject, instituteId) {
    if (instituteId === '') {
        return false;
    }
    let updateQuerySQL = "UPDATE "+TABLE+" SET " + updateHelperController.createSetForUpdateDB(updateObject).join(',') + " WHERE institute_id = ?";
    console.log(updateQuerySQL + ' ' + instituteId.ID);
    const updateQuery = db.prepare(updateQuerySQL);
    const returnValue = updateQuery.run(instituteId.ID);

    if (returnValue.changes >= 1) {
        return true;
    }

    return false;
}

function addOrganizationalForm(data, instituteId) {
    data['institute_id'] = instituteId;
    let insertInto = updateHelperController.getInsertIntoSQL(data);
    let insertIntoQuery = "INSERT INTO "+TABLE+" ("+insertInto.keys.join(',')+") VALUES ("+insertInto.values.join(',')+")";
    console.log("Organizational: " + insertIntoQuery);
    let returnValue = db.prepare(insertIntoQuery).run();

    if (returnValue.changes >= 1) {
        return true;
    }

    return false;
}

module.exports = {
    updateOrganizationalForm: updateOrganizationalForm,
    addOrganizationalForm: addOrganizationalForm,
}