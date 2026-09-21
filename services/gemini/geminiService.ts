import { Recipe } from "../../types/recipe";
import { createGeminiModel, parseJsonResponse } from "./geminiClient";
import {
  fetchRecipePageMetadata,
  RecipePageMetadata,
} from "../web/recipePageMetadata";

// The Hebrew literals mirror the Category / Difficulty / Relative enum values.
const RECIPE_FIELDS = `title (string), description (string), ingredients (array of {name, amount}),
steps (array of {order, text}), timeInMinutes (number), difficulty (one of: "קל","בינוני","קשה"),
category (one of: "מרק","סלט","מנה ראשונה","תוספת","מנה עיקרית","קינוח","משקה","אחר"),
relatives (array, subset of: "צמחוני","טבעוני","ללא גלוטן","ללא חלב","דיאט")`;

const JSON_ONLY = `Return ONLY valid JSON, no markdown, no explanation.`;

const IMAGE_PROMPT = `You are a recipe extraction assistant. The image shows a handwritten Hebrew recipe.
Extract all recipe information and return a JSON object with these fields:
${RECIPE_FIELDS}.
${JSON_ONLY}`;

const URL_OUTPUT_FIELDS = `Return a JSON object with these fields:
${RECIPE_FIELDS},
byWho (string, the person or site the page credits as the recipe's author, exactly as written, or "" if nobody is credited),
imageUrl (string, absolute URL of the main recipe photo on the page, or "" if none).
${JSON_ONLY}`;

// Social captions run ~2k chars; long Facebook posts more. Keep the prompt
// bounded; the paste screen applies the same cap as its input maxLength.
export const MAX_TEXT_CHARS = 10_000;

const textPrompt = (text: string) =>
  `You are a recipe extraction assistant. The text below was copied from a social-media post, a message, or a web page.
It may be in Hebrew or English and may include unrelated content such as hashtags, emojis, personal commentary, or calls to like and follow.
Extract only the recipe and ignore everything else. If the text has no explicit title, compose a short Hebrew title.
Return all text fields in Hebrew, translating when the source is in another language.
Return a JSON object with these fields:
${RECIPE_FIELDS},
byWho (string, the person or page the text credits as the recipe's author, exactly as written, or "" if nobody is credited).
${JSON_ONLY}

Text:
"""
${text.slice(0, MAX_TEXT_CHARS)}
"""`;

// Keep the grounding block bounded — some sites' JSON-LD embeds whole comment threads
const MAX_JSON_LD_CHARS = 12_000;

const urlPrompt = (url: string, recipeJsonLd?: Record<string, unknown>) => {
  const grounding = recipeJsonLd
    ? `
The page publishes this schema.org Recipe structured data. Treat it as the primary source and use the page itself only to fill in what it lacks:
${JSON.stringify(recipeJsonLd).slice(0, MAX_JSON_LD_CHARS)}
`
    : "";

  return `You are a recipe extraction assistant. Visit this URL and extract the recipe:
${url}
${grounding}
${URL_OUTPUT_FIELDS}`;
};

export async function analyzeRecipeImage(
  base64Image: string
): Promise<Partial<Recipe>> {
  const model = createGeminiModel();

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: IMAGE_PROMPT },
        ],
      },
    ],
  });

  const parsed = parseJsonResponse(result.response.text());
  return parsed as Partial<Recipe>;
}

export async function parseRecipeFromUrl(url: string): Promise<Partial<Recipe>> {
  // Read the HTML ourselves first: og:image and the JSON-LD author/photo are
  // invisible to the model's URL tool (it sees rendered text), and they are
  // exact where the model would guess. Fails soft to model-only extraction.
  const metadata = await fetchRecipePageMetadata(url);

  const model = createGeminiModel();

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: urlPrompt(url, metadata.recipeJsonLd) }] }],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tools: [{ urlContext: {} }] as any,
  });

  const parsed = parseJsonResponse(result.response.text());
  return mergeUrlResult(parsed, metadata);
}

export async function parseRecipeFromText(text: string): Promise<Partial<Recipe>> {
  const model = createGeminiModel();

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: textPrompt(text) }] }],
  });

  const parsed = parseJsonResponse(result.response.text());
  return normalizeTextResult(parsed);
}

/**
 * Pasted text has no page to pull a photo from, and an empty byWho is removed
 * rather than kept as "" so the review screen's own default (the current
 * user's name) can apply.
 */
function normalizeTextResult(parsed: Record<string, unknown>): Partial<Recipe> {
  const recipe = { ...(parsed as Partial<Recipe>) };

  const byWho = nonEmptyString(parsed.byWho);
  if (byWho) recipe.byWho = byWho;
  else delete recipe.byWho;

  delete recipe.imageUrl;

  return recipe;
}

/**
 * Page metadata wins over the model's reading of the same fact. Fields the
 * model left empty are removed rather than left as ""/null so the review
 * screen's own defaults (e.g. the current user's name) can apply.
 */
function mergeUrlResult(
  parsed: Record<string, unknown>,
  metadata: RecipePageMetadata
): Partial<Recipe> {
  const recipe = { ...(parsed as Partial<Recipe>) };

  const byWho = metadata.author ?? nonEmptyString(parsed.byWho);
  if (byWho) recipe.byWho = byWho;
  else delete recipe.byWho;

  const imageUrl = metadata.imageUrl ?? httpUrl(parsed.imageUrl);
  if (imageUrl) recipe.imageUrl = imageUrl;
  else delete recipe.imageUrl;

  return recipe;
}

function nonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function httpUrl(value: unknown): string | undefined {
  const text = nonEmptyString(value);
  return text && /^https?:\/\//i.test(text) ? text : undefined;
}
