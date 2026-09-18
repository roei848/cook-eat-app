import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

export async function uploadProfileImage(uid: string, uri: string) {
  const response = await fetch(uri);
  if (!response.ok) throw new Error("Failed to fetch image");

  const blob = await response.blob();
  if (!blob || blob.size === 0) throw new Error("Invalid blob");

  const ext = uri.split(".").pop() || "jpg";
  const imageRef = ref(storage, `profileImages/${uid}/avatar.${ext}`);

  await uploadBytes(imageRef, blob, {
    contentType: blob.type || "image/jpeg",
  });

  return await getDownloadURL(imageRef);
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/**
 * File extension for the Storage object name. Remote URLs frequently have
 * none (`.../photo?w=800`, `.../images/abc`), where a naive split would
 * yield "com/photo" — fall back to jpg instead.
 */
function imageExtension(uri: string): string {
  const candidate = uri.split("?")[0].split("#")[0].split(".").pop() ?? "";
  return /^[a-z0-9]{2,5}$/i.test(candidate) ? candidate.toLowerCase() : "jpg";
}

export async function uploadRecipeImage(uri: string): Promise<string> {
  const response = await fetch(uri);
  if (!response.ok) throw new Error("Failed to fetch image");

  const blob = await response.blob();
  if (!blob || blob.size === 0) throw new Error("Invalid blob");

  const ext = imageExtension(uri);
  const imageRef = ref(storage, `recipeImages/${generateId()}.${ext}`);

  await uploadBytes(imageRef, blob, {
    contentType: blob.type || "image/jpeg",
  });

  return await getDownloadURL(imageRef);
}

export async function uploadHandwrittenRecipeImage(uri: string): Promise<string> {
  const response = await fetch(uri);
  if (!response.ok) throw new Error("Failed to fetch image");

  const blob = await response.blob();
  if (!blob || blob.size === 0) throw new Error("Invalid blob");

  const ext = imageExtension(uri);
  const imageRef = ref(storage, `handwrittenRecipes/${generateId()}.${ext}`);

  await uploadBytes(imageRef, blob, {
    contentType: blob.type || "image/jpeg",
  });

  return await getDownloadURL(imageRef);
}
