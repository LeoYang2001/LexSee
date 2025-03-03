import "dotenv/config";

export default {
  expo: {
    name: "LexSee",
    slug: "lexsee",
    version: "2.0.1",
    orientation: "portrait",
    icon: "./assets/LexSeeV2_logo.png",
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
      chatgptApiKey: process.env.OPENAI_API_KEY,
      eas: {
        projectId: "7b05e482-ffc9-46e8-b33c-c4bf2e938fcc",
      },
    },
    plugins: [],
  },
};
