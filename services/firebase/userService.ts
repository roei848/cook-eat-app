import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { UserProfile } from "../../types/user";

export async function fetchUserProfile(uid: string) {
  try {
    const snap = await getDoc(doc(db, "users", uid));

    if (!snap.exists()) {
      console.warn("User profile missing!");
      return null;
    }

    return snap.data() as UserProfile;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, data);
  }