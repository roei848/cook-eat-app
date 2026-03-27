import 'dotenv/config';

export default ({ config }) => ({
  name: "cook-eat-app",
  slug: "cook-eat-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.roei848.cookeatapp",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  androidNavigationBar: {
    visible: "sticky-immersive",
  },
  plugins: [
    "expo-web-browser",
    [
      "expo-image-picker",
      {
        photosPermission: "האפליקציה מבקשת גישה לתמונות שלך",
        cameraPermission: "האפליקציה מבקשת גישה למצלמה",
      },
    ],
  ],
  extra: {
    geminiApiKey: process.env.GEMINI_API_KEY,
  },
});
