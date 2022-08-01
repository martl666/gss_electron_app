'use strict';

let addressModel = require('../models/address');

function updateMemberAddress(dataString) {
    let helperController = require('./updateHelperController');
    let addressUpdateObj;
    dataString.split('&').forEach((paramSet) => {
        addressUpdateObj = helperController.createUpdateObject('address', paramSet);
        if (paramSet.indexOf('addressId') !== -1) {
            addressModel.updateMemberAddress(addressUpdateObj, paramSet.split('=')[1]);
        }
    });
}

function getAllPostalAddressWithoutAStoredEmail() {
    return addressModel.getAllPostalAddressWithoutAStoredEmail();
}

module.exports = {
    updateMemberAddress: updateMemberAddress,
    getAllPostalAddressWithoutAStoredEmail: getAllPostalAddressWithoutAStoredEmail,
}