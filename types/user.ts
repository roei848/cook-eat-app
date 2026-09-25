export interface UserProfile {
  uid: string; // Firestore UID
  name: string;
  email: string;
  /** Firestore stores `null` for "no avatar" (it rejects `undefined`). */
  avatarUrl?: string | null;
  favorites: string[]; // list of recipe IDs
  createdAt: number;
  darkMode: boolean;
}
