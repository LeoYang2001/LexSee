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
  },
});

export const { setUserProfile, setSavedWordList } = userInfoSlice.actions;
export default userInfoSlice.reducer;
