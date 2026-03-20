'use client';

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import sessionStorage from "redux-persist/lib/storage/session";

import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import productsReducer from './slices/productsSlice';
import ordersReducer from './slices/ordersSlice';

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  products: productsReducer,
  orders: ordersReducer
})

const getDynamicStorage = (persistent: boolean = true) => {
  if (typeof window === 'undefined') {
    return storage;
  }

  return persistent ? storage : sessionStorage;
};

const getUserPersistencePreference = () => {
  // if (typeof window !== 'undefined') {
  //   const rememberMe = localStorage.getItem('rememberMe') === 'true';
  //   return rememberMe;
  // }
  return true;
};

const persistConfig = {
  key: "root",
  storage: getDynamicStorage(getUserPersistencePreference()),
  whitelist: ['user', 'cart', 'products', 'orders'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            "persist/PERSIST",
            "persist/REHYDRATE",
            "persist/PAUSE",
            "persist/FLUSH",
            "persist/PURGE",
            "persist/REGISTER"
          ]
        }
      })
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
