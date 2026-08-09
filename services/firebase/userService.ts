import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { UserProfile } from "../../types/user";

export async function fetchUserProfile(uid: string) {
  try {
    const snap = await getDoc(doc(db, "users", uid));

    if (!snap.exists()) {
      console.warn("User profile missing!");
      return null;
    }

    const data = snap.data() as UserProfile;
    // Normalize at the Firestore boundary: legacy user docs predate the
    // favorites field, but the type declares it non-optional.
    return { ...data, favorites: data.favorites ?? [] };
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, data);
  }

export async function setRecipeFavorite(
  uid: string,
  recipeId: string,
  favorite: boolean
): Promise<void> {
  // arrayUnion/arrayRemove are idempotent, so a double-tap race can't
  // corrupt the list.
  await updateDoc(doc(db, "users", uid), {
    favorites: favorite ? arrayUnion(recipeId) : arrayRemove(recipeId),
  });
}