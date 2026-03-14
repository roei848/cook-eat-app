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
ProfileStack     → Profile
AuthStack        → Login → Register → ForgotPassword
```

**Key directories:**
- `screens/` — Navigation screens (18 files)
- `components/` — Reusable UI components (category, profile, recipe, search, ui)
- `store/` — Redux slices (auth, user, recipes)
- `services/firebase/` — Firebase services (auth, recipes, users, storage)
- `theme/` — Light/dark color system + `useThemeColors()` hook
- `types/` — TypeScript interfaces + enums (Hebrew values)
- `mocks/` — Hebrew seed data for Firebase

## State Management (Redux)

Three slices in `store/`:
- `authSlice` — `{ user: { uid, email } | null }` — actions: `setUser`, `logoutUser`
- `userSlice` — `{ profile: UserProfile | null }` — actions: `setProfile`, `clearProfile`, `setDarkMode`
- `recipeSlice` — `{ items: Recipe[], subscribed: boolean }` — actions: `setRecipes`, `setSubscribed`, `clearRecipes`

## Firebase

- Firestore collections: `users/`, `recipes/`
- Auth persistence via AsyncStorage (users stay logged in across restarts)
- Real-time recipe sync via `onSnapshot()` in `recipeService.ts`
- `subscribed` flag in recipeSlice prevents duplicate Firestore listeners

## Key Patterns

### Screen wrapper
All screens use `<Screen>` from [screens/Screen.tsx](screens/Screen.tsx) — handles SafeArea, background color, status bar theming.

### Theming
Use `useThemeColors()` hook ([theme/useThemeColors.ts](theme/useThemeColors.ts)) to get the current color palette. Dark mode is persisted in Firestore and synced via Redux `userSlice.darkMode`.

### Shared RecipeScreen
[screens/rootScreens/sharedScreens/RecipeScreen.tsx](screens/rootScreens/sharedScreens/RecipeScreen.tsx) is reused across SearchStack and other stacks.

## Agents

Project agents live in `.claude/agents/`:

| Agent | File | Purpose |
|-------|------|---------|
| `@chef` | `agents/chef.md` | Creates new recipes — gathers details, builds a valid `Recipe` object, saves to Firestore via `createRecipe()` |
| `@react-architect` | `agents/react-architect.md` | Builds React Native components following Container/Presenter pattern with TypeScript and strict architecture rules |

## Gotchas

- **RTL forced**: `App.tsx` calls `I18nManager.forceRTL(true)` — all layouts are right-to-left for Hebrew
- **Firebase credentials**: Hardcoded in `services/firebase/firebaseConfig.ts` — not environment-controlled
- **Hebrew everywhere**: Enums in `types/enums/` (category, difficulty, relatives) use Hebrew values; mock data in `mocks/recipes.ts` is Hebrew
- **New Architecture**: `app.json` has `newArchEnabled: true` — use Expo SDK 54+ compatible libraries only
- **No tests**: No testing framework configured
- **No error boundaries**: No root-level error handling
