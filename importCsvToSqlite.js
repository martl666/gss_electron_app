'use strict';

const fs = require('fs');
const sqlite = require('./sqlite');
const DB = require('better-sqlite3-helper');

DB({
    path: './seelsorge.db', // this is the default
    readonly: false, // read only
    fileMustExist: false, // throw error if database not exists
    WAL: true, // automatically enable 'PRAGMA journal_mode = WAL'
    migrate: false
});

async function createInsertObjects(csvObject) {
    let customers = {
        firstname: csvObject[1].trim(),
        lastname: csvObject[0].trim(),
        title: csvObject[2].trim() || '',
        board_of_directors: parseInt(csvObject[15]) || 0, //0 false, 1 true
        advisory_council: parseInt(csvObject[16]) || 0, //0 false, 1 true
        buko_member: parseInt(csvObject[17]) || 0, //0 false, 1 true
        no_member: parseInt(csvObject[18]) || 0, //0 false, 1 true
        ethics: parseInt(csvObject[19]) || 0, //0 false, 1 true
        women: parseInt(csvObject[20]) || 0, //0 false, 1 true
        youth: parseInt(csvObject[21]) || 0, //0 false, 1 true
        publications_private_address: csvObject[25] || '',
        magazine_pdf: parseInt(csvObject[26]) || 0, //0 false, 1 true
        magazine_print: parseInt(csvObject[27]) || 0, //0 false, 1 true
        number_of_magazine: 1,
        active: 1
    };
    let customer_id = DB().insert('customers', customers);

    console.table(customers);

    setAddress(csvObject, customer_id);
    setContactInformation(csvObject, customer_id);

    let institute = {
        customer_id: customer_id, //customers.ID
        institute: csvObject[8] || '',
        diocese: csvObject[7] || '',
    };
    console.table(institute);
    let institute_id = DB().insert('institute', institute);

    setOrganizationForm(csvObject, institute_id);
}

async function setOrganizationForm(csvObject, institute_id) {
    let organizationFormData = csvObject[9].split(',');
    let table = 'organizational_form';

    let formObj = {
        men: 0, //0 false, 1 true
        remand: 0, //0 false, 1 true
        punishable: 0, //0 false, 1 true
        enforcement: 0, //0 false, 1 true
        first_execution: 0, //0 false, 1 true
        open_execution: 0, //0 false, 1 true
        women: 0, //0 false, 1 true
        youth: 0, //0 false, 1 true
        subject_to_deportation: 0
    }
    organizationFormData.forEach(function(form){
        switch (form.trim()) {
            case 'M':
                formObj.men = 1;
                break;
            case 'U':
                formObj.remand = 1;
                break;
            case 'S':
                formObj.punishable = 1;
                break;
            case 'RV':
                formObj.enforcement = 1;
                break;
            case 'EV':
                formObj.first_execution = 1;
                break;
            case 'OV':
                formObj.open_execution = 1;
                break;
            case 'F':
                formObj.women = 1;
                break;
            case 'J':
                formObj.youth = 1;
                break;
            case 'AH':
                formObj.subject_to_deportation = 1;
                break;
            default:
                break;
        }
    });

    let organization_form = {
        institute_id, //institute.ID
        men: formObj.men || 0, //0 false, 1 true
        remand: formObj.remand || 0, //0 false, 1 true
        punishable: formObj.punishable || 0, //0 false, 1 true
        enforcement: formObj.enforcement || 0, //0 false, 1 true
        first_execution: formObj.first_execution || 0, //0 false, 1 true
        open_execution: formObj.open_execution || 0, //0 false, 1 true
        women: formObj.women || 0, //0 false, 1 true
        youth: formObj.youth || 0, //0 false, 1 true
        subject_to_deportation: formObj.subject_to_deportation || 0, //0 false, 1 true
    };

    console.table(organization_form);
    DB().insert(table, organization_form);
}

async function setAddress(csvObject, customerId) {
    let addressBusiness = null;
    let addressPrivate = null;
    let table = 'address';

    if (csvObject[3] !== '') {
        addressPrivate = {
            customer_id: customerId,
            street: csvObject[3].trim(),
            zip: csvObject[4].trim(),
            city: csvObject[5].trim(),
            type: "private", //private, business
        };
        console.table(addressPrivate);
        DB().insert(table, addressPrivate);
    } 
    
    if (csvObject[10] !== '') {
        addressBusiness = {
            customer_id: customerId,
            street: csvObject[10].trim(),
            zip: csvObject[11].trim(),
            city: csvObject[12].trim(),
            type: "business", //private, business
        };
        console.table(addressBusiness);
        DB().insert(table, addressBusiness);
    }
}

async function setContactInformation(csvObject, customerId) {
    let privatePhoneData = null;
    let businessPhoneData = null;
    let email = null;
    let table = 'customers_contact_information';

    if (csvObject[6] !== '') {
        privatePhoneData = {
            customer_id: customerId, //customers.ID
            contact_type: "private_phone", //private_phone, business_phone, email
            contact_data: csvObject[6], //contact data
        }
        console.table(privatePhoneData);
        DB().insert(table, privatePhoneData);
    }
    
    if (csvObject[13] !== '') {
        businessPhoneData = {
            customer_id: customerId, //customers.ID
            contact_type: "business_phone", //private_phone, business_phone, email
            contact_data: csvObject[13], //contact data
        }
        console.table(businessPhoneData);
        DB().insert(table, businessPhoneData);
    }
    
    if (csvObject[14] !== '') {
        csvObject[14].split(',').forEach( async function(emailInsert){
            email = {
                customer_id: customerId, //customers.ID
                contact_type: "email", //private_phone, business_phone, email
                contact_data: emailInsert.trim(), //contact data
            }
            console.table(email);
            DB().insert(table, email);
        });
    } 
}

async function readCsvPerLine() {
    sqlite.openDBConnection();

    var csvFile = fs.readFileSync('csv/Seelsorge_test.csv', 'UTF-8');
    csvFile.split('\n').forEach(async function(line){
        let csvObject = [];
        let groupedValues = line.match(/\"(.*)\"/);
        let numberOfMails = 0;
        if (groupedValues !== null && groupedValues.length > 1) {
            numberOfMails = groupedValues[1].split(';').length;
        }

        let values = line.split(';');
        let writeValueIndexFromIndex = true;
        let valueIndex = 0;
        for(let index = 0; index < values.length; index++) {
            if (writeValueIndexFromIndex) {
                valueIndex = index;
            } else {
                valueIndex++;
            }
            if (values[valueIndex] !== undefined) {
                if (values[index].startsWith('"')) {
                    csvObject[index] = groupedValues[1].replace(';', ',');
                    writeValueIndexFromIndex = false; 
                    valueIndex += numberOfMails-1;
                } else {
                    csvObject[index] = values[valueIndex];
                }
            }
        }
        await createInsertObjects(csvObject);
    });
    
}

readCsvPerLine();