import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: []
    },
    reducers: {
        addToCart: (state, action) => {
            const item = state.items.find(
                (p) => p.id === action.payload.id
            );

            if (item) {
                item.qty += 1;         
            } else {
                state.items.push({     
                    ...action.payload,
                    qty: 1
                });
            }
        },

        removeFromCart: (state, action) => {
            const item = state.items.find(
                (p) => p.id === action.payload
            );

            if (!item) return;

            if (item.qty > 1) {
                item.qty -= 1;        
            } else {
                state.items = state.items.filter(
                    (p) => p.id !== action.payload
                );                   
            }
        }

    }
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
