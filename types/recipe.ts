import { Category } from "./enums/category";
import { Difficulty } from "./enums/diffucalty";
import { Relative } from "./enums/relatives";

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Step {
  order: number;
  text: string;
}

export interface Recipe {
  id: string;
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
}
