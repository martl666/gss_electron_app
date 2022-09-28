'use strict';

const db = require('../controller/dbConnector').getDB();
let updateHelperController = require('../controller/updateHelperController');

function updateInstitute(updateObject, memberId) {
    let updateQuerySQL = "UPDATE institute SET " + updateHelperController.createSetForUpdateDB(updateObject).join(',') + " WHERE customer_id = ?";
    const updateQuery = db.prepare(updateQuerySQL);
    const returnValue = updateQuery.run(memberId);

    if (returnValue.changes >= 1) {
        return true;
    }

    return false;
}

function getInstituteId(memberId) {
    let query = "SELECT ID FROM institute WHERE customer_id = ?";
    let result = db.prepare(query).get(memberId);

    return result;
}

module.exports = {
    getInstituteId: getInstituteId,
    updateInstitute: updateInstitute,
}