import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./slices/userSlice";
import financeReducer from "./slices/financeSlice";
import globalReducer from "./slices/globalSlice";
import statisticsReducer from "./slices/statisticsSlice"; 

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["token"],
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  finance: financeReducer,
  global: globalReducer,
  statistics: statisticsReducer, 
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);