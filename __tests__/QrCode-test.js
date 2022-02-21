import "react-native";
import React from "react";
import QrCode from "components/QrCode";
import renderer from "react-test-renderer";
import { stringToImageURL } from "helpers/textToQrCode";

test("Qr code screen test", () => {
  const tree = renderer.create(<QrCode />).toJSON();
  expect(tree).toMatchSnapshot();
});

describe("Testing string to qrcode", () => {
  it("Mock functions", async () => {
    const result = await stringToImageURL("FUNCTION");

    expect(result).toMatch(/base64/i);
  });
});
