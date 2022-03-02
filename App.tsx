import React from "react";
import { useEffect } from "react";
import QrGenerator from "screens/QrGenerator";
import TaxCalculator from "screens/TaxCalculator";
import SplashScreen from "react-native-splash-screen";

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return <TaxCalculator />;
};

export default App;
