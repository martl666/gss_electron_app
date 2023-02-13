const utf8 = require('utf8');
//const renderer = require('../renderer');

function saveMail(input) {
    let newMailAddress = document.getElementsByName('new_email_'+input)[0].value;
    renderer.rendererSaveMail(input, newMailAddress);
}

function saveNewAddress(memberId) {
    let addressObject = {
        companyname: document.getElementsByName('company')[0].value,
        street: document.getElementsByName('street')[0].value,
        zip: document.getElementsByName('zip')[0].value,
        city: document.getElementsByName('city')[0].value,
        country: document.getElementsByName('country')[0].value,
        state: document.getElementsByName('state')[0].value,
        type: document.getElementsByName('type')[0].value,
        eg: 0,
        customer_id: memberId
    }

    renderer.saveNewAddress(memberId, addressObject);
}

function deleteMail(memberId, rowId) {
    if (confirm('Wollen Sie diese E-Mail Adresse wirklich löschen?')) {
        renderer.rendererDeleteMail(memberId, rowId);
    }
}

function updateMemeberView(memberId) {
    renderer.getCustomerData(memberId)
}

function updateMemberData() {
    let data = document.forms.memberDataForm;
    console.log("DEBUG: " + JSON.stringify(data));

    let dataObject = getQueryString(data);

    console.log(dataObject.queryString);
    console.log(dataObject.memberId);

    renderer.updateMemberData(dataObject.queryString, dataObject.memberId);

    return true;
}

function insertMemberData() {
    let data = document.forms.addMemberForm;

    let dataObject = getQueryString(data);

    console.log(dataObject.queryString);
    console.log(dataObject.memberId);

    renderer.newMemberData(dataObject.queryString);

    return false;
}

function getQueryString(data) {
    let params = '';
    let memberId = 0;
    for( let i=0; i<data.elements.length; i++ )
    {
    let fieldName = data.elements[i].name;
    let fieldValue = data.elements[i].value;
    let fieldId = data.elements[i].id;

    if (fieldName === 'customer_id') {
        memberId = fieldValue;
    }

    let checkboxArr = ['board_of_directors', 'advisory_council', 'buko_member','no_member', 'ethics', 'youth', 'magazine_pdf', 'magazine_print', 'active', 'retired', 'subject_to_deportation','org_youth','women', 'open_execution','first_execution', 'enforcement', 'punishable', 'remand', 'men', 'invoice', 'debit', 'evangelical', 'magazine_membership']
    if (fieldName.length > 1) {        
        //console.log(fieldName + ' - ' + checkboxArr.indexOf(fieldName));
        if (checkboxArr.indexOf(fieldName) !== -1) {
            if (document.getElementById(fieldId).checked) {
                fieldValue = 'checkbox_checked';
            } else {
                fieldValue = 'checkbox_not_checked';
            }
        }
        params += fieldName + '=' + fieldValue + '&';
    }
    
    }
    let queryString = params;
    if (params.slice(-1) === '&') {
        queryString = params.slice(0, -1);
    }

    return {
        queryString: queryString,
        memberId: memberId
    }
}

function exportMailDistributorSearch() {
    let data = document.forms.exportMailDistributorSearch;
    queryString = exportHelperForQueryString(data);
    
    renderer.exportMailDistributorSearch(queryString);
}

function exportCsvSearch() {
    let data = document.forms.exportCsvSearch;
    queryString = exportHelperForQueryString(data);
    
    renderer.exportCsvSearch(queryString);
}

function printMailingLabel() {
    let data = document.forms.printMailingLabel;
    console.log(data.elements[0].value);
    switch (data.elements[0].value) {
        case '1':
            renderer.printMailingLabel();
            break;
        case '2':
            renderer.printAndersOrtLabel();
            break;
        case '3':
            renderer.printAndersOrtLabel3();
            break;
    }
}

function changePrimaryMail(memberId, newPrimaryMailId) {
    renderer.changePrimaryMail(memberId, newPrimaryMailId);
}

function exportHelperForQueryString(data) {
    let params = '';
    for( let i=0; i<data.elements.length; i++ )
    {
        let fieldName = data.elements[i].name;
        let fieldValue = data.elements[i].value;
        if (fieldValue != 'not_used' && fieldValue != '') {
            params += fieldName + '=' + fieldValue + '&';
        }
        
    }
    let queryString = params;

    if (params.slice(-1) === '&') {
        queryString = params.slice(0, -1);
    }
    return queryString;
}

function changeInputFieldType(that, index) {
    if (that.querySelector(':checked').getAttribute('data-field') === 'select') {
        document.getElementById('searchInput_'+index).innerHTML = "<select  name=\"searchValue\" class=\"form-select\"><option>0</option><option>1</option></select>";
      } else {
        document.getElementById('searchInput_'+index).innerHTML = "<input  name=\"searchValue\" class=\"form-control\" type='text' id='text'>";
      }
}

function setNumbersOfMagazine(type) {
    let numbersOfMagazine = document.getElementById('numberOfMagazine').value;
    let checkBoxPrint = document.getElementById('magazine_print');
    let checkBoxPdf = document.getElementById('magazine_pdf');
    if (type == "print" && checkBoxPrint.checked == true) {
        document.getElementById('numberOfMagazine').value = numbersOfMagazine == 0 ? 1 : numbersOfMagazine;
    }

    if (type == "pdf" && checkBoxPdf.checked == true) {
        if (checkBoxPrint.checked == true) {
            document.getElementById('numberOfMagazine').value = numbersOfMagazine
        } else {
            document.getElementById('numberOfMagazine').value = 0;
        }
    }

    if (checkBoxPrint.checked == false && checkBoxPdf.checked == false) {
        document.getElementById('numberOfMagazine').value = 0;
    }
}

function isCompanyNameFilled() {
    let companynamePrivate = document.getElementById('inputCompanyNamePrivate').value.split('').length;
    let companynameBusiness = document.getElementById('inputCompanyNameBusiness').value.split('').length;
    document.getElementById('egPrivate').checked = false;
    document.getElementById('egBusiness').checked = false;

    if (companynamePrivate > 2) {
        document.getElementById('egPrivate').checked = true;
    }

    if (companynameBusiness > 2) {
        document.getElementById('egBusiness').checked = true;
    }
}

function loadPdfFile(file, memberId) {
    renderer.loadPdfFile(file, memberId);
}

function setAttrOnChange(that) {
    that.setAttribute('name', that.value + '_type');
}