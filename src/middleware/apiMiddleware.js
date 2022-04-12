export function apiTokenMiddleware(apiService) {
    return ({ dispatch, getState }) => next => action => {
      if (action.type == 'persist/REHYDRATE') {

        if(action.payload)
        {
          let token = action.payload.login.authData.access_token;
          apiService.setToken(token)
        }
      }
      return next(action);
    }
  }