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

module.exports = {
    updateInstitute: updateInstitute,
}