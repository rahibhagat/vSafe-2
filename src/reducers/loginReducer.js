
import * as types from "../actionTypes";
const initialState = {
  user: {
    account: {
      dateFormat: "",
      expirationDate: "",
      id: "",
      is12HRTimeFormat: false,
      name: "",
      primaryContactId: "",
      timeZoneIDStringJS: "",
      timeZoneId: "",
    },
    departmentId: '',
    fName: "",
    id: "",
    isAdmin: false,
    lName: "",
    language: '',
    locationId: '',
    idf: ''
  },
  authData: {
    access_token: "",
    expires_in: 0,
    refresh_token: "",
    token_type: ""
  },
  company: {},
  isAuthenticated: false,
  error: "",
  loading: false,
  companyPlan: {},
  isLoggedIn: false,
  employeeInfoSaved:false,
  emailNotificationStatus:false,
  smsNotificationStatus:false,
  pushNotificationStatus:false,
  loginPageKey:""
};

export default function (state = initialState, action) {
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
      return {
        ...state,
        loading: action.payload,
        error: ""
      }
    case types.LOAD_COMPANY_SUCCESS:
      return {
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
    case types.EMPLOYEE_INFO_SAVED_SUCCESSFULLY:
      return {
        ...state,
        employeeInfoSaved: action.payload
      }  
    case types.UPDATE_EMAIL_NOTIFICATION_SETTINGS:
      return {
        ...state,
        emailNotificationStatus: action.payload
      }
    case types.UPDATE_SMS_NOTIFICATION_SETTINGS:
      return {
          ...state,
          smsNotificationStatus: action.payload
        }
    case types.UPDATE_PUSH_NOTIFICATION_SETTINGS:
      return {
          ...state,
          pushNotificationStatus: action.payload
        }  
     case types.SAVE_LOGIN_PAGE_KEY:
       return {
         ...state,
         loginPageKey: action.payload
       }   
    case types.RESET_USER:
      return {
        ...state,
        user: {
          account: {
            dateFormat: "",
            expirationDate: "",
            id: "",
            is12HRTimeFormat: false,
            name: "",
            primaryContactId: "",
            timeZoneIDStringJS: "",
            timeZoneId: "",
          },
          departmentId: '',
          fName: "",
          id: "",
          isAdmin: false,
          lName: "",
          language: '',
          locationId: '',
          idf: ''
        },
        authData: {
          access_token: "",
          expires_in: 0,
          refresh_token: "",
          token_type: ""
        },
        company: {},
        isAuthenticated: false,
        error: "",
        loading: false,
        companyPlan: {},
        isLoggedIn: false,
        employeeInfoSaved:false,
        emailNotificationStatus:false,
        smsNotificationStatus:false,
        pushNotificationStatus:false,
        loginPageKey:""
      }
    default:
      return state;
  }
}

