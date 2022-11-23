// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
let customersController = require('./controller/customers');
let addressController = require('./controller/address');
let cciController = require('./controller/customerContactInformation');
let organizationalFormController = require('./controller/organizationalForm');
let exportController = require('./controller/exports');
let dbUpdater = require('./controller/dbUpdater');
let {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
const institute = require('./controller/institute');

dbUpdater.createBackup();
let loader = new TwingLoaderFilesystem('./views');
let twing = new TwingEnvironment(loader, {
    
});
//'cache': './views/cache',
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    icon: __dirname + path.sep + 'img' + path.sep + 'seelsorge.jpg',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.maximize();
  mainWindow.show();

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Einige APIs können nur nach dem Auftreten dieses Events genutzt werden.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


ipcMain.handle('query', async (event, someArgument) => {
  const result = customersController.getAllMembers();
  return result
})

ipcMain.handle('getCusomerData', async (event, param) => {
  const result = customersController.getMemberData(param.memberId);
  let content = twing.load('member/update/memberData.html').then((template) => {
    return template.render({result: result}).then((output) => {
      return output;
    });
  });
  
  return content;
});

ipcMain.handle('addMember', async (event, param) => {
  let content = twing.load('member/add/addMemberForm.html').then((template) => {
    return template.render({}).then((output) => {
      return output;
    });
  });
  
  return content;
});

ipcMain.handle('exportCSV', async (event, param) => {
  let content = twing.load('exports/exportMain.html').then((template) => {
    return template.render({csv: true}).then((output) => {
      return output;
    });
  });
  
  return content;
});

ipcMain.handle('exportMailDistributor', async (event, param) => {
  let content = twing.load('exports/exportMain.html').then((template) => {
    return template.render({}).then((output) => {
      return output;
    });
  });
  
  return content;
});

ipcMain.handle('printEnvelops', async (event, param) => {
  let content = twing.load('print/selectAddressees.html').then((template) => {
    return template.render({}).then((output) => {
      return output;
    });
  });
  
  return content;
});


ipcMain.handle('printMailingLabel', async(event, param) => {
  const printWindow = new BrowserWindow({
    show: false,
    icon: __dirname + path.sep + 'img' + path.sep + 'seelsorge.jpeg',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  
  printWindow.show();

  printWindow.loadFile('print.html');
});

ipcMain.handle('printAndersOrtLabel', async(event, param) => {
  const printWindow = new BrowserWindow({
    show: false,
    icon: __dirname + path.sep + 'img' + path.sep + 'seelsorge.jpeg',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  
  printWindow.show();

  printWindow.loadFile('printAndersOrt.html');
});

ipcMain.handle('changePrimaryMail', async(event, param) => {
  let returnVal = customersController.updatePrimaryMailAddress(param.memberId, param.newPrimaryMailId);
  if (returnVal)
    return param.memberId;
  else 
    return returnVal;
});


ipcMain.handle('exportMailDistributorSearch', async (event, param) => {
  exportController.exportResult(param.queryString, 'mail');
});

ipcMain.handle('exportCsvSearch', async (event, param) => {
  exportController.exportResult(param.queryString, 'csv');
});

ipcMain.handle('saveNewMail', async(event, param) => {
  let returnVal = customersController.insertNewMailAddress(param.memberId, param.newMailAddress);
  if (returnVal)
    return param.memberId;
  else 
    return returnVal;
});

ipcMain.handle('deleteMail', async(event, param) => {
  customersController.deleteMailAddress(param.rowId);
  
  return param.memberId;
});

ipcMain.handle('updateMemberData', async(event, param) => {
  customersController.updateMemberData(param.updateQueryString, param.memberId);
  addressController.updateMemberAddress(param.updateQueryString);
  cciController.updateMemberContactInformation(param.updateQueryString);
  organizationalFormController.updateOrganizationalForm(param.updateQueryString, param.memberId);
  institute.updateInstitute(param.updateQueryString, param.memberId);

  return param.memberId;
});

ipcMain.handle('addMemberData', async(event, param) => {
  let newCustomerID = customersController.addMemberData(param.insertQueryString);
  console.log("Query String: " + param.insertQueryString);
  addressController.addMemberAddress(param.insertQueryString, newCustomerID);
  cciController.addMemberContactInformation(param.insertQueryString, newCustomerID);
  //let organizationalId = organizationalFormController.addOrganizationalForm(param.insertQueryString, newCustomerID);
  //institute.addInstitute(param.insertQueryString, organizationalId);

  return true;
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// preload.js