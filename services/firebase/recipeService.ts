import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { auth, db } from "./firebaseConfig";
import { Recipe, RecipeNote, StoredNote } from "../../types/recipe";

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

    // Firestore setDoc throws on undefined values. Optional fields (imageUrl,
    // recipeLink, handwrittenRecipeImg) are legitimately absent depending on
    // which add flow produced the recipe, so drop them like updateRecipe does.
    const payload = Object.fromEntries(
      Object.entries({
        ...data,
        authorId: auth.currentUser?.uid,
        createdAt: new Date().getTime(),
      }).filter(([, value]) => value !== undefined)
    );

    await setDoc(ref, payload);

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
  // Firestore updateDoc throws on undefined values (e.g. a recipe without imageUrl)
  const clean = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );
  const ref = doc(db, "recipes", recipeId);
  await updateDoc(ref, clean);
}

/**
 * Delete recipe permanently
 */
export async function deleteRecipe(recipeId: string) {
  await deleteDoc(doc(db, "recipes", recipeId));
}

/**
 * Append a note. arrayUnion is atomic server-side, so two family members
 * adding notes at the same moment cannot clobber each other — which a
 * read-modify-write through updateRecipe() would.
 *
 * Deliberately does not catch: the caller rolls back its optimistic insert
 * on rejection.
 */
export async function addRecipeNote(recipeId: string, note: RecipeNote) {
  await updateDoc(doc(db, "recipes", recipeId), { notes: arrayUnion(note) });
}

/**
 * Remove a note. `raw` must be the exact value stored in Firestore —
 * arrayRemove matches by deep equality, so a rebuilt object will not match.
 * Pass DisplayNote.raw, never a reconstructed note.
 */
export async function removeRecipeNote(recipeId: string, raw: StoredNote) {
  await updateDoc(doc(db, "recipes", recipeId), { notes: arrayRemove(raw) });
}
