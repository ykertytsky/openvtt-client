import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../slices/authApi";
import { removeToken } from "@/lib/utils/token";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
}

export const authSlice = createSlice({
    name: 'auth', 
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.isAuthenticated = action.payload !== null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            removeToken();
        },
    },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
