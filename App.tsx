import { useEffect } from "react";
import { I18nManager, Platform } from "react-native";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { store } from "./store/store";
import RootNavigator from "./screens/RootNavigator";

export default function App() {
  useEffect(() => {
    const enableRTL = async () => {
      if (!I18nManager.isRTL) {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
      }
    };

    enableRTL();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
