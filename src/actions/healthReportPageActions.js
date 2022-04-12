import API from "../api";
import NavigatorService from '../navigatorService/navigator';
import * as types from "../actionTypes";
// import { unsubscribePushNotification } from '../actions/pushNotificationAction';
import {ActionSheet, Toast} from 'native-base';
import { result } from "lodash";

function _saveHealthAssesments(healthAssesments) {
    return {
        type:types.SAVE_HEALTH_ASSESMENTS,
        payload: healthAssesments
    }
}

function _showVSafeSpinner() {
    return {
        type: types.SHOW_VSAFE_SPINNER
    }
}

function _hideVSafeSpinner() {
    return {
        type: types.HIDE_VSAFE_SPINNER
    }
}

function _showAttemptedCheckList(list) {
    return {
        type: types.SHOW_ATTEMPTED_READ_ONLY_CHECKLIST,
        payload: list
    }
}

function _resetAttemptedReadOnlyCheckList() {
    return {
        type: types.RESET_ATTEMPTED_READ_ONLY_CHECKLIST
    }
}

function _saveSelectedHealthAssesmentRecords(list) {
    return {
        type: types.SAVE_SELECTED_HEALTH_ASSESMENT_RECORDS,
        payload: list
    }
}

function _saveMessageLogs(list) {
    return {
        type: types.SAVE_MESSAGE_LOGS,
        payload: list
    } 
}

function _clearMessageLogs() {
    return {
        type: types.CLEAR_MESSAGE_LOGS
    }
}

export function getHealthAssesmentsByDate(startDateTime,endDateTime) {
    return function (dispatch,getState) {
        dispatch(startVSafeSpinner())
          var user = getState().login.user;
          var filter  = {
              SearchQuery : 'UploadedById=' + '"' + user.id + '"' + '&&' + 'CreatedOn' + '>=' + '"' + startDateTime.toString() + '"' + '&&' + 'CreatedOn' + '<=' + '"' + endDateTime.toString() + '"',
              Fields : 'Id,Status,CheckList.Id as CheckListId,Checklist.Name as ChecklistName,UploadedBy.LastAssesmentDate as LastAssesmentDate,CreatedOn'
          }
          API.get(`healthassesments`,filter)
          .then(res=> {
            //    console.log(res);
            if(res.length > 0) {
                res.reverse()
                dispatch(_saveHealthAssesments(res))
            }
            else {
                dispatch(_saveHealthAssesments(undefined))
            }
               dispatch(stopVSafeSpinner())
          })
          .catch(err=> {
            console.log(err);
          })
    }
}

export function getSelectedHealthAssesmentRecords(checkListId,id) {
    return function (dispatch,getState) {
        var healthAssesmentRecords = undefined;
        var filter = {
              Fields: 'Id,Status,Notes,Checklist,UploadedBy.LastAssesmentDate as LastAssesmentDate,HealthAssesmentRecords'
        }
        API.get(`healthassesments/${id}`,filter)
        .then(res=>{
        //    console.log(res)
           healthAssesmentRecords = res;
           dispatch(_saveSelectedHealthAssesmentRecords(res))
           API.get(`checklists/${checkListId}?Fields=Id,Name,Location.Name as LocationName,ChecklistQuestions.Select(x=>new {x.Id,x.Name,x.Type,x.Order,x.IsMultiOption,x.IsMultiAnswer,x.TerminateOnError,x.ErrorMessage,x.ChecklistQuestionMultiOptions.Select(y=>new {y.Id,y.Name,y.Order,y.Type}) as ChecklistQuestionMultiOptions}) as ChecklistQuestions`)
            .then(result => {
                // console.log(result)
                var healthAssesmentsRecord
                var selectedCheckList = result
                healthAssesmentRecords.healthAssesmentRecords.map((s,i)=>{
                    var recordQueId = s.checklistQuestionId
                    var recordQueMultiOptionId = s.checklistQuestionMultiOptionId
                    result.checklistQuestions.map((a,b)=>{
                        if(recordQueId == a.id) {
                           a.checklistQuestionMultiOptions.map((x,y)=>{
                               if(recordQueMultiOptionId == x.id){
                                   x.selected = true
                               }
                           })
                        }
                    })
                })
                // console.log(result)
                dispatch(_showAttemptedCheckList(result))
                dispatch(stopVSafeSpinner())
            })
            .catch(err => {
                console.log(err)
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }
}

export function getMessageLogsByDate(startdatetime, enddatetime,pageNumber,pageSize,onScroll,onDateChange) {
    return function(dispatch,getState) {
        var user = getState().login.user;
        var renderedList = getState().healthReportPage.messageLogsList;
        // '&&' + 'FromEmployeeId=' + '"' + user.id + '"' + '||' + 'ToEmployeeId=' + '"' + user.id + '"',
        var filter = {
            PageNumber:pageNumber,
            PageSize: 10,
            SearchQuery: 'CreatedOn' + '>=' + '"' + startdatetime.toString() + '"' + '&&' + 'CreatedOn' + '<=' + '"' + enddatetime.toString() + '"' + '&&' + `toEmployeeId!=fromEmployeeId && (toEmployeeId="${user.id}" || fromEmployeeId="${user.id}")`,
            Fields: 'Id,FromEmployeeId,ToEmployeeId,Description,IsPushNotification,PushNotificationStatus,IsEmailNotification,EmailNotificationStatus,IsSMSNotification,SMSNotificationStatus,new {fromEmployee.fname,fromEmployee.lname} as fromEmployee,new {toEmployee.fname,toEmployee.lname} as toEmployee,updatedOn,createdOn'
        }
       API.get(`messagelogs`,filter)
       .then(res=>{
        // console.log(res)
        if(onDateChange) {
            dispatch(_saveMessageLogs(res.reverse()))
        }
        else if(onScroll) {
            if(res.length > 0) {
                if(renderedList.length > 0) {
                    var response = res.reverse()
                    var finalList = renderedList.concat(response)
                    dispatch(_saveMessageLogs(finalList));
                }
                else {
                  dispatch(_saveMessageLogs(res.reverse()))
                }
            }
            else if(renderedList.length > 0) {
                dispatch(_saveMessageLogs(renderedList))
              }
              else {
                dispatch(_saveMessageLogs(res))
              }
        }
          dispatch(stopVSafeSpinner())
       })
       .catch(err=>{
        dispatch(_saveMessageLogs([]))
        dispatch(stopVSafeSpinner())
        console.log(err)
       }) 
    }
}
export function clearMessageLogs() {
    return function (dispatch,getState) {
        dispatch(_clearMessageLogs())
    }
}
export function startVSafeSpinner() {
    return function (dispatch,getState) {
        dispatch(_showVSafeSpinner())
    }
}
export function stopVSafeSpinner() {
    return function (dispatch,getState) {
        dispatch(_hideVSafeSpinner())
    }
}
export function resetAttemptedReadOnlyCheckList() {
    return function (dispatch,getState) {
        dispatch(_resetAttemptedReadOnlyCheckList())
    }
}
export function resetHealthReportPage() {
    return {
        type: types.RESET_HEALTH_REPORT_PAGE
    }
}
//#endregion 