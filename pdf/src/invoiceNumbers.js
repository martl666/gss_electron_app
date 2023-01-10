module.exports = class InvoiceNumbers {
    constructor() {
        this.invoiceJson = require('./config/invoiceNumbers.json');
    }

    #writeNewInvoiceNumberToJson(newInvoiceNumber) {
        this.invoiceJson.invoiceNumbers = newInvoiceNumber
        const fs = require('fs');
        fs.writeFileSync('./config/invoiceNumbers.json', JSON.stringify(this.invoiceJson, null, 4));
    }

    getNextInvoiceNumber() {
        const invoiceNumber = String(parseInt(this.invoiceJson.invoiceNumbers)+1).padStart(4, '0');
        this.#writeNewInvoiceNumberToJson(invoiceNumber);
        return this.invoiceJson.pattern + invoiceNumber;
    }
}