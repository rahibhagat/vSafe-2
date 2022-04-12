import API from "../api";
import NavigatorService from '../navigatorService/navigator';
import * as types from "../actionTypes";
// import { unsubscribePushNotification } from '../actions/pushNotificationAction';
import { showSnackBar,setSnackBarMessage } from "./checkListsPageActions";
import { getTodaysHealthAssesmentsList,getTodaysMessageLogs,setPath } from "./dashBoardPageActions";
import { getHealthAssesmentsByDate } from "./healthReportPageActions";
import { getStartAndEndTimeDate } from "../utility/index";
import { startVSafeSpinner, stopVSafeSpinner } from "./healthReportPageActions";
import { Toast,Icon } from 'native-base';
import { result, set } from "lodash";
import { func } from "prop-types";
import moment from "moment";


function _saveSelectedCheckList(checkList) {
    return {
        type: types.SAVE_SELECTED_CHECKLIST,
        payload: checkList
    }
}

function _resetSelectedCheckList() {
    return {
        type: types.RESET_SELECTED_CHECKLIST
    }
}

function _saveSelectedQuestion(selectedQuestion) {
    return {
        type: types.SAVE_SELECTED_QUESTION,
        payload: selectedQuestion
    }
}

function _startSpinnerToSubmitHealthAssesmentsReport() {
    return {
        type:types.START_SPINNER_TO_SUBMIT_HEALTH_ASSESMENT_REPORT,
    }
}

function _stopSpinnerToSubmitHealthAssesmentsReport() {
    return {
        type:types.STOP_SPINNER_TO_SUBMIT_HEALTH_ASSESMENT_REPORT,
    }
}

export function getSelectedCheckList(checkListId) {
    return function (dispatch, getState) {
        setTimeout(()=>{
            dispatch(startVSafeSpinner())
        },500)
        var PageNumber = 0;
        var PageSize = 10;
        // var Id = '2de520c5-599e-4491-a0e7-08d88c69ab87'
        API.get(`checklists/${checkListId}?Fields=Id,Name,Location.Name as LocationName,ChecklistQuestions.Select(x=>new {x.Id,x.Name,x.Type,x.Order,x.IsMultiOption,x.IsMultiAnswer,x.TerminateOnError,x.ErrorMessage,x.ChecklistQuestionMultiOptions.Select(y=>new {y.Id,y.Name,y.Order,y.Type}) as ChecklistQuestionMultiOptions}) as ChecklistQuestions`)
            .then(result => {
                // console.log(result)
                var selectedCheckList = result
                dispatch(_saveSelectedCheckList(selectedCheckList))
                setTimeout(()=>{
                    dispatch(stopVSafeSpinner())
                },1000)
            })
            .catch(err => {
                console.log(err)
                dispatch(stopVSafeSpinner())
            })
    }
}

export function resetSelectedCheckList() {
    return function (dispatch, getState) {
        dispatch(_resetSelectedCheckList())
    }
}

export function submitYourReport(question,notes) {
    return function (dispatch, getState) {
        var array = [];
        var user = getState().login.user;
        var negative = false
        var savedQuestions = getState().bodyAssessmentPage.selectedQuestions;
        var checkListId = getState().checkListsPage.selectedCheckListId;
        var savedPath = getState().dashBoardPage.savedPath
        
        question.map((s,i)=>{[
            s.checklistQuestionMultiOptions.map((x,y)=>{
                if(x.selected == true) {
                    if(x.type == 2){
                        negative = true
                    }
                }
            })
        ]})
        question.map((x, y) => {
            var questionId = x.id
            x.checklistQuestionMultiOptions.map((s, i) => {
                if (s.selected == true) {
                    var selectedQuestionDtoModel = {
                        // healthAssesmentId: "",
                        checklistQuestionId: "",
                        checklistQuestionMultiOptionId: "",
                        departmentId: "",
                        locationId: ""
                    }
                    selectedQuestionDtoModel.checklistQuestionId = questionId
                    selectedQuestionDtoModel.checklistQuestionMultiOptionId = s.id
                    selectedQuestionDtoModel.departmentId = user.departmentId
                    selectedQuestionDtoModel.locationId = user.locationId
                    array.push(selectedQuestionDtoModel)
                }
            })
        })
        // console.log(array)
        var submitReportDto = {
            uploadedById: user.id,
            status: negative == true ? 2 : 1,
            notes: notes,
            checklistId: checkListId,
            locationId: user.locationId,
            departmentId: user.departmentId,
            "healthAssesmentRecords": array
        }

        // console.log(submitReportDto)
        dispatch(_startSpinnerToSubmitHealthAssesmentsReport())
        API.post(`healthassesments`,submitReportDto)
        .then(response=>{
        //   console.log(response)
          dispatch(_stopSpinnerToSubmitHealthAssesmentsReport())
          dispatch(_resetSelectedCheckList())
          dispatch(setSnackBarMessage('Submitted Successfully'))
          dispatch(showSnackBar())
          if(savedPath == "DashBoardPage") {
                        setTimeout(()=>{
            NavigatorService.navigate('DashBoardPage')
          },1000)
          var enddate = moment.tz(user.account.timeZoneIDStringJS).toDate();
          var startdate = moment.tz(user.account.timeZoneIDStringJS).toDate();
          var dates =  getStartAndEndTimeDate(startdate,enddate,user.account.timeZoneIDStringJS,user.account.dateFormat,user.account.is12HRTimeFormat)
          setTimeout(()=>{
            dispatch(getTodaysHealthAssesmentsList(dates.startdatetime,dates.enddatetime))
            dispatch(getTodaysMessageLogs(dates.startdatetime,dates.enddatetime))
          },2000)
          }
          else if(savedPath == "HealthReportPage") {
            setTimeout(()=>{
                NavigatorService.navigate('HealthReportPage')
              },1000)
              var currentdate = new Date(); 
            //   var datetime =  (currentdate.getMonth()+1)  + "/"
            //                   + currentdate.getDate()  + "/" 
            //                   + currentdate.getFullYear() + " "  
            //                   + "00" + ":"  
            //                   + "00" + ":" 
            //                   + "00";
               var enddate = moment.tz(user.account.timeZoneIDStringJS).toDate();
               var startdate = moment.tz(user.account.timeZoneIDStringJS).toDate();
               var dates =  getStartAndEndTimeDate(startdate,enddate,user.account.timeZoneIDStringJS,user.account.dateFormat,user.account.is12HRTimeFormat)
               setTimeout(()=>{
                dispatch(getHealthAssesmentsByDate(dates.startdatetime,dates.enddatetime))
              },2000)               
          }
        })
        .catch(err=>{
            dispatch(_stopSpinnerToSubmitHealthAssesmentsReport())
            dispatch(_resetSelectedCheckList())
            dispatch(showSnackBar('Something went wrong'))
            console.log(err);
        })
    }
}

export function resetBodyAssesmentPage() {
    return {
        type: types.RESET_BODYASSESMENT_PAGE
    }
}
//#endregion