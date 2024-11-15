import "dotenv/config";

export default {
  expo: {
    extra: {
      dotImageSearchKey: process.env.EXPO_DOT_IMAGE_SEARCH_KEY,
      chatgptApiKey: process.env.EXPO_DOT_CHATGPT_KEY,
    },
  },
};
