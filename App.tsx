import React, { useEffect, useState } from "react";
import { TextInput, Pressable, StyleSheet, Text } from "react-native";
import { View } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { Divider } from "components";
import QRCode from "components/QrCode";
import { stringToImageURL } from "helpers/textToQrCode";

const App = () => {
  const [qr, setQr] = useState("");
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <View style={localStyles.container}>
      <View style={localStyles.textInputContainer}>
        <TextInput
          value={qr}
          onChangeText={setQr}
          placeholderTextColor="gray"
          placeholder="Add value"
          style={localStyles.textInput}
        />
        <Divider size={25} />
      </View>
      <Divider />
      <View style={localStyles.qrContainer}>
        {qr ? <QRCode qr={qr} ecl="L" /> : null}
      </View>
      <Pressable
        onPress={async () => {
          console.log(await stringToImageURL("FUNCTION"));
        }}
      >
        <Text>TEST</Text>
      </Pressable>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: "gray",
    flex: 1,
    padding: 20,
  },
  textInputContainer: {
    height: 100,
    width: "100%",
    alignItems: "center",
  },
  textInput: {
    height: 50,
    backgroundColor: "white",
    width: "100%",
    borderRadius: 10,
    color: "black",
  },
  qrContainer: {
    flex: 1,
    alignItems: "center",
  },
});

export default App;
