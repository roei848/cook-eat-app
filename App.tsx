import { useEffect } from "react";
import { I18nManager } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { RootState, store } from "./store/store";
import RootNavigator from "./screens/RootNavigator";
import { setRecipes, setSubscribed } from "./store/recipeSlice";
import { subscribeToRecipes } from "./services/firebase/recipeService";

function AppBootstrap() {
  const dispatch = useDispatch();
  const subscribed = useSelector(
    (state: RootState) => state.recipes.subscribed
  );

  useEffect(() => {
    // Only subscribe if we haven't already
    if (subscribed) return;

    const unsubscribe = subscribeToRecipes(
      (recipes) => {
        dispatch(setRecipes(recipes));
        dispatch(setSubscribed(true)); // Move this inside!
      },
      (error) => {
        console.error("❌ Snapshot Error:", error);
      }
    );

    return () => unsubscribe();
  }, [dispatch, subscribed]);

  useEffect(() => {
    if (!I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppBootstrap />
    </Provider>
  );
}
