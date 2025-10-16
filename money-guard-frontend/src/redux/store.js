import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import financeReducer from './slices/financeSlice';
import globalReducer from './slices/globalSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], // Only persist user slice (token and user data)
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  finance: financeReducer,
  global: globalReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);
