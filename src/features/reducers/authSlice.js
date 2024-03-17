// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    token: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.status = true;
            const { token, status } = action.payload;
            state.token = token;
            state.status = status;
        },
        logout: (state, action) => {
            state.status = false;
            state.token = null;
        }
    }
});

export default authSlice.reducer;
export const { setCredentials, logout } = authSlice.actions;
