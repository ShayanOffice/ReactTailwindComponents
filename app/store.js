import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { RTKapi } from './RTKapi';
import systemReducer from './systemSlice';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { combineReducers } from 'redux';

const persistConfig = {
  key: 'main-root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, systemReducer);
const reducers = combineReducers({
  // Add the generated reducer as a specific top-level slice

  // persistedReducer,
  systemReducer: persistedReducer,
  [RTKapi.reducerPath]: RTKapi.reducer,
});

export const store = configureStore({
  reducer: reducers,
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(RTKapi.middleware),
});

export const PersistedStore = persistStore(store);
// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
