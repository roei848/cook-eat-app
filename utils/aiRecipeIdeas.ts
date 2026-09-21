import { Category } from "../types/enums/category";
import { Difficulty } from "../types/enums/diffucalty";
import { Relative } from "../types/enums/relatives";
import { Ingredient, Recipe, Step } from "../types/recipe";
import {
  AI_AUTHOR_NAME,
  AiIdeasMode,
  AiRecipeOption,
  AiRecipeRequest,
  IDEAS_COUNT,
  MAX_CHIP_CHARS,
  MAX_INGREDIENT_CHIPS,
  MAX_TIME_MINUTES,
  MAX_WISH_CHARS,
  MIN_FRIDGE_INGREDIENTS,
  MIN_WISH_CHARS,
} from "../types/aiIdeas";

/** Quick-add chips for the fridge mode — common Israeli household staples. */
export const STAPLE_SUGGESTIONS = [
  "ביצים",
  "עגבניות",
  "מלפפון",
  "בצל",
  "שום",
  "תפוחי אדמה",
  "אורז",
  "פסטה",
  "עוף",
  "טונה",
  "גבינה צהובה",
  "קוטג׳",
  "חלב",
  "לימון",
  "פלפל",
  "גזר",
];

const CATEGORY_VALUES = new Set<string>(Object.values(Category));
const DIFFICULTY_VALUES = new Set<string>(Object.values(Difficulty));
const RELATIVE_VALUES = new Set<string>(Object.values(Relative));

function nonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const item of value) {
    const text = nonEmptyString(item);
    if (text) out.push(text);
  }
  return out;
}

function toIngredients(value: unknown): Ingredient[] {
  if (!Array.isArray(value)) return [];
  const out: Ingredient[] = [];
  for (const item of value) {
    if (typeof item !== "object" || item === null) continue;
    const { name, amount } = item as Record<string, unknown>;
    const cleanName = nonEmptyString(name);
    if (!cleanName) continue;
    out.push({
      name: cleanName,
      amount: amount == null ? "" : String(amount).trim(),
    });
  }
  return out;
}

// The schema asks for plain strings so the model cannot misnumber steps.
function toSteps(value: unknown): Step[] {
  return stringList(value).map((text, index) => ({ order: index + 1, text }));
}

function toMinutes(value: unknown): number | undefined {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value.trim())
        : NaN;
  return Number.isFinite(n) && n > 0 ? Math.round(n) : undefined;
}

function toRelatives(value: unknown): Relative[] {
  const seen = new Set<string>();
  const out: Relative[] = [];
  for (const item of stringList(value)) {
    if (!RELATIVE_VALUES.has(item) || seen.has(item)) continue;
    seen.add(item);
    out.push(item as Relative);
  }
  return out;
}

function toOption(
  raw: unknown,
  index: number,
  mode: AiIdeasMode,
  batchId: number
): AiRecipeOption | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;

  const title = nonEmptyString(r.title);
  if (!title) return null;
  const ingredients = toIngredients(r.ingredients);
  if (ingredients.length === 0) return null;
  const steps = toSteps(r.steps);
  if (steps.length === 0) return null;

  const recipe: Partial<Recipe> = {
    title,
    description: nonEmptyString(r.description) ?? "",
    ingredients,
    steps,
    category: CATEGORY_VALUES.has(r.category as string)
      ? (r.category as Category)
      : Category.OTHER,
    difficulty: DIFFICULTY_VALUES.has(r.difficulty as string)
      ? (r.difficulty as Difficulty)
      : Difficulty.MEDIUM,
    relatives: toRelatives(r.relatives),
    // The model wrote it, so the model gets the credit — not the person saving
    byWho: AI_AUTHOR_NAME,
  };

  // Left absent (not 0) when unusable so the review form's own "missing"
  // state asks the user to fill it in.
  const timeInMinutes = toMinutes(r.timeInMinutes);
  if (timeInMinutes !== undefined) recipe.timeInMinutes = timeInMinutes;

  const isFridge = mode === "fridge";
  return {
    id: `${batchId}-${index}`,
    recipe,
    usedIngredients: isFridge ? stringList(r.usedIngredients) : [],
    missingIngredients: isFridge ? stringList(r.missingIngredients) : [],
  };
}

/**
 * Turn the model's `{ recipes: [...] }` JSON into option cards, dropping
 * anything that could not become a savable recipe. Enum values the model
 * invented fall back to אחר / בינוני rather than failing the whole batch.
 */
export function normalizeAiRecipeOptions(
  parsed: unknown,
  request: AiRecipeRequest
): AiRecipeOption[] {
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return [];
  }
  const recipes = (parsed as Record<string, unknown>).recipes;
  if (!Array.isArray(recipes)) return [];

  // One id per fetch; the index makes ids within the batch distinct.
  const batchId = Date.now();
  const options: AiRecipeOption[] = [];
  for (const [index, raw] of recipes.entries()) {
    const option = toOption(raw, index, request.mode, batchId);
    if (option) options.push(option);
    if (options.length === IDEAS_COUNT) break;
  }
  return options;
}

const SUMMARY_INGREDIENTS = 3;
const SUMMARY_WISH_CHARS = 60;

/** One-line recap of a request for headers and captions. */
export function summarizeAiRequest(request: AiRecipeRequest): string {
  const parts: string[] = [];

  if (request.mode === "fridge") {
    const shown = request.ingredients.slice(0, SUMMARY_INGREDIENTS).join(", ");
    parts.push(
      request.ingredients.length > SUMMARY_INGREDIENTS ? `${shown} ועוד` : shown
    );
  } else {
    const wish = request.wish.trim();
    parts.push(
      wish.length > SUMMARY_WISH_CHARS
        ? `${wish.slice(0, SUMMARY_WISH_CHARS - 1)}…`
        : wish
    );
  }

  if (request.category) parts.push(request.category);
  if (request.relatives.length > 0) parts.push(request.relatives.join(", "));
  if (request.maxTimeInMinutes) parts.push(`עד ${request.maxTimeInMinutes} דק׳`);

  return parts.filter(Boolean).join(" · ");
}

/** What the input screen holds while the user is typing. */
export interface AiIdeasFormState {
  mode: AiIdeasMode;
  ingredients: string[];
  wish: string;
  category?: Category;
  relatives: Relative[];
  /** Minutes as typed; TimeInput owns a string, parsing happens here. */
  maxTimeText: string;
}

/** Which input an error belongs to, so the screen can show it inline. */
export type AiIdeasErrorField = "ingredients" | "wish" | "maxTime";

export interface AiIdeasInputError {
  message: string;
  field: AiIdeasErrorField;
}

export type BuildAiRequestResult =
  | { request: AiRecipeRequest }
  | { error: string; field: AiIdeasErrorField };

const invalidTime: BuildAiRequestResult = { error: "זמן לא תקין", field: "maxTime" };

/**
 * Validate the form and produce the request the results screen will send.
 * Only the active mode's input is carried over, so a draft left in the other
 * mode never leaks into the prompt.
 */
export function buildAiRecipeRequest(form: AiIdeasFormState): BuildAiRequestResult {
  if (form.mode === "fridge") {
    if (form.ingredients.length < MIN_FRIDGE_INGREDIENTS) {
      return {
        error: `הוסף לפחות ${MIN_FRIDGE_INGREDIENTS} מצרכים`,
        field: "ingredients",
      };
    }
  }

  const wish = form.wish.trim().slice(0, MAX_WISH_CHARS);
  if (form.mode === "wish" && wish.length < MIN_WISH_CHARS) {
    return { error: "ספר לנו קצת יותר על מה שבא לך", field: "wish" };
  }

  const maxTimeText = form.maxTimeText.trim();
  let maxTimeInMinutes: number | undefined;
  if (maxTimeText) {
    if (!/^\d+$/.test(maxTimeText)) return invalidTime;
    const minutes = Number(maxTimeText);
    if (minutes < 1 || minutes > MAX_TIME_MINUTES) return invalidTime;
    maxTimeInMinutes = minutes;
  }

  const request: AiRecipeRequest = {
    mode: form.mode,
    ingredients: form.mode === "fridge" ? form.ingredients : [],
    wish: form.mode === "wish" ? wish : "",
    relatives: form.relatives,
  };
  // Optional keys are added only when set so the param stays clean.
  if (form.category) request.category = form.category;
  if (maxTimeInMinutes !== undefined) request.maxTimeInMinutes = maxTimeInMinutes;

  return { request };
}

export interface AddChipResult {
  ingredients: string[];
  error?: string;
}

const chipKey = (name: string) => name.trim().toLowerCase().replace(/\s+/g, " ");

/**
 * Add a typed or tapped ingredient to the chip list. Blank and duplicate
 * entries are ignored silently; only the hard cap is worth an error.
 */
export function addIngredientChip(ingredients: string[], raw: string): AddChipResult {
  const name = raw.trim().replace(/\s+/g, " ").slice(0, MAX_CHIP_CHARS);
  if (!name) return { ingredients };

  const key = chipKey(name);
  if (ingredients.some((existing) => chipKey(existing) === key)) {
    return { ingredients };
  }
  if (ingredients.length >= MAX_INGREDIENT_CHIPS) {
    return { ingredients, error: `אפשר להוסיף עד ${MAX_INGREDIENT_CHIPS} מצרכים` };
  }
  return { ingredients: [...ingredients, name] };
}
