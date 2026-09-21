import { Recipe } from "./recipe";
import { Category } from "./enums/category";
import { Relative } from "./enums/relatives";

export type AiIdeasMode = "fridge" | "wish";

/** Serializable — it travels as a route param. Never put functions here. */
export interface AiRecipeRequest {
  mode: AiIdeasMode;
  /** Fridge mode: the user's ingredient chips. Empty in wish mode. */
  ingredients: string[];
  /** Wish mode: what the user feels like cooking. Empty in fridge mode. */
  wish: string;
  category?: Category;
  /** Empty means no dietary constraint. */
  relatives: Relative[];
  maxTimeInMinutes?: number;
}

export interface AiRecipeOption {
  /** Client-generated per fetch, so a regenerate never collides with a saved id. */
  id: string;
  /**
   * title, description, ingredients, steps, difficulty, category, relatives,
   * byWho (always AI_AUTHOR_NAME) and timeInMinutes when the model gave a
   * usable one. Never imageUrl — there is no photo to point at.
   */
  recipe: Partial<Recipe>;
  /** Fridge mode only: which of the user's chips this recipe uses. */
  usedIngredients: string[];
  /** Fridge mode only: what the user would still need to buy. */
  missingIngredients: string[];
}

/** Credited in the recipe's "מאת" field; also groups these on Home's spotlight. */
export const AI_AUTHOR_NAME = "Gemini";

export const MAX_INGREDIENT_CHIPS = 20;
export const MAX_CHIP_CHARS = 30;
export const MAX_WISH_CHARS = 300;
// "פיצה" is a perfectly good wish — only reject empty or accidental input.
export const MIN_WISH_CHARS = 3;
export const MIN_FRIDGE_INGREDIENTS = 2;
export const MAX_TIME_MINUTES = 600;
export const IDEAS_COUNT = 3;
