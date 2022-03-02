import React, { useEffect } from "react";
import SplashScreen from "react-native-splash-screen";
import TaxCalculator from "screens/TaxCalculator";

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return <TaxCalculator />;
};

export default App;
