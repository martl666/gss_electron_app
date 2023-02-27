'use strict';

const eventToCustomerModel = require('../models/eventToCustomer');

function saveCustomerToEvent(eventCustomerObject) {
    return eventToCustomerModel.saveCustomerToEvent(eventCustomerObject);
}

module.exports = {
    saveCustomerToEvent: saveCustomerToEvent,
    getEventsForCustomer: getEventsForCustomer,
}