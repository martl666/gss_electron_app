'use strict';

const db = require('../controller/dbConnector').getDB();

function saveEvent(eventObject) {
    const stmt = db.prepare("INSERT INTO event (event_name, event_date_start, event_date_end, event_price_gross, event_price_net, event_text_invoice, event_text_confirmation) VALUES($event_name, $event_date_start, $event_date_end, $event_price_gross, $event_price_net, $event_text_invoice, $event_text_confirmation)");
    
    const info = stmt.run({
        event_name: eventObject.event_name, 
        event_date_start: eventObject.event_date_start, 
        event_date_end: eventObject.event_date_end, 
        event_price_gross: eventObject.event_price_gross, 
        event_price_net: eventObject.event_price_net,
        event_text_invoice: eventObject.event_text_invoice,
        event_text_confirmation: eventObject.event_text_confirmation
    });

    if (info.changes < 1) {
        return false;
    }

    return true;
}

function getEvents() {
    const stmt = db.exec("SELECT event_id, event_name FROM event WHERE event_date_end > NOW()");
}

function getEventsForCustomer(customer_id) {
    const stmt = db.prepare("SELECT e.event_id, e.event_name, ec.paid, ec.paid_date, ec.invoice_date, ec.confirmation_of_participation_created FROM event e LEFT JOIN event_customer ec ON e.event_id = ec.event_id WHERE ec.customer_id = $customer_id");
    return stmt.all({
        customer_id: customer_id
    });
}

function getEventInformations(eventId) {
    const stmt = db.prepare('SELECT event_name, event_text_confirmation, event_date_start, event_date_end FROM event WHERE event_id = $event_id');
    return stmt.get({
        event_id: eventId
    });
}

module.exports = {
    saveEvent: saveEvent,
    getEvents: getEvents,
    getEventsForCustomer: getEventsForCustomer,
    getEventInformations: getEventInformations,
}