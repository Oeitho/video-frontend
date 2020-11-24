import { createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { rootReducer } from './rootReducer';
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['credentials'],
}

const persistentReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistentReducer);

export const persistor = persistStore(store);