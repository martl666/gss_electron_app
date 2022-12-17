'use strict';

const db = require('../controller/dbConnector').getDB();
let updateHelperController = require('../controller/updateHelperController');

function getAllMembersData() {
    const result= db.prepare("SELECT customers.ID, customers.title, customers.firstname, customers.lastname, customers.board_of_directors, customers.buko_member, IIF(institute.institute = '', '---', IIF(institute.diocese = '', institute.institute, institute.institute || ' / ' || institute.diocese)) AS `institute`, IIF(customers.active = 1, 'aktiv', 'inaktiv') AS `active`  FROM customers LEFT JOIN institute ON customers.ID = institute.customer_id").all();
    
    return result;
}

function getMemberData (memberId) {

    let query = "SELECT customers.*, GROUP_CONCAT(address.street || '$$' || address.city || '$$' || address.zip || '$$' || address.type || '$$' || address.ID || '$$' || address.country || '$$' || IFNULL(address.state, '') || '$$' || address.eg || '$$' || IFNULL(address.companyname, '')) AS `address`, institute.*, cci.contactData, organizational_form.* FROM customers LEFT JOIN address ON customers.ID = address.customer_Id LEFT JOIN institute ON customers.ID = institute.customer_id LEFT JOIN organizational_form ON institute.ID = organizational_form.institute_id LEFT JOIN (SELECT customers_contact_information.customer_id, GROUP_CONCAT(customers_contact_information.ID || '$$' || customers_contact_information.contact_type || '$$' || customers_contact_information.contact_data || '$$' || customers_contact_information.contact_primary_mail_address ) AS `contactData` FROM customers_contact_information GROUP BY customer_id) cci ON customers.ID = cci.customer_id  WHERE customers.ID = ? GROUP BY address.customer_id";
    
    let result = db.prepare(query).get(memberId);

    return result;
}

function insertNewMailAddress(memberId, newMailAddress) {
    let newMailAddressQuery = db.prepare("INSERT INTO customers_contact_information (customer_id, contact_type, contact_data) VALUES (?, ?, ?)").run(memberId, 'email', newMailAddress);
    
    if (newMailAddressQuery.changes >= 1) {
        return true;
    }

    return false;
    //console.log(newMailAddressQuery.lastInsertRowid + ' ' + newMailAddressQuery.changes);
}

function deleteMailAddress(customersContactInfoId) {
    const deleteRowQuery = db.prepare("DELETE FROM customers_contact_information WHERE ID = ?");
    const returnValue = deleteRowQuery.run(customersContactInfoId);
    //deleteRowQuery.finalize();

    if (returnValue.changes >= 1) {
        return true;
    }

    return false;
}

function customersUpdate(updateObject, updateMemberId) {
    if (updateMemberId === '') {
        return false;
    }
    let updateQuerySQL = "UPDATE customers SET " + updateHelperController.createSetForUpdateDB(updateObject).join(',') + " WHERE ID = ?";
    const updateQuery = db.prepare(updateQuerySQL);
    const returnValue = updateQuery.run(updateMemberId);

    if (returnValue.changes >= 1) {
        return true;
    }

    return false;
}

function addCustomer(addCustomerObject) {
    let data = addCustomerObject;
    let insertIntoKey = [];
    let insertIntoValue = [];
    Object.keys(data).forEach(key => {
        insertIntoKey.push(key);
    if (isNaN(data[key])) {
        insertIntoValue.push("'"+data[key]+"'");
    } else if (data[key] === ''){
        insertIntoValue.push("''");
    } else {
        insertIntoValue.push(data[key]);
    }
    
    });
    if (insertIntoValue[0] !== '' && insertIntoValue[2] !== '') {
        let insertIntoQuery = "INSERT INTO customers ("+insertIntoKey.join(',')+") VALUES ("+insertIntoValue.join(',')+")";
        console.log("Customer: " + insertIntoQuery);
        let newCustomer = db.prepare(insertIntoQuery).run();

        return newCustomer.lastInsertRowid;
    } else {
        return -1;
    }
}

function updatePrimaryMailAddress(memberId, newPrimaryMailAddress) {
    let cleanPrimaryMailAddressQuery = db.prepare("UPDATE customers_contact_information SET contact_primary_mail_address = 0 WHERE customer_id = ?").run(memberId);
    
    if (cleanPrimaryMailAddressQuery.changes >= 1) {
        let setPrimaryMailAddressQuery = db.prepare("UPDATE customers_contact_information SET contact_primary_mail_address = 1 WHERE customer_id = ? AND ID = ? LIMIT 1").run(memberId, newPrimaryMailAddress);

        if (setPrimaryMailAddressQuery.changes >= 1) {
            return true;
        }
    }

    return false;
}

module.exports = {
    getAllMembersData: getAllMembersData,
    getMemberData: getMemberData,
    insertNewMailAddress: insertNewMailAddress,
    deleteMailAddress: deleteMailAddress,
    customersUpdate: customersUpdate,
    updatePrimaryMailAddress: updatePrimaryMailAddress,
    addCustomer: addCustomer,
}