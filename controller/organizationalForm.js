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

function addOrganizationalForm(dataString, instituteId) {
    let helperController = require('./updateHelperController');
    let insertObject = null;
    dataString.split('&').forEach((paramSet) => {
        insertObject = helperController.createUpdateObject('organization', paramSet);
    });
    ofModel.addOrganizationalForm(insertObject, instituteId); 
}

module.exports = {
    updateOrganizationalForm: updateOrganizationalForm,
    addOrganizationalForm: addOrganizationalForm,
}