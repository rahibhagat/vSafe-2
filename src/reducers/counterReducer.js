const initialState = {
  count: 30
};

export default function(state= initialState, action){
    switch (action.type) {
      case "Counter":       
        return {
          ...state,
          count: action.payload
        }
      default:
        return state;       
    }
  }