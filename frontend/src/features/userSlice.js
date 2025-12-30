import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  name: "",
  cart: []
};

export const userSlice = createSlice({
  name: "user_info",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
    },

    unsetUserInfo: (state) => {
      state.email = "";
      state.name = "";
      state.cart = [];
    },

    // ✅ ADD TO CART
    addToCart: (state, action) => {
      const item = state.cart.find(
        (p) => p.id === action.payload.id
      );

      if (item) {
        item.qty += 1;
      } else {
        state.cart.push({
          ...action.payload,
          qty: 1
        });
      }
    },

    // ❌ REMOVE ITEM
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (p) => p.id !== action.payload
      );
    },

    // ➕➖ UPDATE QTY
    updateQty: (state, action) => {
      const item = state.cart.find(
        (p) => p.id === action.payload.id
      );
      if (item) {
        item.qty = action.payload.qty;
      }
    },

    // 🧹 CLEAR CART (NEW)
    clearCart: (state) => {
      state.cart = [];
    }
  }
});

export const {
  setUserInfo,
  unsetUserInfo,
  addToCart,
  removeFromCart,
  updateQty,
  clearCart
} = userSlice.actions;

export default userSlice.reducer;
