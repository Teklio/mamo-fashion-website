import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import _storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";

// Vite/esbuild ESM interop: sometimes the imported default storage is wrapped inside a 'default' property
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const storage = (_storage as any)?.default || _storage;

const persistConfig = {
  key: "mm-admin-root",
  storage,
  whitelist: ["auth", "tab"],
};

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
