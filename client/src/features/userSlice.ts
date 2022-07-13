import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
    isAuthenticated: boolean;
    signin: boolean;
    user: {
        nickname?: string;
        profileImagePath?: string;
        profileImageName?: string;
        userName?: string;
        email?: string;
    }
}

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isAuthenticated: false,
        signin: false,
        user: {},
    } as User,
    reducers: {
        SIGNIN: (state, action: PayloadAction<User['user']>) => {
            state.user = action.payload;
            state.signin = true;
            state.isAuthenticated = true;
        },
        SIGNOUT: (state, action: PayloadAction<User['user']>) => {
            state.user = action.payload;
            state.signin = false;
            state.isAuthenticated = false;
        }
    }
})

export const { SIGNIN, SIGNOUT } = userSlice.actions;

export default userSlice.reducer;