'use strict';

const db = require('../controller/dbConnector').getDB();
let updateHelperController = require('../controller/updateHelperController');

function updateMemberContactInfo(updateObject, cciID) {
    if (cciID === '') {
        return false;
    }
    let updateQuerySQL = "UPDATE customers_contact_information SET " + updateHelperController.createSetForUpdateDB(updateObject).join(',') + " WHERE ID = ?";
    const updateQuery = db.prepare(updateQuerySQL);
    const returnValue = updateQuery.run(cciID);

    if (returnValue.changes >= 1) {
        return true;
    }

    return false;
}

function addMemberContactInformation(data, newCustomerID) {
    data['customer_id'] = newCustomerID;
    let insertInto = updateHelperController.getInsertIntoSQL(data);
    let insertIntoQuery = "INSERT INTO customers_contact_information ("+insertInto.keys.join(',')+") VALUES ("+insertInto.values.join(',')+")";
    console.log("Contact: " + insertIntoQuery);
    let returnValue = db.prepare(insertIntoQuery).run();

    if (returnValue.changes >= 1) {
        return true;
    }

    return false;
}

module.exports = {
    updateMemberContactInfo: updateMemberContactInfo,
    addMemberContactInformation: addMemberContactInformation,
}