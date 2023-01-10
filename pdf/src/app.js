'use strict';

const pdf = require('html-pdf');
const fs = require('fs');
const options = {format: 'A4'};
const HtmlCreator = require('./html');
let html = fs.readFileSync('../html/invoice_design_windows.html', 'utf-8');

let renderedHtml = new HtmlCreator(html);
renderedHtml = renderedHtml.getAddressBlock(1);

pdf.create(renderedHtml.html, options).toFile('../pdf/'+renderedHtml.invoiceNumber+'.pdf', function(err, res) {
    if (err) return console.log(err);
    console.log(res);
});