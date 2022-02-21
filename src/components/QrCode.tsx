import React from "react";
import { useRef } from "react";
import { View, Text, Pressable } from "react-native";
import QRCode, { QRCodeProps } from "react-native-qrcode-svg";

interface Props {
  qr: string;
  ecl: "L" | "M";
}

type dataURLCallback = (data: string) => void;
interface QrCodeRef {
  toDataURL: (callback: dataURLCallback) => void;
}
const QrCodeComp = ({ qr, ecl }: Props) => {
  const qrRef = useRef<QrCodeRef>();
  const getStr = () => {
    console.log("CURRENT", qrRef.current);
    //Stavio bih odgovarajuci tip, ali ulazio sam u paketic i tamo je tip any
    qrRef.current?.toDataURL((data) => {
      console.log("DATA", "data:image/gif;base64,", data);
    });
  };
  return (
    <Pressable onPress={getStr}>
      <QRCode
        value={qr}
        size={250}
        ecl={ecl}
        getRef={(r) => (qrRef.current = r)}
      />
    </Pressable>
  );
};

export default QrCodeComp;
