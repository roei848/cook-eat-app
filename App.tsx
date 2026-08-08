import { useEffect } from "react";
import { I18nManager, View } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { SuezOne_400Regular } from "@expo-google-fonts/suez-one";
import {
  Assistant_400Regular,
  Assistant_500Medium,
  Assistant_600SemiBold,
  Assistant_700Bold,
  Assistant_800ExtraBold,
} from "@expo-google-fonts/assistant";

import { RootState, store } from "./store/store";
import RootNavigator from "./screens/RootNavigator";
import Loader from "./components/shared/Loader";
import { useThemeColors } from "./theme/useThemeColors";
import { setRecipes, setSubscribed } from "./store/recipeSlice";
import { subscribeToRecipes } from "./services/firebase/recipeService";
import {
  setGroceryItems,
  setGrocerySubscribed,
  setGroceryError,
  clearGrocery,
} from "./store/grocerySlice";
import { subscribeToGrocery } from "./services/firebase/groceryService";

function AppBootstrap() {
  const dispatch = useDispatch();
  const subscribed = useSelector(
    (state: RootState) => state.recipes.subscribed
  );
  const uid = useSelector((state: RootState) => state.auth.user?.uid);

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
    if (!uid) {
      dispatch(clearGrocery());
      return;
    }

    const unsubscribe = subscribeToGrocery(
      uid,
      (items) => {
        dispatch(setGroceryItems(items));
        dispatch(setGrocerySubscribed(true));
        dispatch(setGroceryError(null));
      },
      (error) => {
        console.error("❌ Grocery snapshot error:", error);
        dispatch(setGrocerySubscribed(true));
        dispatch(setGroceryError(error.message));
      }
    );

    return () => unsubscribe();
  }, [dispatch, uid]);

  useEffect(() => {
    if (!I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }
  }, []);

  // Gate rendering on the brand fonts so no screen ever paints with the
  // system font. On a font error we proceed with system fonts rather than
  // blocking the app.
  const [fontsLoaded, fontError] = useFonts({
    SuezOne_400Regular,
    Assistant_400Regular,
    Assistant_500Medium,
    Assistant_600SemiBold,
    Assistant_700Bold,
    Assistant_800ExtraBold,
  });

  if (!fontsLoaded && !fontError) {
    return <FontGate />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function FontGate() {
  const colors = useThemeColors();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background.default,
      }}
    >
      <Loader size={180} />
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppBootstrap />
    </Provider>
  );
}
