import { Category } from "./enums/category";
import { Relative } from "./enums/relatives";
import { Difficulty } from "./enums/diffucalty";

export interface RecipeNote {
  id: string;
  text: string;
  authorUid: string;
  authorName: string;
  createdAt: number;
}

/**
 * Firestore holds legacy plain-string notes alongside new note objects.
 * Both shapes coexist permanently — there is no backfill.
 */
export type StoredNote = string | RecipeNote;

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Step {
  order: number;
  text: string;
}

export interface Recipe {
  id?: string; // Firestore ID
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: Step[];
  imageUrl?: string;
  category: Category;
  relatives: Relative[];
  difficulty: Difficulty;
  timeInMinutes: number;
  byWho: string;
  createdAt: number;
  notes?: StoredNote[];
  recipeLink?: string;
  handwrittenRecipeImg?: string;
}
