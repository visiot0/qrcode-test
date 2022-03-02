import { calculateTax } from "helpers/calculateTax";
import React, { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import dataJson from "./data.json";

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
    Quantity: 51.767,
    UnitPrice: 536.22,
    Labels: ["F", "N", "A", "C"],
    TotalAmount: 27758.5,
  },
  {
    Name: "Item1",
    Quantity: 93.688,
    UnitPrice: 520.64,
    Labels: ["F"],
    TotalAmount: 48777.72,
  },
  {
    Name: "Item2",
    Quantity: 5.691,
    UnitPrice: 547.23,
    Labels: ["F", "N", "P", "T", "B", "Ж", "C"],
    TotalAmount: 3114.29,
  },
  {
    Name: "Item3",
    Quantity: 24.724,
    UnitPrice: 656.35,
    Labels: ["F", "E", "T", "A"],
    TotalAmount: 16227.6,
  },
];

const TaxCalculator = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Pressable
        onPress={() => {
          console.log(calculateTax(listaPoreza, stavkeRacuna));
        }}
      >
        <Text>Izracunaj</Text>
      </Pressable>
    </View>
  );
};

export default TaxCalculator;
