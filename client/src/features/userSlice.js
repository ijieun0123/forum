import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {
            _id:'',
            profileImage: '',
            userName: '',
            nickname: '',
            userId: '',
            password: '',
            signin: false
        },
    },
    reducers: {
        signin: (state, action) => {
            state.user = action.payload;
        },
        signout: (state, action) => {
            state.user = action.payload;
        }
    }
})

export const { signin, signout } = userSlice.actions;

export default userSlice.reducer;