// #region global imports
import { Platform } from 'react-native';
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer, getStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to AsyncStorage for react-native
import thunk from 'redux-thunk';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import devTools from 'remote-redux-devtools';
import { composeWithDevTools } from 'redux-devtools-extension';
// #endregion

// #region Abhisi Imports
import API from "../api";
import allReducers from '../reducers/index.js';
import {apiTokenMiddleware} from '../middleware/apiMiddleware';
import {purgeStateMiddleware} from '../middleware/purgeStateMiddleware';
// #endregion

const apiMiddleware = apiTokenMiddleware(API);
const purgeState = purgeStateMiddleware();

const composeEnhancers = composeWithDevTools({
    // Specify here name, actionsBlacklist, actionsCreators and other options
  });

  const enhancer = composeEnhancers(
    applyMiddleware(thunk, apiMiddleware, purgeState),
    // other store enhancers if any
  );
// const enhancer = compose(
//     applyMiddleware(thunk, apiMiddleware, purgeState),
//     devTools({
//         name: Platform.OS,
//         hostname: 'localhost',
//         port: 5678
//     }),
// );

const persistConfig = {
    key: 'root',
    stateReconciler: autoMergeLevel2,
    storage,
    whitelist: ['login','settingsPage']
};

const persistedReducer = persistReducer(persistConfig, allReducers);
const configStore = async () => {
    const store = createStore(persistedReducer, enhancer);
    const persistor = persistStore(store);
    return { persistor, store };
};

export default configStore;