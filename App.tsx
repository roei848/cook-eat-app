import { useEffect } from "react";
import { I18nManager, Platform } from "react-native";
import * as Updates from "expo-updates";

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

        // Required for the change to fully apply
        if (Platform.OS !== "web") {
          await Updates.reloadAsync();
        }
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
