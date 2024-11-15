import "dotenv/config";

export default {
  expo: {
    name: "LexSee",
    slug: "lexsee",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/bookmark.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.leoyang.LexSee",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.leoyang_2001.LexSee",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      dotImageSearchKey: process.env.EXPO_DOT_IMAGE_SEARCH_KEY,
      chatgptApiKey: process.env.EXPO_DOT_CHATGPT_KEY,
      eas: {
        projectId: "7b05e482-ffc9-46e8-b33c-c4bf2e938fcc",
      },
    },
    plugins: [],
  },
};
