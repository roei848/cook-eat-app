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
npx expo run:android            # Build & launch the dev build on the emulator/device
npx expo start                  # Metro only, once a dev build is installed
```

The app includes native modules (Google Sign-In, release signing), so it runs in a development build rather than Expo Go.

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

- Firebase Authentication (email/password, Google Sign-In)
- Real-time recipe sync via Firestore `onSnapshot`
- Recipe search and filtering by category
- Image upload for recipes
- Dark mode (persisted per user in Firestore)
- Full Hebrew RTL layout
- Grocery list management

## Google Sign-In setup

Google login uses [`@react-native-google-signin/google-signin`](https://react-native-google-signin.github.io/docs/) (the free "original" API) to get a Google ID token, which is exchanged for a Firebase session with `signInWithCredential`. It is a native module: it works in development builds (`npx expo run:android`) and release APKs, **not in Expo Go**. First-time Google users get their `users/{uid}` profile created automatically from their Google name, email and photo.

### One-time console setup

1. **Firebase console → Authentication → Sign-in method**: enable the **Google** provider.
2. **Firebase console → Project settings → Your apps → Android app** (`com.roei848.cookeatapp`; add it if missing): add **both** SHA-1 fingerprints below. Google needs an OAuth client for every signing key that will run the app, otherwise sign-in fails with `DEVELOPER_ERROR` (code 10).

   | Keystore | SHA-1 |
   |----------|-------|
   | Debug (`android/app/debug.keystore`, used by `expo run:android`) | `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25` |
   | Release (`credentials/cook-eat-release.keystore`, used by the APK) | `EA:33:56:88:6A:D4:3D:12:1A:6A:74:D5:88:4C:2F:3E:27:19:F7:00` |

   To recompute them after a keystore change:
   ```bash
   keytool -list -v -keystore android/app/debug.keystore -storepass android -alias androiddebugkey | grep SHA1
   keytool -list -v -keystore credentials/cook-eat-release.keystore -alias cook-eat | grep SHA1
   ```
3. **Web client ID**: in the Google provider settings (step 1) expand *Web SDK configuration* and copy the **Web client ID** (it looks like `963986344144-xxxx.apps.googleusercontent.com`). Put it in `.env`:
   ```
   GOOGLE_WEB_CLIENT_ID=963986344144-xxxx.apps.googleusercontent.com
   ```
   `app.config.js` exposes it as `extra.googleWebClientId`; the app throws a clear error on the Google button if it is missing. See `.env.example`.
4. Rebuild the native app so the module is linked:
   ```bash
   export ANDROID_HOME="$HOME/Library/Android/sdk"
   npx expo prebuild --platform android --clean
   npx expo run:android
   ```
   `prebuild --clean` deletes `android/local.properties`, so without `ANDROID_HOME` in your shell the next Gradle run fails with "SDK location not found". Either export it in `~/.zshrc` or recreate the file: `echo "sdk.dir=$HOME/Library/Android/sdk" > android/local.properties`.

No `google-services.json` is needed: the app uses the Firebase JS SDK, and the Google Sign-In config plugin is only added for iOS (see below).

### iOS (when an iOS build is added)

Create an OAuth client of type **iOS** for the bundle identifier in the Firebase/Google Cloud console and set `GOOGLE_IOS_CLIENT_ID` in `.env`. `app.config.js` then adds the config plugin with the matching `iosUrlScheme`. Run `npx expo prebuild --platform ios --clean` afterwards.

### Troubleshooting

- `DEVELOPER_ERROR` / code 10 on Android: the SHA-1 of the keystore that signed the running build is not registered, or the package name differs. `npx @react-native-google-signin/config-doctor` prints what the build actually uses.
- "Google did not return an ID token": `GOOGLE_WEB_CLIENT_ID` is missing or is not a *Web* client ID.

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
