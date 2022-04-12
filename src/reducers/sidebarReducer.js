import * as types from '../actionTypes/index';
const initialState = {
    sidebarList: {}, 
    mailboxList: {}, 
    err:"", 
    selectedMailbox: 0,
    badgeCount: {}, 
    selectedListItem: 0,
    mailboxInfoforDefaultSetting:{},
    mailboxcustomfield:undefined,
    mailboxconfirmed: undefined,
    mailboxteamlist:[],
    selectedTeam:0,
    teambadgeCount:[]
  };
  
  export default function(state= initialState, action){
      switch (action.type) {
        case types.SET_SIDEBAR_LIST:
          return {
            ...state,
            sidebarList: action.payload
          }   
        case types.GET_USER_MAILBOX_LIST:
          return {
            ...state,
            mailboxList: action.payload
          } 
        case types.GET_USER_MAILBOX_LIST_FAILED:
          return {
            ...state,
            err: action.payload
          }     
        case types.SET_MAILBOX_PERMISSION:
          return {
            ...state,
            mailboxconfirmed: action.payload
          }  
        case types.SET_SELECTED_MAILBOX:
          return {
            ...state,
            selectedMailbox: action.payload
          }
          case types.SET_SELECTED_TEAM: 
          return {
            ...state,
            selectedTeam:action.payload
          }
        case types.UPDATE_BADGE_COUNT:
          return {
            ...state,
            badgeCount: action.payload
          }  
          case types.UPDATE_TEAM_BADGE_COUNT:
            return {
              ...state,
              teambadgeCount: action.payload
            } 
        case types.UPDATE_BADGE_COUNT_FAILED:
          return {
            ...state,
            err: action.payload
          }    
        case types.SET_SELECTED_SIDEBAR_LISTITEM:
          return {
            ...state,
            selectedListItem: action.payload
          } 
          case types.GET_MAILBOX_TEAMLIST: 
          return {
            ...state,
            mailboxteamlist:action.payload
          }   
          case types.SET_MAILBOX_DEFAULT_SETTING:
            return {
              ...state,
              mailboxInfoforDefaultSetting: action.payload,
            }
            case types.SET_MAILBOX_CUSTOM_FIELD:
              return {
                ...state,
                mailboxcustomfield: action.payload
              }
            case types.RESET_SIDEBAR:
              return {
                ...state,
                sidebarList: {}, 
                mailboxList: {}, 
                err:"", 
                selectedMailbox: 0,
                badgeCount: {}, 
                selectedListItem: 0,
                mailboxInfoforDefaultSetting:{},
                mailboxcustomfield:undefined,
                mailboxconfirmed:undefined,
                mailboxteamlist:[],
                selectedTeam:0,
                teambadgeCount:[]
              }
        default:
          return state;       
      }
    }