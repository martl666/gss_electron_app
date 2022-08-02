'use strict';

const db = require('../controller/dbConnector').getDB();
let updateHelperController = require('../controller/updateHelperController');'use strict';

function updateMemberContactInfo(updateObject, cciID) {
    let updateQuerySQL = "UPDATE customers_contact_information SET " + updateHelperController.createSetForUpdateDB(updateObject).join(',') + " WHERE ID = ?";
    const updateQuery = db.prepare(updateQuerySQL);
    const returnValue = updateQuery.run(cciID);

    if (returnValue.changes >= 1) {
        return true;
    }

    return false;
}

module.exports = {
    updateMemberContactInfo: updateMemberContactInfo,
}