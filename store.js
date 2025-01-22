import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "./slices/userInfoSlice";
import loadingReducer from "./slices/loadingSlice";

const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    loading: loadingReducer,
  },
});

export default store;
