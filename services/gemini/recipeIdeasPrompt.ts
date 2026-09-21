import { ResponseSchema, Schema, SchemaType } from "@google/generative-ai";

import { Category } from "../../types/enums/category";
import { Difficulty } from "../../types/enums/diffucalty";
import { Relative } from "../../types/enums/relatives";
import {
  AiRecipeRequest,
  IDEAS_COUNT,
  MAX_CHIP_CHARS,
  MAX_INGREDIENT_CHIPS,
  MAX_WISH_CHARS,
} from "../../types/aiIdeas";

/**
 * Pure prompt + schema for recipe ideas. Kept free of Expo imports so it can
 * be exercised outside the app.
 *
 * Enum lists come straight from the enums, so they cannot drift from what
 * the app can store (unlike the hand-copied literals in RECIPE_FIELDS).
 */

const stringEnum = (values: string[]): Schema => ({
  type: SchemaType.STRING,
  format: "enum",
  enum: values,
});

const stringArray: Schema = {
  type: SchemaType.ARRAY,
  items: { type: SchemaType.STRING },
};

const RECIPE_IDEAS_SCHEMA: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    recipes: {
      type: SchemaType.ARRAY,
      minItems: IDEAS_COUNT,
      maxItems: IDEAS_COUNT,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          category: stringEnum(Object.values(Category)),
          difficulty: stringEnum(Object.values(Difficulty)),
          relatives: {
            type: SchemaType.ARRAY,
            items: stringEnum(Object.values(Relative)),
          },
          timeInMinutes: { type: SchemaType.INTEGER },
          ingredients: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                name: { type: SchemaType.STRING },
                amount: { type: SchemaType.STRING },
              },
              required: ["name", "amount"],
            },
          },
          // Plain strings: the client numbers them, so order can't go wrong.
          steps: stringArray,
          usedIngredients: stringArray,
          missingIngredients: stringArray,
        },
        required: [
          "title",
          "description",
          "category",
          "difficulty",
          "relatives",
          "timeInMinutes",
          "ingredients",
          "steps",
          "usedIngredients",
          "missingIngredients",
        ],
      },
    },
  },
  required: ["recipes"],
};

/**
 * Declared as a plain const (not a GenerationConfig literal) so the untyped
 * thinkingConfig key below does not trip excess-property checks.
 */
export const IDEAS_GENERATION_CONFIG = {
  responseMimeType: "application/json",
  responseSchema: RECIPE_IDEAS_SCHEMA,
  // Variety between "הצעות אחרות" regenerations
  temperature: 1.0,
  // Three Hebrew recipes run ~3-5k tokens; a truncated body is invalid JSON
  maxOutputTokens: 8192,
  // Not in the 0.24.1 typings, but generationConfig is passed through
  // verbatim to v1beta (same precedent as `tools: [{ urlContext: {} }]`).
  // 0 turns thinking off and saves several seconds per call. Delete this key
  // if the API answers 400 on device; raise it if recipe quality feels weak.
  thinkingConfig: { thinkingBudget: 0 },
};

export function buildIdeasPrompt(
  request: AiRecipeRequest,
  avoidTitles: string[] = []
): string {
  const blocks: string[] = [];

  blocks.push(
    `You are a creative home-cooking assistant for a Hebrew family recipe app.
Propose exactly ${IDEAS_COUNT} distinct, complete, realistic recipes. Make them meaningfully different from each other (technique, cuisine, or main component).`
  );

  if (request.mode === "fridge") {
    // Caps are enforced by the input screen too; repeated here so the prompt
    // stays bounded no matter where a request came from.
    const ingredients = request.ingredients
      .slice(0, MAX_INGREDIENT_CHIPS)
      .map((name) => name.slice(0, MAX_CHIP_CHARS));
    blocks.push(
      `The user has these ingredients: ${ingredients.join(", ")}.
Prefer recipes that use as many of them as possible. Pantry staples (salt, pepper, oil, water, sugar, flour, common dried spices) are assumed available and are never "missing".
Each recipe may need up to 3 extra ingredients; list those in missingIngredients. In usedIngredients, repeat the user's exact wording for the ingredients the recipe uses.`
    );
  } else {
    blocks.push(
      `The user wants: """${request.wish.slice(0, MAX_WISH_CHARS)}"""
Propose recipes that match this wish.`
    );
  }

  const constraints: string[] = [];
  if (request.category) {
    constraints.push(`Every recipe's category must be "${request.category}".`);
  }
  if (request.relatives.length > 0) {
    constraints.push(`Every recipe must be suitable for: ${request.relatives.join(", ")}.`);
  }
  if (request.maxTimeInMinutes) {
    constraints.push(
      `Every recipe's total timeInMinutes must be ${request.maxTimeInMinutes} minutes or less.`
    );
  }
  if (constraints.length > 0) blocks.push(constraints.join("\n"));

  if (avoidTitles.length > 0) {
    blocks.push(
      `Do not repeat these recipes the user already saw: ${avoidTitles.join(", ")}.`
    );
  }

  const rules = [
    "Output rules:",
    "- All text in Hebrew.",
    '- Amounts as short Israeli household measures (כוסות, כפות, כפיות, גרם), e.g. "2 כפות", for 4 servings.',
    "- 4 to 8 concise imperative steps, each a single string.",
    "- description: 1-2 appetizing sentences.",
    "- timeInMinutes: total time as an integer.",
    `- relatives: only tags that truly apply (subset of ${Object.values(Relative).join(", ")}).`,
    `- category: one of ${Object.values(Category).join(", ")}; difficulty: one of ${Object.values(Difficulty).join(", ")}.`,
    request.mode === "wish"
      ? "- usedIngredients and missingIngredients must be empty arrays."
      : null,
    "Return ONLY valid JSON, no markdown, no explanation.",
  ].filter((line): line is string => line !== null);
  blocks.push(rules.join("\n"));

  return blocks.join("\n\n");
}
