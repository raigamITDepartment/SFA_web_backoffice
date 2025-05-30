import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Store/authSlice'; // Adjust the path based on your project structure

const store = configureStore({
    reducer: {
        auth: authReducer, // Add your reducers here
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;