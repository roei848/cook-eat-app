import Constants from "expo-constants";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Recipe } from "../../types/recipe";

function getApiKey(): string {
  const key = Constants.expoConfig?.extra?.geminiApiKey as string | undefined;
  if (!key) throw new Error("GEMINI_API_KEY not configured");
  return key;
}

function parseJsonResponse(text: string): Record<string, unknown> {
  // Strip markdown code fences if Gemini returns them despite instructions
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  return JSON.parse(cleaned);
}

const IMAGE_PROMPT = `You are a recipe extraction assistant. The image shows a handwritten Hebrew recipe.
Extract all recipe information and return a JSON object with these fields:
title (string), description (string), ingredients (array of {name, amount}),
steps (array of {order, text}), timeInMinutes (number), difficulty (one of: "קל","בינוני","קשה"),
category (one of: "מרק","סלט","מנה ראשונה","תוספת","מנה עיקרית","קינוח","משקה","אחר"),
relatives (array, subset of: "צמחוני","טבעוני","ללא גלוטן","ללא חלב","דיאט").
Return ONLY valid JSON, no markdown, no explanation.`;

const urlPrompt = (url: string) =>
  `You are a recipe extraction assistant. Visit this URL and extract the recipe:
${url}

Return a JSON object with these fields:
title (string), description (string), ingredients (array of {name, amount}),
steps (array of {order, text}), timeInMinutes (number), difficulty (one of: "קל","בינוני","קשה"),
category (one of: "מרק","סלט","מנה ראשונה","תוספת","מנה עיקרית","קינוח","משקה","אחר"),
relatives (array, subset of: "צמחוני","טבעוני","ללא גלוטן","ללא חלב","דיאט"),
imageUrl (string, the main recipe image URL from the page if found).
Return ONLY valid JSON, no markdown, no explanation.`;

export async function analyzeRecipeImage(
  base64Image: string
): Promise<Partial<Recipe>> {
  const genAI = new GoogleGenerativeAI(getApiKey());
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

export async function parseRecipeFromUrl(
  url: string
): Promise<Partial<Recipe> & { imageUrl?: string }> {
  const genAI = new GoogleGenerativeAI(getApiKey());
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: urlPrompt(url) }] }],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tools: [{ urlContext: {} }] as any,
  });

  const parsed = parseJsonResponse(result.response.text());
  return parsed as Partial<Recipe> & { imageUrl?: string };
}
