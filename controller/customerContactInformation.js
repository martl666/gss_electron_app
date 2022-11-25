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

function addMemberContactInformation(dataString, newCustomerID) {
    let helperController = require('./updateHelperController');
    let contactUpdateObj = null;
    let helperType = '';
    dataString.split('&').forEach((paramSet) => {
        contactUpdateObj = helperController.createUpdateObject('contact', paramSet);
        if (contactUpdateObj.contact_data !== '' && contactUpdateObj.contact_type !== '' && contactUpdateObj.contact_type !== helperType) {
            if (contactUpdateObj.contact_type === 'email_primary') {
                contactUpdateObj.contact_primary_mail_address = 1;
            } else {
                contactUpdateObj.contact_primary_mail_address = 0;
            }

            if (contactUpdateObj.contact_type.indexOf('email') !== -1) 
                contactUpdateObj.contact_type = 'email';

            cciModel.addMemberContactInformation(contactUpdateObj, newCustomerID);
            helperType = contactUpdateObj.contact_type;
        } 
        
    });
    
}

module.exports = {
    updateMemberContactInformation: updateMemberContactInformation,
    addMemberContactInformation: addMemberContactInformation
}