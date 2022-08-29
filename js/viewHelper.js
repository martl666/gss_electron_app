const utf8 = require('utf8');

function saveMail(input) {
    var newMailAddress = document.getElementsByName('new_email_'+input)[0].value;
    renderer.rendererSaveMail(input, newMailAddress);
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

    var params = '';
    var memberId = 0;
    for( var i=0; i<data.elements.length; i++ )
    {
    var fieldName = data.elements[i].name;
    var fieldValue = data.elements[i].value;
    var fieldId = data.elements[i].id;

    if (fieldName == 'customer_id') {
        memberId = fieldValue;
    }

    var checkboxArr = ['board_of_directors', 'advisory_council', 'buko_member','no_member', 'ethics', 'youth', 'magazine_pdf', 'magazine_print', 'active', 'retired', 'subject_to_deportation','org_youth','women', 'open_execution','first_execution', 'enforcement', 'punishable', 'remand', 'men']
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
    var queryString = params;
    if (params.slice(-1) === '&') {
        queryString = params.slice(0, -1);
    }
    renderer.updateMemberData(queryString, memberId);
    return true;
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
    }
}

function changePrimaryMail(memberId, newPrimaryMailId) {
    renderer.changePrimaryMail(memberId, newPrimaryMailId);
}

function exportHelperForQueryString(data) {
    var params = '';
    for( var i=0; i<data.elements.length; i++ )
    {
        var fieldName = data.elements[i].name;
        var fieldValue = data.elements[i].value;
        if (fieldValue != 'not_used' && fieldValue != '') {
            params += fieldName + '=' + fieldValue + '&';
        }
        
    }
    var queryString = params;

    if (params.slice(-1) === '&') {
        queryString = params.slice(0, -1);
    }
    return queryString;
}