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
    type: '',
}

let contact = {
    contact_type: "",
    contact_data: "",
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
        case 'address':
            updateObject = address;
            helperKey = cleanFormFieldName('_',key)[1];
            break;
        case 'contact':
            updateObject = contact;
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

        if (objectType == 'address' || objectType == 'contact') {
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

function cleanFormFieldName(splitChar, name) {
    return name.split(splitChar);
}

module.exports = {
    createUpdateObject: createUpdateObject,
    createSetForUpdateDB: createSetForUpdateDB,
}