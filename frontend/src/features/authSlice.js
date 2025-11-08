import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  access_token: null,
  refresh_token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // login ke time tokens set karne ke liye
    setUserToken: (state, action) => {
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
    },

    // logout ya token expire hone par reset karne ke liye
    unSetUserToken: (state) => {
      state.access_token = null;
      state.refresh_token = null;
    },
  },
});

export const { setUserToken, unSetUserToken } = authSlice.actions;

export default authSlice.reducer;
