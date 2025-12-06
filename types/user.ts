export interface User {
  id: string; // Firestore UID
  name: string;
  email: string;
  avatarUrl?: string;
  favorites: string[]; // list of recipe IDs
  createdAt: number;
}
