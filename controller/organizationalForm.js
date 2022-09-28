'use strict';

let ofModel = require('../models/organizationalForm');
let instituteModel = require('../models/institute');

function updateOrganizationalForm(dataString, memberId) {
    let helperController = require('./updateHelperController');
    let updateObj;
    dataString.split('&').forEach((paramSet) => {
        updateObj = helperController.createUpdateObject('organization', paramSet);
    });
    let instituteId = instituteModel.getInstituteId(memberId);
    ofModel.updateOrganizationalForm(updateObj, instituteId);
}

module.exports = {
    updateOrganizationalForm: updateOrganizationalForm,
}