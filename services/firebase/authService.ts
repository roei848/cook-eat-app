import { auth } from "./firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithCredential,
  signOut,
  GoogleAuthProvider,
  UserCredential,
} from "firebase/auth";
import { createUserProfile } from "./userService";
import { requestGoogleIdToken, signOutOfGoogle } from "./googleSignIn";

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
  await createUserProfile({ uid: userCredential.user.uid, name, email });
};

/**
 * Google Sign-In. Resolves with the credential, or `null` when the user
 * dismissed the account picker (callers should stay quiet in that case).
 *
 * The Firestore profile for first-time Google users is created by the auth
 * listener in RootNavigator (ensureUserProfile), which runs for every
 * sign-in, so nothing here depends on winning a race with it.
 */
export const loginWithGoogle = async (): Promise<UserCredential | null> => {
  const idToken = await requestGoogleIdToken();
  if (!idToken) return null;

  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
};

export const resetPassword = async (email: string) => {
  return sendPasswordResetEmail(auth, email.trim(), {
    url: "https://cook-eat-app-88800.firebaseapp.com",
    handleCodeInApp: false,
  });
};


export const logout = async (): Promise<void> => {
  await signOutOfGoogle();
  return signOut(auth);
};
