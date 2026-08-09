import { Recipe } from "../types/recipe";

export type RecipeField =
  | "title"
  | "description"
  | "category"
  | "difficulty"
  | "timeInMinutes"
  | "byWho"
  | "ingredients"
  | "steps";

export type RecipeValidationErrors = Partial<Record<RecipeField, string>>;

const ALL_FIELDS: RecipeField[] = [
  "title",
  "description",
  "category",
  "difficulty",
  "timeInMinutes",
  "byWho",
  "ingredients",
  "steps",
];

const VALIDATORS: Record<RecipeField, (draft: Partial<Recipe>) => string | undefined> = {
  title: (d) => (!d.title?.trim() ? "יש להזין שם מתכון" : undefined),
  description: (d) => (!d.description?.trim() ? "יש להזין תיאור" : undefined),
  category: (d) => (!d.category ? "יש לבחור קטגוריה" : undefined),
  difficulty: (d) => (!d.difficulty ? "יש לבחור רמת קושי" : undefined),
  timeInMinutes: (d) =>
    !Number.isFinite(d.timeInMinutes) || (d.timeInMinutes as number) <= 0
      ? "יש להזין זמן הכנה תקין"
      : undefined,
  byWho: (d) => (!d.byWho?.trim() ? "יש להזין את שם הכותב" : undefined),
  ingredients: (d) =>
    !d.ingredients?.some((i) => i.name.trim()) ? "יש להוסיף לפחות רכיב אחד" : undefined,
  steps: (d) =>
    !d.steps?.some((s) => s.text.trim()) ? "יש להוסיף לפחות שלב הכנה אחד" : undefined,
};

export function validateRecipeFields(
  draft: Partial<Recipe>,
  fields: RecipeField[]
): RecipeValidationErrors {
  const errors: RecipeValidationErrors = {};
  for (const field of fields) {
    const message = VALIDATORS[field](draft);
    if (message) errors[field] = message;
  }
  return errors;
}

export function validateRecipe(draft: Partial<Recipe>): {
  valid: boolean;
  errors: RecipeValidationErrors;
} {
  const errors = validateRecipeFields(draft, ALL_FIELDS);
  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Trims strings, drops empty ingredient/step rows, renumbers step order,
 * and strips undefined values (Firestore updateDoc rejects undefined).
 */
export function sanitizeRecipeDraft(draft: Partial<Recipe>): Partial<Recipe> {
  const clean: Partial<Recipe> = { ...draft };

  if (clean.title !== undefined) clean.title = clean.title.trim();
  if (clean.description !== undefined) clean.description = clean.description.trim();
  if (clean.byWho !== undefined) clean.byWho = clean.byWho.trim();
  if (clean.recipeLink !== undefined) clean.recipeLink = clean.recipeLink.trim();

  if (clean.ingredients !== undefined) {
    clean.ingredients = clean.ingredients
      .filter((i) => i.name.trim())
      .map((i) => ({ name: i.name.trim(), amount: i.amount.trim() }));
  }

  if (clean.steps !== undefined) {
    clean.steps = clean.steps
      .filter((s) => s.text.trim())
      .map((s, index) => ({ order: index + 1, text: s.text.trim() }));
  }

  for (const key of Object.keys(clean) as (keyof Recipe)[]) {
    if (clean[key] === undefined) delete clean[key];
  }

  return clean;
}
