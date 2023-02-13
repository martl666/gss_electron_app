const InvoiceNumbers = require('./invoiceNumbers');
const customersModel = require('../../models/customers');
const addressesModel = require('../../models/address');

let members;

let addresses;

module.exports = class HtmlCreator {
    constructor(html) {
        this.html = html;
    }

    #getAddressInfo() {
        let addressBlock;
        if (members !== undefined) {
            addressBlock = `${members.title}<br>${members.firstname} ${members.lastname}<br>${members.institute}<br>`;
            if (addresses !== undefined) {
                addressBlock += `${addresses.street}<br>${addresses.zip} ${addresses.city}`
            }
        }

        return addressBlock;
    }

    #getText() {
        if (members !== undefined) {
            if (members.invoice === 1) {
                this.html = this.html.replace('${invoiceText}', '<p>Der Gesamtbetrag ist innerhalb von 14 Tagen nach Erhalt der Rechnung mit dem<br>\
                <b>Verwendungszweck ${invoiceId}</b> auf unser unten genanntes Konto zu zahlen.</p>');
            } else {
                this.html = this.html.replace('${invoiceText}', '<p>Der Gesamtbetrag wird per Lastschriftverfahren von Ihrem Konto eingezogen.<br>\
                Es ist <b>keine Überweisung notwendig.</b></p>');
            }
        }

        return this;
    }

    #getDateYear() {
        this.html = this.html.replaceAll('${dateYear}', new Date().getFullYear());

        return this;
    }

    #getDate() {
        this.html = this.html.replaceAll('${today}', new Date().toLocaleDateString());

        return this;
    }

    #getMembershipFee() {
        this.html = this.html.replaceAll('${membershipFee}', members.membership_fee);

        return this;
    }

    #getNextInvoiceNumber() {
        this.invoiceNumber = new InvoiceNumbers().getNextInvoiceNumber()
        this.html = this.html.replaceAll('${invoiceId}', this.invoiceNumber);

        return this;
    } 

  getAddressBlock(memberId) {
        return new Promise((resolve, reject) => {
            members = customersModel.getCustomerDataForPdf(memberId);
            addresses = addressesModel.getAddressDataForPdf(memberId);
            console.log(members);
            this.html = this.html.replaceAll('${membersAddress}', this.#getAddressInfo());
            this.#getText();
            this.#getDate();
            this.#getDateYear();
            this.#getNextInvoiceNumber();
            this.#getMembershipFee();

            this.invoiceText = members.invoice === 1 ? 'Rechnung' : 'Lastschrift';
            this.fileInfo = `_${members.firstname}_${members.lastname}`;

            resolve(this);
        });

        return this;
    }       
}