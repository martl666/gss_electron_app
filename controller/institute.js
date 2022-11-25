'use strict';

let instituteModel = require('../models/institute');

function updateInstitute(dataString, memberId) {
    let helperController = require('./updateHelperController');
    let updateObj;
    dataString.split('&').forEach((paramSet) => {
        updateObj = helperController.createUpdateObject('institute', paramSet);
    });
    instituteModel.updateInstitute(updateObj, memberId);
}

function addInstitute(dataString, newCustomerID) {
    let helperController = require('./updateHelperController');
    let instituteObj = null;
    dataString.split('&').forEach((paramSet) => {
        instituteObj = helperController.createUpdateObject('institute', paramSet);
    });
    return instituteModel.addInstitute(instituteObj, newCustomerID);
}

module.exports = {
    updateInstitute: updateInstitute,
    addInstitute: addInstitute,
}