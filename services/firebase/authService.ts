import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  UserCredential,
} from "firebase/auth";

export const loginWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email.trim(), password);
};

export const registerWithEmail = async (
  name: string,
  email: string,
  password: string
): Promise<void> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  await setDoc(doc(db, "users", uid), {
    uid,
    name: name,
    email: email,
    avatarUrl: null,
    createdAt: new Date().getTime(),
    favorites: [],
    darkMode: false,
  });
};

export const resetPassword = async (email: string) => {
  return sendPasswordResetEmail(auth, email.trim(), {
    url: "https://cook-eat-app-88800.firebaseapp.com",
    handleCodeInApp: false,
  });
};


export const logout = async (): Promise<void> => {
  return signOut(auth);
};
