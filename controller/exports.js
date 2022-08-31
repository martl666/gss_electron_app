'use strict';

let exportModel = require('../models/exports');
let customersModel = require('../models/customers');
let fileWriter = require('./fileWriter');
const address = require('./address');

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
                searchSqlSearchString += splittedValues[1] + ' %%LINK%% ';
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
        result = customersModel.getMemberData('all');
        let csvObject = [];
        let csvLine = [];
        for(let rows = 0; rows < result.length; rows++) {
            Object.keys(result[rows]).forEach(function (key, index) {
                let val = result[rows][key];
                if (index === 16) {
                    console.log('Key: ' + key + ' Value: ' + result[rows][key] + ' Index: ' + index);
                    if(val !== null && val !== undefined) {
                        let addressSplit = val.split(',');
                        console.log('length: ' + addressSplit.length);
                        if (addressSplit.length < 2) {
                            val += ',';
                        }
                    }
                }
                //TODO order phone numbers in private/business, max. 4 mail addresses!
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
                if (index == 29) {
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

function orderPhoneNumbers(phoneNumbersObj) {
    //first private, business second
}

function setEmptyMailFieldsForCsv(mailAddressObj) {
    //max. 4 mail addresses
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