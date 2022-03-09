import _ from 'lodash'
import { exec } from 'child_process'
import { calculateTax } from 'helpers/calculateTax'
import { taxData } from './TaxCalculator-test'

async function vpfrInvoice(payload) {
    return new Promise(function (resolve, reject) {
        exec('sh ./__tests__/vpfr/vpfr-invoice.sh \'' + payload + '\'', (error, stdout, stderr) => {
            if (error) {
                console.error(error)
                reject(error)
                return
            }

            // if (stderr) {
            //     console.error(stderr)
            //     reject(stderr)
            //     return
            // }

            resolve(stdout.trim())
        })
    })
}

const objectsEqual = (o1, o2) => {
    const isEqual = Object.keys(o1).length === Object.keys(o2).length
        && Object.keys(o1).every(p => o1[p] === o2[p])

    if (!isEqual) {
        console.log(o1, o2)
    }

    return isEqual
}
const arraysEqual = (a1, a2) =>
    a1.length === a2.length && a1.every((o) => objectsEqual(o, _.find(a2, { label: o.label })))


describe('Testing tax calucation dinamicly!', () => {

    const taxList = ['F', 'N', 'P', 'E', 'T', 'A', 'B', 'Ж', 'C']
    const getDynamicInvoiceRequest = () => {

        let invoiceTotal = 0

        const items = []
        for (let i = 0, itemsCount = _.random(1, 10); i < itemsCount; i++) {
            const quantity = _.round(_.random(0.001, 100, true), 3)
            const unitPrice = _.round(_.random(0.01, 100, true), 2)
            const totalAmount = _.round(quantity * unitPrice, 2)
            const taxes = _.shuffle(taxList).slice(0, _.random(1, taxList.length))

            items.push({
                'Name': 'Item-' + i,
                'Quantity': quantity,
                'UnitPrice': unitPrice,
                'Labels': taxes,
                'TotalAmount': totalAmount
            })

            invoiceTotal += totalAmount
        }

        return getInvoiceRequest(items, _.round(invoiceTotal, 2))

    }

    const getInvoiceRequest = (items, invoiceTotal) => {
        return {
            'InvoiceType': 'Normal',
            'TransactionType': 'Sale',
            'Items': items,
            'Payment': [{ 'Amount': _.round(invoiceTotal, 2), 'PaymentType': 'Cash' }]
        }
    }

    const runSimpleItem = async (taxLabels) => {
        const invoiceRequest = getInvoiceRequest([{
            'Name': 'Item',
            'Quantity': 1,
            'UnitPrice': 1,
            'Labels': taxLabels,
            'TotalAmount': 1
        }], 1)

        const vpfrRes = await vpfrInvoice(JSON.stringify(invoiceRequest))
        const vpfrTaxes = JSON.parse(vpfrRes).taxItems
        const result = calculateTax(taxData, invoiceRequest.Items)

        //console.log('vpfrTaxes', vpfrTaxes)
        //console.log('result', result)

        return arraysEqual(vpfrTaxes, result.invoiceTaxItems)
    }


    it('Compare with VPFR', async () => {

        const invoiceRequest = getDynamicInvoiceRequest()

        expect(invoiceRequest).not.toBeNull()

        const vpfrRes = await vpfrInvoice(JSON.stringify(invoiceRequest))
        expect(vpfrRes).not.toBeNull()

        const vpfrTaxes = JSON.parse(vpfrRes).taxItems
        expect(vpfrTaxes).not.toBeNull()

        const result = calculateTax(taxData, invoiceRequest.Items)
        expect(result.invoiceTaxItems).not.toBeNull()

        expect(arraysEqual(vpfrTaxes, result.invoiceTaxItems)).toBe(true)

    })


    it('Simple tax', async () => {

        await expect(runSimpleItem(['P', 'Ж'])).resolves.toBe(true)
        //await expect(runSimpleItem(['P', 'F'])).resolves.toBe(true);
        //await expect(runSimpleItem(['P', 'E'])).resolves.toBe(true);
        //await expect(runSimpleItem(['P', 'T'])).resolves.toBe(true);
        //await expect(runSimpleItem(['P', 'A'])).resolves.toBe(true);
    })

    it('Should calculate tax on simple item with P and Ж labels', () => {

        const p = 0.5 //categoryType 2, amount-per-quantity, amount-on-quantity
        const z = 19 //Ж, categoryType 0, proportional tax

        const quantity = 1
        const total = 1

        //step 1 calculate "amount-on-quantity" tax
        const pAmount = _.round(quantity * p, 4)

        //step 2 exclude "amount-on-quantity" tax from additional calculations
        const taxableTotal = total - pAmount

        //step 3 calculate Ж tax
        const zAmount = _.round(taxableTotal * z / (100 + z), 4)

        expect(0.5).toBe(pAmount)
        expect(0.0798).toBe(zAmount)


        //try "calculateTax" with same params
        const result = calculateTax(taxData, [{
            'Name': 'Item',
            'Quantity': 1,
            'UnitPrice': 1,
            'Labels': ['P', 'Ж'],
            'TotalAmount': 1
        }])

        expect(0.5).toBe(_.find(result.invoiceTaxItems, { label: 'P' }).amount)
        expect(0.0798).toBe(_.find(result.invoiceTaxItems, { label: 'Ж' }).amount)

    })

    it.skip('That weird rounding example', async () => {

        const invoiceRequest = getInvoiceRequest([{
            Name: 'Item0',
            Quantity: 50.913,
            UnitPrice: 666.02,
            Labels: ['E', 'T'],
            TotalAmount: 33909.08,
        }], 33909.08)

        const vpfrRes = await vpfrInvoice(JSON.stringify(invoiceRequest))

        const vpfrTaxes = JSON.parse(vpfrRes).taxItems

        const result = calculateTax(taxData, invoiceRequest.Items)

        expect(arraysEqual(vpfrTaxes, result.invoiceTaxItems)).toBe(true)
    })

    it.skip('Another weird rounding example', async () => {

        const invoiceRequest = getInvoiceRequest([{
            Name: 'Item0',
            Quantity: 1,
            UnitPrice: 1,
            Labels: ['F', 'Ж'],
            TotalAmount: 1,
        }], 1)

        const vpfrRes = await vpfrInvoice(JSON.stringify(invoiceRequest))

        const vpfrTaxes = JSON.parse(vpfrRes).taxItems

        const result = calculateTax(taxData, invoiceRequest.Items)

        expect(arraysEqual(vpfrTaxes, result.invoiceTaxItems)).toBe(true)
    })



    it('Simple F tax', async () => {

        await expect(runSimpleItem(['F'])).resolves.toBe(true)
    })

    it('Simple N tax', async () => {

        await expect(runSimpleItem(['N'])).resolves.toBe(true)
    })

    it('Simple P tax', async () => {

        await expect(runSimpleItem(['P'])).resolves.toBe(true)
    })

    it('Simple E tax', async () => {

        await expect(runSimpleItem(['E'])).resolves.toBe(true)
    })

    it('Simple T tax', async () => {

        await expect(runSimpleItem(['T'])).resolves.toBe(true)
    })

    it('Simple A tax', async () => {

        await expect(runSimpleItem(['A'])).resolves.toBe(true)
    })

    it('Simple B tax', async () => {

        await expect(runSimpleItem(['B'])).resolves.toBe(true)
    })

    it('Simple Ж tax', async () => {

        await expect(runSimpleItem(['Ж'])).resolves.toBe(true)
    })

    it('Simple C tax', async () => {

        await expect(runSimpleItem(['C'])).resolves.toBe(true)
    })

})
