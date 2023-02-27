'use strict';

const eventModel = require('../models/events');

function saveEvent(eventObject) {
    return eventModel.saveEvent(eventObject);
}

function getEvents() {

}

function getEventsForCustomer(memberId) {
    return eventModel.getEventsForCustomer(memberId);
}

module.exports = {
    saveEvent: saveEvent,
    getEvents: getEvents,
    getEventsForCustomer: getEventsForCustomer,
};