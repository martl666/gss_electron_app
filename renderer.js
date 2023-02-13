const { ipcRenderer } = require('electron');
let savedDataSet;
let $_TABLE = '#table';

document.querySelector('#members').addEventListener('click', () => {
  ipcRenderer.invoke('query', '').then((result) => {
    savedDataSet = result;
    showTable(result);
    getCustomerData();
  });
});

document.querySelector('#addMember').addEventListener('click', () => {
  addMember();
});

document.querySelector('#exportCSV').addEventListener('click', () => {
  ipcRenderer.invoke('exportCSV').then((result)=>{
    document.getElementById('content').innerHTML = result;
    return true;
  });
});

document.querySelector('#exportMailDistributor').addEventListener('click', () => {
  ipcRenderer.invoke('exportMailDistributor').then((result)=>{
    document.getElementById('content').innerHTML = result;
    return true;
  });
});

document.querySelector('#printEnvelops').addEventListener('click', () => {
  ipcRenderer.invoke('printEnvelops').then((result)=>{
    document.getElementById('content').innerHTML = result;
    return true;
  });
});

document.querySelector('#createInvoice').addEventListener('click', () => {
  ipcRenderer.invoke('createInvoice').then((result)=>{
    document.getElementById('content').innerHTML = result;
    return true;
  });
});
            
ipcRenderer.invoke('query', '').then((result) => {
  savedDataSet = result;
  showTable(result);
  getCustomerData();
});

function addMember() {
  ipcRenderer.invoke('addMember').then((result)=>{
    document.getElementById('content').innerHTML = result;
    return true;
  });
}

function getCustomerData(memberIdInput) {
  $(document).ready(function() {
    if (memberIdInput >= 1) {
      ipcRenderer.invoke('getCusomerData', {memberId: memberIdInput}).then((result)=>{
        document.getElementById('content').innerHTML = result;
        return true;
      });
    }
    let table = $($_TABLE).DataTable();
  
    $($_TABLE+' tbody').on('click', 'tr', function () {
        const data = table.row(this).data();
        ipcRenderer.invoke('getCusomerData', {memberId: data[0]}).then((result)=>{
          document.getElementById('content').innerHTML = result;
        });
    });
  });
}

function showTable(result) {
  const dataSet = result;
  document.getElementById('content').innerHTML ='<table id="table" class="display table" width="100%"></table>';
  $(document).ready(function () {
    $($_TABLE).DataTable({
      data: dataSet,
      stateSave: true,
      columns: [
          { title: 'Customer ID' },
          { title: 'Titel' },
          { title: 'Vorname' },
          { title: 'Nachname' },
          { title: 'Vorstand' },
          { title: 'Buko Mitglied' },
          { title: 'JVA / Diözese' },
          { title: 'Aktiv' },
      ],
      pageLength: 50,
      lengthMenu: [10, 25, 50, 100, 200, 500],
    });
  });
}

function rendererSaveMail(memberId, newMailAddress) {
  ipcRenderer.invoke('saveNewMail', {memberId: memberId, newMailAddress: newMailAddress}).then((result) => {
    if (result >= 1) {
      document.getElementById('modalBodyMail').innerHTML = 'Email wurde erfolgreich angelegt.';
    } else {
      document.getElementById('modalBodyMail').innerHTML = 'Es ist ein Fehler beim speichern der Email aufgetreten.';
    }
  })
}

function rendererDeleteMail(memberId, rowId) {
  ipcRenderer.invoke('deleteMail', {memberId: memberId, rowId: rowId}).then((memberId) => {
    //result is memberId, important to load customer view
    if (memberId >= 1) {
      getCustomerData(memberId);
    } 
  })
}

async function updateMemberData(queryString, memberId) {
  await ipcRenderer.invoke('updateMemberData', {updateQueryString: queryString, memberId: memberId}).then((memberId) => {
    if (memberId >= 1) {
      $('#overlay').show().delay(1000).fadeOut();
      $('body').append(`<div class="toast fade show" id="myToast" style="position: fixed; bottom: 10px; right: 10px;">
        <div class="toast-header">
          <strong class="me-auto">Hinweis</strong>
          <small>vor wenigen Sekunden</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          Änderungen wurden erfolgreich gespeichert.
        </div>
      </div>`);
      getCustomerData(memberId);
    } 
  });
}

async function newMemberData(queryString) {
  await ipcRenderer.invoke('addMemberData', {insertQueryString: queryString}).then((newMemberId) => {
    if (newMemberId >= 1) {
      $('#overlay').show().delay(1000).fadeOut();
      $('body').append(`<div class="toast fade show" id="myToast" style="position: fixed; bottom: 10px; right: 10px;">
        <div class="toast-header">
          <strong class="me-auto">Hinweis</strong>
          <small>vor wenigen Sekunden</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          Mitglied wurde erfolgreich gespeichert mit der Mitglieder-ID: ${newMemberId}.
        </div>
      </div>`);
      getCustomerData(newMemberId);
    }
  });
}

function exportMailDistributorSearch(queryString) {
  ipcRenderer.invoke('exportMailDistributorSearch', {queryString: queryString}).then((result) => {
    if (result >= 1) {
      console.log('Write File to Browser');
    } 
  });
}

function exportCsvSearch(queryString) {
  ipcRenderer.invoke('exportCsvSearch', {queryString: queryString}).then((result) => {
    if (result >= 1) {
      console.log('Write File to Browser');
    } 
  });
}

function changePrimaryMail(memberId, newPrimaryMailId) {
  ipcRenderer.invoke('changePrimaryMail', {memberId: memberId, newPrimaryMailId: newPrimaryMailId}).then((result) => {
    if (result >= 1) {
      getCustomerData(memberId);
    } 
  });
}

function printMailingLabel() {
  ipcRenderer.invoke('printMailingLabel', {}).then((result) => {
    if (result >= 1) {
      printResult(result);
    } 
  });
}

function printAndersOrtLabel() {
  ipcRenderer.invoke('printAndersOrtLabel', {}).then((result) => {
    if (result >= 1) {
      printResult(result);
    } 
  });
}

function printAndersOrtLabel3() {
  ipcRenderer.invoke('printAndersOrtLabel3', {}).then((result) => {
    if (result >= 1) {
      printResult(result);
    } 
  });
}

function loadPdfFile (file, memberId) {
  ipcRenderer.invoke('showPdf', {fileName: file, memberId: memberId}).then((result) => {
    document.getElementById('content').innerHTML = result;
  });
}

function saveNewAddress(memberId, addressObject) {
  ipcRenderer.invoke('saveNewAddress', {addressObject: addressObject, memberId: memberId}).then(result => {
    document.getElementById('content').innerHTML = result;
  });
}

module.exports = {
  rendererSaveMail: rendererSaveMail,
  getCustomerData: getCustomerData,
  rendererDeleteMail: rendererDeleteMail,
  updateMemberData: updateMemberData,
  addMember: addMember,
  newMemberData: newMemberData,
  exportMailDistributorSearch: exportMailDistributorSearch,
  exportCsvSearch: exportCsvSearch,
  changePrimaryMail: changePrimaryMail,
  printMailingLabel: printMailingLabel,
  printAndersOrtLabel: printAndersOrtLabel,
  printAndersOrtLabel3: printAndersOrtLabel3,
  loadPdfFile: loadPdfFile,
  saveNewAddress: saveNewAddress,
}