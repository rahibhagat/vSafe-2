import * as types from "../actionTypes";
import AsyncStorage from '@react-native-community/async-storage';
import { act } from "react-test-renderer";
const initialState = {
  users: {},
  teams: {},
  error: "",
  Status: null,
  showSpinnerAssign: true,
  assignedUser: {},
  sendasstatus: '',
  userreport:undefined,
  configuredCheckList:undefined,
  selectedCheckListId:undefined,
  showSnackBar:false,
  snackBarMessage:'',
  healthAssesmentsList:undefined,
  messageLogsList:[],
  showVSafeSpinner:false,
  selectedHealthAssesmentRecord:undefined
};

export default function (state = initialState, action) {
  switch (action.type) {
    case types.GET_USERS_LIST_FAILED:
      return {
        ...state,
        users: {},
        error: action.payload,
        showSpinnerAssign: false,
      }
      case types.SAVE_HEALTH_ASSESMENTS:
          return {
              ...state,
              healthAssesmentsList:action.payload
          }
     case types.SAVE_SELECTED_HEALTH_ASSESMENT_RECORDS:
              return {
                  ...state,
                  selectedHealthAssesmentRecord:action.payload
              }
      case types.SAVE_SELECTED_CHECKLIST_ID:
      return {
        ...state,
        selectedCheckListId:action.payload
      }
      case types.SHOW_VSAFE_SPINNER:
          return {
              ...state,
              showVSafeSpinner:true
          }
          case types.HIDE_VSAFE_SPINNER:
            return {
                ...state,
                showVSafeSpinner:false
            }
      case types.SHOW_SNACKBAR:
        return {
          ...state,
          showSnackBar:true,
          snackBarMessage:action.payload
        }
        case types.HIDE_SNACKBAR:
          return {
            ...state,
            showSnackBar:false,
            snackBarMessage:''
          }
      case types.SAVE_CONFIGURED_CHECKLIST:
        return {
          ...state,
          configuredCheckList:action.payload
        }
    case types.UPDATE_ASIGNEE_FAILED:
      return {
        ...state,
        error: action.payload,
        showSpinnerAssign: false,
      }
    case types.SAVE_MESSAGE_LOGS:
      return {
        ...state,
        messageLogsList:action.payload
      }
    case types.CLEAR_MESSAGE_LOGS:
      return {
        ...state,
        messageLogsList:[]
      }    
      case types.SET_USER_REPORT:
        return {
          ...state,
          userreport: action.payload
        }
    case types.GET_USERS_LIST:
      return {
        ...state,
        users: action.payload,
        showSpinnerAssign: false,
      }
    case types.GET_USERS_START:
      return {
        ...state,
        showSpinnerAssign: true,
      }
    case types.GET_TEAMS_START:
      return {
        ...state,
        showSpinnerAssign: true
      }
    case types.GET_TEAMS_LIST:
      return {
        ...state,
        teams: action.payload,
        showSpinnerAssign: false
      }
    case types.GET_TEAMS_LIST_FAILED:
      return {
        ...state,
        teams: {},
        error: action.payload,
        showSpinnerAssign: false,

      }
    case types.SET_STATUS_SENDAS:
      return {
        ...state,
        sendasstatus: action.payload
      }
    case types.ASSIGN_USER_START:
      return {
        ...state,
        showSpinnerAssign: true,
      }
    case types.SET_CONVERSATION:
      return {
        ...state,
        showSpinnerAssign: false,
      }
    case types.RESET_HEALTH_REPORT_PAGE:
      return {
        ...state,
        users: {},
        teams: {},
        error: "",
        Status: null,
        showSpinnerAssign: true,
        assignedUser: {},
        sendasstatus: '',
        userreport:undefined,
        configuredCheckList:undefined,
        selectedCheckListId:undefined,
        showSnackBar:false,
        snackBarMessage:'',
        healthAssesmentsList:undefined,
        showVSafeSpinner:false,
        selectedHealthAssesmentRecord:undefined,
        messageLogsList:[]
      }
    default:
      return state;
  }
};