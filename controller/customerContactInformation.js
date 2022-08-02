'use strict';

let cciModel = require('../models/customersContactInformation');

function updateMemberContactInformation(dataString) {
    let helperController = require('./updateHelperController');
    let cciUpdateObj;
    dataString.split('&').forEach((paramSet) => {
        cciUpdateObj = helperController.createUpdateObject('contact', paramSet);
        if (paramSet.indexOf('contactId') !== -1) {
            cciModel.updateMemberContactInfo(cciUpdateObj, paramSet.split('=')[1]);
        }
    });
}

module.exports = {
    updateMemberContactInformation: updateMemberContactInformation,
}