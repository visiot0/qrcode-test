import {
  InvoiceItemRequestInterface,
  TaxItemInterface,
} from "screens/TaxCalculator";

interface CalculatedTaxList {
  categoryType: number | string;
  label: string;
  amount: number;
  rate: number;
  categoryName: string;
  name?: string;
  total: number;
  quantity: number;
}

export interface FinalTaxListItem {
  categoryType: number | string;
  label: string;
  amount: number;
  rate: number;
  categoryName: string;
}

const calculateTax = (
  taxList: TaxItemInterface[],
  invoiceItems: InvoiceItemRequestInterface[]
) => {
  const calculatedTaxList: CalculatedTaxList[] = [];
  const finalTaxListArray: FinalTaxListItem[] = [];

  const updateFinalTaxList = (taxItem: CalculatedTaxList) => {
    const findItemIndex = finalTaxListArray.findIndex(
      (e) => e.label == taxItem.label
    );
    if (findItemIndex != -1) {
      finalTaxListArray[findItemIndex].amount += taxItem.amount;
    } else {
      const finalTaxItem: FinalTaxListItem = {
        categoryType: taxItem.categoryType,
        label: taxItem.label,
        amount: taxItem.amount,
        rate: taxItem.rate,
        categoryName: taxItem.categoryName,
      };

      finalTaxListArray.push(finalTaxItem);
    }
  };

  // let prosloPuta = 0;
  for (let i = 0; i < taxList.length; i++) {
    for (let j = 0; j < invoiceItems.length; j++) {
      for (let k = 0; k < taxList[i].taxRates.length; k++) {
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
        calculatedTaxList[i].amount = parseFloat(
          (
            (calculatedTaxList[i].total / (1 + sumOnTotalRates / 100)) *
            (calculatedTaxList[i].rate / (100 + totalRate))
          ).toFixed(4)
        );
        updateFinalTaxList(calculatedTaxList[i]);

        break;
      case 1:
        calculatedTaxList[i].amount = parseFloat(
          (
            (calculatedTaxList[i].total / (1 + totalRate / 100)) *
            (calculatedTaxList[i].rate / 100)
          ).toFixed(4)
        );

        updateFinalTaxList(calculatedTaxList[i]);
        break;
      case 2:
        let itmTotal = parseFloat(
          (
            calculatedTaxList[i].total -
            (calculatedTaxList[i].total -
              calculatedTaxList[i].rate * calculatedTaxList[i].quantity)
          ).toFixed(4)
        );
        calculatedTaxList[i].amount = itmTotal;

        updateFinalTaxList(calculatedTaxList[i]);
        break;
    }
  }
  return finalTaxListArray;
};

export { calculateTax };
