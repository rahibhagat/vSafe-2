import * as types from "../actionTypes";
import AsyncStorage from '@react-native-community/async-storage';
const initialState = {
  users: {},
  teams: {},
  error: "",
  Status: null,
  showSpinnerAssign: true,
  assignedUser: {},
  sendasstatus: '',
  userreport:undefined
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
    case types.RESET_ASSIGN_PAGE:
      return {
        ...state,
        users: {},
        teams: {},
        error: "",
        Status: null,
        showSpinnerAssign: true,
        assignedUser: {},
        sendasstatus: ''
      }
    default:
      return state;
  }
};