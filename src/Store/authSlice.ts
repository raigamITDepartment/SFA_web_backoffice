import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    token: string | null;
    userName: string | null;
    password: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    token: null,
    userName: null,
    password: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthData: (state, action: PayloadAction<{ token: string; userName: string; password: string }>) => {
            const { token, userName, password } = action.payload;
            state.token = token;
            state.userName = userName;
            state.password = password;
            state.isAuthenticated = true;
        },
        clearAuthData: (state) => {
            state.token = null;
            state.userName = null;
            state.password = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;