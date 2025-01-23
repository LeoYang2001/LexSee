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
  searchedHistory: [], // Derived state: combines searchHistory with savedWordList
};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
    },
    setSavedWordList: (state, action) => {
      state.savedWordList = action.payload;
      // Recalculate searchedHistory
      state.searchedHistory = compareLists(
        state.searchHistory,
        state.savedWordList
      );
    },
    setSearchHistory: (state, action) => {
      state.searchHistory = action.payload;
      // Recalculate searchedHistory
      state.searchedHistory = compareLists(
        state.searchHistory,
        state.savedWordList
      );
    },
    addWordToSavedList: (state, action) => {
      const exists = state.savedWordList.some(
        (word) => word.id === action.payload.id
      );
      if (!exists) {
        state.savedWordList.push(action.payload);
      }
    },
    removeWordFromSavedList: (state, action) => {
      // Optimistic update to the Redux state
      state.savedWordList = state.savedWordList.filter(
        (word) => word.id !== action.payload.id
      );
    },
    addToSearchHistory: (state, action) => {
      const exists = state.searchHistory.some(
        (item) => item === action.payload.id
      );
      if (!exists) {
        state.searchHistory.push(action.payload);
      }
    },
    removeFromSearchHistory: (state, action) => {
      // Optimistic update to the Redux state
      state.searchHistory = state.searchHistory.filter(
        (item) => item !== action.payload
      );
    },
  },
});

// Helper function to compare lists and format searched history
const compareLists = (searchHistory, savedWordList) => {
  const savedWordSet = new Set(savedWordList.map((word) => word.id));
  return searchHistory.map((word) => ({
    word,
    ifSaved: savedWordSet.has(word),
  }));
};

export const {
  setUserProfile,
  setSavedWordList,
  setSearchHistory,
  addWordToSavedList,
  removeWordFromSavedList,
  addToSearchHistory,
  removeFromSearchHistory,
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
