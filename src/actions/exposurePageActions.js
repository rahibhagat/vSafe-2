import API from "../api";
import NavigatorService from '../navigatorService/navigator';
import * as types from "../actionTypes";
import { startVSafeSpinner, stopVSafeSpinner } from "./healthReportPageActions";
import { showSnackBar,setSnackBarMessage } from "./checkListsPageActions";
import { getStartAndEndTimeDate } from "../utility/index";
import moment from "moment";


function _saveContacts(contactsList) {
    return {
        type: types.SAVE_CONTACTS_LIST,
        payload: contactsList
    }
}

function _saveSearchContactList(list) {
    return {
        type: types.SAVE_SEARCHED_CONTACT_LIST,
        payload: list
    }
}

function _saveEmploeeExposures(list) {
    return {
        type: types.SAVE_EMPLOYEE_EXPOSURES,
        payload: list
    }
}

function _saveExternalExposures(list) {
    return {
        type: types.SAVE_EXTERNAL_EXPOSURES,
        payload: list
    }
}

function _saveSelectedExternalExposureDetails(selectedExternalExposureDetail) {
    return {
        type: types.SAVE_SELECTED_EXTERNAL_EXPOSURE_DETAIL,
        payload: selectedExternalExposureDetail
    }
}

function _saveEmployeeExposureReport(employeeExposureReport) {
    return {
        type: types.SAVE_EMPLOYEE_EXPOSURE_REPORT,
        payload: employeeExposureReport
    }
}

export function _showFormToAddNewContacts(value) {
    return {
        type: types.SHOW_FORM_TO_ADD_NEW_CONTACTS,
        payload: value
    }
}

export function getAllContacts(startdatetime,enddatetime) {
    return function (dispatch, getState) {
        dispatch(startVSafeSpinner())
        var user = getState().login.user;
        var filter = {
            SearchQuery : 'CreatedOn' + '>=' + '"' + startdatetime.toString() + '"' + '&&' + 'CreatedOn' + '<=' + '"' + enddatetime.toString() + '"',
            Fields: 'Id,Name,Email,Company,Phone',
            PageSize:100
        }
        API.get(`externalcontacts`, filter)
            .then(res => {
                // console.log(res)
                if(res.length > 0) {
                    res.reverse()
                    dispatch(_saveContacts(res))
                }
                else{
                    dispatch(_saveContacts(undefined))
                }
                dispatch(stopVSafeSpinner())
            })
            .catch(err => {
                dispatch(stopVSafeSpinner())
                console.log(err)
            })
    }
}

export function getAllExteranlExposure(startdatetime,enddatetime) {
    return function (dispatch, getState) {
        dispatch(startVSafeSpinner())
        var user = getState().login.user;
        var filter = {
            SearchQuery : 'EmployeeId=' + '"' + user.id +  '"' + '&&' + 'CreatedOn' + '>=' + '"' + startdatetime.toString() + '"' + '&&' + 'CreatedOn' + '<=' + '"' + enddatetime.toString() + '"',
            Fields: 'Id,RSSI,StartContactDate,EndContactDate,ExternalContactId,ExternalContact as ExternalContact',
            PageSize:100
        }
        API.get(`externalexposers`, filter)
            .then(res => {
                // console.log(res)
                if(res.length > 0) {
                    res.reverse()
                    dispatch(_saveExternalExposures(res))
                }
                else{
                    dispatch(_saveExternalExposures(undefined))
                }
                dispatch(stopVSafeSpinner())
            })
            .catch(err => {
                dispatch(stopVSafeSpinner())
                console.log(err)
            })
    }
}

export function getExteranlExposureById(id) {
    return function (dispatch,getState) {
        dispatch(startVSafeSpinner())
        var filter = {
            Fields:'StartContactDate,EndContactDate,ExternalContact,Purpose'
        }
        API.get(`externalexposers/${id}`,filter)
        .then(res=>{
        //    console.log(res)
           dispatch(_saveSelectedExternalExposureDetails(res))
           dispatch(stopVSafeSpinner())
        })
        .catch(err=>{
            console.log(err)
            dispatch(stopVSafeSpinner())
        })
    }
}

export function getContactListFromSearchedText(text) {
    return function (dispatch, getState) {
        if (text.length == 0) {
                dispatch(clearExternalContactList())
        }
        else {
            var filter = {
                SearchQuery: "Name.Contains" + "(" + '"' + text + '"' + ")" + ' ' + "or" + ' ' + "Email.Contains" + "(" + '"' + text + '"' + ")",
                Fields: 'Id,Name,Email,Company,Phone'
            }
            API.get(`externalcontacts`, filter)
                .then(res => {
                    // console.log(res);
                    // dispatch(getAllContacts(res))
                    dispatch(_saveSearchContactList(res))
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }
}

export function createNewExternalContact(contactDto) {
    return function (dispatch, getState) {
        var user = getState().login.user;
        API.post(`externalcontacts`, contactDto)
            .then(res => {
                // console.log(res)
                var ExposureContactDto = {
                    externalContactId: res.id,
                    rssi: -40,
                    startContactDate: new Date().toUTCString(),
                    endContactDate: new Date().toUTCString(),
                    purpose:contactDto.purpose,
                    employeeId: user.id,
                    departmentId: user.departmentId,
                    locationId: user.locationId
                  }
                // var dates = getStartAndEndTimeDate(new Date(),new Date())
                // dispatch(getAllExteranlExposure(dates.startdatetime,dates.enddatetime))
                // dispatch(showSnackBar('Created Successfully'))
                dispatch(createNewExternalExposureContact(ExposureContactDto))
            })
            .catch(err => {
                console.log(err)
                dispatch(showSnackBar('Something Went Wrong'))
            })
    }
}

export function createNewExternalExposureContact(contactDto) {
    return function (dispatch, getState) {
        var user = getState().login.user;
        API.post(`externalexposers`, contactDto)
            .then(res => {
                // console.log(res)
                var enddate = moment.tz(user.account.timeZoneIDStringJS).toDate();
                var startdate = moment.tz(user.account.timeZoneIDStringJS).toDate();
                var dates = getStartAndEndTimeDate(startdate,enddate,user.account.timeZoneIDStringJS,user.account.dateFormat,user.account.is12HRTimeFormat)
                dispatch(getAllExteranlExposure(dates.startdatetime,dates.enddatetime))
                dispatch(setSnackBarMessage('Submitted Successfully'))
                dispatch(showSnackBar())
            })
            .catch(err => {
                console.log(err)
                dispatch(showSnackBar('Something Went Wrong'))
            })
    }
}

export function getEmployeeExposuresReport(startdatetime,enddatetime,formValue) {
    return function (dispatch,getState) {
        var user = getState().login.user;
        dispatch(startVSafeSpinner())
        var filter = {
            EmployeeId: user.id,
            startDate: startdatetime.toString(),
            endDate: enddatetime.toString()
        }
        API.get(`employeeexposers/exposerreport`,filter).
        then(res=>{
            // console.log(res)
            if(res.employeeExposers.length > 0) {
                var employeeExpossureRepost = res.employeeExposers.reverse()
                dispatch(_saveEmployeeExposureReport(employeeExpossureRepost))
            }
            else {
                dispatch(_saveEmployeeExposureReport(undefined))
            }
            dispatch(stopVSafeSpinner())
            if(formValue != undefined) {
                setTimeout(()=>{
                    dispatch(_showFormToAddNewContacts(true))
                },500)
            }
        })
        .catch(err=>{
            dispatch(stopVSafeSpinner())
            console.log(err)
        })
    }
}

export function getAllEmployeeExposures(startdatetime,enddatetime) {
    return function (dispatch, getState) {
        var user = getState().login.user;
        dispatch(startVSafeSpinner())
        var filter  = {
            SearchQuery : 'EmployeeId=' + '"' + user.id +  '"' + '&&' + 'CreatedOn' + '>=' + '"' + startdatetime.toString() + '"' + '&&' + 'CreatedOn' + '<=' + '"' + enddatetime.toString() + '"',
            Fields : 'Id,StartContactDate,EndContactDate,RSSI,ContactId,ContactEmployee.FName,ContactEmployee.LName,ContactEmployee.Name',
            PageSize:10000
        }
        API.get(`employeeexposers`,filter)
            .then(res => {
                // console.log(res)
                if(res.length > 0){
                    res.reverse()
                    dispatch(_saveEmploeeExposures(res))
                }
                else {
                    dispatch(_saveEmploeeExposures(undefined))
                }
                dispatch(stopVSafeSpinner())

            })
            .catch(err => {
                dispatch(stopVSafeSpinner())
               console.log(err)
            })
    }

}

export function clearExternalContactList() {
    return {
        type: types.CLEAR_EXTERNAL_CONTACT_LIST,
    }
}


export function clearSelectedExternalExposureDetail() {
    return {
        type:types.CLEAR_SELECTED_EXTERNAL_EXPOSURE_DETAIL
    }
}

export function resetExposurePage() {
    return {
        type: types.RESET_EXPOSURE_PAGE
    }
}
//#endregion

//#endregion

