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
  userreport: undefined,
  configuredCheckList: undefined,
  selectedCheckListId: undefined,
  showSnackBar: false,
  snackBarMessage: '',
  contactsList: undefined,
  searchedContactList: undefined,
  employeeExposuresList:undefined,
  externalExposureList:undefined,
  selectedExternalExposureDetail:undefined,
  employeeExposersReport:undefined,
  showFormForNewContacts:false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case types.SAVE_CONTACTS_LIST:
      return {
        ...state,
        contactsList: action.payload
      }
    case types.SAVE_SEARCHED_CONTACT_LIST:
      return {
        ...state,
        searchedContactList: action.payload
      }
    case types.SAVE_SELECTED_EXTERNAL_EXPOSURE_DETAIL:
      return {
        ...state,
        selectedExternalExposureDetail:action.payload
      }  
      case types.SAVE_EXTERNAL_EXPOSURES:
        return {
          ...state,
          externalExposureList:action.payload
        }
    case types.SAVE_EMPLOYEE_EXPOSURES:
      return {
        ...state,
        employeeExposuresList:action.payload
      }  
     case types.SAVE_EMPLOYEE_EXPOSURE_REPORT:
       return {
         ...state,
         employeeExposersReport:action.payload
       } 
    case types.CLEAR_SELECTED_EXTERNAL_EXPOSURE_DETAIL: {
      return {
        ...state,
        selectedExternalExposureDetail:undefined
      }
    }  
    case types.SHOW_FORM_TO_ADD_NEW_CONTACTS: {
      return {
        ...state,
        showFormForNewContacts:action.payload
      }
    }
     case types.CLEAR_EXTERNAL_CONTACT_LIST:
       return {
         ...state,
         contactsList:undefined,
         searchedContactList:undefined
       } 
    case types.RESET_EXPOSURE_PAGE:
      return {
        ...state,
        users: {},
        teams: {},
        error: "",
        Status: null,
        showSpinnerAssign: true,
        assignedUser: {},
        sendasstatus: '',
        userreport: undefined,
        configuredCheckList: undefined,
        selectedCheckListId: undefined,
        showSnackBar: false,
        snackBarMessage: '',
        contactsList: undefined,
        searchedContactList: undefined,
        employeeExposuresList:undefined,
        externalExposureList:undefined,
        selectedExternalExposureDetail:undefined,
        employeeExposersReport:undefined,
        showFormForNewContacts:false
        // snackBarMessage: ''
      }
    default:
      return state;
  }
};