'use strict';

const db = require('../controller/dbConnector').getDB();

function saveCustomerToEvent (eventCustomerObject) {
    eventCustomerObject = eventCustomerObject.eventCustomerObject;
    const stmt = db.prepare("INSERT INTO event_customer (event_id, customer_id) VALUES($event_id, $customer_id)");
    
    const info = stmt.run({
        event_id: eventCustomerObject.event_id, 
        customer_id: eventCustomerObject.customer_id
    });

    if (info.changes < 1) {
        return false;
    }

    return true;
}



module.exports = {
    saveCustomerToEvent: saveCustomerToEvent,
    getEventsForCustomer: getEventsForCustomer,
}