import API from "../api";
import NavigatorService from '../navigatorService/navigator';
import * as types from "../actionTypes";
import { conversationType, activityIDs,snackBarMessages } from '../constants/vSafeEnum'
import _ from "lodash";
import AsyncStorage from "@react-native-community/async-storage";
import { ActionSheet } from "native-base";
import BLEAdvertiser from 'react-native-ble-advertiser';
var moment = require('moment-timezone');
import { startVSafeSpinner, stopVSafeSpinner } from "./healthReportPageActions";
import { showSnackBar,setSnackBarMessage } from "./checkListsPageActions";
import { saveDeviceLocally, getDeciveFromLocal } from "../utility/index";
const APPLE_ID = 0x1C;
import English from "../languages/english.json";
import French from "../languages/french.json";

function saveBleScannedDeviceFinalList(params) {
    return {
        type: types.SET_BLE_SCANNED_DEVICES,
        payload: params

    }
}

function setBleAdvertisingStatus(value) {
    return {
        type: types.SET_BLE_ADVERTISING_STATUS,
        payload: value
    }
}

function _saveTodaysHealthAssesments(healthAssesments) {
    return {
        type: types.SAVE_TODAY_HEALTH_ASSESMENTS,
        payload: healthAssesments
    }
}

function _setrefershHealtAssesmentsList(value) {
    return {
        type: types.REFRESHING_HEALTH_ASSESMENTS_LIST,
        payload: value
    }
}

export function _updateEmailNotificationSettings(value) {
    return {
        type: types.UPDATE_EMAIL_NOTIFICATION_SETTINGS,
        payload:value
    }
}

export function _updateSMSNotificationSettings(value) {
    return {
        type: types.UPDATE_SMS_NOTIFICATION_SETTINGS,
        payload:value
    }
}

export function _updatePushNotificationSettings(value) {
    return {
        type: types.UPDATE_PUSH_NOTIFICATION_SETTINGS,
        payload:value
    }
}

function _setSelectedLanguageFile(selectedLanguageFile) {
    return {
        type: types.SET_SELECTED_LANGUAGE_FILE,
        payload: selectedLanguageFile
    }
}

function _saveTodaysMessageLogs(messageLogs) {
    return {
        type: types.SAVE_TODAYS_MESSAGE_LOGS,
        payload: messageLogs
    }
}

function _saveSearchSavedMessageList(list) {
    return {
        type: types.SAVE_SEARCHED_SAVED_MESSAGE_LIST,
        payload: list
    }
}

function _saveUploadBleDeviceError(error) {
    return {
        type: types.SAVE_UPLOAD_BLE_DEVICE_ERROR,
        payload: error
    }
}

function _saveUpdateBleDeviceError(error) {
    return {
        type: types.SAVE_UPDATE_BLE_DEVICE_ERROR,
        payload: error
    }
}

export function saveBleScannedDevices(bleDeviceslist) {
    return function (dispatch, getState) {
        var scannedDevice = getState().dashBoardPage.scannedDeviceList;
        var user = getState().login.user;
       var devicesList =  bleDeviceslist.reduce((unique, o) => {
            if(!unique.some(obj => obj.contactId === o.contactId)) {
              unique.push(o);
            }
            return unique;
        },[]);
        // console.log("SCANNED DEVICELIST",devicesList);
        // will execute when we don't have any scanned devices in state
        getDeciveFromLocal()
            .then(res => {
                if(res !== null){
                    if (res.length > 0) {
                        // console.log("LOCALLY STORED DEVICE",res)
                        var uploadDevice = []
                        var updateDevice = []
                        // update device
                        res.map((s, i) => {
                            var id = s.contactId
                            devicesList.map((x, y) => {
                                if (id == x.contactId) {
                                    s.endContactDate = new Date().toUTCString()
                                    updateDevice.push(s)
                                }
                            })
                        })
    
                        // upload device
                        var set1 = new Set(res.map(({ contactId }) => contactId))
                        var set2 = new Set(devicesList.map(({ contactId }) => contactId))
                        var result1 = res.filter(({ contactId }) => !set2.has(contactId))
                        var result2 = devicesList.filter(({ contactId }) => !set1.has(contactId));
                        //    var results =  res.filter(({contactId:Id1})=>{
                        //         !deviceslist.some(({userGUID:Id2})=>{
                        //            return(
                        //             Id2 == Id1
                        //            ) 
                        //         })
                        //     })
                        //     var results1 =  deviceslist.filter(({userGUID:Id1})=>{
                        //         !res.some(({contactId:Id2})=>{
                        //            return(
                        //             Id2 == Id1
                        //            ) 
                        //         })
                        //     })
                        // console.log(result1, result2)
                        var uploadNewScannedDevices = []
                        if(result2.length > 0 )
                        {
                            result2.map((s, i) => {
                                var device = {
                                    employeeId: "",
                                    contactId: "",
                                    rssi: 0,
                                    startContactDate: "",
                                    endContactDate: "",
                                    departmentId: "",
                                    locationId: ""
                                }
                                device.employeeId = user.id
                                device.contactId = s.contactId,
                                device.rssi = s.rssi
                                device.startContactDate = new Date().toUTCString()
                                device.endContactDate = new Date().toUTCString()
                                device.departmentId = user.departmentId
                                device.locationId = user.locationId
                                uploadNewScannedDevices.push(device)
                            })
                            // console.log("UPLOAD NEW DEVICE AFTER SCANNED IS ALREADY STARTED",uploadNewScannedDevices)
                            dispatch(uploadBleDeviceList(uploadNewScannedDevices))
                             var finalResultToSaveLocally = updateDevice.concat(uploadNewScannedDevices)
                        // console.log(finalResultToSaveLocally)
                        // uploadDevice = results
                        dispatch(updateBleDeviceList(updateDevice))
                        // console.log("SAVING DEVICE LOCALLY AFTER UPDAE API",finalResultToSaveLocally)
                        saveDeviceLocally(finalResultToSaveLocally)
                            .then(res => {
                                // console.log(res)
                            })
                            .catch(err => {
                                // console.log(err)
                            })
                        }
                        dispatch(updateBleDeviceList(updateDevice))
                       
                    }
                    else {
                        var locallyStoredDeviceList = []
                        devicesList.map((s, i) => {
                            var device = {
                                employeeId: "",
                                contactId: "",
                                rssi: 0,
                                startContactDate: "",
                                endContactDate: "",
                                departmentId: "",
                                locationId: ""
                            }
                            device.employeeId = user.id
                            device.contactId = s.contactId,
                            device.rssi = s.rssi
                            device.startContactDate = new Date().toUTCString()
                            device.endContactDate = new Date().toUTCString()
                            device.departmentId = user.departmentId
                            device.locationId = user.locationId
                            locallyStoredDeviceList.push(device)
                        })
                        // console.log(locallyStoredDeviceList)
                        var uniqueResult = locallyStoredDeviceList.reduce((unique, o) => {
                            if(!unique.some(obj => obj.contactId === obj.contactId && obj.startContactDate === o.startContactDate)) {
                              unique.push(o);
                            }
                            return unique;
                        },[]);
                        // console.log("Unique Result getting here",uniqueResult);
                        saveDeviceLocally(locallyStoredDeviceList)
                            .then(res => {
                                // console.log(res)
                                // console.log("UPLOADING DEVICE BECAUSE RES LENGTH > 0",locallyStoredDeviceList)
                                dispatch(uploadBleDeviceList(locallyStoredDeviceList))
                            })
                            .catch(err => {
                                // console.log(err)
                            })
                    }
                }
                else {
                    var locallyStoredDeviceList = []
                    devicesList.map((s, i) => {
                        var device = {
                            employeeId: "",
                            contactId: "",
                            rssi: 0,
                            startContactDate: "",
                            endContactDate: "",
                            departmentId: "",
                            locationId: ""
                        }
                        device.employeeId = user.id
                        device.contactId = s.contactId,
                            device.rssi = s.rssi
                        device.startContactDate = new Date().toUTCString()
                        device.endContactDate = new Date().toUTCString()
                        device.departmentId = user.departmentId
                        device.locationId = user.locationId
                        locallyStoredDeviceList.push(device)
                    })
                    // console.log("UPLOADING NEW SCANNED DEVICES FOR FIRST TIME SCAN",locallyStoredDeviceList)
                    var uniqueResult = locallyStoredDeviceList.reduce((unique, o) => {
                        if(!unique.some(obj => obj.contactId === obj.contactId && obj.startContactDate === o.startContactDate)) {
                          unique.push(o);
                        }
                        return unique;
                    },[]);
                    // console.log("Unique Result getting here",uniqueResult);
                    saveDeviceLocally(locallyStoredDeviceList)
                        .then(res => {
                            // console.log(res)
                            dispatch(uploadBleDeviceList(locallyStoredDeviceList))
                        })
                        .catch(err => {
                            // console.log(err)
                        })
                }
            })
            .catch(err => {

            })
        // if (scannedDevice.length == 0) {
        //     var locallyStoredDeviceList = []
        //     deviceslist.map((s,i)=>{
        //         var device = {
        //             employeeId: "",
        //             contactId: "",
        //             rssi: 0,
        //             startContactDate: "",
        //             endContactDate: "",
        //             departmentId: "",
        //             locationId: ""
        //         }
        //         device.employeeId = user.id
        //         device.contactId = s.userGUID,
        //         device.rssi = s.rssi
        //         device.startContactDate = new Date().toUTCString()
        //         device.endContactDate = new Date().toUTCString()
        //         device.departmentId = user.departmentId
        //         device.locationId = user.locationId
        //         locallyStoredDeviceList.push(device)
        //     })
        //     console.log(locallyStoredDeviceList)
        //     saveDeviceLocally(locallyStoredDeviceList)
        //     .then(res=>{
        //         console.log(res)
        //         dispatch(uploadBleDeviceList(locallyStoredDeviceList))
        //     })
        //     .catch(err=>{
        //         console.log(err)
        //     })
        //     dispatch(saveBleScannedDeviceFinalList(deviceslist));
        // }
        // else {
        //     //using to show only new scanned devices
        //     // filtering based on user guid
        //      getDeciveFromLocal().then(res=>{
        //         console.log(res)
        //         res.map((s,i)=>{
        //             var id = s.contactId
        //             deviceslist.map((x,y)=>{
        //                 if(id == x.userGUID) {
        //                     s.endContactDate = new Date().toUTCString()
        //                 }
        //             })
        //         })
        //         var newScannedDeviceList = []
        //         deviceslist.map((s,i)=>{
        //             var id = s.userGUID
        //             var value = res.find((x,y)=>{
        //                 if(id == x.contactId){
        //                     return x
        //                 }
        //             })
        //             if(value == undefined){
        //                 var device = {
        //                     employeeId: "",
        //                     contactId: "",
        //                     rssi: 0,
        //                     startContactDate: "",
        //                     endContactDate: "",
        //                     departmentId: "",
        //                     locationId: ""
        //                 }
        //                 device.employeeId = user.id
        //                 device.contactId = s.userGUID,
        //                 device.rssi = s.rssi
        //                 device.startContactDate = new Date().toUTCString()
        //                 device.endContactDate = new Date().toUTCString()
        //                 device.departmentId = user.departmentId
        //                 device.locationId = user.locationId
        //                newScannedDeviceList.push(device)
        //             }
        //             console.log(value)
        //         })
        //         deviceslist.map((s,i)=>{
        //             var id = s.contactId
        //             var value = deviceslist.find((x,y)=>{
        //                 if(id == x.userGUID) {
        //                     return x
        //                 }
        //             })
        //             if(value == undefined) {
        //                 res.splice(i,1)
        //             }
        //         })
        //     var response = []
        //     res.map((s,i)=>{
        //         response.push(s)
        //     })
        //     newScannedDeviceList.map((s,i)=>{
        //         response.push(s)
        //     })
        //     console.log(res,'res')
        //     console.log(newScannedDeviceList,'newScannedDeviceList')
        //     console.log(response,'response')
        //     dispatch(updateBleDeviceList(response))
        //     saveDeviceLocally(response)
        //     .then(res=>{
        //         console.log(res)
        //     })
        //     .catch(err=>{
        //         console.log(err)
        //     })
        //     })
        //     .catch(err=>{
        //         console.log(err)
        //     })
        //     var set1 = new Set(scannedDevice.map(({ userGUID }) => userGUID))
        //     var set2 = new Set(deviceslist.map(({ userGUID }) => userGUID))
        //     var result1 = scannedDevice.filter(({ userGUID }) => !set2.has(userGUID))
        //     var result2 = deviceslist.filter(({ userGUID }) => !set1.has(userGUID));
        //     var set3 = new Set(scannedDevice.map(({ lastScannedTime }) => lastScannedTime))
        //     var set4 = new Set(deviceslist.map(({ lastScannedTime }) => lastScannedTime))
        //     var result3 = scannedDevice.filter(({ lastScannedTime }) => !set2.has(lastScannedTime))
        //     var result4 = deviceslist.filter(({ lastScannedTime }) => !set1.has(lastScannedTime));
        //     console.log(result1, result2)
        //     if (result2.length > 0) {
        //         dispatch(clearBleScannedDevices())
        //         scannedDevice.concat(result4)
        //         dispatch(saveBleScannedDeviceFinalList(deviceslist));
        //     }
        //     else if (result4.length > 0) {
        //         dispatch(clearBleScannedDevices())
        //         scannedDevice.concat(result4)
        //         dispatch(saveBleScannedDeviceFinalList(deviceslist));
        //     }
        //     else {
        //         dispatch(saveBleScannedDeviceFinalList(scannedDevice));
        //     }


        // }
        // dispatch(saveDeviceLocally(deviceslist))
    }
}



export function saveBlueToothStates(value) {
    return {
        type: types.SAVE_BLUETOOTH_STATE,
        payload: value
    }
}

export function saveAccessCoarseLocationStatus(value) {
    return {
        type: types.SAVE_ACCESS_COARSE_LOCATION_STATUS,
        payload: value
    }
}

export function uploadBleDeviceList(deviceList) {
    return function (dispatch, getState) {
        if (deviceList.length == 0) {

        }
        else {
            var finalDeviceList = []
            deviceList.map((s,i)=>{
                if(s.contactId != undefined) {
                    if(s.employeeId !== s.contactId) {
                        finalDeviceList.push(s)
                    }
                }
            })
            API.post(`employeeexposers/bulkupload`, finalDeviceList)
                .then(response => {
                    // console.log("bulk upload response",response)
                })
                .catch(err => {
                    // console.log(err)
                    var error = err.toString();
                    dispatch(_saveUploadBleDeviceError(error))
                })
        }
    }
}

export function _refreshDashBoarPageStart() {
    return {
        type: types.REFRESH_DASH_BORAD_PAGE_START
    };
}

export function updateBleDeviceList(deviceList) {
    return function (dispatch, getState) {
        var employeeexposersForUpdate = []
        if (deviceList.length == 0) {

        }
        else {
            deviceList.map((s, i) => {
                if(s.contactId != undefined) {
                    if( s.employeeId !== s.contactId) {
                        var dto = {
                            contactId: "",
                            startContactDate: ""
                        }
                        dto.contactId = s.contactId
                        dto.startContactDate = s.startContactDate
                        employeeexposersForUpdate.push(dto)
                    }
                }
            })
            var finalList = {
                employeeExposersForUpdate: employeeexposersForUpdate,
                endContactDate: new Date().toUTCString()
            }
            API.put(`employeeexposers/bulkupdate`, finalList)
                .then(response => {
                    // console.log("bulk update response",response)
                })
                .catch(err => {
                    // console.log(err.toString())
                    var error = err.toString();
                    dispatch(_saveUpdateBleDeviceError(error))
                })
        }
    }
}

export function startBleAdvertising(userGuid) {
    return function (dispatch, getState) {
        var currentBlueToothStatus = getState().dashBoardPage.currentBlueToothState;
        // console.log('bleAdvertising starting', currentBlueToothStatus)
        // if (currentBlueToothStatus == true) {
            BLEAdvertiser.setCompanyId(APPLE_ID);
            BLEAdvertiser.broadcast("50ef0497-811d-4940-8280-8c42cab67589", [], {
                includeTxPowerLevel: true
            }).then(success => {
                dispatch(setBleAdvertisingStatus(true))
                // console.log('Broadcasting Sucessful', success)
            })
                .catch(error => {
                    dispatch(setBleAdvertisingStatus(false))
                    console.log('Broadcasting Error', error)
                });
        // }
    }
}

export function getTodaysHealthAssesmentsList(startdatetime, enddatetime) {
    return function (dispatch, getState) {
        dispatch(_refreshDashBoarPageStart())
        var user = getState().login.user;
        var filter = {
            SearchQuery: 'UploadedById=' + '"' + user.id + '"' + '&&' + 'CreatedOn' + '>=' + '"' + startdatetime.toString() + '"' + '&&' + 'CreatedOn' + '<=' + '"' + enddatetime.toString() + '"',
            Fields: 'Id,Status,CheckList.Id as CheckListId,Checklist.Name as ChecklistName,UploadedBy.LastAssesmentDate as LastAssesmentDate'
        }
        dispatch(startVSafeSpinner())
        API.get(`healthassesments`, filter)
            .then(res => {
                // console.log(res);
                if (res.length > 0) {
                    res.reverse()
                    var latestAssesmentList = [res[0]]
                    dispatch(_saveTodaysHealthAssesments(latestAssesmentList))
                }
                else {
                    dispatch(_saveTodaysHealthAssesments(res))
                }
                dispatch(setRefreshHealthAssesmentsList(false))
                dispatch(stopVSafeSpinner())
            })
            .catch(err => {
                dispatch(setRefreshHealthAssesmentsList(false))
                dispatch(stopVSafeSpinner())
                console.log(err);
            })
    }
}


export function getTodaysMessageLogs(startdatetime, enddatetime) {
    return function(dispatch,getState) {
        var user = getState().login.user;
        var filter = {
            PageSize:100,
            SearchQuery: 'CreatedOn' + '>=' + '"' + startdatetime.toString() + '"' + '&&' + 'CreatedOn' + '<=' + '"' + enddatetime.toString() + '"' + '&&' + `toEmployeeId!=fromEmployeeId && (toEmployeeId="${user.id}")`,
            Fields: 'Id,FromEmployeeId,ToEmployeeId,Description,IsPushNotification,PushNotificationStatus,IsEmailNotification,EmailNotificationStatus,IsSMSNotification,SMSNotificationStatus,new {fromEmployee.fname,fromEmployee.lname} as fromEmployee,new {toEmployee.fname,toEmployee.lname} as toEmployee,updatedOn'
        }
       API.get(`messagelogs`,filter)
       .then(res=>{
        //   console.log(res)
          if(res.length > 0) {
            res.reverse()
            var finalList = []
            finalList = res
            dispatch(_saveTodaysMessageLogs(finalList))
          }
          else {
            dispatch(_saveTodaysMessageLogs(res))
          }
       })
       .catch(err=>{
           console.log(err)
       }) 
    }
}

export function searchSavedMessageList(searchText) {
    return function (dispatch,getState) {
        if(searchText.length == 0) {

        }
        else {
            var filter = {
                SearchQuery: "description.Contains" + "(" + '"' + searchText + '"' + ")"
            }
            API.get(`savedmessages`,filter)
            .then(res=>{
                // console.log(res);
                dispatch(_saveSearchSavedMessageList(res))
            })
            .catch(err=>{
                console.log(err);
            })

        }
    }
}

export function sendMessage(body) {
    return function (dispatch,getState) {
        API.post(`employees/sendmessage`,body)
        .then(res=>{
            console.log(res)
            dispatch(setSnackBarMessage('Submitted Successfully'))
            dispatch(showSnackBar())
        })
        .catch(err=>{
            console.log(err)
        })
    }
}

export function setPath(path) {
    return {
        type: types.SET_PATH,
        payload: path
    }
}

export function stopBleAdvertising() {
    return function (dispatch, getState) {
        var currentBlueToothStatus = getState().dashBoardPage.currentBlueToothState;
        console.log('bleAdvertising starting', currentBlueToothStatus)
        // if(currentBlueToothStatus == true) {
        BLEAdvertiser.stopBroadcast()
            .then(success => {
                dispatch(setBleAdvertisingStatus(false))
                console.log("Stop Broadcast Successful", success)
            })
            .catch(error => {
                dispatch(setBleAdvertisingStatus(true))
                console.log("Stop Broadcast Error", error)
            });
        // }
        // else {

        // }
    }
}

export function setRefreshHealthAssesmentsList(value) {
    return function (dispatch, getState) {
        dispatch(_setrefershHealtAssesmentsList(value))
    }
}

export function clearBleScannedDevices() {
    return {
        type: types.CLEAR_BLE_SCANNED_DEVICES
    }
}

export function clearSearchedSavedMessageList() {
    return {
        type: types.CLEAR_SEARCHED_SAVED_MESSAGE_LIST,
    }
}

export function enableEmailNotificationSettings(enableEmailNotification) {
  return function(dispatch,getState) {
      dispatch(startVSafeSpinner())
      var userId = getState().login.user.id;
      var modal = [
      {
          "value": enableEmailNotification,
          "path": "/enableEmailNotification",
          "op": "replace"
        },
      ]
      API.patch(`employees/${userId}`,modal)
      .then(res=>{
        console.log(res)
        dispatch(_updateEmailNotificationSettings(enableEmailNotification))
        dispatch(stopVSafeSpinner())
      })
      .catch(err=>{
          console.log(err)
          dispatch(stopVSafeSpinner())
      })
  }
}

export function enableSMSNotificationSettings(enableSMSNotification) {
    return function(dispatch,getState) {
        dispatch(startVSafeSpinner())
        var userId = getState().login.user.id;
        var modal = [
        {
            "value": enableSMSNotification,
            "path": "/enableSMSNotification",
            "op": "replace"
          }
        ]
        API.patch(`employees/${userId}`,modal)
        .then(res=>{
          console.log(res)
          dispatch(_updateSMSNotificationSettings(enableSMSNotification))
          dispatch(stopVSafeSpinner())
        })
        .catch(err=>{
            console.log(err)
            dispatch(stopVSafeSpinner())
        })
    }
  }

  export function enablePushNotificationSettings(enablePushNotification) {
    return function(dispatch,getState) {
        dispatch(startVSafeSpinner())
        var userId = getState().login.user.id;
        var modal = [
          {
            "value": enablePushNotification,
            "path": "/enablePushNotification",
            "op": "replace"
          },
        ]
        API.patch(`employees/${userId}`,modal)
        .then(res=>{
          console.log(res)
          dispatch(_updatePushNotificationSettings(enablePushNotification))
          dispatch(stopVSafeSpinner())
        })
        .catch(err=>{
            console.log(err)
            dispatch(stopVSafeSpinner())
        })
    }
  }


  export function changeAppLanguage(selectedLanguage) {
      return function (dispatch,getState) {
          var addLanguageFile = undefined;
          if(selectedLanguage.id == 1) {
              addLanguageFile = English
          }
          else {
              addLanguageFile = French
          }
          var jsonFile = JSON.stringify(selectedLanguage)
          AsyncStorage.setItem("@app_language",jsonFile,(err)=>{
            console.log("Getting error while setting app lan",err)
          }) 
          dispatch(_setSelectedLanguageFile(addLanguageFile))
      }
  }
export function updateNewPassword(passwords) {
    return function (dispatch,getState) {
        dispatch(startVSafeSpinner())
        API.putPass(`employees/changepassword`,passwords)
        .then(res=>{
            dispatch(stopVSafeSpinner())
            setTimeout(()=>{
                if(res) {
                    dispatch(setSnackBarMessage(snackBarMessages.updatePassSuccess))
                    dispatch(showSnackBar())
                }
                else {
                    dispatch(setSnackBarMessage(snackBarMessages.updatePassFail))
                    dispatch(showSnackBar())
                }
            },1000)
        })
        .catch(err=>{
        })
    }
}  

export function setSelectedLanguage(selectedLanguage) {
    return {
        type: types.SELECT_LANGUAGE,
        payload: selectedLanguage
    }
}

export function savedEmployeeInfoSuccessfully(value) {
    return {
        type: types.EMPLOYEE_INFO_SAVED_SUCCESSFULLY,
        payload: value
    }
}

export function resetDashBoardPage() {
    return {
        type: types.RESET_HOME_PAGE
    }
}

export function resetSettingsPage() {
    return {
        type: types.RESET_SETTINGS_PAGE
    }
}