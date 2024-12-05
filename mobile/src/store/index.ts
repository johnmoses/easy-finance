import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit';
import { MMKV } from 'react-native-mmkv';
import appReducer from './slices/app';
import chatReducer from './slices/chat';
import userReducer from './slices/user';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from 'redux-persist';
import persistStore from 'redux-persist/es/persistStore';

const storage = new MMKV();
const reduxStorage = {
  setItem: (key: string, value: any) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
    return Promise.resolve();
  },
};

// Persist setup
const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  blacklist: ['user'],
};

const combinedReducer = combineReducers({
  app: appReducer,
  chat: chatReducer,
  user: userReducer,
});

const rootReducer = (state: any, action: AnyAction) => {
  if (action.type === 'LOGOUT') {
    return combinedReducer(undefined, action);
  }
  return combinedReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

let store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    // getDefaultMiddleware({
    //   serializableCheck: false, immutableCheck: false,
    // }),
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

let persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };
