// src/config/firebase.ts

import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  GoogleAuthProvider,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbJlh_062a2pOwcdMyyjhKgDsokc4Ruwg",
  authDomain: "cook-eat-app-88800.firebaseapp.com",
  projectId: "cook-eat-app-88800",
  storageBucket: "cook-eat-app-88800.firebasestorage.app",
  messagingSenderId: "963986344144",
  appId: "1:963986344144:web:c27a06dcc7e35daa9ab6d5",
};

// Initialize Firebase App
export const firebaseApp = initializeApp(firebaseConfig);

// 🔥 Initialize Auth with React Native persistence
export const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Firestore
export const db = getFirestore(firebaseApp);
