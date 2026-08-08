import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  writeBatch,
} from "firebase/firestore";

import { db } from "./firebaseConfig";
import { GroceryItem, NewGroceryItem } from "../../types/grocery";

function groceryCollection(uid: string) {
  return collection(db, "users", uid, "grocery");
}

// Firestore rejects undefined values — include source fields only when present
function toPayload(item: NewGroceryItem) {
  return {
    name: item.name.trim(),
    amount: item.amount.trim(),
    checked: false,
    createdAt: new Date().getTime(),
    ...(item.sourceRecipeId
      ? {
          sourceRecipeId: item.sourceRecipeId,
          sourceRecipeTitle: item.sourceRecipeTitle ?? "",
        }
      : {}),
  };
}

export function subscribeToGrocery(
  uid: string,
  onChange: (items: GroceryItem[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(groceryCollection(uid), orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: GroceryItem[] = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as GroceryItem)
      );

      onChange(items);
    },
    onError
  );
}

export async function addGroceryItem(uid: string, item: NewGroceryItem) {
  try {
    const ref = doc(groceryCollection(uid));
    await setDoc(ref, toPayload(item));
    return ref.id;
  } catch (error) {
    console.error("Error adding grocery item:", error);
    return null;
  }
}

export async function addGroceryItems(uid: string, items: NewGroceryItem[]) {
  if (items.length === 0) return;

  try {
    const batch = writeBatch(db);
    items.forEach((item) => {
      batch.set(doc(groceryCollection(uid)), toPayload(item));
    });
    await batch.commit();
  } catch (error) {
    console.error("Error adding grocery items:", error);
  }
}

export async function setGroceryItemChecked(
  uid: string,
  itemId: string,
  checked: boolean
) {
  await updateDoc(doc(db, "users", uid, "grocery", itemId), { checked });
}

export async function deleteGroceryItem(uid: string, itemId: string) {
  await deleteDoc(doc(db, "users", uid, "grocery", itemId));
}

export async function deleteGroceryItems(uid: string, itemIds: string[]) {
  if (itemIds.length === 0) return;

  try {
    const batch = writeBatch(db);
    itemIds.forEach((itemId) => {
      batch.delete(doc(db, "users", uid, "grocery", itemId));
    });
    await batch.commit();
  } catch (error) {
    console.error("Error deleting grocery items:", error);
  }
}
