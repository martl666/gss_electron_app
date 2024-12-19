'use strict';

let customersModel = require('../models/customers');
const {readdirSync} = require("fs");


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

function getMemberData(memberId, fileExtension, path) {
    var result = customersModel.getMemberData(memberId);
    result.pdf = getPdfFromMember(memberId, fileExtension, path);

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

function getPdfFromMember(memberId, fileExtension, mainPath) {
    const fs = require('fs');
    const path = require('path');

    const files = [];
    try {
        const dirs = fs.readdirSync(mainPath);
        for(const paths of dirs) {
            const newMainPath = mainPath + path.sep + paths;
            if (fs.lstatSync(newMainPath).isDirectory()) {
                const result = getPdfFromMember(memberId, fileExtension, newMainPath);
                if (result.length > 0) {
                    if (Array.isArray(result)) {
                        files.push(result[0]);
                    } else {
                        files.push(result);
                    }
                }
            }
            
            if (paths.includes(`_${memberId}.${fileExtension}`)) {
                return newMainPath;
            }
        }
    } catch (e) {
        console.error(e);
    }
    return files;
}

module.exports = {
    getAllMembers: getAllMembers,
    getMemberData: getMemberData,
    insertNewMailAddress: insertNewMailAddress,
    deleteMailAddress: deleteMailAddress,
    updateMemberData: updateMemberData,
    updatePrimaryMailAddress: updatePrimaryMailAddress,
    addMemberData: addMemberData,
    getPdfFromMember: getPdfFromMember,
}