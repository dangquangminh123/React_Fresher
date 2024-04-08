import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import counterReducer from '../redux/counter/counterSlice';
import accountReducer from './account/accounterSlice';
import orderReducer from './order/orderSlice';
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['account'], //Blacklist dùng để không lưu thoogn tin redux account
}

const rootReducer = combineReducers({
  counter: counterReducer,
  account: accountReducer,
  order: orderReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

const persistor = persistStore(store)

export { store, persistor };
