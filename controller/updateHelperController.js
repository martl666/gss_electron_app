'use strict';

let numberFields = {
    number_of_magazine: 'int',
}

let customers = {
    firstname: '',
    lastname : '',
    title : '',
    board_of_directors : 0,
    advisory_council : 0,
    buko_member : 0,
    no_member : 0,
    ethics : 0,
    youth : 0,
    publications_private_address : 0,
    magazine_pdf : 0,
    magazine_print : 0,
    number_of_magazine : 0,
    retired : 0,
    active : 0,
};

let address = {
    street: '',
    zip: '',
    city: '',
    state: '',
    country: '',
    type: '',
}

let contact = {
    contact_type: "",
    contact_data: "",
}

let organization = {
    men: 0,
    remand: 0,
    punishable: 0,
    enforcement: 0,
    first_execution: 0,
    open_execution: 0,
    women: 0,
    org_youth: 0,
    subject_to_deportation: 0,
}

let institute = {
    institute: "",
    diocese: "",
}

function createUpdateObject(objectType, valuesArray) {
    let updateObject;
    let splitedValues = valuesArray.split('=');
    let key = splitedValues[0];
    let helperKey = key;
    let updateValue = splitedValues[1];

    switch (objectType) {
        case 'customers':
            updateObject = customers;
            break;
        case 'addressInsert':
            updateObject = address;
            if (key.indexOf('business') !== -1 || key.indexOf('private') !== -1)
                helperKey = cleanFormFieldName('_',key)[1];
            break;
        case 'address': 
            updateObject = address;
            helperKey = cleanFormFieldName('_',key)[1];
            break;
        case 'contact':
            updateObject = contact;
            helperKey = cleanFormFieldName('-',key)[0];
            break;
        case 'organization':
            updateObject = organization;
            break;
        case 'institute':
            updateObject = institute;
            helperKey = cleanFormFieldName('-',key)[0];
            break;
        default:
            break;
    }

    if (updateObject.hasOwnProperty(helperKey)) {
        if (updateValue.indexOf('checkbox') !== -1) {
            updateValue = checkboxValueForDB(updateValue);
        }

        if (numberFields.hasOwnProperty(key)) {
            if (numberFields[key] === 'int') {
                updateValue = parseInt(updateValue);
            } else if (numberFields[key] === 'float') {
                updateValue = parseFloat(value);
            }
        }

        if (objectType == 'addressInsert' || objectType == 'address' || objectType == 'contact' || objectType == 'institute') {
            updateObject[helperKey] = updateValue;
        }  else {
            updateObject[key] = updateValue;
        }
        
    }
    //console.table(updateObject);
    return updateObject;
}

function createSetForUpdateDB(updateObject) {
    let updateQuerySetPart = [];
    Object.keys(updateObject).forEach((key) => {
        if (isNaN(updateObject[key])) {
            updateQuerySetPart.push(key + "='" +updateObject[key].trim()+"'");
        } else if (updateObject[key] === '') { 
            updateQuerySetPart.push(key + "=''");
        } else {
            updateQuerySetPart.push(key + "=" +updateObject[key]);
        }
    });

    return updateQuerySetPart;
}

function checkboxValueForDB(value) {
    if (value === 'checkbox_checked') {
        return 1;
    } else {
        return 0;
    }
}

function getInsertIntoSQL(inputObject) {
    let data = inputObject;
    let insertIntoKey = [];
    let insertIntoValue = [];
    Object.keys(data).forEach(key => {
        insertIntoKey.push(key);
        if (isNaN(data[key])) {
            insertIntoValue.push("'"+data[key]+"'");
        } else if (data[key] === ''){
            insertIntoValue.push("''");
        } else {
            insertIntoValue.push(data[key]);
        }
    });

    return {
        keys: insertIntoKey,
        values: insertIntoValue,
    };
}

function cleanFormFieldName(splitChar, name) {
    return name.split(splitChar);
}

module.exports = {
    createUpdateObject: createUpdateObject,
    createSetForUpdateDB: createSetForUpdateDB,
    getInsertIntoSQL: getInsertIntoSQL,
}