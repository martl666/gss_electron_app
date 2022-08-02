'use strict';

let exportModel = require('../models/exports');
let fileWriter = require('./fileWriter');

function exportMailDistributorResult(queryString) {
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
    
    let result = exportModel.exportMailDistributorSqlResult(searchSqlSearchString.slice(0,-10).replaceAll('%%LINK%%', link), link);
    
    fileWriter.writeDataToFile(result, 'export_test.txt');
    
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
    exportMailDistributorResult: exportMailDistributorResult,
 }