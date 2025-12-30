import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    address: {
        id: null,
        user_full_name: "",
        mobile_number: "",
        address_line: "",
        city: "",
        state: "",
        pincode: "",
        created_at: "",
        updated_at: "",
    },
};

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {
        // ✅ Address set karne ke liye
        setAddress: (state, action) => {
            state.address = action.payload;
        },

        // ❌ Address clear (logout / clear cart)
        clearAddress: (state) => {
            state.address = initialState.address;
        },
    },
});

export const { setAddress, clearAddress } = addressSlice.actions;
export default addressSlice.reducer;
