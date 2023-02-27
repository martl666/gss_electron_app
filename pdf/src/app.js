'use strict';

const pdf = require('html-pdf');
const fs = require('fs');
const options = {format: 'A4', timeout: '100000'};
const HtmlCreator = require('./html');
const os = require('os');
let html;

function createBills() {
    if (os.platform().toString() === 'darwin') {
        html = fs.readFileSync('./pdf/html/invoice_design_mac.html', 'utf-8');
    } else if (os.platform().toString() === 'win32') {
        html = fs.readFileSync('./pdf/html/invoice_design_windows.html', 'utf-8');
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
}

async function createConfirmations(dataObj) {
    console.log(dataObj);
    dataObj = dataObj.data;
    const year = new Date().getFullYear();
    if (os.platform().toString() === 'darwin') {
        html = fs.readFileSync('./pdf/html/confirmation_design_mac.html', 'utf-8');
    } else if (os.platform().toString() === 'win32') {
        html = fs.readFileSync('./pdf/html/confirmation_design_windows.html', 'utf-8');
    }

    let renderedHtml = new HtmlCreator(html);
    renderedHtml = await renderedHtml.getAddressBlockConfirmation(dataObj.memberId, dataObj.eventId);
        
    await pdf.create(renderedHtml.html, options).toFile('./pdf/pdf/'+year+'/confirmation_'+renderedHtml.fileInfo+'_'+dataObj.eventId+'_'+dataObj.memberId+'.pdf', function(err, res) {
        if (err) return console.log(err);
        console.log(res);
    });
}

module.exports = {
    createBills: createBills,
    createConfirmations: createConfirmations,
}