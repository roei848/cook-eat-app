# Cook & Eat

A Hebrew-first recipe app built with React Native (Expo) and Firebase. Browse, search, and manage recipes with real-time sync, dark mode support, and a fully RTL interface.

## Tech Stack

- **Framework:** React Native 0.81 via Expo SDK 54
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Navigation:** React Navigation (bottom tabs + native stacks)
- **Animations:** React Native Reanimated

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator

### Installation

```bash
git clone https://github.com/roei848/cook-eat-app.git
cd cook-eat-app
npm install
```

### Running the App

```bash
npx expo start --tunnel         # Start dev server (scan QR with Expo Go)
```

## Project Structure

```
├── App.tsx                  # Entry point — Redux Provider, RTL setup, navigation
├── screens/                 # All app screens
│   ├── Screen.tsx           # Shared screen wrapper (SafeArea, theming)
│   └── rootScreens/         # Authenticated screens
│       ├── HomeScreen.tsx
│       ├── SearchScreen.tsx
│       ├── AddRecipeScreen.tsx
│       ├── GroceryScreen.tsx
│       ├── ProfileScreen.tsx
│       └── sharedScreens/
│           └── RecipeScreen.tsx
├── components/              # Reusable UI components
│   ├── category/
│   ├── recipe/
│   ├── search/
│   ├── profile/
│   └── ui/
├── store/                   # Redux slices (auth, user, recipes)
├── services/firebase/       # Firebase services (auth, recipes, users, storage)
├── theme/                   # Light/dark color system
├── types/                   # TypeScript interfaces & enums
└── mocks/                   # Hebrew seed data
```

## Navigation

```
RootNavigator (auth-gated)
├── AppTabs (authenticated)
│   ├── Home
│   ├── Search → Category → Recipe
│   ├── Add Recipe
│   ├── Grocery
│   └── Profile
└── AuthStack (unauthenticated)
    ├── Login
    ├── Register
    └── Forgot Password
```

## Features

- Firebase Authentication (email/password)
- Real-time recipe sync via Firestore `onSnapshot`
- Recipe search and filtering by category
- Image upload for recipes
- Dark mode (persisted per user in Firestore)
- Full Hebrew RTL layout
- Grocery list management

## Release build (Android APK)

Users install the app from the download page at <https://roei848.github.io/cook-eat-app/> (the `gh-pages` branch). The page links to the stable URL <https://github.com/roei848/cook-eat-app/releases/latest/download/cook-eat.apk> and reads the version, size and date from the latest GitHub release.

### Signing

Release builds are signed with a dedicated keystore that lives outside git in `credentials/` (gitignored):

```
credentials/
├── cook-eat-release.keystore   # PKCS12, alias "cook-eat"
└── keystore.properties         # storeFile, keyAlias, storePassword, keyPassword
```

`plugins/withReleaseSigning.js` wires that file into the generated `android/app/build.gradle` on every prebuild. When the folder is missing, release builds fall back to the template debug keystore, which is fine for local testing but produces an APK that cannot update an install signed with the real key.

**Back up `credentials/` somewhere safe (password manager, private drive).** If it is lost, existing installs cannot be updated in place.

### Build

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
npx expo prebuild --platform android --clean
cd android && ./gradlew :app:assembleRelease -PreactNativeArchitectures=arm64-v8a,armeabi-v7a
# -> android/app/build/outputs/apk/release/app-release.apk
```

The x86 ABIs are left out on purpose; they are only needed for emulators.

### Publish a new version

1. Bump `version` and increment `android.versionCode` in `app.config.js`, then build as above.
2. Create the release. The asset must be a file literally named `cook-eat.apk` so the stable link keeps working:
   ```bash
   cp android/app/build/outputs/apk/release/app-release.apk /tmp/cook-eat.apk
   gh release create vX.Y.Z /tmp/cook-eat.apk --title "Cook & Eat X.Y.Z" --notes "What changed"
   ```
3. Nothing else to do: the download page picks up the new release automatically.

## License

This project is private and not licensed for public use.
