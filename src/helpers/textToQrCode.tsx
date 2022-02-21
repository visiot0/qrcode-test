import QRCode from "qrcode";
import { encode as btoa } from "base-64";

export const stringToImageURL = async (str: string) => {
  let res = await QRCode.toString(str, {
    type: "utf8",
    errorCorrectionLevel: "L",
    width: 100,
  });
  return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(res)));
};
