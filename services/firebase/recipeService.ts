import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  updateDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

import { auth, db } from "./firebaseConfig";
import { Recipe } from "../../types/recipe";

export function subscribeToRecipes(
  onChange: (recipes: Recipe[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(collection(db, "recipes"), orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const recipes: Recipe[] = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : data.createdAt,
          ...data,
        } as Recipe;
      });

      onChange(recipes);
    },
    onError
  );
}

/**
 * Fetch single recipe by id
 */
export async function fetchRecipe(recipeId: string) {
  const snap = await getDoc(doc(db, "recipes", recipeId));

  if (!snap.exists()) {
    console.warn("Recipe not found!");
    return null;
  }

  return {
    id: snap.id,
    ...snap.data(),
  } as Recipe;
}

/**
 * Fetch all recipes (for Search / Home)
 */
export async function fetchRecipes() {
  const querySnap = await getDocs(collection(db, "recipes"));

  return querySnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Recipe[];
}

/**
 * Create new recipe
 */
export async function createRecipe(
  data: Omit<Recipe, "id" | "createdAt">
): Promise<string | null> {
  try {
    const ref = doc(collection(db, "recipes"));

    await setDoc(ref, {
      ...data,
      authorId: auth.currentUser?.uid,
      createdAt: new Date().getTime(),
    });

    return ref.id;
  } catch (error) {
    console.error("Error creating recipe:", error);
    return null;
  }
}

/**
 * Update recipe
 */
export async function updateRecipe(recipeId: string, data: Partial<Recipe>) {
  const ref = doc(db, "recipes", recipeId);
  await updateDoc(ref, data);
}
