export interface GroceryItem {
  id: string; // Firestore ID
  name: string;
  amount: string;
  checked: boolean;
  sourceRecipeId?: string;
  sourceRecipeTitle?: string;
  createdAt: number;
}

export type NewGroceryItem = Omit<GroceryItem, "id" | "checked" | "createdAt">;
