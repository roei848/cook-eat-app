import 'dotenv/config';

// iOS client IDs look like "<id>.apps.googleusercontent.com"; the URL scheme
// the Google Sign-In SDK registers is that ID reversed.
const googleIosClientId = process.env.GOOGLE_IOS_CLIENT_ID;
const googleIosUrlScheme = googleIosClientId
  ? `com.googleusercontent.apps.${googleIosClientId.replace(/\.apps\.googleusercontent\.com$/, "")}`
  : undefined;

export default ({ config }) => ({
  ...config,
  name: "cook-eat-app",
  slug: "cook-eat-app",
  version: "1.0.1",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#F6F6EF",
    },
    package: "com.roei848.cookeatapp",
    versionCode: 2,
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "./plugins/withReleaseSigning",
    "./plugins/withHebrewLocale",
    "expo-status-bar",
    [
      "expo-splash-screen",
      {
        image: "./assets/splash-icon.png",
        resizeMode: "contain",
        // Android 12+ shows the splash image inside a 192 dp circle; the badge
        // is round, so 180 dp fills it without clipping (the default is 100).
        imageWidth: 180,
        backgroundColor: "#FFFAF5",
      },
    ],
    "expo-font",
    "expo-web-browser",
    [
      "expo-image-picker",
      {
        photosPermission: "האפליקציה מבקשת גישה לתמונות שלך",
        cameraPermission: "האפליקציה מבקשת גישה למצלמה",
      },
    ],
    // Google Sign-In. We use the Firebase JS SDK (no google-services.json),
    // so the plugin runs in its "without Firebase" mode, which only registers
    // the iOS URL scheme and requires it. On Android the module autolinks and
    // needs no plugin, so it is only added once an iOS client ID exists.
    ...(googleIosUrlScheme
      ? [
          [
            "@react-native-google-signin/google-signin",
            { iosUrlScheme: googleIosUrlScheme },
          ],
        ]
      : []),
  ],
  extra: {
    ...config.extra,
    geminiApiKey: process.env.GEMINI_API_KEY,
    googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID,
    googleIosClientId,
  },
});
