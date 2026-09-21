# cook-eat-app

A React Native (Expo) recipe app with Firebase backend, Hebrew RTL support, and real-time Firestore sync.

## Commands

```bash
npx expo start           # Start Expo dev server (opens QR code)
npx expo start --ios     # Open iOS simulator
npx expo start --android # Open Android emulator
npx expo start --web     # Open in browser (limited)
```

No test runner configured.

## Architecture

```
App.tsx          → Redux Provider > AppBootstrap > NavigationContainer > RootNavigator
RootNavigator    → Watches Firebase auth state → AppTabs (authed) or AuthStack (unauthed)
AppTabs          → Bottom tabs: Home | SearchTab | AddRecipe | Grocery | Profile
SearchStack      → Search → Category → RecipeScreen (shared)
AddRecipeStack   → MethodPicker → (Manual: Step1 → Step2 → Step3) | ImageCapture | UrlInput | FreeTextInput | (AiIdeasInput → AiIdeasResults) → RecipeReview
ProfileStack     → Profile
AuthStack        → Login → Register → ForgotPassword
```

**Key directories:**
- `screens/` — Navigation screens
- `screens/rootScreens/addRecipe/` — Full add-recipe wizard (Container/Presenter pairs per screen)
- `components/recipe/form/` — Wizard form inputs (CategoryPicker, IngredientEditor, StepEditor, etc.)
- `components/ai/` — AI ideas flow UI (IngredientChipsInput, AiRecipeOptionCard)
- `components/` — Other reusable UI (category, profile, search, ui)
- `store/` — Redux slices (auth, user, recipes)
- `services/firebase/` — Firebase services (auth, recipes, userService, grocery, storage)
- `services/gemini/` — Gemini AI: `geminiClient.ts` (shared model/key/JSON helpers), `geminiService.ts` (extraction), `recipeIdeasPrompt.ts` + `recipeIdeasService.ts` (generation)
- `theme/` — Light/dark color system + `useThemeColors()` hook
- `types/` — TypeScript interfaces + enums (Hebrew values)
- `mocks/` — Hebrew seed data for Firebase

## State Management (Redux)

Four slices in `store/`:
- `authSlice` — `{ user: { uid, email } | null }` — actions: `setUser`, `logoutUser`
- `userSlice` — `{ profile: UserProfile | null }` — actions: `setProfile`, `clearProfile`, `setDarkMode`, `setFavorites`
- `recipeSlice` — `{ items: Recipe[], subscribed: boolean }` — actions: `setRecipes`, `setSubscribed`, `clearRecipes`
- `grocerySlice` — `{ items, subscribed, error }` — per-user `users/{uid}/grocery` subcollection, synced in `App.tsx`

## Firebase

- Firestore collections: `users/`, `recipes/`
- Auth persistence via AsyncStorage (users stay logged in across restarts)
- Real-time recipe sync via `onSnapshot()` in `recipeService.ts`
- Recipe listener lives in `App.tsx`, keyed on the signed-in `uid` (one per session); `subscribed` in recipeSlice only means "first snapshot arrived" and gates screen loaders

## Key Patterns

### Screen wrapper
All screens use `<Screen>` from [screens/Screen.tsx](screens/Screen.tsx) — handles SafeArea, background color, status bar theming.

### Theming
Use `useThemeColors()` hook ([theme/useThemeColors.ts](theme/useThemeColors.ts)) to get the current color palette. Dark mode is persisted in Firestore and synced via Redux `userSlice.darkMode`.

### Shared RecipeScreen
[screens/rootScreens/sharedScreens/RecipeScreen.tsx](screens/rootScreens/sharedScreens/RecipeScreen.tsx) is reused across SearchStack and other stacks.

## AI Integration (Gemini)

`services/gemini/` uses `@google/generative-ai` with model `gemini-2.5-flash` (shared helpers in `geminiClient.ts`).

Extraction (`geminiService.ts`), each returning one `Partial<Recipe>`:
- `analyzeRecipeImage(base64)` — extracts a Hebrew recipe from a handwritten photo
- `parseRecipeFromUrl(url)` — fetches and parses a recipe from a URL (uses `urlContext` tool)
- `parseRecipeFromText(text)` — parses a recipe from pasted free text (social captions, messages); the UrlInput error state links here as a fallback

Generation (`recipeIdeasService.ts`, prompt + schema in `recipeIdeasPrompt.ts`):
- `generateRecipeIdeas(request, { signal, avoidTitles })` — one call, 3 complete recipes from fridge ingredients or a free-text wish, returned as `AiRecipeOption[]` (`types/aiIdeas.ts`). The only call using `responseSchema` JSON mode; `utils/aiRecipeIdeas.ts` normalizes the response (enum fallbacks, step numbering) and holds the pure form validation.

All results are passed to `RecipeReview` for user confirmation before saving. Saves that came from an AI option `popTo` the results screen (via the `aiOrigin` param) instead of resetting to MethodPicker.

**API key**: set `GEMINI_API_KEY` in `.env` → read via `app.config.js` `extra.geminiApiKey` → accessed with `Constants.expoConfig.extra.geminiApiKey`. Never hardcoded.

## Plugins

Active plugins in `.claude/settings.json`:

| Plugin | Purpose |
|--------|---------|
| `superpowers` | Brainstorming, TDD, planning, debugging, code review skills |
| `ui-ux-pro-max` | 50 UI styles, design system, component generation |
| `frontend-design` | Distinctive production-grade React Native UI |
| `typescript-lsp` | TypeScript language server integration |
| `claude-md-management` | Audit and update CLAUDE.md files |
| `context7` | Live library/framework documentation lookup |

## Agents

Project agents live in `.claude/agents/`:

| Agent | File | Purpose |
|-------|------|---------|
| `@chef` | `agents/chef.md` | Creates new recipes — gathers details, builds a valid `Recipe` object, saves to Firestore via `createRecipe()` |
| `@react-architect` | `agents/react-architect.md` | Builds React Native components following Container/Presenter pattern with TypeScript and strict architecture rules |

## Gotchas

- **RTL forced**: `App.tsx` calls `I18nManager.forceRTL(true)` — all layouts are right-to-left for Hebrew
- **Firebase credentials**: Hardcoded in `services/firebase/firebaseConfig.ts` — not environment-controlled
- **Gemini API key**: Must be in `.env` as `GEMINI_API_KEY` and exposed via `app.config.js` `extra` — throws at runtime if missing
- **Hebrew everywhere**: Enums in `types/enums/` (category, difficulty, relatives) use Hebrew values; mock data in `mocks/recipes.ts` is Hebrew
- **New Architecture**: always on since Expo SDK 55 (the `newArchEnabled` config key no longer exists) — the project is on SDK 57, use only libraries compatible with it
- **No tests**: No testing framework configured
- **No error boundaries**: No root-level error handling
