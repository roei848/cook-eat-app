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
