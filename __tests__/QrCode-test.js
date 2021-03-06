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

describe("Testing string to qrcode", () => {
  it("Mock functions", async () => {
    const result = await stringToImageURL("FUNCTION");
    expect(result).toMatch(
      "data:image/gif;base64,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"
    );
  });
});
