'use strict';

const db = require('../controller/dbConnector').getDB();
let updateHelperController = require('../controller/updateHelperController');

function updateMemberAddress(updateObject, addressID) {
    if (addressID === '') {
        return false;
    }
    let updateQuerySQL = "UPDATE address SET " + updateHelperController.createSetForUpdateDB(updateObject).join(',') + " WHERE ID = ?";
    console.log(updateQuerySQL);
    const updateQuery = db.prepare(updateQuerySQL);
    const returnValue = updateQuery.run(addressID);

    if (returnValue.changes >= 1) {
        return true;
    }

    return false;
}

function addMemberAddress(addressObject, newCustomerID) {
    addressObject['customer_id'] = newCustomerID;
    let insertInto = updateHelperController.getInsertIntoSQL(addressObject);
    let insertIntoQuery = "INSERT INTO address ("+insertInto.keys.join(',')+") VALUES ("+insertInto.values.join(',')+")";
    console.log("Address: " + insertIntoQuery);
    let returnValue = db.prepare(insertIntoQuery).run();

    if (returnValue.changes >= 1) {
        return true;
    }

    return false;
}

function getAllPostalAddressWithoutAStoredEmail() {
    let query = "SELECT customers.ID, customers.firstname, customers.lastname, address.street, address.city, IIF(address.country = 'Deutschland', PRINTF('%05d',address.zip), address.zip), address.type, address.country, address.eg, address.companyname \
    FROM customers\
    LEFT JOIN address ON customers.ID = address.customer_id \
    WHERE customers.ID NOT IN (SELECT customers_contact_information.customer_id FROM customers_contact_information WHERE customers_contact_information.contact_type = 'email')\
    AND address.street IS NOT NULL\
    AND address.type = 'private'\
    AND customers.active = 1 \
    AND customers.retired = 0 \
    GROUP BY customers.ID";
    const result = db.prepare(query).all();

    return result;
}

function getAllAndersOrtAddress(startAt, maxNumbersOfMagazine) {
    console.log( startAt + " " + maxNumbersOfMagazine );
    //TODO use privte address if customer has only one address saved
    let query = "SELECT customers.ID, customers.title, customers.firstname, customers.lastname, address.street, address.city, IIF(address.country = 'Deutschland', PRINTF('%05d',address.zip), address.zip), address.type, address.country, address.eg, address.companyname, customers.magazine_print, customers.number_of_magazine, customers.magazine_pdf, COUNT(address.type) \
    FROM customers \
    LEFT JOIN address ON customers.ID = address.customer_id \
    WHERE customers.magazine_print = 1 \
    AND customers.number_of_magazine BETWEEN 3 AND 3 \
    AND address.type = 'business' \
    GROUP BY customers.ID \
    ORDER BY customers.number_of_magazine DESC";

    const result = db.prepare(query).all();

    return result;
}

function getAddressDataForPdf(memberId) {
    let result = db.prepare("SELECT street, zip, city FROM address WHERE type = 'business' AND customer_id = ?").get(memberId);

    if (result === undefined) {
        result = db.prepare("SELECT street, zip, city FROM address WHERE type = 'private' AND customer_id = ?").get(memberId);
    }
    return result;
}

function createOrUpdateAddress(addressObject) {
    console.log("Query: " + `INSERT INTO address (${Object.keys(addressObject)}) VALUES (${Object.values(addressObject)})`);
    const result = db.prepare(`INSERT INTO address (${Object.keys(addressObject).map(key => `'${key}'`)}) VALUES (${Object.values(addressObject).map(value => isNaN(value) ? `'${value}'`: value)})`).run();
    console.log('createOrUpdateAddress Result: ' + JSON.stringify(result));
    return result;
}

module.exports = {
    updateMemberAddress: updateMemberAddress,
    getAllPostalAddressWithoutAStoredEmail: getAllPostalAddressWithoutAStoredEmail,
    getAllAndersOrtAddress: getAllAndersOrtAddress,
    addMemberAddress: addMemberAddress,
    getAddressDataForPdf: getAddressDataForPdf,
    createOrUpdateAddress: createOrUpdateAddress,
}