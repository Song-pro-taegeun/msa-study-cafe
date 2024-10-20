import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
// import loadingSlice from "./loadingSlice";
// import recentFindDataParamSlice from "./recentFindDataParamSlice";

export const store = configureStore({
  reducer: {
    userSlice,
    // loadingSlice,
    // recentFindDataParamSlice,
  },
});

export default store;
