import API from "../api";
import NavigatorService from '../navigatorService/navigator';
import * as types from "../actionTypes";
import {conversationType,activityIDs} from '../constants/vSafeEnum'
import _ from "lodash";
//#region Assign Page Actions

//#region 'Load user List'
    
    //#region Local Methods
    function _loadUsersListSuccess(users){
        return {
            type: types.GET_USERS_LIST,
            payload: users
        };
    }
    function _loadUsersListFailed(err){
        return {
            type: types.GET_USERS_LIST_FAILED,
            payload: err
        };
    }
    function _loadTeamsListSuccess(teams){
        return {
            type: types.GET_TEAMS_LIST,
            payload: teams
        }
    }
    function _loadTeamsListFailed(err){
        return {
            type: types.GET_TEAMS_LIST_FAILED,
            payload: err
        }
    }
    //#endregion

    //#region Global Methods
export function loadUserListRequested(){
    return function(dispatch, getState) {
        var fields = "User.Email,User.UserName,User.ID";
        var mailboxID = getState().sidebar.selectedMailbox;
        var filterOptions = {
            offset: 0,
            sort: "",
            filter: "User.RowStatus==0 AND MailboxID==" + mailboxID,
            fields: fields,
            limit: 0
        };
        API.get(`MailboxUsers/`, filterOptions)
        .then(users => {
            //Update the state with the users for the mailbox.
            dispatch(_loadUsersListSuccess(users.filteredList));
        })
        .catch(err => {
            dispatch(_loadUsersListFailed(err + " Update user list failed."));
        });
    }
}
export function loadTeamListRequested(){
    return function (dispatch,getState){
        var filtermodel = {
            offset: 0,
            sort: "",
            filter: "",
            fields: "ID,Name,TeamMembers,TeamMailboxes",
            limit: 0
        };
        var params = { offset: filtermodel.offset, sort: filtermodel.sort, filter: filtermodel.filter, fields: filtermodel.fields, limit: filtermodel.limit }
        API.get(`Teams/`,params)
        .then(Teams=>{
            var response = Teams.filteredList
            var loadedTeams = []
            var mailboxID = getState().sidebar.selectedMailbox;
            response.map((v,i)=>{
                v.teamMailboxes.map((x,y)=>{
                    if(x.mailboxID == mailboxID){
                        loadedTeams.push(v)
                    }
                })
            })
            // console.log(loadedTeams)
            dispatch(_loadTeamsListSuccess(loadedTeams))
        })
        .catch(err=> {
            dispatch(_loadTeamsListFailed(err + 'Update team List Failed'))
        })
    }
}
//#endregion

//#endregion

//#region 'Assign User'
    //#region Local Methods
    function updateUserReport(userreport) {
        return {
            type: types.SET_USER_REPORT,
            payload: userreport
        }
    }
    export function setUserReport (userreport) {
        return function (dispatch,getState) {
               dispatch(updateUserReport(userreport));
        }
        
    }
function _updateAsigneeSuccess(conversation){
    return {
        type: types.SET_CONVERSATION,
        payload: conversation
    };
}
function _updateAsigneeFailed(err){
    return {
        type: types.UPDATE_ASIGNEE_FAILED,
        payload: err
    };
}
function _updateAsigneeStart(){
    return {
        type: types.ASSIGN_USER_START
    };
}
//#endregion
    //#region Global Methods
    export function assignTeamRequestedforCompose(team){
        return function(dispatch, getState) {
            dispatch(_updateAsigneeStart());
            var conversation = _.cloneDeep(getState().conversationPage.conversation);
            conversation.teamID = team.id;
            conversation.assignee = team.name;
            dispatch(_updateAsigneeSuccess(conversation));
        }
    }
    export function assignUserRequestedforCompose(user){
        return function(dispatch, getState) {
            dispatch(_updateAsigneeStart());        
                    var conversation = _.cloneDeep(getState().conversationPage.conversation);
                    conversation.userID = user.id;
                    conversation.assignee = user.userName;
                    dispatch(_updateAsigneeSuccess(conversation));   
        }
    }
    export function assignTeamRequested(team){
        return function(dispatch, getState){
            var convDTO = [];
            convDTO.push({
                ConversationID: getState().conversationPage.selectedConversationID,
                teamID: team.id
            });
            var params1 = {mailboxId:getState().sidebar.selectedMailbox.toString()}
            var body = {
                convTeams: convDTO, 
                mailboxId: getState().sidebar.selectedMailbox  
            };
            dispatch(_updateAsigneeStart());
            API.put(`Conversations/AssignConversationsToTeam2`,body)
            .then(data =>{

            var conversationHistoryList = [];
            var body = {
                activity: activityIDs.AssignedTo,
                conversationID: getState().conversationPage.selectedConversationID,   
                tagData: team.id   
            };
            conversationHistoryList.push(body);
            // Set history of status changed. 
            API.post(`ConversationHistories/CreateConversationsHistory`, conversationHistoryList)
            .then(data => {
                // Do nothing History updated
                var conversation = _.cloneDeep(getState().conversationPage.conversation);
                conversation.teamID = team.id;
                conversation.assignee = team.name;
                dispatch(_updateAsigneeSuccess(conversation));
            })
            .catch(err=> {
                // DIspatch error 
                dispatch(_doUpdateStatusFailed(err + " Cannot Create History."));
            })
            
        })
        .catch(err => {
            
            dispatch(_updateAsigneeFailed(err + " Update Asignee failed."));
        });
        }
    }
export function assignUserRequested(user){
    return function(dispatch, getState) {
        var convDTO = [];
        convDTO.push({
            ConversationID: getState().conversationPage.selectedConversationID,
            UserID: user.id
        });
        var body = {
            convUsers: convDTO, 
            mailboxId: getState().sidebar.selectedMailbox  
        };
        
        dispatch(_updateAsigneeStart());
        // ?mailboxId=${encodeURIComponent(mailboxId)}
        // Changed this method in webapi so as to accept all the parameters as body
        API.put(`Conversations/AssignConversationsToUser2`, body)
        .then(data =>{
            var conversationHistoryList = [];
            var body = {
                activity: activityIDs.AssignedTo,
                conversationID: getState().conversationPage.selectedConversationID,   
                tagData: user.id   
            };
            conversationHistoryList.push(body);
            // Set history of status changed. 
            API.post(`ConversationHistories/CreateConversationsHistory`, conversationHistoryList)
            .then(data => {
                // Do nothing History updated
                var conversation = _.cloneDeep(getState().conversationPage.conversation);
                conversation.userID = user.id;
                conversation.assignee = user.userName;
                dispatch(_updateAsigneeSuccess(conversation));
            })
            .catch(err=> {
                // DIspatch error 
                dispatch(_doUpdateStatusFailed(err + " Cannot Create History."));
            })
            
        })
        .catch(err => {
            
            dispatch(_updateAsigneeFailed(err + " Update Asignee failed."));
        });
    }
}
export function deleteAssignee(convid,id,index){
    return function(dispatch,getState)
    { 
        var convIDs = [convid]
        if(convid !== undefined){
            if(id == getState().conversationPage.conversation.teamID)
            {
                dispatch(_updateAsigneeStart());
            API.put(`Conversations/UnassignConversationsFromTeam`,convIDs)
        .then(res=>{
            var conversationHistoryList = [];
            var body = {
                activity: activityIDs.AssignedTo,
                conversationID: getState().conversationPage.selectedConversationID,   
                tagData: null   
            };
            conversationHistoryList.push(body);
            // Set history of status changed. 
            API.post(`ConversationHistories/CreateConversationsHistory`, conversationHistoryList)
            .then(data => {
                // Do nothing History updated
                var conversation = _.cloneDeep(getState().conversationPage.conversation);
                conversation.teamID = null;
                dispatch(_updateAsigneeSuccess(conversation));
            })
            .catch(err=> {
                // DIspatch error 
                dispatch(_doUpdateStatusFailed(err + " Cannot Create History."));
            })
            
        })
        .catch(err => {
            
            dispatch(_updateAsigneeFailed(err + " Update Asignee failed."));
        });
    }
        
        else if(id == getState().conversationPage.conversation.userID){
            dispatch(_updateAsigneeStart());
            API.put(`Conversations/UnassignConversationsFromUser`,convIDs)
            .then(res=>{
                var conversationHistoryList = [];
                var body = {
                    activity: activityIDs.AssignedTo,
                    conversationID: getState().conversationPage.selectedConversationID,   
                    tagData: null   
                };
                conversationHistoryList.push(body);
                // Set history of status changed. 
                API.post(`ConversationHistories/CreateConversationsHistory`, conversationHistoryList)
                .then(data => {
                    // Do nothing History updated
                    var conversation = _.cloneDeep(getState().conversationPage.conversation);
                    conversation.userID = null;
                    dispatch(_updateAsigneeSuccess(conversation));
                })
                .catch(err=> {
                    // DIspatch error 
                    dispatch(_doUpdateStatusFailed(err + " Cannot Create History."));
                })
                
            })
            .catch(err => {
                
                dispatch(_updateAsigneeFailed(err + " Update Asignee failed."));
            });
        }
    }
        else if(index == 0){
            var conversation = _.cloneDeep(getState().conversationPage.conversation);
            conversation.teamID = null;
            dispatch(_updateAsigneeSuccess(conversation));
        }
        else{
            var conversation = _.cloneDeep(getState().conversationPage.conversation);
            conversation.userID = null;
            dispatch(_updateAsigneeSuccess(conversation));
        }
        
    }
}

export function resetAssignPage() {
    return {
        type: types.RESET_ASSIGN_PAGE
    }
}
//#endregion
//#endregion

//#endregion