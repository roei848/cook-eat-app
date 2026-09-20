import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

const LOCAL_URI = /^(file|content):\/\//i;

/**
 * Reads an image into a Blob for upload.
 *
 * Local picker URIs (file:// and content://) go through React Native's own
 * XMLHttpRequest instead of the global fetch. Since Expo SDK 57 the global
 * fetch is expo/fetch, whose Android file handler opens the percent-encoded
 * path literally and answers 404 for Expo Go's "%40anonymous%2F…" cache
 * directory and for any path with spaces or non-ASCII characters. RN's XHR is
 * served by the native Blob module, which resolves the URI correctly on both
 * platforms. Remote URLs (hotlinked recipe photos) still use fetch.
 */
async function readImageBlob(uri: string): Promise<Blob> {
  const blob = LOCAL_URI.test(uri) ? await readLocalBlob(uri) : await readRemoteBlob(uri);
  if (!blob || blob.size === 0) throw new Error("Invalid blob");
  return blob;
}

function readLocalBlob(uri: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = () => resolve(xhr.response as Blob);
    xhr.onerror = () => reject(new Error(`Failed to read image file: ${uri}`));
    xhr.open("GET", uri, true);
    xhr.send();
  });
}

async function readRemoteBlob(uri: string): Promise<Blob> {
  const response = await fetch(uri);
  if (!response.ok) throw new Error(`Failed to fetch image (${response.status})`);
  return response.blob();
}

export async function uploadProfileImage(uid: string, uri: string) {
  const blob = await readImageBlob(uri);

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
  const blob = await readImageBlob(uri);

  const ext = imageExtension(uri);
  const imageRef = ref(storage, `recipeImages/${generateId()}.${ext}`);

  await uploadBytes(imageRef, blob, {
    contentType: blob.type || "image/jpeg",
  });

  return await getDownloadURL(imageRef);
}

export async function uploadHandwrittenRecipeImage(uri: string): Promise<string> {
  const blob = await readImageBlob(uri);

  const ext = imageExtension(uri);
  const imageRef = ref(storage, `handwrittenRecipes/${generateId()}.${ext}`);

  await uploadBytes(imageRef, blob, {
    contentType: blob.type || "image/jpeg",
  });

  return await getDownloadURL(imageRef);
}
