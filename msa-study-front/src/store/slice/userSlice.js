import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  sub: null,
  auth: null,
  exp: null,
  pmUserNo: null,
  pmUserId: null,
  pmName: null,
  pmPhone: null,
  userRole: null,
  sessionId: null,
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;
