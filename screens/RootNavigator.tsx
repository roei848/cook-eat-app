// src/navigation/RootNavigator.tsx

import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../services/firebase/firebaseConfig";

import { setUser } from "../store/authSlice";
import { RootState } from "../store/store";
import AppTabs from "./AppTabs";
import AuthStack from "./authStack";

export default function RootNavigator() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      dispatch(setUser(firebaseUser ? firebaseUser : null));
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? <AppTabs /> : <AuthStack />;
}
