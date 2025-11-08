// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import userReducer from "../features/userSlice";
import { userAuthApi } from "../services/userAuthApi";
import { productApi } from "../services/productApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    [userAuthApi.reducerPath]: userAuthApi.reducer,
    [productApi.reducerPath]: productApi.reducer, // ✅ add this
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userAuthApi.middleware) // ✅ include API middleware
      .concat(productApi.middleware), // ✅ include product API middleware
});
