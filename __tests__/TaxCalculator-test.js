import "react-native";
import { calculateTax } from "helpers/calculateTax";

const taxData = [
  {
    name: "ECAL",
    categoryType: 0,
    taxRates: [
      {
        rate: 11.0,
        label: "F",
      },
    ],
    orderId: 1,
  },
  {
    name: "N-TAX",
    categoryType: 0,
    taxRates: [
      {
        rate: 0.0,
        label: "N",
      },
    ],
    orderId: 2,
  },
  {
    name: "PBL",
    categoryType: 2,
    taxRates: [
      {
        rate: 0.5,
        label: "P",
      },
    ],
    orderId: 3,
  },
  {
    name: "STT",
    categoryType: 0,
    taxRates: [
      {
        rate: 6.0,
        label: "E",
      },
    ],
    orderId: 4,
  },
  {
    name: "TOTL",
    categoryType: 1,
    taxRates: [
      {
        rate: 2.0,
        label: "T",
      },
    ],
    orderId: 5,
  },
  {
    name: "VAT",
    categoryType: 0,
    taxRates: [
      {
        rate: 9.0,
        label: "A",
      },
      {
        rate: 0.0,
        label: "B",
      },
      {
        rate: 19.0,
        label: "Ж",
      },
    ],
    orderId: 6,
  },
  {
    name: "VAT-EXCL",
    categoryType: 0,
    taxRates: [
      {
        rate: 0.0,
        label: "C",
      },
    ],
    orderId: 7,
  },
];

describe("Testing tax function", () => {
  it("Mock functions", () => {
    const result = calculateTax(taxData, [
      {
        Name: "Item0",
        Quantity: 50.913,
        UnitPrice: 666.02,
        Labels: ["E", "T"],
        TotalAmount: 33909.08,
      },
    ]);
    expect(JSON.stringify(result.reverse())).toMatch(
      JSON.stringify([
        {
          categoryType: 1,
          label: "T",
          amount: 664.8839,
          rate: 2.0,
          categoryName: "TOTL",
        },
        {
          categoryType: 0,
          label: "E",
          amount: 1881.7469,
          rate: 6.0,
          categoryName: "STT",
        },
      ])
    );
  });
});
