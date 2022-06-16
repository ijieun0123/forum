import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isAuthenticated: false,
        signin: false,
        user: {},
    },
    reducers: {
        SIGNIN: (state, action) => {
            state.user = action.payload;
            state.signin = true;
            state.isAuthenticated = true;
        },
        SIGNOUT: (state, action) => {
            state.user = action.payload;
            state.signin = false;
            state.isAuthenticated = false;
        }
    }
})

export const { SIGNIN, SIGNOUT } = userSlice.actions;

export default userSlice.reducer;