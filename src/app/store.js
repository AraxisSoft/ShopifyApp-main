import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "features/messageSlice";
import authSlice from "features/authSlice";

export default configureStore({
  reducer: {
    messages: messageReducer,
    auth: authSlice,
  },
});
