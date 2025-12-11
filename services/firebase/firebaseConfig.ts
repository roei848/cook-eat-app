import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: replace with your Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyCbJlh_062a2pOwcdMyyjhKgDsokc4Ruwg",
  authDomain: "cook-eat-app-88800.firebaseapp.com",
  projectId: "cook-eat-app-88800",
  storageBucket: "cook-eat-app-88800.firebasestorage.app",
  messagingSenderId: "963986344144",
  appId: "1:963986344144:web:c27a06dcc7e35daa9ab6d5",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(firebaseApp);

// Google provider
export const googleProvider = new GoogleAuthProvider();

// Firestore
export const db = getFirestore(firebaseApp);
