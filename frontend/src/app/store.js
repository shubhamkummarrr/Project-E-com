// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import userReducer from "../features/userSlice";
import { userAuthApi } from "../services/userAuthApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    [userAuthApi.reducerPath]: userAuthApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userAuthApi.middleware) // ✅ include API middleware
});
