import storage from 'redux-persist/lib/storage';
import rootReducer from './rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { persistReducer, persistStore } from "redux-persist";

const persistorConfig={
    key:"root",
    storage,
    wishlist:["user"]
}

const persistedReducer=persistReducer(persistorConfig,rootReducer)

const store=configureStore({
    reducer:persistedReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
     serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
  })
})

const persistor=persistStore(store)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export {store,persistor}