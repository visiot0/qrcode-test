import { Encoder, ErrorCorrectionLevel, QRByte } from "@nuintun/qrcode";

export const stringToImageURL = async (str: string) => {
  const qrcodeEncoder = new Encoder({
    errorCorrectionLevel: ErrorCorrectionLevel.L,
  });
  qrcodeEncoder.write(new QRByte(str));
  qrcodeEncoder.make();
  return qrcodeEncoder.toDataURL(10);
};
