import { useEffect } from "react";
import { I18nManager } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { RootState, store } from "./store/store";
import RootNavigator from "./screens/RootNavigator";
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
