// userInfoSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: {
    uid: "",
    imgUrl: "",
    language: "",
    // Add other profile fields here as needed
  },
  savedWordList: [],
  searchHistory: [],
};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
    },
    setSavedWordList: (state, action) => {
      // Save the word list as a stringified object
      state.savedWordList = JSON.stringify(action.payload);
    },
    setSearchHistory: (state, action) => {
      state.searchHistory = action.payload;
    },
  },
});

export const { setUserProfile, setSavedWordList, setSearchHistory } =
  userInfoSlice.actions;
export default userInfoSlice.reducer;
