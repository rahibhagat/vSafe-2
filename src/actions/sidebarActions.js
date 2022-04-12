import API from "../api";
import NavigatorService from '../navigatorService/navigator';
import * as types from '../actionTypes/index';
import { logoutUserRequested } from './loginAction';
import { unloadConversationList } from './testBodyPageActions';
import { Toast } from 'native-base'
import { conversationType, activityIDs, conversationStatus, loadActivity,CustomFieldTypes,sidebarListEnum } from '../constants/vSafeEnum'


//#region 'Load Badge Count'

function _loadBadgeCountSuccess(badgeData) {
    return {
        type: types.UPDATE_BADGE_COUNT,
        payload: badgeData
    };
}
function _loadBadgeCountForTeamSuccess(badgeData) {
    return {
        type: types.UPDATE_TEAM_BADGE_COUNT,
        payload: badgeData
    }
}
function _loadBadgeCountFailed(err) {
    return {
        type: types.UPDATE_BADGE_COUNT_FAILED,
        payload: err
    };
}
export function loadBadgeCountRequested() {
    return function (dispatch, getState) {
        var selectedMailbox = getState().sidebar.selectedMailbox;
        var userId = getState().login.user.userID;
        var params = {
            mailboxID: selectedMailbox
        }

        var filterOptions = {
            offset: 0,
            sort: "",
            filter: "UserID==" + userId + " AND Mailbox.id =="+ selectedMailbox,
            fields: "MailboxID as ID, Mailbox.CompanyID, Mailbox.EmailID, Mailbox.MailboxName,Mailbox.Confirmed,Mailbox.ResetLinkTime,"
                     + "Mailbox.Conversations.Where(Status!=" + conversationStatus.Spam + " && Status != " + conversationStatus.Closed + ").Count() as AllConversationCount,"
                     + "Mailbox.Conversations.Where(Status == " + conversationStatus.Closed + ").Count() as ClosedConversationCount,"
                     + "Mailbox.Conversations.Where(Status == " + conversationStatus.Spam + ").Count() as SpamConversationCount,"
                     + "Mailbox.Conversations.Where(UserID == null && TeamID == null && Status !=" + conversationStatus.Spam +  " && Status != " + conversationStatus.Closed + ").Count() as UnAssgnedConversationCount,"
                     + "Mailbox.Conversations.Where(UserID == " + userId+ " && Status!=" + conversationStatus.Spam +  " && Status != " + conversationStatus.Closed + ").Count() as MineConversationCount,"
                     + "Mailbox.Conversations.Where(Status!=" + conversationStatus.Pending + " && Status!=" + conversationStatus.Spam + " && Status != " + conversationStatus.Closed + ").Count() as OpenConversationCount",
                     
            limit: 0
        };

       
        API.get(`MailboxUsers/`, filterOptions)
            .then(badgeData => {
                dispatch(_loadBadgeCountSuccess(badgeData.filteredList[0]));
                 API.get(`Mailboxes/getMailboxInfoByMailboxID/`, params)
            .then(badgeData => {
                // console.log(badgeData);
                dispatch(_loadBadgeCountForTeamSuccess(badgeData.teamCountInfo));
            })
            .catch(err => {
                dispatch(_loadBadgeCountFailed(err + 'Update Badge Failed !!'));
                Toast.show({ text: "Thers is no Internet", textStyle: { color: "white" }, buttonText: "okay", type: "danger", duration: 5000, position: 'bottom' })
            })
            })
            .catch(err => {
                dispatch(_loadBadgeCountFailed(err + 'Update Badge Failed !!'));
                Toast.show({ text: "Thers is no Internet", textStyle: { color: "white" }, buttonText: "okay", type: "danger", duration: 5000, position: 'bottom' })
            })
    }
}
//#endregion

//#region 'Load User Sidebar List'
export function loadUserSidebarList(sidebarList) {
    return {
        type: types.SET_SIDEBAR_LIST,
        payload: sidebarList
    };
}
//#endregion

//#region 'Load User Mailbox List'
function _loadUserMailboxListSuccess(userMailboxData) {
    return {
        type: types.GET_USER_MAILBOX_LIST,
        payload: userMailboxData
    };
}
function _loadUserMailboxListFailed(err) {
    return {
        type: types.GET_USER_MAILBOX_LIST_FAILED,
        payload: err
    };
}
function loadedMailBoxInfoforDefaultSetting(DefaultStatus) {
    return {
        type: types.SET_MAILBOX_DEFAULT_SETTING,
        payload: DefaultStatus
    }
}
function _loadMailBoxTeamListSuccess(mailboxteamlist) {
    return {
        type: types.GET_MAILBOX_TEAMLIST,
        payload: mailboxteamlist
    }
}
export function _loadMailBoxCustomField(customField) {
    return {
        type: types.SET_MAILBOX_CUSTOM_FIELD,
        payload: customField
    }
}
export function _setMailboxPermission(err) {
    return {
        type: types.SET_MAILBOX_PERMISSION,
        payload: err
    }
}
export function _sendInviteToConfirmMailbox(mailboxID) {
    return function (dispatch, getState) {
        var params = {
            mailboxID: mailboxID,
        }
        API.put(`Mailboxes/SendInviteToMailboxAddress`, params)
            .then(res => {
                // console.log(res)
            })
    }
}
export function loadMailboxTeamListRequested(){
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
            dispatch(_loadMailBoxTeamListSuccess(loadedTeams))
        })
        .catch(err=> {
            dispatch(_loadTeamsListFailed(err + 'Update team List Failed'))
        })
    }
}
export function loadMailBoxCustomFields(selectedMailbox) {
    return function (dispatch, getState) {
        var selectedMailbox = getState().sidebar.selectedMailbox;
        var filtermodel = {
            offset: 0,
            limit: 0,
            sort: "",
            filter: "MailboxID==" + selectedMailbox,
            fields: "ID,Name,MailboxID,CustomFieldType,Data,Sequence"
        };
        var params = { offset: filtermodel.offset, sort: filtermodel.sort, filter: filtermodel.filter, fields: filtermodel.fields, limit: filtermodel.limit }
        API.get(`MailboxCustomField/`, params)
            .then(MailboxCustomField => {
                // console.log(MailboxCustomField)
                var sortedCustomFieldlist =  MailboxCustomField.filteredList.sort(function(x,y){
                    return  x.sequence - y.sequence 
                })
                var newmailboxcustomfields = sortedCustomFieldlist.map((v,i)=>{
                    v.value = '';
                    // v.data = JSON.parse(v.data)
                    return v;
                })
                // console.log(newmailboxcustomfields)
                dispatch(_loadMailBoxCustomField(newmailboxcustomfields))
                var dropdowndata = []
                // MailboxCustomField.filteredList.map((filter) => {
                //     if (filter.customFieldType == 2) {
                //         var filterid = filter.id
                //         var datafilter = JSON.parse(filter.data)
                //         datafilter.dropdownOptions.map((s, i) => {
                //             dropdowndata.push({ id: filterid, value: i, name: s })
                //         })
                //     }
                // })
                // console.log(dropdowndata)
            })

    }
}
export function loadMailBoxInfoforDefaultSetting() {
    return function (dispatch, getState) {
        var selectedMailbox = getState().sidebar.selectedMailbox;
        var fields = "Id, CompanyID, MailboxName, EmailID, Alias, FromName, DefaultStatus, DefaultAssignee, EmailTemplate, EmailSignature, AutoReplyStatus, AutoReplySubject, AutoReplyMessage, ConnectionSetting, Salutation, RowStatus, ContactUsSetting,AllowEmailNotification,AllowSmsNotification,Confirmed,ResetLinkTime"
        var params = {
            fields: fields
        }
        API.get(`Mailboxes/` + selectedMailbox, params)
            .then(MailboxInfo => {
                var MailboxDefaultSettingInfo = {
                    defaultStatus: MailboxInfo.defaultStatus,
                    defaultAssignee: MailboxInfo.defaultAssignee
                }
                dispatch(loadedMailBoxInfoforDefaultSetting(MailboxDefaultSettingInfo))
                dispatch(loadMailBoxCustomFields(selectedMailbox))
            })
    }
}
export function loadUserMailboxListRequested() {
    return function (dispatch, getState) {
        var userId = getState().login.user.userID;
        var filterOptions = {
            offset: 0,
            sort: "",
            filter: "UserID==" + userId,
            fields: "MailboxID as ID,Mailbox.MailboxName as MailboxName, Mailbox.ContactUsSetting as ContactUsSetting, Mailbox.ConnectionSetting as ConnectionSetting,Mailbox.Confirmed as Confirmed",
            limit: 0
        };
        API.get(`MailboxUsers/`, filterOptions)
            .then(userMailboxData => {
                if (userMailboxData.filteredList[0].confirmed == true) {
                    var alreadyselectedmailbox = getState().sidebar.selectedMailbox
                    dispatch(_loadUserMailboxListSuccess(userMailboxData));
                    if(alreadyselectedmailbox == 0) {
                        dispatch(setSelectedMailbox(userMailboxData.filteredList[0].id));
                    }
                    dispatch(loadMailboxTeamListRequested())
                    dispatch(loadBadgeCountRequested());
                    dispatch(loadMailBoxInfoforDefaultSetting());
                }
                else {
                    dispatch(_setMailboxPermission(userMailboxData.filteredList[0]));
                }
            })
            .catch(err => {
                // dispatch(resetSidebar())
                dispatch(setSelectedMailbox(0));
                dispatch(unloadConversationList())
                dispatch(logoutUserRequested('Your Session has been expired..Please Login Again'))
                dispatch(_loadUserMailboxListFailed(err + 'Get Mailbox List Failed !!'));

            });
    }
}
//#endregion
export function resetSidebar() {
    return {
        type: types.RESET_SIDEBAR
    }
}
export function resetSelectedFilter() {
    return {
        type: types.RESET_SELECTED_FILTER
    }
}
export function setSelectedMailbox(mailboxID) {
    return {
        type: types.SET_SELECTED_MAILBOX,
        payload: mailboxID
    };
}
export function setSelectedTeam(teamID) {
    return {
        type: types.SET_SELECTED_TEAM,
        payload: teamID
    }
}
export function setSelectedSidebarListItem(selectedListItem) {
    return {
        type: types.SET_SELECTED_SIDEBAR_LISTITEM,
        payload: selectedListItem
    };
}