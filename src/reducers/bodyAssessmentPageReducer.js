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
  selectedCheckList:undefined,
  selectedQuestions:[],
  showSpinnerToSubmitHealtAssesmentReport:false,
  attemptedReadOnlyCheckList:undefined
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
      case types.START_SPINNER_TO_SUBMIT_HEALTH_ASSESMENT_REPORT:
        return {
          ...state,
          showSpinnerToSubmitHealtAssesmentReport:true
        }
        case types.SHOW_ATTEMPTED_READ_ONLY_CHECKLIST:
          return {
            ...state,
            attemptedReadOnlyCheckList:action.payload
          }
        case types.STOP_SPINNER_TO_SUBMIT_HEALTH_ASSESMENT_REPORT:
          return {
            ...state,
            showSpinnerToSubmitHealtAssesmentReport:false
          }
          case types.RESET_ATTEMPTED_READ_ONLY_CHECKLIST:
            return {
              ...state,
              attemptedReadOnlyCheckList:undefined
            }
      case types.SAVE_SELECTED_CHECKLIST:
        return {
          ...state,
          selectedCheckList:action.payload
        }
        case types.SAVE_SELECTED_QUESTION:
          return {
            ...state,
            selectedQuestions:action.payload
          }
        case types.RESET_SELECTED_CHECKLIST:
          return {
            ...state,
            selectedCheckList:undefined
          }
    case types.UPDATE_ASIGNEE_FAILED:
      return {
        ...state,
        error: action.payload,
        showSpinnerAssign: false,
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
    case types.RESET_BODYASSESMENT_PAGE:
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
        selectedCheckList:undefined,
        selectedQuestions:[],
        showSpinnerToSubmitHealtAssesmentReport:false,
        attemptedReadOnlyCheckList:undefined
      }
    default:
      return state;
  }
};