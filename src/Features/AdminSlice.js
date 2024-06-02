import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    admin: JSON.parse(localStorage.getItem('admin')) || null,
    adminAccessToken: localStorage.getItem('adminAccessToken') || null,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setAdmin: (state, action) => {
            state.admin = action.payload;
            localStorage.setItem('admin', JSON.stringify(action.payload));
        },
        setAdminAccessToken: (state, action) => {
            state.adminAccessToken = action.payload;
            localStorage.setItem('adminAccessToken', action.payload);
        },
        logoutAdmin: (state) => {
            state.admin = null;
            state.adminAccessToken = null;
            localStorage.removeItem('admin');
            localStorage.removeItem('adminAccessToken');
        },
    },
});

export const { setAdmin, setAdminAccessToken, logoutAdmin } = adminSlice.actions;

export const selectAdmin = (state) => state.admin;
export const selectAdminAccessToken = (state) => state.adminAccessToken;

export default adminSlice.reducer;

