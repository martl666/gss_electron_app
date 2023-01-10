const InvoiceNumbers = require('./invoiceNumbers');
const members = {
    1: {
        firstname: 'Martin',
        lastname: 'Haydn',
        title: 'Dr.',
        invoice: 1,
        organization: 'JVA Moabit',
        membershipFee: 25
    }
}

const addresses = {
    1: {
        street: 'Etzelwanger Straße 14',
        zip: '92259',
        city: 'Neukirchen',
        type: 'business'
    }
}

module.exports = class HtmlCreator {
    constructor(html) {
        this.html = html;
    }

    #getAddressInfo(memberId) {
        let addressBlock;
        if (members[memberId] !== undefined) {
            addressBlock = `${members[memberId].title}<br>${members[memberId].firstname} ${members[memberId].lastname}<br>${members[memberId].organization}<br>`;
            if (addresses[memberId] !== undefined) {
                addressBlock += `${addresses[memberId].street}<br>${addresses[memberId].zip} ${addresses[memberId].city}`
            }
        }

        return addressBlock;
    }

    #getText(memberId) {
        if (members[memberId] !== undefined) {
            if (members[memberId].invoice === 1) {
                this.html = this.html.replaceAll('${invoiceText}', '<p>Der Gesamtbetrag ist innerhalb von 14 Tagen nach Erhalt der Rechnung mit dem<br>\
                <b>Verwendungszweck ${invoiceId}</b> auf unser unten genanntes Konto zu zahlen.</p>');
            } else {
                this.html = this.html.replaceAll('${invoiceText}', '<p>Der Gesamtbetrag wird per Lastschriftverfahren von Ihrem Konto eingezogen.<br>\
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

    #getMembershipFee(memberId) {
        this.html = this.html.replaceAll('${membershipFee}', members[memberId].membershipFee);

        return this;
    }

    #getNextInvoiceNumber() {
        this.invoiceNumber = new InvoiceNumbers().getNextInvoiceNumber()
        this.html = this.html.replaceAll('${invoiceId}', this.invoiceNumber);

        return this;
    } 

    getAddressBlock(memberId) {
        this.html = this.html.replaceAll('${membersAddress}', this.#getAddressInfo(memberId));
        this.#getText(memberId);
        this.#getDate();
        this.#getDateYear();
        this.#getNextInvoiceNumber();
        this.#getMembershipFee(memberId);

        return this;
    }       
}