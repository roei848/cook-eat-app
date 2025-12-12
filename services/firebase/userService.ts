import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { UserProfile } from "@firebase/auth";

export async function fetchUserProfile(uid: string) {
  const snap = await getDoc(doc(db, "users", uid));

  if (!snap.exists()) {
    console.warn("User profile missing!");
    return null;
  }

  return snap.data() as UserProfile;
}
