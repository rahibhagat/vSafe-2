
import * as types from "../actionTypes";
const initialState = {
    user : {
        companyID: 0,
        language: "",
        lastName: "",
        userID: "",
        userName: "",
        userRole: 0,
        userEmail: "", 
        confirmed: false
    },
    authData  : {
      access_token: "",
      expires_in: 0,
      refresh_token: "",
      token_type: ""
    }, 
    company: {},
    isAuthenticated: false  ,
    error: "", 
    loading: false,
    companyPlan: {},
    isLoggedIn: false
  };
  
  export default function(state= initialState, action){
      switch (action.type) {
        case "LOGIN_EMAIL":       
          return {
            ...state,
            user: action.payload,
            //authToken: action.payload.authToken
          }
        case types.UPDATE_AUTH_TOKEN:  
          return {
            ...state,
            authData: action.payload
          }
        case types.LOGGEDIN_USER_SUCCESS:  
          return {
            ...state,
            user: action.payload, 
            loading: false,
            isLoggedIn: true
          }
        case types.UPDATE_AUTH_STATUS:  
          return {
            ...state,
            isAuthenticated: action.payload,
            error: ""           
          }    
        case types.ERROR:  
          return {
            ...state,
            error: action.payload,
            loading: false
          }  
        case types.LOGIN_START_SPINNER:
          return{
            ...state,
            loading: action.payload, 
            error: ""
          }     
        case types.LOAD_COMPANY_SUCCESS:
          return{
            ...state,
            company: action.payload
          }
        case types.LOAD_COMPANY_FAILED:  
          return {
            ...state,
            error: action.payload,
            loading: false
          }  
        case types.LOAD_COMPANY_PLAN_SUCCESS:  
          return {
            ...state,
            companyPlan: action.payload,
          }  
        case types.LOAD_COMPANY_PLAN_FAILED:  
          return {
            ...state,
            error: action.payload,
          }  
        default:
          return state;       
      }
    }

    