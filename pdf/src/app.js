'use strict';

const pdf = require('html-pdf');
const fs = require('fs');
const options = {format: 'A4', timeout: '100000'};
const HtmlCreator = require('./html');
const os = require('os');
let html;
if (os.platform().toString() === 'darwin') {
    html = fs.readFileSync('./pdf/html/invoice_design_mac.html', 'utf-8');
} else if (os.platform().toString() === 'win32') {
    html = fs.readFileSync('/pdf/html/invoice_design_windows.html', 'utf-8');
}

const customersModel = require('../../models/customers');
const allCustomerIds = customersModel.getCustomersIdForPdf();
const createdBills = [];
allCustomerIds.forEach(async customerId => {
    let renderedHtml = new HtmlCreator(html);
    renderedHtml = await renderedHtml.getAddressBlock(customerId.ID);
    
    await pdf.create(renderedHtml.html, options).toFile('./pdf/pdf/'+renderedHtml.invoiceText+'/'+renderedHtml.invoiceNumber+renderedHtml.fileInfo+'_'+customerId.ID+'.pdf', function(err, res) {
        if (err) return console.log(err);
        console.log(res);
        createdBills.push(res);
    });
});

return createdBills;