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
npx expo start           # Start dev server (scan QR with Expo Go)
npx expo start --ios     # Open in iOS simulator
npx expo start --android # Open in Android emulator
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

## License

This project is private and not licensed for public use.
