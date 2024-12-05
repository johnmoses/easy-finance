import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/app';
import chatReducer from './slices/chat';
import helpReducer from './slices/help';
import PreferenceBoxSlice from './slices/preferencebox';
import userReducer from './slices/user';

export const store = configureStore({
  reducer: {
    app: appReducer,
    chat: chatReducer,
    help: helpReducer,
    preferenceBox: PreferenceBoxSlice,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
