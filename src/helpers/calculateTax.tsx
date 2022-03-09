import {
  InvoiceItemRequestInterface,
  TaxItemInterface,
} from "screens/TaxCalculator";


import bigDecimal from 'js-big-decimal'
import _, { cloneWith } from 'lodash'

export interface ListOfTaxLists {
  validFrom: Date | string, 
  groupId: number,
  taxCategories: TaxItemInterface[]
}

interface CalculatedTaxList {
  categoryType: number | string;
  label: string;
  amount: number;
  rate: number;
  categoryName: string;
  orderId: number;
  name?: string;
  total: number;
  quantity: number;
}

export interface InvoiceTaxItemResponseInterface {
  categoryType: number | string;
  label: string;
  amount: number;
  rate: number;
  categoryName: string;
  orderId?: number;
}

export interface TaxCategoryAmountInterface {
  amount: number;
  orderId: number;
}

export interface InvoiceTax {
  invoiceTaxItems: InvoiceTaxItemResponseInterface[];
  taxCategoryAmounts: TaxCategoryAmountInterface[];
  taxGroupRevision: number;
}

const calculateTax = (
  listOfTaxLists:  ListOfTaxLists[],
  invoiceItems: InvoiceItemRequestInterface[],
  documentDate: Date | null = null
) => {
  const calculatedTaxList: CalculatedTaxList[] = [];
  const finalTaxListArray: InvoiceTaxItemResponseInterface[] = [];

  const updateFinalTaxList = (taxItem: CalculatedTaxList) => {
    const findItemIndex = finalTaxListArray.findIndex(
      (e) => e.label == taxItem.label
    );

    if (findItemIndex != -1) {
      const tempAmount = Number(bigDecimal.round(finalTaxListArray[findItemIndex].amount+taxItem.amount, 4, 5))
      finalTaxListArray[findItemIndex].amount = tempAmount;
    } else {
      const finalTaxItem: InvoiceTaxItemResponseInterface = {
        categoryType: taxItem.categoryType,
        label: taxItem.label,
        amount: taxItem.amount,
        rate: taxItem.rate,
        categoryName: taxItem.categoryName,
        orderId: taxItem.orderId
      };

      finalTaxListArray.push(finalTaxItem);
    }
  };

  const docDate = documentDate || new Date()
  const itemWithLastValidDate = listOfTaxLists.filter(l => new Date(l.validFrom).getTime() <= docDate.getTime()).sort((d1, d2) => new Date(d2.validFrom).getTime() - new Date(d1.validFrom).getTime())[0]

  // CHECK WHICH TAX LIST TO USE
  const taxList = itemWithLastValidDate.taxCategories

  // let prosloPuta = 0;
  const taxLabelsArr: string[] = []
  const invoiceItemLabelsArr: string[] = []

  for (let i = 0; i < taxList.length; i++) {
    for (let j = 0; j < invoiceItems.length; j++) {
      invoiceItemLabelsArr.push(...invoiceItems[j].Labels)
      if(invoiceItems[j].Labels.length <= 0){
        throw new Error("Labels array can't be empty!")
      }

      for (let k = 0; k < taxList[i].taxRates.length; k++) {
        taxLabelsArr.push(taxList[i].taxRates[k].label)

        if (
          invoiceItems[j].Labels.findIndex(
            (itm) => itm === taxList[i].taxRates[k].label
          ) != -1
        ) {
          
          //let amount =0
          // switch(taxList[i].categoryType){
          //   case 3: amount = (invoiceItems[j].TotalAmount*taxList[i].taxRates[k].rate)/
          // }
          calculatedTaxList.push({
            categoryName: taxList[i].name,
            orderId: taxList[i].orderId,
            label: taxList[i].taxRates[k].label,
            amount: 0, //formula
            categoryType: taxList[i].categoryType,
            rate: taxList[i].taxRates[k].rate,
            name: invoiceItems[j].Name,
            total: invoiceItems[j].TotalAmount,
            quantity: invoiceItems[j].Quantity,
          });
        }
      }
    }
  }

  const taxLabelsFiltered = [...new Set(taxLabelsArr)]
  const invoiceItemLabelsFiltered = [...new Set(invoiceItemLabelsArr)]

  const notValidItems =  _.difference(invoiceItemLabelsFiltered,taxLabelsFiltered);

  if(notValidItems.length > 0){
    throw new Error("There are invalid elements submitted!")
  }

  for (let i = 0; i < calculatedTaxList.length; i++) {
    // daje zbir svih rateove itema

    let totalRate = calculatedTaxList.reduce(
      (total, curr) =>
        total +
        (calculatedTaxList[i].name === curr.name &&
        calculatedTaxList[i].categoryType == curr.categoryType
          ? curr.rate
          : 0),
      0
    );

    let sumOnTotalRates = calculatedTaxList.reduce(
      (total, curr) =>
        total +
        (calculatedTaxList[i].name === curr.name && curr.categoryType == 1
          ? curr.rate
          : 0),
      0
    );

    switch (calculatedTaxList[i].categoryType) {
      case 0:
        const cat0Amount = bigDecimal.round(((calculatedTaxList[i].total / (1 + sumOnTotalRates / 100)) * (calculatedTaxList[i].rate / (100 + totalRate))), 4, 5)
        calculatedTaxList[i].amount = Number(cat0Amount)

       // calculatedTaxList[i].amount = ((calculatedTaxList[i].total / (1 + sumOnTotalRates / 100)) * (calculatedTaxList[i].rate / (100 + totalRate)))
        updateFinalTaxList(calculatedTaxList[i]);

        break;
      case 1:
        const cat1Amount = bigDecimal.round(((calculatedTaxList[i].total / (1 + totalRate / 100)) * (calculatedTaxList[i].rate / 100)), 4, 5);
        calculatedTaxList[i].amount = Number(cat1Amount);

        updateFinalTaxList(calculatedTaxList[i]);
        break;
      case 2:
        let cat2Amount = bigDecimal.round((calculatedTaxList[i].total -(calculatedTaxList[i].total -calculatedTaxList[i].rate * calculatedTaxList[i].quantity)), 4, 5)
        
        calculatedTaxList[i].amount = Number(cat2Amount);

        updateFinalTaxList(calculatedTaxList[i]);
        break;
    }
  }

  const group =  _.groupBy(finalTaxListArray, taxItem => taxItem.orderId)

  const sumOfTaxCategories: TaxCategoryAmountInterface[] = Object.entries(group).map(([key, value]) => ({orderId: Number(key), amount: value.reduce((acc, curr) => Number(bigDecimal.round(acc+curr.amount, 4,5)), 0)}))

  const filteredTaxListArray: InvoiceTaxItemResponseInterface[] = finalTaxListArray.map((itm) => ({categoryType: itm.categoryType, label: itm.label, amount: itm.amount, rate: itm.rate, categoryName: itm.categoryName}))
  const finalResult: InvoiceTax = {invoiceTaxItems: filteredTaxListArray, taxCategoryAmounts: sumOfTaxCategories, taxGroupRevision: itemWithLastValidDate.groupId}
  return finalResult
};

export { calculateTax };
