import API from "../api";
import NavigatorService from '../navigatorService/navigator';
import * as types from "../actionTypes";
import AsyncStorage from "@react-native-community/async-storage";
import { resetBodyAssesmentPage } from "./bodyAssessmentPageActions";
import { resetCheckListPage  } from "./checkListsPageActions";
import { resetHealthReportPage,startVSafeSpinner,stopVSafeSpinner } from "./healthReportPageActions";
import { resetDashBoardPage,resetSettingsPage,savedEmployeeInfoSuccessfully,
  enablePushNotificationSettings,enableEmailNotificationSettings,
  enableSMSNotificationSettings,setSelectedLanguage,changeAppLanguage,_updateEmailNotificationSettings
,_updatePushNotificationSettings,_updateSMSNotificationSettings } from "./dashBoardPageActions";
import { resetExposurePage } from "./exposurePageActions";
import { showSnackBar,setSnackBarMessage } from "./checkListsPageActions";
import OneSignal from 'react-native-onesignal';
import { snackBarMessages } from "../constants/vSafeEnum";
// import { unsubscribePushNotification } from '../actions/pushNotificationAction';
import {Toast} from 'native-base';
import { func } from "prop-types";
export function _updateAuthData  (auth) {
    return {
      type: types.UPDATE_AUTH_TOKEN,
      payload: auth
    };
  }
function _updateLoggedInUser  (user) {
    return {
      type: "LOGGEDIN_USER_SUCCESS",
      payload: user
    };
  }
function _authenticationFailed  () {
    return {
      type: types.UPDATE_AUTH_STATUS,
      payload: false
    };
  } 
function _authenticationSuccess  () {
    return {
      type: types.UPDATE_AUTH_STATUS,
      payload: true
    };
  }
function _userGetFailed  (err) {
    return {
      type: types.ERROR,
      payload: err
    };
  }
function _authFailedError  (err) {
    return {
      type: types.ERROR,
      payload: err
    };
  }
function _loginSpinnerStart  () {
    return {
      type: types.LOGIN_START_SPINNER,
      payload: true
    };
  }
function _loadCompanySuccess(company){
  return{
    type: types.LOAD_COMPANY_SUCCESS,
    payload: company
  };
}
function _loadCompanyFailed(err){
  return{
    type: types.LOAD_COMPANY_FAILED,
    payload: err
  };
}
function _updateCompanyPlan(companyPlan){
  return{
    type: types.LOAD_COMPANY_PLAN_SUCCESS,
    payload: companyPlan
  };
}
function _updateCompanyPlanFailed(err){
  return{
    type: types.LOAD_COMPANY_PLAN_FAILED,
    payload: err
  };
}

export function saveLoginPageKey(key) {
  return {
    type: types.SAVE_LOGIN_PAGE_KEY,
    payload: key
  }
}


export function validUser(user) {
    if(user.email){
      //do nothing
    }
    else{
      // user.email='saurabh.abhyankar7@gmail.com';
      // user.password='saurabh1'
      if(!user.email || !user.password){
        return function(dispatch, getState) {
          dispatch(_authenticationFailed());    
          dispatch(_authFailedError("Email And Password cannot be empty."));
        }
      }
    }
    return function(dispatch, getState) {
        dispatch(_loginSpinnerStart());
        
        API.login(user) 
        .then(resultJson => {
            //User is authenticated by the identity server
            if(resultJson.error){
                dispatch(_authenticationFailed());    
                dispatch(_authFailedError( resultJson.error_description + '  Or Invalid User'));
            }else{
                //Update Auth data
                dispatch(_updateAuthData(resultJson));
                dispatch(_authenticationSuccess()); 
            }
            // Try to get the current logged in user
            if(getState().login.isAuthenticated){
              // Toast.show({ text: "Logged-in successfully", textStyle: { color: "white" }, buttonText: "okay", type: "success", duration: 5000, position: 'bottom' })
              // dispatch(_updateLoggedInUser(user));   
              // NavigatorService.navigate("HomePage");
                API.getUserInfo(`info`)
                .then(userData => {
                      if(userData.id !== undefined){
                        API.get('employees/' + userData.id)
                        .then(res=>{
                          if(userData.language == "en") {
                            var selectedLanguage = getState().settingsPage.languages[0]
                              dispatch(setSelectedLanguage(selectedLanguage))
                              dispatch(changeAppLanguage(selectedLanguage))
                            AsyncStorage.setItem("@app_language",JSON.stringify(selectedLanguage),(err)=>{
                              if(err != null) {
                                //  console.log("getting error while setting app lan",err)
                              }
                            })
                          }
                          else {
                            var selectedLanguage = getState().settingsPage.languages[1]
                            dispatch(setSelectedLanguage(selectedLanguage))
                            dispatch(changeAppLanguage(selectedLanguage))
                            AsyncStorage.setItem("@app_language",JSON.stringify(selectedLanguage),(err)=>{
                              if(err != null) {
                                //  console.log("getting error while setting app lan",err)
                              }
                            })
                          }   
                              dispatch(_updateEmailNotificationSettings(res.enableEmailNotification))
                              dispatch(_updateSMSNotificationSettings(res.enableSMSNotification))
                              dispatch(_updatePushNotificationSettings(res.enablePushNotification))
                              // console.log(res)
                              // console.log(userData)
                              dispatch(_updateLoggedInUser(userData)); 
                              AsyncStorage.removeItem("@localstorage_ble_device_list",(err)=>{
                                // console.log("Getting error while clearing asyncStorage",err)
                              })
                              NavigatorService.navigate("PreferencePage");
                          
                        })
                        .catch(err=>{
                          console.log(err)
                        })
                        
                        //#region Get Company Details of the logged in user
                        // var filterModel = {
                        //   fields: "ID,CompanyName,OpenTracking,TimeZone,TimeFormat,WhiteList,BlackList,CompanyUserPermissions,LogoURL,WhiteLabel,PaymentService",
                        // };
                        // // Get the Company details of the Logged in user.
                        // API.get(`Companies/`,filterModel)
                        // .then(company => {
                        //   //User get successfull and hence update the current user
                        //   dispatch(_updateLoggedInUser(userData));    
                          
                        //   // Company is successfully loaded
                        //   dispatch(_loadCompanySuccess(company)); 
                          
                        //   API.get(`CompanyPlans/GetCompanyPlan/`)
                        //   .then(companyPlanData => {
                        //     dispatch(_updateCompanyPlan(companyPlanData));
                        //     if(companyPlanData.active){
                        //       // Set the route params according to the logged in user.
                        //       // Admin user =-> All
                        //       // Normak user =-> Mine (Also hide 'All')
                        //       var params = {};
                        //       params["route"] = "All"; 
                        //       NavigatorService.navigate('TestBodyPage', params);
                        //     }else{
                        //       dispatch(_updateCompanyPlanFailed("Plan is not active." + err));
                        //       var resultJson = null
                        //      dispatch(_resetUser())
                        //      Toast.show({text:"your plan has been expired",textStyle:{color:"white"},buttonText:"okay",type:"danger",duration: 5000,position:'bottom'})
                        //     }
                        //   })
                        //   .catch(err => {
                        //     dispatch(_resetUser())
                        //     dispatch(_updateCompanyPlanFailed("Plan is not active."));
                        //   })
                        // })
                        // .catch(err => {
                        //   dispatch(_authenticationFailed()); 
                        //   dispatch(_loadCompanyFailed());
                        // });
                        //#endregion                        
                        
                    }
                    else if(userData.message){
                      dispatch(_authFailedError(userData.message )); 
                    }
                    else{
                        //User get unsuccessfull 
                        dispatch(_authFailedError(userData.error ));   
                    }                                        
                })
                .catch(err => {
                    // TODO:- Handle error and display global msg          
                    //User get unsuccessfull   
                    dispatch(_authenticationFailed());    
                    dispatch(_userGetFailed(err));
                })
            }
        })
        .catch(err => {
            // TODO:- Handle error and display global msg
            dispatch(_authenticationFailed());    
            dispatch(_authFailedError(err.toString()));
            // cb(err);
        });
    }
  }

export function resetPassword(userId) {
  return function (dispatch,getState) {
    dispatch(startVSafeSpinner())
    API.putPass(`employees/resetpassword`,userId)
    .then(res=>{
      dispatch(stopVSafeSpinner())
      setTimeout(()=>{
          if(res) {
              dispatch(setSnackBarMessage(snackBarMessages.resetPassSuccess))
              dispatch(showSnackBar())
          }
          else {
              dispatch(setSnackBarMessage(snackBarMessages.resetPassFail))
              dispatch(showSnackBar())
          }
      },1000)
    })
    .catch(err=>{
      dispatch(stopVSafeSpinner())
    })
  }
}
  //#region Logout User

export function _resetUser(){
  return {
    type: types.RESET_USER
  }
}
function _logoutStart(){
  return{
    type: types.LOGOUT_START
  };
}
function _logoutSuccess(){
  return{
    type: types.LOGOUT_SUCCESS
  };
}
function _logoutDone(){
  return{
    type: types.LOGOUT_DONE
  };
}

// **** At Present if we make any change of state in this action,
// It is causing the purge state to fail. Not sure why it is happening
// Make sure to check the purge process if any state change is done in this
// action ****
export function logoutUserRequested(err){
  return function(dispatch, getState) {
    dispatch(_logoutStart());
    dispatch(savedEmployeeInfoSuccessfully(false))
    dispatch(resetBodyAssesmentPage())
    dispatch(resetCheckListPage())
    dispatch(resetHealthReportPage())
    dispatch(resetDashBoardPage())
    dispatch(resetSettingsPage())
    dispatch(resetExposurePage())
    setTimeout(()=>{
      dispatch(_resetUser())
    },4000)
    OneSignal.logoutEmail(function(successResponse) {
      //Successfully logged out of email
      console.log(successResponse,"successfully logged-out email")
  }, function(error) {
      //Failed to log out of email
      console.log(error,"getting error logout email")
  });
    var deviceList = []
    AsyncStorage.removeItem("@localstorage_ble_device_list",(err)=>{
      console.log("Getting error while clearing asyncStorage",err)
    })
    // Remove the token
    API.logout(); 

    
    // Unsubscribe the Push notifications
    // dispatch(unsubscribePushNotification());
   
   
    setTimeout(() => {
      // Redirect to the Home page
      // NavigatorService.navigate('LoginPage');
      // This will purge the persistent state 
      dispatch(_logoutSuccess());
      // Fired after the purge
      dispatch(_logoutDone());
      // dispatch(_resetUser())
      // if(err !== undefined){
      //   return(
      //     Toast.show({ text: err, textStyle: { color: "white" }, buttonText: "okay", type: "danger", duration: 5000, position: 'bottom' })
      //   )
      // }
    }, 300)
  }
}
//#endregion 