'use strict';

const db = require('../controller/dbConnector').getDB();
let searchHelperController = require('../controller/searchHelperController');

function exportMailDistributorSqlResult(searchStr, searchLink) {
    let searchQuery = "SELECT customers_contact_information.contact_data FROM customers_contact_information LEFT JOIN customers ON customers_contact_information.customer_id = customers.ID WHERE customers_contact_information.contact_type='email' " + searchLink + ' ' + searchStr;
    
    let searchResult = db.prepare(searchQuery).all();

    return searchResult;
}

function exportCsvFileData(searchStr, searchLink) {
    let searchQuery = "SELECT customers.*, GROUP_CONCAT(address.street || ' ' || address.city || ' ' || address.zip || ' ' || address.country || ' ' || address.type || ' ' || IFNULL(address.state, '')) AS `address`, institute.*, cci.contactData, organizational_form.* FROM customers LEFT JOIN address ON customers.ID = address.customer_Id LEFT JOIN institute ON customers.ID = institute.customer_id LEFT JOIN organizational_form ON institute.ID = organizational_form.institute_id LEFT JOIN (SELECT customers_contact_information.customer_id, GROUP_CONCAT(customers_contact_information.contact_type || ' ' || customers_contact_information.contact_data || ' ' || customers_contact_information.contact_primary_mail_address ) AS `contactData` FROM customers_contact_information GROUP BY customer_id) cci ON customers.ID = cci.customer_id";

    if (searchStr !== '') {
        searchQuery += " WHERE 1=1 " + searchLink + ' ' + searchStr
    }

    searchQuery += " GROUP BY address.customer_id";
    console.log(searchQuery);
    let searchResult = db.prepare(searchQuery).all();

    return searchResult;
}

module.exports = {
    exportMailDistributorSqlResult: exportMailDistributorSqlResult,
    exportCsvFileData: exportCsvFileData
}