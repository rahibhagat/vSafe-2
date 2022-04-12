import API from "../api";
import NavigatorService from '../navigatorService/navigator';
import * as types from "../actionTypes";
import { conversationType, loadActivity,conversationStatus } from '../constants/vSafeEnum'
import {getKeyandMailboxname} from '../utility';
import { tokenEndPoint, apiEndPoint, serviceBasePath,signalRURL } from '../config/config';
import { Toast, ActionSheet } from 'native-base';
import { loadBadgeCountRequested } from './sidebarActions';

//#region 'ConversationList Actions'

//#region Local Methods
export function _loadConversationListSuccess(convList, convDeletedList) {
    return {
        type: types.UPDATE_CONVLIST,
        payload: convList, convDeletedList
    };
}
function _loadConversationListFailed(err) {
    return {
        type: types.UPDATE_CONVLIST_FAILED,
        payload: err
    };
}
export function _loadMoreConversationStart() {
    return {
        type: types.LOAD_MORE_START
    };
}
export function _refreshConversationStart() {
    return {
        type: types.REFRESH_CONV_START
    };
}

//#endregion

//#region Global Methods
export function startforconvupdate(){
    return {
        type: types.START_FOR_CONV_UPDATE
    }
}
export function stopforconvupdate(){
    return { 
        type: types.STOP_FOR_CONV_UPDATE
    }
}
export function setConversationId(convid) {
    return {
        type: types.SETCONVID,
        payload : convid
    };
}

export function unloadConversationList() {
    return {
        type: types.RESET_CONVLIST
    };
}
export function _DeleteConversationList(convDeletedList) {
    return {
        type: types.DELETE_CONVLIST,
        payload: convDeletedList
    }
}
export function showResetFilterButton(value) {
    return {
        type:types.SHOW_RESET_FILTER_BUTTON,
        payload:value
    }
}

export function setAggregations(response){
    var filters = {}
    var statuses = []
    var mailboxes = []
    var users = []
    statuses.push({key:0,name:'Select Status'})
    var status = response.aggregations.statuses.buckets.map(res=>{
        if(res.key == conversationStatus.Open){
                statuses.push({key: res.key,name:'open' + '  (' + res.doc_count + ')'})
        }
        else if(res.key == conversationStatus.Closed)
        {
            statuses.push({key: res.key,name:'close' + '  (' + res.doc_count + ')'})
    }
    else if(res.key == conversationStatus.Pending){
        statuses.push({key: res.key,name:'pending' + '  (' + res.doc_count + ')'})
    }
    else {
        statuses.push({key: res.key,name:'spam' + '  (' + res.doc_count + ')'})
    }
    // console.log(statuses);
    
    })
    filters.statuses = statuses
    mailboxes.push({key:0,name:'Select Mailbox'})
    var mailbox = response.aggregations.mailboxes.buckets.map(res=>{
          var keymailbox = res.key.split('|')
          mailboxes.push({key:parseInt(keymailbox[0]),name:keymailbox[1] + ' (' + res.doc_count + ')'})
        //   console.log(mailboxes)
    })
    filters.mailboxes = mailboxes
    users.push({key:0,name:'Select User'})
    var user = response.aggregations.users.buckets.map(res=>{
        var keyusers = res.key.split('|')
        if(keyusers.length == 1){
            keyusers[0] = "1"
            keyusers[1] = "Unassigned"
        }
             users.push({key: parseInt(keyusers[0]),name: keyusers[1] + ' (' + res.doc_count + ')'})
            //  console.log(users)
    })
    filters.users = users
    // console.log(filters);
    // var mailboxes = response.aggregations.mailboxes.buckets.map(res=> {
    //     if()
    // })
    return {
        type: types.SET_FILTERS_FOR_SEARCH,
        payload: filters
    }
}
export function setSelectedMailboxForSearch(mailboxId){
    return {
        type: types.SET_SELECTED_MAILBOX_FOR_SEARCH,
        payload: mailboxId
    }
}
export function startSpinnerForSearch(){
    return {
        type: types.START_SPINNER_FOR_SEARCH
    }
}
export function stopSpinnerForSearch(){
    return {
        type: types.STOP_SPINNER_FOR_SEARCH
    }
}
export function _deleteConversationStart(value) {
    return {
        type: types.START_CONVERSATION_DELETE,
        payload: value
    }
}
export function loadSearchConvListSuccess(searchedconvList){

    return {
        type: types.SET_SEARCHED_CONV_LIST,
        payload: searchedconvList
    }
}
export function resetSearchConvList(){
    return {
        type: types.RESET_SEARCHED_CONV_LIST
    } 
}
export function setscrollPosition(value) {
    return {
        type: types.SET_SCROLL_POSITION,
        payload: value
    }
}
export function setSelectedOrder(selectedorder) {
    return {
        type: types.SET_SELECTED_ORDER,
        payload: selectedorder
    }
}
export function setSelectedFilter(selectedfilter) {
    return {
        type: types.SET_SELECTED_FILTER,
        payload: selectedfilter
    }
}
export function filterapplied (value) {
    return {
        type: types.SET_APPLIED_FILTER,
        payload: value
    }
}
export function orderapplied (value) {
    return {
        type: types.SET_APPLIED_ORDER,
        payload: value
    }
}
//using to delete conversation
export function _DeleteConversation(convDeletedList, newData) {
    var IDs = [];
    convDeletedList.map((s,i)=>{
        IDs.push(s.id)
    })
    // IDs.push(
    //     convDeletedList
    // )
    return function (dispatch, getState) {
        dispatch(_deleteConversationStart(true))
        dispatch(unloadConversationList())
        // dispatch(loadBadgeCountRequested())
        API.post(`Conversations/DeteleConversationByIDS`,IDs)
            .then(convDeletedList => {
                // dispatch(unloadConversationList())
                
                dispatch(_loadConversationListSuccess(convDeletedList))
                dispatch(loadBadgeCountRequested())
                dispatch(_deleteConversationStart(false))
                Toast.show({ text: "Deleted successfully", textStyle: { color: "white" }, buttonText: "okay", type: "success", duration: 3000, position: 'bottom' })
            })
    }
}
export function addNewConversation(notifyObject){
    return function (dispatch,getState){
  var convList = getState().conversationList.convList
  var res = convList.filter(res => {return res.id == notifyObject.ConversationId })
//   console.log(res,'HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII')
}}
export function setGlobalSearchDto(text){
        var  globalSearchDto = {

            // From which position to search
            from: 0,

            // Size of total documents to load
            size: 7,

            // Search key
            searchText: text,

            // Facets/Filters
            aggregationFilters: [],

            // Date range value
            dateRangeVal: 0,

            // Field to execute search on (By default, Subject, LastMessage, MessageList & Tags)
            suggestedField: "",

            // Sorting Type on LastModifiedDate
            sortType: "asc"
        };
        API.post(`ElasticSearch/`,globalSearchDto)
        .then(response => {
            // console.log(response)
            var responseconv = response.hits.hits.map(conv=>{
                return conv._source
            }) 
            // console.log(responseconv)
            dispatch(loadSearchConvListSuccess(responseconv))
        })
    
}
export function loadConversationsRequested(offset, sort, filter, limit, loadingActivity) {
    return function (dispatch, getState) {
        // Filter needs to be set 
        // (MailboxID=={{$stateParams.id}} && ConversationType!={{model.convType.Chat}} && Status!={{model.statusIds.Closed}} && Status!={{model.statusIds.Spam}}{{model.showUnread}})
        var filterModel = {
            offset: offset,
            sort: sort,
            filter: filter,
            fields: "",
            limit: limit,
            param: ""
        };
        switch (sort) {
            case "newest":
                filterModel.sort = "LastModifiedDate descending";
                break;
            case "oldest":
                filterModel.sort = "LastModifiedDate ascending";
                break;
        }
        // Used to show spinner when the more conversations are loaded.
        if (loadingActivity === loadActivity.LoadMore) {
            dispatch(_loadMoreConversationStart());
        }
        // Show spinner while refreshing the Conversations
        else if (loadingActivity === loadActivity.Refresh) {
            dispatch(_refreshConversationStart());
        }
        dispatch(_loadMoreConversationStart());
        API.get(`Conversations/GetFilteredConversations`, filterModel)
            .then(convList => {
                //if undefine then set to zero.
                // console.log(convList)
                if (!convList.length) {
                    convList.length = 0
                }
                if (convList.length > 0) {
                    if (loadingActivity === loadActivity.LoadMore && convList.length > 0) {
                        var conversationList = getState().conversationList.convList;
                        var cx = convList.map(function (conv) {
                            if (conversationList.findIndex(convx => convx.id === conv.id) > -1) {
                                // Do nothing as the conversation is already present in the list. 
                                return null;
                            } else {
                                return conv;
                            }
                        });
                        if (cx.length) {
                            conversationList = conversationList.concat(cx);
                        }
                        convList = conversationList;
                    }
                    // convList.sort(function(x,y){
                    //     return y.bIsUnRead - x.bIsUnRead
                    // })
                    // console.log(convList)
                    dispatch(_loadConversationListSuccess(convList));
                }
                //check for end of conversationlist 
                else if (loadingActivity === loadActivity.LoadMore && convList.length === 0) {
                    var conversationList = getState().conversationList.convList;
                    dispatch(_loadConversationListSuccess(conversationList));
                }
                //check for empty conversationlist.
                //By adding 'else if' we are specifying that on 'loadInitial' ,
                //if there are no conversations then only we want to render ‘No conversation’ message.
                else if (loadingActivity === loadActivity.LoadInitial && convList.length === 0) {
                    dispatch(_loadConversationListSuccess(convList));
                }
            //  dispatch(stopforconvupdate())
            })
            .catch(err => {
                dispatch(_loadConversationListFailed("Something Went Wrong While Loading Conversation List"));
                Toast.show({text:"Something Went Wrong While Loading Conversation List or There is No Internet ",textStyle:{color:"white"},buttonText:"okay",type:"danger",duration: 5000,position:'bottom'})   
            });
    }
}
    //#endregion

//#endregion

