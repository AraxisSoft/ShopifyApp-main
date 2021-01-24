import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isPro: true,
  },
  reducers: {
    setPro: (state, action) => {
      console.log(action);
      state.isPro = true;
    },
    setFree: (state, action) => {
      console.log(action);
      state.msg2 = false;
    },
  },
});

export const { setPro, setFree } = authSlice.actions;

export const selectIsPro = (state) => state.auth.isPro;

export default authSlice.reducer;
