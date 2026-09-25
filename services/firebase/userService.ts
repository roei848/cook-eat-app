import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  runTransaction,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import type { User as FirebaseUser } from "firebase/auth";
import { db } from "./firebaseConfig";
import { UserProfile } from "../../types/user";
import { buildNewProfile, profileFromAuthUser } from "../../utils/userProfile";

/** Normalize at the Firestore boundary: legacy user docs predate `favorites`. */
function normalizeProfile(data: UserProfile): UserProfile {
  return { ...data, favorites: data.favorites ?? [] };
}

export async function fetchUserProfile(uid: string) {
  try {
    const snap = await getDoc(doc(db, "users", uid));

    if (!snap.exists()) {
      console.warn("User profile missing!");
      return null;
    }

    return normalizeProfile(snap.data() as UserProfile);
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
}

/** Creates (overwrites) the profile document. Used by email registration. */
export async function createUserProfile(input: {
  uid: string;
  name: string;
  email: string;
}): Promise<UserProfile> {
  const profile = buildNewProfile(input);
  await setDoc(doc(db, "users", input.uid), profile);
  return profile;
}

/**
 * Get-or-create in one transaction, so a concurrent registration write can
 * never be clobbered. Provider sign-ins (Google) have no registration form,
 * so this is where their profile is born, seeded from the provider's
 * name / email / photo.
 */
export async function ensureUserProfile(user: FirebaseUser): Promise<UserProfile | null> {
  const ref = doc(db, "users", user.uid);
  try {
    return await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      if (snap.exists()) {
        return normalizeProfile(snap.data() as UserProfile);
      }
      const profile = profileFromAuthUser(user);
      tx.set(ref, profile);
      return profile;
    });
  } catch (error) {
    console.error("Failed to ensure user profile:", error);
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
