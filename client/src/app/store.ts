import { configureStore } from '@reduxjs/toolkit';
import storage from "redux-persist/lib/storage/session"
import { combineReducers } from "redux"; 
import { persistReducer } from 'redux-persist'
import thunk from 'redux-thunk'
import userSlice from '../features/userSlice.ts'
import forumSlice from '../features/forumSlice.ts'

const reducers = combineReducers({
    user: userSlice,
    forum: forumSlice
});

const persistConfig = {
    key: 'root',
    storage
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk]
});

export type ReducerType = ReturnType<typeof reducers>;

export type DispatchType = typeof store.dispatch;

export default store;



