import { calculateTax, FinalTaxListItem } from "helpers/calculateTax";
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
const listaPoreza: TaxItemInterface[] = dataJson;

export interface InvoiceItemRequestInterface {
  Gtin?: string;
  Name: string;
  Quantity: number;
  UnitPrice: number;
  Labels: string[];
  TotalAmount: number;
}

const stavkeRacuna: InvoiceItemRequestInterface[] = [
  {
    Name: "Item0",
    Quantity: 50.913,
    UnitPrice: 666.02,
    Labels: ["E", "T"],
    TotalAmount: 33909.08,
  },
];

const TaxCalculator = () => {
  const [tax, setTax] = useState<FinalTaxListItem[]>([]);
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.btn}
        onPress={() => {
          setTax(calculateTax(listaPoreza, stavkeRacuna));
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
