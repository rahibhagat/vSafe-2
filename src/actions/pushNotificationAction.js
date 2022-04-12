import OneSignal from 'react-native-onesignal';
import * as types from "../actionTypes";
import { oneSignalAppID } from "../config/config";

// #region LOCAL METHODS
function _setupPushNotificationSuccess() {
    return {
        type: types.SETUP_PUSH_NOTIFICATION_SUCCESSS
    };
}
function _subscriptionChangedSuccess() {
    return {
        type: types.SUBSCRIPTION_CHANGE_SUCCESS
    };
}
function _subscriptionUnsubscribedSuccess(){
    return {
        type: types.UNSUBSCRIBE_ONE_SIGNAL_SUCCESS,
    };
}
function _subscribeOneSignalSuccess() {
    return {
        type: types.SUBSCRIBE_ONE_SIGNAL_SUCCESS
    };
}
// #end region

// #region GLOBAL METHODS

export function setupPushNotification() {
    return function (dispatch, getState) {
        if (getState().login.isAuthenticated == true) {
            var userId = getState().login.user.id;
            // OneSignal.setLogLevel(6,0);
            OneSignal.init(oneSignalAppID,{kOSSettingsKeyAutoPrompt : true,kOSSettingsKeyInAppLaunchURL: false});
            OneSignal.inFocusDisplaying(1);
            OneSignal.sendTags({ userId: userId});
            // dispatch(_onSubscriptionChanged(userId));
            // dispatch(_subscribeOneSignal(userId));
            // dispatch(_setupPushNotificationSuccess(userId));
        }
    };
}
export function unsubscribePushNotification() {
    return function (dispatch, getState) {
        OneSignal.getPermissionSubscriptionState((status) => {
            if (status.subscriptionEnabled == "true") {
                OneSignal.setSubscription(false)
                dispatch(_subscriptionUnsubscribedSuccess());
            }
        });
    };
}
export function _subscribeOneSignal(loggedInUserId) {
    //Firstly this will check user id
    return function (dispatch) {
        OneSignal.getPermissionSubscriptionState((status) => {
            if (status.userId == null) {
                OneSignal.setSubscription(true);
            }
            else {
                OneSignal.getTags((receivedTags) => {
                    if (receivedTags && receivedTags.userId && receivedTags.userId == loggedInUserId) {
                        // do nothing as tag is already set.
                        OneSignal.setSubscription(true)
                    } else {
                        if (receivedTags && receivedTags.userId) {
                            //Remove old tag
                            OneSignal.deleteTag("userId");
                        }
                        // set the subscription status to true
                        OneSignal.setSubscription(true);
                        //Add new tag
                        OneSignal.sendTags({ userId: loggedInUserId, device: "mobile" ,platform: 2});
                        dispatch(_subscribeOneSignalSuccess());
                    }
                });
            }
        });
    }
}

export function _onSubscriptionChanged(loggedInUserId) {
    //Secondly this will check when subscription changed
    return function (dispatch) {
        OneSignal.getPermissionSubscriptionState((status) => {
            if (status.subscriptionEnabled) {
                OneSignal.sendTags({ userId: loggedInUserId, device: "mobile" ,platform: 2});
                dispatch(_subscriptionChangedSuccess());
            }
        });
    }
}
// #end region