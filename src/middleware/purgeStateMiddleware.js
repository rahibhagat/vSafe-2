import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { purgeStoredState } from 'redux-persist';
export function purgeStateMiddleware() {
    return ({ dispatch, getState }) => next => action => {
      if (action.type == 'LOGOUT_SUCCESS') {
        const persistConfig = {
          key: 'root',
          stateReconciler: autoMergeLevel2,
          storage,
          whitelist: ['login']
        };
        purgeStoredState(persistConfig);
      }
      return next(action);
    }
  }