'use strict';

let exportModel = require('../models/exports');
let customersModel = require('../models/customers');
let fileWriter = require('./fileWriter');
function exportResult(queryString, type) {
    let searchSqlSearchString = '';
    let link;
    let termObject;
    queryString.split('&').forEach((paramSet) => {
        let splittedValues = paramSet.split('=');
        
        if (splittedValues[0] == 'searchField') {
            searchSqlSearchString += splittedValues[1];
        }
    
        if (splittedValues[0] == 'searchTerm') {
            termObject = getTermValueForSql(splittedValues[1]);
            if (termObject.like == 'both') {
                searchSqlSearchString += termObject.term;
            } else if (termObject.like == 'start') {
                searchSqlSearchString += termObject.term;
            } else if (termObject.like == 'end') {
                searchSqlSearchString += termObject.term;
            } else {
                searchSqlSearchString += termObject.term;
            }
        }
    
        if (splittedValues[0] == 'searchValue') {
            if (termObject.like == 'both') {
                searchSqlSearchString += "'%"+splittedValues[1] + '%\' %%LINK%% ';;
            } else if (termObject.like == 'start') {
                searchSqlSearchString += '\''+splittedValues[1] + '%\' %%LINK%% ';
            } else if (termObject.like == 'end') {
                searchSqlSearchString += "'%"+splittedValues[1] + '\' %%LINK%% ';
            } else {
                searchSqlSearchString += "'"+splittedValues[1] +"'" + ' %%LINK%% ';
            }
            termObject = null;
        }

        if (splittedValues[0] == 'searchLink') {
            link = splittedValues[1];
        }
        
    });
    
    let result;
    let fileName;
    if (type === 'mail') {
        result = exportModel.exportMailDistributorSqlResult(searchSqlSearchString.slice(0,-10).replaceAll('%%LINK%%', link), link);
        fileName = 'mail_export.txt';
    }
    if (type === 'csv') {
        result = exportModel.exportCsvFileData(searchSqlSearchString.slice(0,-10).replaceAll('%%LINK%%', link), link);
        let csvObject = [];
        let csvLine = [];
        console.log('Result Dataset: ' + JSON.stringify(result));
        for(let rows = 0; rows < result.length; rows++) {
            Object.keys(result[rows]).forEach(function (key, index) {
                let val = result[rows][key];
                //console.log(index + " Value: " + val);
                if (index === 16) {
                    if(val !== null && val !== undefined) {
                        let addressSplit = val.split(',');
                        if (addressSplit.length < 2) {
                            val += ',';
                        }
                    }
                }
                
                if (index === 19) {
                    val = splitMailFromPhone(val);
                }
                console.log(index + " Value after Split: " + val);
                if (val !== undefined && isNaN(val) && val.includes(',') && (index !== 3 && index !== 18 && index  !== 19)) {
                    if (val !== undefined && isNaN(val)) {
                        let splitVals = val.split(',');
                        let splitValsArr = [];
                        splitVals.forEach((item) => {
                            splitValsArr.push('"'+item+'"');
                        });
                        val = splitValsArr.join(',');
                    }
                } else if (val !== undefined && isNaN(val) && val.includes(',') && (index === 3 || index === 18 || index  === 19)) {
                    val = '"'+val+'"';
                }
                csvLine.push(val);
                if (index == 28) {
                    csvObject.push(csvLine.join(','));
                    csvLine = [];
                }
            });
        }
        result = csvObject;
        fileName = 'member_data.csv';
    }
    fileWriter.writeDataToFile(result, fileName, type);
    
}

function splitMailFromPhone(addressLine) {
    let phone = {
        private: '',
        business: ''
    };

    let mail = {
        mail_primary: '',
        mail_1: '',
        mail_2: '',
        mail_3: ''
    }

    if (addressLine === null || addressLine === undefined) {
        return ',,,,,,';
    }

    let splitedAddress = addressLine.split(',');

    splitedAddress.forEach((addressInfoItem) => {
        let addressParts = addressInfoItem.split(' ');
        if (addressParts[0] === 'private_phone') {
                phone.private = addressParts.slice(1, addressParts.length-1).join(' ');
        }
        
        if (addressParts[0] === 'business_phone') {
                phone.business = addressParts.slice(1, addressParts.length-1).join(' ');
        }
        
        if (addressParts[0] === 'email' && addressParts[2] == 1) {
                mail.mail_primary = addressParts[1];
        }
        
        if (addressParts[0] === 'email' && addressParts[2] == 0) {
                if (mail.mail_1 == '')
                    mail.mail_1 = addressParts[1];
                if (mail.mail_2 == '' && mail.mail_1 !== addressParts[1])
                    mail.mail_2 = addressParts[1];
                if (mail.mail_3 == '' && mail.mail_1 !== addressParts[1] && mail.mail_2 !== addressParts[1])
                    mail.mail_3 = addressParts[1];
        }
    });

    let returnAddress = [];
    Object.keys(phone).forEach((item) => {
        returnAddress.push(phone[item]);
    });

    Object.keys(mail).forEach((item) => {
        returnAddress.push(mail[item]);
    });

    return returnAddress;
}

function getTermValueForSql(value) {
    let termString = {
        term: '',
        like: '',
    };
    switch (value) {
        case 'equal':
            termString.term = ' = ';
            termString.like = null;
            break;
        case 'not_equal':
            termString.term = ' != ';
            termString.like = null;
            break;
        case 'smaller':
            termString.term = ' < ';
            termString.like = null;
            break;
        case 'bigger':
            termString.term = ' > ';
            termString.like = null;
            break;
        case 'smaller_equal':
            termString.term = ' <= ';
            termString.like = null;
            break;
        case 'bigger_equal':
            termString.term = ' >= ';
            termString.like = null;
            break;
        case 'like':
            termString.term = ' LIKE ';
            termString.like = 'both';
            break;
        case 'like_start':
            termString.term = ' LIKE ';
            termString.like = 'start';
            break;
        case 'like_end':
            termString.term = ' LIKE ';
            termString.like = 'end';
            break;
        default:
            break;
    }

    return termString;
}

 module.exports = {
    exportResult: exportResult,
 }