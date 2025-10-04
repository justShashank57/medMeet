import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: localStorage.getItem('userIdentity') || ""
}

export const identitySlice = createSlice({
    name: 'identity',
    initialState,
    reducers: {
        updateUserIdentity: (state, action) => {
            localStorage.setItem('userIdentity', action.payload);
            state.value = action.payload;
        },
        clearUserIdentity: (state) => {
            localStorage.removeItem('userIdentity');
            state.value = "";
        }
    }
})

export const { updateUserIdentity, clearUserIdentity } = identitySlice.actions;
export default identitySlice.reducer;
