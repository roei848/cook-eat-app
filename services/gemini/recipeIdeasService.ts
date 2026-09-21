import { AiRecipeOption, AiRecipeRequest } from "../../types/aiIdeas";
import { normalizeAiRecipeOptions } from "../../utils/aiRecipeIdeas";
import { createGeminiModel, parseJsonResponse } from "./geminiClient";
import { buildIdeasPrompt, IDEAS_GENERATION_CONFIG } from "./recipeIdeasPrompt";

// Three full Hebrew recipes take a while even with thinking off
const REQUEST_TIMEOUT_MS = 60_000;

export interface GenerateRecipeIdeasOptions {
  /** Abort when the results screen unmounts or the user leaves mid-request. */
  signal?: AbortSignal;
  /** Titles from earlier batches, so "הצעות אחרות" really are other ideas. */
  avoidTitles?: string[];
}

/**
 * One call, three complete recipes as option cards. Throws on any failure
 * (missing key, network, unusable JSON, zero valid recipes); the screen owns
 * the Hebrew messaging, like the other Gemini flows.
 */
export async function generateRecipeIdeas(
  request: AiRecipeRequest,
  { signal, avoidTitles = [] }: GenerateRecipeIdeasOptions = {}
): Promise<AiRecipeOption[]> {
  const model = createGeminiModel(IDEAS_GENERATION_CONFIG);

  const result = await model.generateContent(
    {
      contents: [
        { role: "user", parts: [{ text: buildIdeasPrompt(request, avoidTitles) }] },
      ],
    },
    { signal, timeout: REQUEST_TIMEOUT_MS }
  );

  const ideas = normalizeAiRecipeOptions(
    parseJsonResponse(result.response.text()),
    request
  );
  if (ideas.length === 0) throw new Error("Gemini returned no usable recipes");
  return ideas;
}
