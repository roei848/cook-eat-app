import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../services/firebase/firebaseConfig";

import { logoutUser, setUser } from "../store/authSlice";
import { RootState } from "../store/store";
import AppTabs from "./AppTabs";
import AuthStack from "./AuthStack";
import { fetchUserProfile } from "../services/firebase/userService";
import { clearProfile, setProfile } from "../store/userSlice";

export default function RootNavigator() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Listen to Firebase authentication state
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Update auth state in Redux
        dispatch(setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
        }));

        // Load user profile from Firestore
        const profile = await fetchUserProfile(firebaseUser.uid);
        if (profile) {
          dispatch(
            setProfile({
              uid: firebaseUser.uid,
              name: profile.name,
              email: profile.email,
              avatarUrl: profile.avatarUrl,
              favorites: profile.favorites,
              createdAt: profile.createdAt,
              darkMode: profile.darkMode,
            })
          );
        } else {
          dispatch(logoutUser());
          dispatch(clearProfile());
        }
      } else {
        // Clear Redux on logout
        dispatch(logoutUser());
        dispatch(clearProfile());
      }

      setInitializing(false);
    });

    return unsubscribe; // cleanup listener
  }, [dispatch]);

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? <AppTabs /> : <AuthStack />;
}
