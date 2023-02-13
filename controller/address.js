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

function addMemberAddress(dataString, newCustomerID) {
    let helperController = require('./updateHelperController');
    let addressUpdateObj = null;
    let index = 0;
    let count = true;
    dataString.split('&').forEach((paramSet) => {
        addressUpdateObj = helperController.createUpdateObject('addressInsert', paramSet);
        if (addressUpdateObj.type !== '') {
            if (index === 6) {
                if (addressUpdateObj.street !== '')
                    addressModel.addMemberAddress(addressUpdateObj, newCustomerID);
                index++
                count = false;
            } else if (index === 0) {
                if (addressUpdateObj.street !== '')
                    addressModel.addMemberAddress(addressUpdateObj, newCustomerID);
            }
            if (count)
                index++;
        }
    });
}

function createOrUpdateAddress(addressObject) {
    return addressModel.createOrUpdateAddress(addressObject);
}

function getAllPostalAddressWithoutAStoredEmail() {
    return addressModel.getAllPostalAddressWithoutAStoredEmail();
}

function getAllAndersOrtAddress() {
    return addressModel.getAllAndersOrtAddress();
}

module.exports = {
    updateMemberAddress: updateMemberAddress,
    getAllPostalAddressWithoutAStoredEmail: getAllPostalAddressWithoutAStoredEmail,
    getAllAndersOrtAddress: getAllAndersOrtAddress,
    addMemberAddress: addMemberAddress,
    createOrUpdateAddress: createOrUpdateAddress,
}