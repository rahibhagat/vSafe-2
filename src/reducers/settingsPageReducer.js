import API from "../api";
import NavigatorService from '../navigatorService/navigator';
import * as types from "../actionTypes";
import { conversationType } from '../constants/vSafeEnum'
import _ from "lodash";
const initialState = {
    message: {},
    file: [],
    showSpinner: true,
    sendMessageClicked: false,
    replyAsFBComment: false,
    composeTag: [],
    customerInfo: [],
    error:'',
    selectedcustomfields:undefined,
    filesids:[],
    checkedcustomfield:[],
    languages : [
        { 
          id:1,
          name: 'English (Canada)',
          selected: false
        },
        {
          id:2,
          name: 'Français (Canada)',
          selected: false
        }
      ],
      selectedLanguage:undefined,
      selectedLanguageFile:undefined
}

export default function (state = initialState, action) {
    switch (action.type) {
        case types.GET_TAGS_LIST_START: {
            return {
                ...state,
                showSpinner: false,
                error: ""
            }
        }
        case types.UPLOAD_START: {
            return {
                ...state,
                showSpinner: true,
                error: ""
            }
        }
        case types.SELECT_LANGUAGE: {
          return {
              ...state,
              selectedLanguage:action.payload
          }
        }
        case types.ADD_COMPOSE_TAG: {
            return {
                ...state,
                composeTag: action.payload
            }
        }
        case types.SET_CUSTOM_FIELDS: {
            return {
                ...state,
                selectedcustomfields:action.payload
            }
        }
        case types.UPLOAD_CUSTOM_FIELD_SUCCESSFULLY: {
            return{
                ...state
            }
        }
        case types.SET_CHECKED_CUSTOM_FIELD: {
            return {
                ...state,
                checkedcustomfield: action.payload
            }
        }
        case types.CUSTOMERINFO: {
            return {
                ...state,
                customerInfo: action.payload,
                showSpinner: false
            }
        }
        case types.LOAD_CUSTOMER_FAILED:{
            return {
                ...state,
                error: '' 
            }
        }
        case types.REMOVE_CUSTOMER: {
            return {
                ...state,
                customerInfo: []
            }
        }
        case types.REMOVE_START: {
            return {
                ...state,
                showSpinner: true,
                error: ""
            }
        }
        case types.UPLOAD_COMPLETE: {
            return {
                ...state,
                showSpinner: false,
                file: action.payload
            }
        }
        case types.SET_SELECTED_FILE: {
            return {
                ...state,
                file: action.payload
            }
        }
        case types.REMOVE_FILE: {
            return {
                ...state,
                file: action.payload,
                showSpinner: false
            }
        }
        case types.SET_SELECTED_LANGUAGE_FILE: {
            return {
                ...state,
                selectedLanguageFile:action.payload
            }
        }
        case types.UPLOAD_ERROR:
            return {
                ...state,
                showSpinner: false,
                error: action.payload
            }
        case types.SEND_START:
            return {
                ...state,
                sendMessageClicked: true,
                error: ""
            }
        case types.MESSAGE_SENT:
            return {
                ...state,
                message: action.payload,
                sendMessageClicked: false,
            }
        case types.MESSAGE_SENT_ERROR:
            return {
                ...state,
                error: action.payload,
                sendMessageClicked: false
            }
            case types.REMOVE_ERROR:
                return {
                    ...state,
                    error:''
                }
        case types.UPLOAD_FILES_IDS:
            return {
                ...state,
                filesids: action.payload
            }
        case types.RESET_SETTINGS_PAGE:
            return {
                ...state,
                message: {},
                file: [],
                showSpinner: true,
                sendMessageClicked: false,
                replyAsFBComment: false,
                composeTag: [],
                customerInfo: [],
                error:'',
                selectedcustomfields:undefined,
                filesids:[],
                checkedcustomfield:[],
                languages : [
                    { 
                      id:1,
                      name: 'English (Canada)',
                      selected: false
                    },
                    {
                      id:2,
                      name: 'Français (Canada)',
                      selected: false
                    }
                  ],
            }
        case types.SET_REPLY_AS_COMMENT_FLAG:
            return {
                ...state,
                replyAsFBComment: true,
                message: action.payload
            }
        default:
            return state;
    }
}