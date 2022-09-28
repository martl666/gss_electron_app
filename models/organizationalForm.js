'use strict'

const db = require('../controller/dbConnector').getDB();
let updateHelperController = require('../controller/updateHelperController');

function updateOrganizationalForm(updateObject, instituteId) {
    let updateQuerySQL = "UPDATE organizational_form SET " + updateHelperController.createSetForUpdateDB(updateObject).join(',') + " WHERE institute_id = ?";
    console.log(updateQuerySQL + ' ' + instituteId.ID);
    const updateQuery = db.prepare(updateQuerySQL);
    const returnValue = updateQuery.run(instituteId.ID);

    if (returnValue.changes >= 1) {
        return true;
    }

    return false;
}

module.exports = {
    updateOrganizationalForm: updateOrganizationalForm,
}