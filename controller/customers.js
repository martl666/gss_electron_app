'use strict';

let customersModel = require('../models/customers');


function getAllMembers() {
    var result = customersModel.getAllMembersData();

    var dataSet = [];
    var dataRow = [];

    result.forEach(function(row){
        dataRow.push(row.ID, row.title, row.firstname, row.lastname, row.board_of_directors, row.buko_member, row.institute, row.active);
        dataSet.push(dataRow);
        dataRow = [];
    });


    return dataSet;
    
}

function getMemberData(memberId) {
    var result = customersModel.getMemberData(memberId);

    return result;
}

function insertNewMailAddress(memberId, newMailAddress) {
    var result = customersModel.insertNewMailAddress(memberId, newMailAddress);

    return result;
}

function deleteMailAddress(cciId) {
    var result = customersModel.deleteMailAddress(cciId);

    return result;
}

function updateMemberData(dataString, memberId) {
    let customersUpdateObj = memberDataMapping(dataString);
    customersModel.customersUpdate(customersUpdateObj, memberId);
}

function addMemberData(dataString) {
    let customersAddObj = memberDataMapping(dataString);
    return customersModel.addCustomer(customersAddObj);
}

function memberDataMapping(dataString) {
    let helperController = require('./updateHelperController');
    let customersUpdateObj;
    dataString.split('&').forEach((paramSet) => {
        customersUpdateObj = helperController.createUpdateObject('customers', paramSet);
    });

    return customersUpdateObj;
}

function updatePrimaryMailAddress(memberId, newMailAddress) {
    var result = customersModel.updatePrimaryMailAddress(memberId, newMailAddress);

    return result;
}

module.exports = {
    getAllMembers: getAllMembers,
    getMemberData: getMemberData,
    insertNewMailAddress: insertNewMailAddress,
    deleteMailAddress: deleteMailAddress,
    updateMemberData: updateMemberData,
    updatePrimaryMailAddress: updatePrimaryMailAddress,
    addMemberData: addMemberData,
}