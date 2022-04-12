import * as types from "../actionTypes";
const initialState = {
    convList:{},
    error: "",
    loadingMoreConversations: false,
    refreshConversations: false,
    setconvid:undefined,
    startupdate:false,
    searchedconvlist:undefined,
    spinnerforsearch: false,
    emptysearchedconvlist: false,
    selectedmailboxofsearch: 0,
    setfiltersforsearch: undefined,
    selectedfilter:'All',
    selectedorder:'newest',
    showresetfilterbutton:false,
    setappliedfilter:'All',
    setappliedorder:'newest',
    startconversationdelete:false,
    scrollposition:undefined
  };

  export default function(state= initialState, action){
    switch (action.type) {
        case types.UPDATE_CONVLIST:       
          return {
            ...state,
            convList: action.payload,
            loadingMoreConversations: false,
            refreshConversations: false
        }
        case types.RESET_CONVLIST:       
          return {
            ...state,
            convList: {},
            loadingMoreConversations: false,
            refreshConversations:false
        }
        case types.RESET_SELECTED_FILTER: 
        return {
          ...state,
          setappliedfilter:'All',
          setappliedorder:'newest',
          selectedfilter:'All',
          selectedorder:'newest',
        }
        case types.START_CONVERSATION_DELETE:
          return {
            ...state,
            startconversationdelete:action.payload
          }
        case types.START_FOR_CONV_UPDATE:
          return {
            ...state,
            startupdate:true
          }
          case types.RESET_SEARCHED_CONV_LIST:
            return {
              ...state,
              searchedconvlist: undefined,
              spinnerforsearch: false
            }
            case types.SET_SCROLL_POSITION: 
            return {
              ...state,
              scrollposition:action.payload
            }
          case types.STOP_FOR_CONV_UPDATE:
            return{
              ...state,
              startupdate:false
            }
        case types.SETCONVID:       
          return {
            ...state,
           setconvid:action.payload
        }
        case types.SHOW_RESET_FILTER_BUTTON:
          return {
            ...state,
            showresetfilterbutton:action.payload
          }
        case types.SET_FILTERS_FOR_SEARCH:
          return{
            ...state,
            setfiltersforsearch:action.payload
          }
        case types.START_SPINNER_FOR_SEARCH:
          return {
            ...state,
            spinnerforsearch: true
          }
          case types.SET_SELECTED_ORDER:
            return {
              ...state,
              selectedorder:action.payload
            }
          case types.SET_SELECTED_FILTER:
            return {
              ...state,
              selectedfilter: action.payload
            }
          case types.SET_SELECTED_MAILBOX_FOR_SEARCH: 
          return {
            ...state,
            selectedmailboxofsearch: action.payload
          }
          case types.STOP_SPINNER_FOR_SEARCH:
            return {
              ...state,
              spinnerforsearch: false,
              emptysearchedconvlist: true
            }
            case types.SET_SIGNALR_CONNECTION:
              return {
                ...state
              }
        case types.SET_SEARCHED_CONV_LIST: 
        return {
          ...state,
          searchedconvlist: action.payload,
          spinnerforsearch: false
        }
        case types.UPDATE_CONVLIST_FAILED:       
          return {
            ...state,
            error: action.payload,
            loadingMoreConversations: false,
            refreshConversations: false
        }
        case types.SET_APPLIED_FILTER : 
        return {
          ...state,
            setappliedfilter:action.payload
        }
        case types.SET_APPLIED_ORDER : 
        return {
          ...state,
          setappliedorder:action.payload
        }
        case types.LOAD_MORE_START :
          return {
            ...state,
            loadingMoreConversations: true,
        }  
        case types.REFRESH_CONV_START :
          return {
            ...state,
            refreshConversations: true,
        }
        
        default:
          return state;  
    }
  };