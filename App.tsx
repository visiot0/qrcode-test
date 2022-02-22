import React, { useEffect, useState } from "react";
import {
  TextInput,
  Pressable,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  View
} from "react-native";
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
      </View>
      <Pressable
        style={localStyles.btn}
        onPress={async () => {
          setBase64(await stringToImageURL(qr));
        }}
      >
        <Text>Generisi QR Code</Text>
      </Pressable>
      <Text>NOTE: Pritiskom na base64 string isti će biti kopiran u vaš clipboard.</Text>
      <Divider/>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="always"
      >
        <Pressable
          onPress={() => {
            Clipboard.setString(base64);
            setBase64("")
            setQr("")
            Alert.alert("BASE64 copied!")
          }}
        >
          <Text>{base64}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  btn: {backgroundColor:'lightgray', borderRadius: 7, padding: 8},
  container: {
    backgroundColor: "#EFEFEF",
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
