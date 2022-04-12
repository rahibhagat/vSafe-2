import API from "../api";
import NavigatorService from '../navigatorService/navigator';
import * as types from "../actionTypes";
// import { unsubscribePushNotification } from '../actions/pushNotificationAction';
import { getSelectedCheckList } from "./bodyAssessmentPageActions";
import { startVSafeSpinner, stopVSafeSpinner } from "./healthReportPageActions";
import {ActionSheet, Toast} from 'native-base';
import { result } from "lodash";


function _saveConfiguredCheckList(checkList) {
    return {
        type: types.SAVE_CONFIGURED_CHECKLIST,
        payload: checkList
    }
}


function _saveSelectedCheckListId(id) {
    return {
        type: types.SAVE_SELECTED_CHECKLIST_ID,
        payload: id
    }
}

export function showSnackBar(msgtype) {
    return  {
        type:types.SHOW_SNACKBAR,
        payload:msgtype
    }
}
export function hideSnackBar() {
    return  {
        type:types.HIDE_SNACKBAR,
    }
}

export function setSnackBarMessage(snackbarMessage) {
    return {
        type: types.SET_SNACKBAR_MSG,
        payload:snackbarMessage
    }
}

export function getCheckLists() {
    return function (dispatch,getState) {
        var PageNumber = 0;
        var PageSize = 10;
        var user = getState().login.user;
        var Id = '2de520c5-599e-4491-a0e7-08d88c69ab87'
        var locationId = `${user.locationId}`
        var filter = {
            SearchQuery: "LocationId==" + '"' + locationId + '"'
        }
        API.get(`checklists`,filter)
        .then(result => {
            //    console.log(result)
               var configuredCheckList = result
               if(configuredCheckList.length == 1) {
                dispatch(selectedCheckListId(configuredCheckList[0].id));
                dispatch(getSelectedCheckList(configuredCheckList[0].id));
                NavigatorService.navigate('BodyAssessmentPage',{onle1CheckList:true,selectedCheckListName:configuredCheckList[0].name});
               }
               dispatch(_saveConfiguredCheckList(configuredCheckList))
        })
        .catch(err=> {
             console.log(err)
        })
    }
}

export function selectedCheckListId(selectedCheckListId) {
    return function (dispatch,getState) {
        dispatch(_saveSelectedCheckListId(selectedCheckListId))
    }
}

export function resetCheckListPage() {
    return {
        type: types.RESET_CHECKLIST_PAGE
    }
}
//#endregion 