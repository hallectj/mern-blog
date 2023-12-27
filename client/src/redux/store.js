import { configureStore, combineReducers } from '@reduxjs/toolkit'
import  userReducer  from './user/userSlice'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
//import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';

const rootReducer = combineReducers({
  user: userReducer
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1
}

const persist_reducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persist_reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(
    {serializableCheck: false}
  )
})

export const persistor = persistStore(store);