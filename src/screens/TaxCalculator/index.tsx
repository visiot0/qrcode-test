import { calculateTax, InvoiceTax, ListOfTaxLists } from "helpers/calculateTax";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import dataJson from "./data.json";
import { Divider } from "components";

export interface TaxItemInterface {
  name: string;
  categoryType: string | number;
  taxRates: TaxRateInterface[];
  orderId: number;
}

export interface TaxRateInterface {
  rate: number;
  label: string;
}
const listaPoreza: ListOfTaxLists[] = dataJson;

export interface InvoiceItemRequestInterface {
  Gtin?: string;
  Name: string;
  Quantity: number;
  UnitPrice: number;
  Labels: string[];
  TotalAmount: number;
}

const stavkeRacuna: InvoiceItemRequestInterface[] =[{"Name":"Item0","Quantity":81.855,"UnitPrice":267.31,"Labels":["N","T","A"],"TotalAmount":21880.66},{"Name":"Item1","Quantity":78.522,"UnitPrice":10.75,"Labels":["E","Ж"],"TotalAmount":844.11},{"Name":"Item2","Quantity":77.918,"UnitPrice":184.78,"Labels":["F","N","E","T"],"TotalAmount":14397.69}]

const TaxCalculator = () => {
  const [tax, setTax] = useState<InvoiceTax>();
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.btn}
        onPress={() => {
          setTax(calculateTax(listaPoreza, stavkeRacuna, new Date("2022-03-24T23:00:00Z")));
        }}
      >
        <Text>Izracunaj</Text>
      </Pressable>
      <Divider />
      <Text>{JSON.stringify(tax)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "gray",
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  btn: { backgroundColor: "lightgray", borderRadius: 7, padding: 8 },
});
export default TaxCalculator;
