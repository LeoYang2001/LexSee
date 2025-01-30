import { createSlice } from "@reduxjs/toolkit";

const languageSlice = createSlice({
  name: "languages",
  initialState: {
    list: [],
  },
  reducers: {
    setList: (state, action) => {
      state.list = action.payload;
    },
    getLanguageCode: (state, action) => {
      const languageName = action.payload;
      const language = state.list.find(
        (item) => item.language === languageName
      );
      return language ? language.code : null;
    },
  },
});

export const { setList, getLanguageCode } = languageSlice.actions;
export default languageSlice.reducer;
