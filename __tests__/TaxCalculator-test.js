import "react-native";
import { calculateTax } from "helpers/calculateTax";

export const taxData = [
  {
    "validFrom": "2021-12-19T23:00:00Z",
    "groupId": 5,
    "taxCategories": [
      {
        "name": "ECAL",
        "categoryType": 0,
        "taxRates": [
          {
            "rate": 11.00,
            "label": "F"
          }
        ],
        "orderId": 1
      },
      {
        "name": "N-TAX",
        "categoryType": 0,
        "taxRates": [
          {
            "rate": 0.00,
            "label": "N"
          }
        ],
        "orderId": 2
      },
      {
        "name": "PBL",
        "categoryType": 2,
        "taxRates": [
          {
            "rate": 0.50,
            "label": "P"
          }
        ],
        "orderId": 3
      },
      {
        "name": "STT",
        "categoryType": 0,
        "taxRates": [
          {
            "rate": 6.00,
            "label": "E"
          }
        ],
        "orderId": 4
      },
      {
        "name": "TOTL",
        "categoryType": 1,
        "taxRates": [
          {
            "rate": 2.00,
            "label": "T"
          }
        ],
        "orderId": 5
      },
      {
        "name": "VAT",
        "categoryType": 0,
        "taxRates": [
          {
            "rate": 9.00,
            "label": "A"
          },
          {
            "rate": 0.00,
            "label": "B"
          },
          {
            "rate": 19.00,
            "label": "Ж"
          }
        ],
        "orderId": 6
      },
      {
        "name": "VAT-EXCL",
        "categoryType": 0,
        "taxRates": [
          {
            "rate": 0.00,
            "label": "C"
          }
        ],
        "orderId": 7
      }
    ]
  },
  {
    "validFrom": "2021-07-22T09:55:24Z",
    "groupId": 2,
    "taxCategories": [
      {
        "name": "ECAL",
        "categoryType": 0,
        "taxRates": [
          {
            "rate": 11.00,
            "label": "F"
          }
        ],
        "orderId": 1
      },
      {
        "name": "N-TAX",
        "categoryType": 0,
        "taxRates": [
          {
            "rate": 0.00,
            "label": "N"
          }
        ],
        "orderId": 2
      },
      {
        "name": "PBL",
        "categoryType": 2,
        "taxRates": [
          {
            "rate": 0.50,
            "label": "P"
          }
        ],
        "orderId": 3
      },
      {
        "name": "STT",
        "categoryType": 0,
        "taxRates": [
          {
            "rate": 6.00,
            "label": "E"
          }
        ],
        "orderId": 4
      },
      {
        "name": "TOTL",
        "categoryType": 1,
        "taxRates": [
          {
            "rate": 2.00,
            "label": "T"
          }
        ],
        "orderId": 5
      },
      {
        "name": "VAT",
        "categoryType": 0,
        "taxRates": [
          {
            "rate": 9.00,
            "label": "A"
          },
          {
            "rate": 0.00,
            "label": "B"
          }
        ],
        "orderId": 6
      },
      {
        "name": "VAT-EXCL",
        "categoryType": 0,
        "taxRates": [
          {
            "rate": 0.00,
            "label": "C"
          }
        ],
        "orderId": 7
      }
    ]
  },
  {
    "validFrom": "2021-07-15T23:08:09Z",
    "groupId": 1,
    "taxCategories": [
      {
        "name": "ECAL",
        "categoryType": 0,
        "taxRates": [
          {
            "rate": 10.00,
            "label": "F"
          }
        ],
        "orderId": 1
      },
      {
        "name": "N-TAX",
        "categoryType": 0,
        "taxRates": [
          {
            "rate": 0.00,
            "label": "N"
          }
        ],
        "orderId": 2
      },
      {
        "name": "PBL",
        "categoryType": 2,
        "taxRates": [
          {
            "rate": 0.50,
            "label": "P"
          }
        ],
        "orderId": 3
      },
      {
        "name": "STT",
        "categoryType": 0,
        "taxRates": [
          {
            "rate": 6.00,
            "label": "E"
          }
        ],
        "orderId": 4
      },
      {
        "name": "TOTL",
        "categoryType": 1,
        "taxRates": [
          {
            "rate": 2.00,
            "label": "T"
          }
        ],
        "orderId": 5
      },
      {
        "name": "VAT",
        "categoryType": 0,
        "taxRates": [
          {
            "rate": 9.00,
            "label": "A"
          },
          {
            "rate": 0.00,
            "label": "B"
          }
        ],
        "orderId": 6
      },
      {
        "name": "VAT-EXCL",
        "categoryType": 0,
        "taxRates": [
          {
            "rate": 0.00,
            "label": "C"
          }
        ],
        "orderId": 7
      }
    ]
  }
];

// TEST 1
describe("TEST 1", () => {
  it("Mock functions", () => {
    const result = calculateTax(taxData, [
      {
        Name: "Item0",
        Quantity: 50.913,
        UnitPrice: 666.02,
        Labels: ["E", "T"],
        TotalAmount: 33909.08,
      },
    ], new Date());

    expect(JSON.stringify(result.invoiceTaxItems.reverse())).toMatch(
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

// TEST 2
describe("TEST 2", () => {
  it("Mock functions", () => {
    const result = calculateTax(taxData, [{"Name":"Item0","Quantity":51.767,"UnitPrice":536.22,"Labels":["F","N", "A","C"],"TotalAmount":27758.5},{"Name":"Item1","Quantity":93.688,"UnitP rice":520.64,"Labels":["F"],"TotalAmount":48777.72},{"Name":"Item2","Qua ntity":5.691,"UnitPrice":547.23,"Labels":["F","N","P","T","B","Ж","C"], "TotalAmount":3114.29},{"Name":"Item3","Quantity":24.724,"UnitPrice":656.35,"Labels":["F","E","T","A"],"TotalAmount":16227.6}]);

    expect(JSON.stringify(result.invoiceTaxItems)).toMatch(
      JSON.stringify([{"categoryType":0,"label":"F","amount":9025.3880,"rate":11.00,"category Name":"ECAL"},{"categoryType":0,"label":"N","amount":0.0000,"rate":0.00, "categoryName":"N-TAX"},{"categoryType":0,"label":"A","amount":3218.2741 ,"rate":9.00,"categoryName":"VAT"},{"categoryType":0,"label":"C","amount ":0.0000,"rate":0.00,"categoryName":"VAT-EXCL"},{"categoryType":1,"label ":"T","amount":379.1969,"rate":2.00,"categoryName":"TOTL"},{"categoryTyp e":2,"label":"P","amount":2.8455,"rate":0.50,"categoryName":"PBL"},{"cat egoryType":0,"label":"B","amount":0.0000,"rate":0.00,"categoryName":"VAT "},{"categoryType":0,"label":"Ж","amount":445.8329,"rate":19.00,"catego ryName":"VAT"},{"categoryType":0,"label":"E","amount":757.5910,"rate":6.00,"categoryName":"STT"}])
    );
  });
});

// TEST 3
describe("TEST 3", () => {
  it("Mock functions", () => {
    const result = calculateTax(taxData, [{"Name":"Item0","Quantity":81.855,"UnitPrice":267.31,"Labels":["N","T", "A"],"TotalAmount":21880.66},{"Name":"Item1","Quantity":78.522,"UnitPric e":10.75,"Labels":["E","Ж"],"TotalAmount":844.11},{"Name":"Item2","Quan tity":77.918,"UnitPrice":184.78,"Labels":["F","N","E","T"],"TotalAmount" :14397.69}]);

    expect(JSON.stringify(result.invoiceTaxItems)).toMatch(
      JSON.stringify([{"categoryType":1,"label":"T","amount":711.3402,"rate":2.00,"categoryNa me":"TOTL"},{"categoryType":0,"label":"N","amount":0.0000,"rate":0.00,"c ategoryName":"N-TAX"},{"categoryType":0,"label":"A","amount":1771.2353," rate":9.00,"categoryName":"VAT"},{"categoryType":0,"label":"E","amount": 764.3831,"rate":6.00,"categoryName":"STT"},{"categoryType":0,"label":"Ж ","amount":128.3047,"rate":19.00,"categoryName":"VAT"},{"categoryType":0 ,"label":"F","amount":1327.0872,"rate":11.00,"categoryName":"ECAL"}])
    );
  });
});


