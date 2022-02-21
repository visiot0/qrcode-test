import React, { useEffect, useState } from "react";
import {
  TextInput,
  Pressable,
  StyleSheet,
  Text,
  ScrollView,
} from "react-native";
import { View } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { Divider } from "components";
import { stringToImageURL } from "helpers/textToQrCode";
import Clipboard from "@react-native-clipboard/clipboard";

const App = () => {
  const [qr, setQr] = useState("");
  const [base64, setBase64] = useState("");
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
      <Pressable
        onPress={async () => {
          setBase64(await stringToImageURL(qr));
        }}
      >
        <Text>Generisi QR Code</Text>
      </Pressable>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="always"
      >
        <Pressable
          onPress={() => {
            Clipboard.setString(base64);
          }}
        >
          <Text>{base64}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: "gray",
    flex: 1,
    padding: 20,
    alignItems: "center",
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
