'use strict';

const db = require('../controller/dbConnector').getDB();
let searchHelperController = require('../controller/searchHelperController');

function exportMailDistributorSqlResult(searchStr, searchLink) {
    let searchQuery = "SELECT customers_contact_information.contact_data FROM customers_contact_information LEFT JOIN customers ON customers_contact_information.customer_id = customers.ID WHERE customers_contact_information.contact_type='email' " + searchLink + ' ' + searchStr;
    
    let searchResult = db.prepare(searchQuery).all();

    return searchResult;
}

module.exports = {
    exportMailDistributorSqlResult: exportMailDistributorSqlResult,
}