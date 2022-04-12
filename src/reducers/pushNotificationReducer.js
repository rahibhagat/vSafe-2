import * as types from '../actionTypes';
const initialState = { };

  export default function(state= initialState, action){
    switch (action.type) {
      case types.SETUP_PUSH_NOTIFICATION_SUCCESSS: {
        return {
          ...state
        }
      }
      case types.SUBSCRIPTION_CHANGE_SUCCESS: {
        return {
          ...state
        }
      }
      case types.SUBSCRIBE_ONE_SIGNAL_SUCCESS: {
        return{
          ...state
        }
      }
      default: {
        return state;
      }
    }
  }