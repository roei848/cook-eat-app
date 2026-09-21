import Constants from "expo-constants";
import { GenerationConfig, GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "gemini-2.5-flash";

export function getApiKey(): string {
  const key = Constants.expoConfig?.extra?.geminiApiKey as string | undefined;
  if (!key) throw new Error("GEMINI_API_KEY not configured");
  return key;
}

/** One model per call — the SDK client is cheap and holds no connection. */
export function createGeminiModel(generationConfig?: GenerationConfig) {
  const genAI = new GoogleGenerativeAI(getApiKey());
  return genAI.getGenerativeModel({ model: MODEL_NAME, generationConfig });
}

export function parseJsonResponse(text: string): Record<string, unknown> {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error(`Gemini response was not valid JSON: ${cleaned.slice(0, 200)}`);
  }
}
