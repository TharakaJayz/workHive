import { User } from "@/lib/types/model.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

interface Payload extends User {
    token: string;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<Payload>) => {
            const { token, ...userValues } = action.payload
            state.user = userValues;
            state.token = token;
            state.isAuthenticated = true;
        },

        clearCredentials: (state) => {
            state.user = null;
            state.token=null;
            state.isAuthenticated = false;
        },
    },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;