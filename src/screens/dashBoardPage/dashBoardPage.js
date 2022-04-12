//#region Third party imports
/* eslint-disable */
import React, { createRef, PureComponent } from "react";
import {
    RefreshControl, Image, View, Animated, BackHandler, StatusBar, Dimensions, Alert, FlatList,
    TouchableOpacity, ImageBackground, TouchableHighlight, ActivityIndicator,
    ScrollView, Modal, PermissionsAndroid, NativeEventEmitter, NativeModules, AppState, Platform,
    KeyboardAvoidingView, Keyboard, ToastAndroid
} from 'react-native';
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Icon,
    List,
    ListItem,
    Text,
    Thumbnail,
    Left,
    Right,
    Fab,
    Body,
    Footer,
    Badge, Toast, Item, Input, Picker, CheckBox, CardItem, Card, Label
} from "native-base";
import Moment from 'react-moment';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { BluetoothStatus } from 'react-native-bluetooth-status';
import FastImage from 'react-native-fast-image';
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
// import { SafeAreaView } from "react-navigation";
import OneSignal from 'react-native-onesignal';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5Pro from "react-native-vector-icons/FontAwesome5Pro";
import Fontisto from "react-native-vector-icons/Fontisto";
import Foundation from "react-native-vector-icons/Foundation";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Octicons from "react-native-vector-icons/Octicons";
import Popover from 'react-native-popover-view';
import ActionButton from 'react-native-action-button';
const short = require('short-uuid');
import { showMessage, hideMessage } from "react-native-flash-message";

//#endregion

//#region vSafe imports
import SnackBar from "../bodyAssessmentPage/snackBar";
import {
    saveBleScannedDevices, clearBleScannedDevices,
    saveBlueToothStates, startBleAdvertising,
    stopBleAdvertising, getTodaysHealthAssesmentsList, setPath, saveAccessCoarseLocationStatus,
    savedEmployeeInfoSuccessfully, getTodaysMessageLogs, searchSavedMessageList,
    clearSearchedSavedMessageList, sendMessage
} from "../../actions/dashBoardPageActions";
import { setupPushNotification } from "../../actions/pushNotificationAction";
import { bleScannedDevicesList } from "../../constants/vSafeEnum";
import styles from "./styles";
import BackgroundTimer from "react-native-background-timer";
import BleManager from 'react-native-ble-manager';
import { hideSnackBar } from "../../actions/checkListsPageActions";
import { getSelectedHealthAssesmentRecords, startVSafeSpinner, } from "../../actions/healthReportPageActions";
import { _updateAuthData } from "../../actions/loginAction";
const BleManagerModule = NativeModules.BleManager;
const BluetoothManager = NativeModules.BluetoothManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
const bluetoothManagerModule = new NativeEventEmitter(BluetoothManager)
// import BLEAdvertiser from 'react-native-ble-advertiser';
import UUIDGenerator from 'react-native-uuid-generator';
import { TextInput } from "react-native";
import moment from "moment";
const APPLE_ID = 0x1C;
const vSafeUUID = "50ef0497-811d-4940-8280-8c42cab67589";
const userID = "c3b7f625-c07f-4d7d-9be1-ddff8ff93b4d";
const channelConfig = {
    id: 'ForegroundServiceChannel',
    name: 'Notification Channel',
    description: 'Notification Channel for Foreground Service',
    enableVibration: true,
    importance: 2
};
import API from "../../api";
import NetworkUtils from "../../actions/netWorkUtilsActions";
import SpinnerOverlay from "../../components/spinnerOverlay";
import { convertToCompanyTimeZone, getStartAndEndTimeDate, convertToCompanyTimeZoneShowOnlyDate } from "../../utility";
const vSafeAppLogo = require("../../../assets/vSafeAppLogoTransparent.png")
const translator = short();
// BleManager.createNotificationChannel(channelConfig);
//#endregion

class DashBoardPage extends PureComponent {
    //#region Constructor
    constructor(props) {
        super(props);
        this.handleAppStateChange = this.handleAppStateChange.bind(this);
        this.onRefreshCtrl = this.onRefreshCtrl.bind(this);
        this.state = {
            underlayColor: 'white',
            message: 'No messages.',
            selectedMailboxFilter: '',
            selectedStatusFilter: '',
            selectedUserFilter: '',
            selectedTimeIntervalFilter: 0,
            startforconvupdate: false,
            modalvisible: true,
            filtermodalvisible: false,
            searchText: '',
            searchmore: false,
            sortlist: false,
            emptysearchedconvlist: false,
            openFilter: false,
            appliedfilter: [],
            appliedglobalfilters: undefined,
            id: 0,
            aggregationFiltersUsers: undefined,
            focusSearch: false,
            selectedfilterforconversation: '',
            filterappliedconv: false,
            appliedfilterfilterby: '',
            appliedfilterorderby: '',
            deleteSelectedConversation: false, checkedconversation: false, conversationids: [],
            initialscrollindex: 10, scrollheight: 0, showUserReport: false, userreport: undefined,
            currentDate: new Date().toISOString(),
            scanning: false,
            showRefreshScan: false,
            peripherals: new Map(),
            ForeGroundperipherals: [],
            appState: '',
            localBluetoothId: '',
            serviceUUIDs: "",
            characteristicUUID: "",
            serviceUUIDBle: "",
            ServiceUUID: '',
            CharacteristicUUID: "",
            uuid: "",
            foregroundService: undefined,
            foregroundServiceRunning: false,
            accessCoarseLocation: false,
            deviceFoundFromForegroundSerive: false,
            deviceFound: false,
            userGUID: '', customUserGuid: userID, keyboardShown: false,
            bluetoothIsEnabled: false,
            isConnected: undefined, updatetingBle: 0,
            active: false,
            showMessageForm: false,
            tapped: false,
            textMessage: "",
            searchMessageText: "",
            errorMessage: false,
            showPopover:false
        }
        this.array = [];
        this.pressToStartScan = this.pressToStartScan.bind(this);
        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        this.handleDeviceID = this.handleDeviceAddressPeripheral.bind(this);
        this.handleStopScan = this.handleStopScan.bind(this);
        this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
        this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
        // this.handleForeGroundServiceBleResultData = this.handleForeGroundServiceBleResultData.bind(this);
        // this.handleForeGroundSeriveHandleStopScan = this.handleForeGroundSeriveHandleStopScan.bind(this);
        this.keyboardWillShow = this.keyboardWillShow.bind(this);
        this.keyboardWillHide = this.keyboardWillHide.bind(this);
        this.onReceived = this.onReceived.bind(this);
        this.onOpened = this.onOpened.bind(this);
        this.props.setupPushNotification()
        // OneSignal.inFocusDisplaying(1);
        this.alertActionButton = React.createRef();

    }
    //#endregion

    //#region Other methods
    componentWillMount() {

        // exit application on hardware back button.
        setTimeout(() => {
            AppState.addEventListener('change', this.handleAppStateChange);
        }, 5000)
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

        this.animatedWidth = new Animated.Value(50)
        this.animatedHeight = new Animated.Value(100)
        this.setState({ initialscrollindex: 10 })
    }
    animatedBox = () => {
        Animated.timing(this.animatedWidth, {
            toValue: 200,
            duration: 1000
        }).start()
        Animated.timing(this.animatedHeight, {
            toValue: 500,
            duration: 500
        }).start()
    }
    componentDidMount(convList) {
        OneSignal.addTrigger("level", "2")
        this.onReceived =  OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
        if (this.props.user.id != undefined) {
            if (this.props.employeeInfoSaved == false) {
                OneSignal.setEmail(this.props.user.name, undefined, (error) => {
                    console.log("Errors : ", error)
                });
                this.props.savedEmployeeInfoSuccessfully(true)
            }
            // Setting External User Id with Callback Available in SDK Version 3.7.0+
            OneSignal.setExternalUserId(this.props.user.id, (results) => {
                // The results will contain push and email success statuses
                console.log('Results of setting external user id');
                console.log(results);

                // Push can be expected in almost every situation with a success status, but
                // as a pre-caution its good to verify it exists
                if (results != null) {
                    if (results.push && results.push.success) {
                        console.log('Results of setting external user id push status:');
                        console.log(results.push.success);
                    }

                    // Verify the email is set or check that the results have an email success status
                    if (results.email && results.email.success) {
                        console.log('Results of setting external user id email status:');
                        console.log(results.email.success);
                    }
                }
            });
        }
        // setInterval(() => {
        //     this.sendBleDeviceListToServer()
        // }, 15000)
        if (Platform.OS === 'android') {
            setTimeout(() => {
                this.checkInitialLocationState();
            }, 2000);
        }
        setTimeout(() => {
            // this.checkInitialBluetoothState();
        }, 2000);

        this.intervalToCheckInterNetStatus = setInterval(() => {
            this.checkInternetConnection();
        }, 5000)
        this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
        BleManager.start({ showAlert: false });
        // UUIDGenerator.getRandomUUID((uuid) => {
        //     this.setState({ userGUID: uuid })
        //     this.setState({ CharacteristicUUID: uuid })


        // });


        // this.handleDeviceID = bleManagerEmitter.addListener('BleManagerDeviceAddress', this.handleDeviceAddressPeripheral);
        // this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral',this.handleDiscoverPeripheral)
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan);
        this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral);
        this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic);
        this.handleDiscoverBluetoothDevices = bluetoothManagerModule.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverBluetoothNearByDevices.bind(this))
        // this.handlerForgroundService = bleManagerEmitter.addListener('my-custom-event', this.handleForeGroundServiceBleResultData);
        // this.handlerForgroundService = bleManagerEmitter.addListener('my-custom-event-handleStopScan', this.handleForeGroundSeriveHandleStopScan);
        var currentdate = new Date();
        this.fetchTodaysHealthAssesmentsList()
        this.fetchTodaysMessagesLogs()
        var shortUserId = translator.fromUUID(this.props.user.id.toString())
        console.log("Shorthened UserID", shortUserId)
        var fullUserId = this.props.user.id.substring(0, 8)
        console.log("full USer ID", fullUserId)
        if (this.props.user.id !== undefined) {
            console.log(this.props.user.id)
            // BluetoothManager.startAdvertising(this.props.user.id.substring(0,8))
            BluetoothManager.startAdvertising(shortUserId)
        }
        else {
            console.log("UserId is undefined : Why ?")
        }
        setTimeout(() => {
            // this.startScan();
            BluetoothManager.startScanning()
            this.setState({scanning:true})
        }, 3000)
        // BluetoothManager.startScanning()

    }

    fetchTodaysHealthAssesmentsList() {
        if (this.props.user.id != undefined) {
            var enddate = moment.tz(this.props.user.account.timeZoneIDStringJS).toDate();
            var startdate = moment.tz(this.props.user.account.timeZoneIDStringJS).toDate();
            var dates = getStartAndEndTimeDate(startdate, enddate, this.props.user.account.timeZoneIDStringJS, this.props.user.account.dateFormat, this.props.user.account.is12HRTimeFormat)
            this.props.getTodaysHealthAssesmentsList(dates.startdatetime, dates.enddatetime)
        }
    }

    fetchTodaysMessagesLogs() {
        if (this.props.user.id != undefined) {
            var enddate = moment.tz(this.props.user.account.timeZoneIDStringJS).toDate();
            var startdate = moment.tz(this.props.user.account.timeZoneIDStringJS).toDate();
            var dates = getStartAndEndTimeDate(startdate, enddate, this.props.user.account.timeZoneIDStringJS, this.props.user.account.dateFormat, this.props.user.account.is12HRTimeFormat);
            this.props.getTodaysMessageLogs(dates.startdatetime, dates.enddatetime)
        }
    }
    componentDidUpdate(prevProps, prevState, nextProps, nextState) {
        // this.fillConversationList(false);
        if (prevState.isConnected !== this.state.isConnected) {
            // this.showToast(this.state.isConnected)
        }
        // if(prevProps.currentBlueToothState !== this.props.currentBlueToothState) {
        //     if(this.props.currentBlueToothState == false){
        //         BleManager.stopScan().then(() => {
        //             // Success code
        //             console.log("Scan stopped");
        //         })
        //             .catch(err => {
        //                 console.log('got error to stop scan', err)
        //             });
        //     }
        //     else {
        //         this.startScan();
        //     }
        // }
    }
    componentWillUnmount() {
        this.handleDiscoverBluetoothDevices.remove();
        this.keyboardWillShowSub.remove();
        this.keyboardWillHideSub.remove();
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('ids', this.onIds);
        AppState.removeEventListener('change', this.handleAppStateChange);
        // this.handlerForgroundService.remove();
        // this.handlerDiscover.remove();
        // this.handlerStop.remove();
        // this.handlerDisconnect.remove();
        // this.handlerUpdate.remove();
        clearInterval(this.timer);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

    }

    onReceived(notification) {
        console.log("Notification received: ", notification);
        // this.showFlashMessage(notification.payload);
    }

    showFlashMessage = (message) => {
        console.log("Flashing message",message)
        showMessage({
            message: "New Message",
            description:message.body,
            type: "danger",
            hideOnPress:true,
          });
    }

    onOpened(openResult) {
        console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);
        this.fetchTodaysMessagesLogs()
    }

    onIds(device) {
        console.log('Device info: ', device);
    }

    async checkInitialBluetoothState() {
        const isEnabled = await BluetoothStatus.state();
        console.log("check bluetooth on or off", isEnabled);
        if (isEnabled == true) {
            this.setState({ bluetoothIsEnabled: true })
            this.props.saveBlueToothStates(true)
            // this.props.startBleAdvertising(this.props.user.id);
        } else {

            Alert.alert(
                'Bluethooth',
                'Bluetooth is turn off, turn on bluetooth for digital scanning',
                [
                    { text: 'No', onPress: () => { this.props.saveBlueToothStates(false) } },
                    {
                        text: 'Yes', onPress: () => {
                            BluetoothStatus.enable(true)
                            this.setState({ bluetoothIsEnabled: true })
                            this.props.saveBlueToothStates(true)
                            setTimeout(() => {
                                this.startScan();
                            }, 5000)
                        }
                    }
                ],
            );
        }
    }

    async checkInternetConnection() {
        const isConnected = await NetworkUtils.isNetworkAvailable();
        this.setState({ isConnected: isConnected })
    }

    async checkInitialLocationState() {
        // const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        // if (granted) {
        //     console.log("You can use the ACCESS_COARSE_LOCATION")
        // }
        // else {
        //     console.log("ACCESS_COARSE_LOCATION permission denied")
        // }
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
            .then(data => {
                //   alert(data)
                // The user has accepted to enable the location services
                // data can be :
                //  - "already-enabled" if the location services has been already enabled
                //  - "enabled" if user has clicked on OK button in the popup
                if (Platform.OS === 'android' && Platform.Version >= 23) {
                    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                        if (result) {
                            this.setState({ accessCoarseLocation: result })
                            this.props.saveAccessCoarseLocationStatus(true)
                            setTimeout(() => {
                                if (this.props.currentBlueToothState && this.state.accessCoarseLocation) {
                                    this.startScan()
                                }
                            }, 5000);
                        } else {
                            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                                if (result) {
                                    this.setState({ accessCoarseLocation: result })
                                    this.props.saveAccessCoarseLocationStatus(true)
                                    setTimeout(() => {
                                        if (this.props.currentBlueToothState && this.state.accessCoarseLocation) {
                                            this.startScan()
                                        }
                                    }, 5000);
                                } else {
                                    this.setState({ accessCoarseLocation: false })
                                    this.props.saveAccessCoarseLocationStatus(false)
                                }
                            });
                        }
                    });
                }
            }).catch(err => {
                this.setState({ accessCoarseLocation: false })
                // alert("Error " + err.message + ", Code : " + err.code);
                // The user has not accepted to enable the location services or something went wrong during the process
                // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
                // codes : 
                //  - ERR00 : The user has clicked on Cancel button in the popup
                //  - ERR01 : If the Settings change are unavailable
                //  - ERR02 : If the popup has failed to open
            });
    }


    keyboardWillShow = (event) => {
        this.setState({ keyboardShown: true })
    };

    keyboardWillHide = (event) => {
        this.setState({ keyboardShown: false })
    };
    // Exiting Application
    handleBackButtonClick() {
        BackHandler.exitApp();
    }
    openDrawer = () => {
        this.props.navigation.openDrawer()
    }

    changeDatesFormat() {
        if (this.props.user.id != undefined) {
            var enddate = moment.tz(this.props.user.account.timeZoneIDStringJS).toDate();
            var startdate = moment.tz(this.props.user.account.timeZoneIDStringJS).toDate();
            var userDate = convertToCompanyTimeZoneShowOnlyDate(startdate, this.props.user.account.timeZoneIDStringJS, this.props.user.account.dateFormat, this.props.user.account.is12HRTimeFormat)
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            const days = [
                "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
            ];
            console.log(userDate)
            var date = new Date(userDate)
            var day = days[date.getDay()]
            var month = monthNames[date.getMonth()]
            var date = date.getDate()
            var finaldate = userDate
            return finaldate
        }
    }


    handleAppStateChange = (nextAppState) => {
        this.setState({ appState: nextAppState });
        // console.log(AppState.currentState)
        // if(this.state.bluetoothIsEnabled && this.state.accessCoarseLocation) {
        // if (AppState.currentState === 'background') {
        //     console.log("Starting background process")
        //     clearTimeout(this.timer);
        //     BluetoothManager.startScanning()
        //     this.setState({ peripheral: new Map(), foregroundServiceRunning: true, peripherals: new Map(), scanning: false, deviceFound: false })
        //     setTimeout(()=>{
        //         BleManager.stopScan().then(() => {
        //             // Success code
        //             console.log("Scan stopped");
        //         })
        //             .catch(err => {
        //                 console.log('got error to stop scan', err)
        //             });
        //     },2000)

        //     // this.props.clearBleScannedDevices();
        // }
        //     else if (nextAppState === "active" && this.state.foregroundService != undefined) {
        //         this.stopService()
        //         var emptyArray = [];
        //         var resultData = []
        //         this.checkInitialBluetoothState();
        //         setTimeout(() => {
        //             this.startScan();
        //             this.setState({ ForeGroundperipherals: emptyArray, foregroundServiceRunning: false, deviceFoundFromForegroundSerive: false })
        //         }, 5000);
        //     }
        // }
    }

    async stopService() {
        try {
            await BleManager.stopService();
        }
        catch (e) {
            console.error(e)
        }

    }


    handleDisconnectedPeripheral(data) {
        let peripherals = this.state.peripherals;
        let peripheral = peripherals.get(data.peripheral);
        if (peripheral) {
            peripheral.connected = false;
            peripherals.set(peripheral.id, peripheral);
            this.setState({ peripherals });
        }
    }

    handleDiscoverBluetoothNearByDevices(data) {
        setTimeout(() => {
            let ForeGroundperipherals = this.state.ForeGroundperipherals;
            console.log("dsfsfcsdfqwd", data)
            this.setState({ updatetingBle: this.state.updatetingBle + 1 })
            if (data.length > 0) {
                var bleDeviceData = JSON.parse(data)
                if (bleDeviceData.kCBAdvDataLocalName != null) {
                    var finalContactId = ""
                    var substr = bleDeviceData.kCBAdvDataLocalName.substring(0, 3)
                    if (substr == "VSF") {
                        finalContactId = bleDeviceData.kCBAdvDataLocalName
                    }
                    else {
                        try {
                            finalContactId = translator.toUUID(bleDeviceData.kCBAdvDataLocalName.toString())
                        }
                        catch (e) {
                            finalContactId = undefined
                        }
                    }
                    if (finalContactId != undefined) {
                        var bleScannedDevicesList = {
                            contactId: finalContactId, rssi: bleDeviceData.RSSI, serviceUUID: '50ef0497-811d-4940-8280-8c42cab67589', lastScannedTime: moment().format("MMMM Do YYYY, h:mm:ss a"), lastScannedDay: ''
                        }

                        if (this.state.ForeGroundperipherals.length == 0) {
                            ForeGroundperipherals.push(bleScannedDevicesList)
                            this.setState({ ForeGroundperipherals, deviceFoundFromForegroundSerive: true })

                        }
                        else {
                            var valuedata = undefined;
                            var object = this.state.ForeGroundperipherals.filter((s, i) => {
                                if (s.contactId == bleScannedDevicesList.contactId) {
                                    return s;
                                }
                            });
                            if (object.length == 0) {
                                ForeGroundperipherals.push(bleScannedDevicesList)
                                this.setState({ ForeGroundperipherals, deviceFoundFromForegroundSerive: true })
                            }
                        }
                        this.props.saveBleScannedDevices(this.state.ForeGroundperipherals)
                    }
                }
            }
        }, 1000)

        // if(data.length > 0){
        //      var bleDeviceData =  JSON.parse(data)
        //     //  console.log("Parsed BleDeviceData",bleDeviceData)
        //      if(bleDeviceData.kCBAdvDataServiceData.length > 0){
        //         var bleScannedDevicesList = {
        //             contactId: bleDeviceData.kCBAdvDataServiceData[0],rssi:bleDeviceData.RSSI, serviceUUID: '50ef0497-811d-4940-8280-8c42cab67589', lastScannedTime: moment().format("MMMM Do YYYY, h:mm:ss a"),lastScannedDay:''
        //         }
        //         //  if (this.state.ForeGroundperipherals.length == 0) {
        //             ForeGroundperipherals.push(bleScannedDevicesList)
        //             this.setState({ ForeGroundperipherals, deviceFoundFromForegroundSerive: true })

        //         // }
        //         // else {
        //         //     var valuedata = undefined;
        //         //     var object = this.state.ForeGroundperipherals.filter((s, i) => {
        //         //         if (s.contactId == data.deviceAddress) {
        //         //             return s;
        //         //         }
        //         //     });
        //         //     if (object.length == 0) {
        //         //         ForeGroundperipherals.push(data)
        //         //         this.setState({ ForeGroundperipherals, deviceFoundFromForegroundSerive: true })
        //         //     }
        //         // }
        //      }
        // }
    }

    sendBleDeviceListToServer() {
        console.log("Peripherals", this.state.ForeGroundperipherals)
        if (this.state.ForeGroundperipherals.length > 0) {
            // this.props.saveBleScannedDevices(this.state.ForeGroundperipherals)
            console.log(this.state.ForeGroundperipherals, 'resulting Data')
        }
    }

    handleForeGroundSeriveHandleStopScan(data) {
        console.log(data, 'handle Scanning stop from foregroundService')
        var emptyArray = [];
        var resultData = []
        this.state.ForeGroundperipherals.map((s, i) => {
            var object = { contactId: '', serviceUUID: '', lastScannedTime: '', lastScannedDay: '', rssi: 0 }
            object.contactId = s.serviceData
            object.serviceUUID = s.serviceUUID
            object.lastScannedTime = moment().format("MMMM Do YYYY, h:mm:ss a");
            object.rssi = parseInt(s.rssi)
            resultData.push(object)
        })
        console.log(resultData)
        // this.props.saveBleScannedDevices(resultData)
        console.log(this.state.ForeGroundperipherals, 'resulting Data')
    }

    // using to get ble scanned result from foreground service
    handleForeGroundServiceBleResultData(data) {
        let ForeGroundperipherals = this.state.ForeGroundperipherals;
        console.log(data)

        if (this.state.ForeGroundperipherals.length == 0) {
            ForeGroundperipherals.push(data)
            this.setState({ ForeGroundperipherals, deviceFoundFromForegroundSerive: true })

        }
        else {
            var valuedata = undefined;
            var object = this.state.ForeGroundperipherals.filter((s, i) => {
                if (s.deviceAddress == data.deviceAddress) {
                    return s;
                }
            });
            if (object.length == 0) {
                ForeGroundperipherals.push(data)
                this.setState({ ForeGroundperipherals, deviceFoundFromForegroundSerive: true })
            }
        }
    }


    handleUpdateValueForCharacteristic(data) {
    }

    getUserGuid(object) {
        var userGuid = Object.keys(object)
        console.log(userGuid, 'HELLLOOOO')
        return userGuid[0];
    }

    handleStopScan() {
        console.log('stopping')
        this.setState({ scanning: false, showRefreshScan: true });
        const list = Array.from(this.state.peripherals.values());
        const finalList = [];
        list.map((s, i) => {
            var bleScannedDevicesList = {
                contactId: "", rssi: 0, serviceUUID: '', lastScannedTime: '', lastScannedDay: ''
            }
            bleScannedDevicesList.contactId = this.getUserGuid(s.advertising.serviceData)
            bleScannedDevicesList.rssi = s.rssi;
            bleScannedDevicesList.serviceUUID = s.advertising.serviceUUIDs[0];

            bleScannedDevicesList.lastScannedTime = moment().format("MMMM Do YYYY, h:mm:ss a");
            finalList.push(bleScannedDevicesList);
        })
        if (this.state.foregroundServiceRunning == false) {
            // this.props.saveBleScannedDevices(finalList);
        }
        console.log(finalList)
    }

    startScan() {
        if (!this.state.scanning) {
            BleManager.scan([vSafeUUID], 30, true).then((results) => {
                console.log('starting')
                this.setState({ scanning: true, showRefreshScan: false });
            });
        }
    }

    retrieveConnected() {
        BleManager.getConnectedPeripherals([]).then((results) => {
            if (results.length == 0) {
                // console.log('No connected peripherals')
            }
            var peripherals = this.state.peripherals;
            for (var i = 0; i < results.length; i++) {
                var peripheral = results[i];
                peripheral.connected = true;
                peripherals.set(peripheral.id, peripheral);
                this.setState({ peripherals });
            }
        });
    }

    handleDeviceAddressPeripheral(address) {
        this.state.localBluetoothId = address
    }

    handleDiscoverPeripheral(peripheral, id) {
        var peripherals = this.state.peripherals;
        if (!peripheral.name) {
            peripheral.name = 'NO NAME';
        }
        // peripheral.rssi = 10 ^ ((-69 - peripheral.rssi) / (10 * 2))
        peripherals.set(peripheral.id, peripheral);
        this.setState({ peripherals, deviceFound: true });
        console.log(peripheral)

    }

    // using to create bond and also to connect with another ble device but not using right now
    createBond(item) {

        BleManager.connect(item.id)
            .then((res) => {
                let peripherals = this.state.peripherals;
                BleManager.createBond(item.id)
                    .then(() => {

                        BleManager.removeBond(item.id)
                            .then(() => {

                            })
                            .catch(err => {

                            })
                    })
                    .catch(err => {

                    })


            }).catch((error) => {
                console.log('Connection error', error);
            });
    }

    startScanAutoMatically() {
        this.timer = setTimeout(() => {
            this.startScan()
            // this.props.clearBleScannedDevices();
        }, 15000);
    }

    async startForeGroundService() {
        const notificationConfig = {
            channelId: 'ForegroundServiceChannel',
            id: 3456,
            title: 'vSafe',
            text: 'vSafe is running',
            icon: 'ic_notification',
            priority: 1
        };
        try {
            await BleManager.startService(notificationConfig);
            this.setState({ foregroundService: true })
        } catch (e) {
            console.error(e);
        }
    }

    pressToStartScan() {
        if (this.state.bluetoothIsEnabled && this.state.accessCoarseLocation) {
            this.startScan();
        }
        else {
            // do nothing
        }
    }

    dynamicStyle() {
        var style = {};
        if (this.state.keyboardShown) {
            return styles.filteranimatedview1
        }
        else {
            return styles.filteranimatedview1
        }
    }

    showAlertToChangeUserGuidManually = () => {
        return (

            <Modal visible={this.state.modalvisible} transparent={true} onRequestClose={() => {
                this.setState({ modalvisible: false })
            }}>
                <KeyboardAvoidingView style={styles.filtermodalview} enabled behavior="padding">
                    <View style={styles.filteranimatedview}>
                        <Header style={{ backgroundColor: 'white', flexDirection: 'row' }}>
                            <View style={{ flex: 0.9, padding: 5, flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Title style={{ color: 'black' }}>Change UserGuid</Title>
                                <Title style={{ fontSize: 10, color: 'black' }}>(change only  second last value)</Title>
                            </View>
                            <View style={{ flex: 0.1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({ modalvisible: false, customUserGuid: userID })
                                    setTimeout(() => {
                                        // this.props.startBleAdvertising(this.state.customUserGuid);
                                    }, 5000);
                                }}><Icon name="close" type="MaterialIcons" /></TouchableOpacity>
                            </View>
                        </Header>
                        <View style={{ padding: 35 }}>
                            <TextInput autoFocus={true} style={{ borderWidth: 1, borderRadius: 10, padding: 10 }} placeholder="Customize UserGuid" value={this.state.customUserGuid} onChangeText={(text) => {
                                this.setState({ customUserGuid: text })
                            }} />
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-evenly' }}>
                            <Button style={{ width: deviceWidth / 2, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }} onPress={() => {
                                this.setState({ modalvisible: false })
                                // this.props.startBleAdvertising(this.state.customUserGuid);
                            }}><Text>Save</Text></Button>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

        )
    }
    // startBleAdvertising() {
    //     console.log('bleAdvertising starting')
    //     BLEAdvertiser.setCompanyId(APPLE_ID);
    //     BLEAdvertiser.broadcast(this.state.customUserGuid, [], {
    //         includeTxPowerLevel: true
    //     }) // The service UUID and additional manufacturer data.
    //         .then(success =>
    //             console.log('Broadcasting Sucessful', success
    //             ))
    //         .catch(error =>
    //             console.log('Broadcasting Error', error
    //             ));
    // }

    showToast = (isConnected) => {
        const connected = isConnected == true ? '' : 'not'
        ToastAndroid.showWithGravityAndOffset(
            "You are " + connected + " connected to the internet",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
        );
    };


    // Processing to be done when refresh is called. 
    onRefreshCtrl() {
        // this.props.startforconvupdate();
        this.fetchTodaysHealthAssesmentsList()
        this.fetchTodaysMessagesLogs()
    }

    renderHealthAssesmentList(item, index) {
        if (item.lastAssesmentDate != undefined) {
            return (
                <TouchableOpacity style={{ flex: 1, flexDirection: 'column', padding: 10 }} onPress={() => {
                    this.props.getSelectedHealthAssesmentRecords(item.checkListId, item.id)
                    this.props.startVSafeSpinner();
                    this.props.navigation.navigate('BodyAssessmentPage', { previousRoute: 'DashBoardPage', readOnlyCheckList: true, selectedCheckListName: item.checklistName, lastAssesmentDate: item.lastAssesmentDate, status: item.status });
                }}>
                    <Card style={{ flex: 1, flexDirection: 'row' }}>
                        <CardItem style={{ flex: 0.1, flexDirection: 'column', backgroundColor: item.status == 1 ? 'green' : 'red', alignItems: 'center', justifyContent: 'center' }}>
                            <View><Text style={{ color: 'white' }}>{index + 1}.</Text></View>
                        </CardItem>
                        <CardItem style={{ flex: 0.8, flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Text numberOfLines={1} style={{ fontSize: 18 }}>{item.checklistName}</Text>
                            <Text numberOfLines={1} style={{ fontSize: 11 }}>{convertToCompanyTimeZone(item.lastAssesmentDate, this.props.user.account.timeZoneIDStringJS, this.props.user.account.dateFormat, this.props.user.account.is12HRTimeFormat)}</Text>
                            {
                                //   <Text style={{fontSize:13}}>Distance : {rssi} m</Text>
                            }
                        </CardItem>
                        <CardItem style={{ flex: 0.1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <View>
                                <Icon name="chevron-right" type="MaterialIcons" />
                            </View>
                        </CardItem>
                    </Card>
                </TouchableOpacity>

                //     <CardItem cardBody>
                //     <Body style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-evenly', padding: 10 }}>
                //         <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', padding: 15 }}>
                //             <View style={{
                //                 width: 40,
                //                 height: 40,
                //                 borderRadius: 100 / 2,
                //                 backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderColor: 'lightgray', borderWidth: 1
                //             }}>
                //             {item.status == 1 ? <Icon name="checkcircle" type='AntDesign' style={{ color: 'green' }} />  : <Icon name="closecircle" type='AntDesign' style={{ color: 'red' }} />  }
                //             </View>
                //             <View style={{ flex: 1, flexDirection: 'column', paddingLeft: 25 }}>
                //                 <Text style={{ fontSize: 18 }}>{item.checklistName}</Text>
                //                 <Text style={{fontSize:14}}>{convertToCompanyTimeZone(item.lastAssesmentDate,this.props.user.account.timeZoneIDStringJS,this.props.user.account.dateFormat,this.props.user.account.is12HRTimeFormat)}</Text>
                //             </View>
                //             <View style={{ flex: 0.2, flexDirection: 'row' }}>
                //             <TouchableOpacity onPress={()=>{
                //                 this.props.getSelectedHealthAssesmentRecords(item.checkListId,item.id)
                //                 this.props.startVSafeSpinner();
                //                 this.props.navigation.navigate('BodyAssessmentPage',{previousRoute:'DashBoardPage',readOnlyCheckList:true,selectedCheckListName:item.checklistName,lastAssesmentDate:item.lastAssesmentDate,status:item.status});
                //             }}>
                //             <Icon type='Ionicons' name={"md-eye"} style={{ color: this.props.primaryColor }}/>
                //             </TouchableOpacity>
                //             </View>
                //         </View>
                //     </Body>
                // </CardItem>

            )
        }
    }

    renderMessageLogsList(item, index) {
        var time = convertToCompanyTimeZone(item.updatedOn,this.props.user.account.timeZoneIDStringJS,this.props.user.account.dateFormat,this.props.user.account.is12HRTimeFormat)
        var string = time.split(" ");
        var hours = time.split(" ")[2].split(':')[0];
        var mins = time.split(" ")[2].split(':')[1];
        var ampm = time.split(" ")[3];
        // var finaltime = string[2] + " " + string[3];
        var finaltime = hours + ':' + mins + ' ' + ampm;
        return (
            <TouchableOpacity style={{ flex: 1, flexDirection: 'column', padding: 10 }} onPress={() => {
                // this.props.getSelectedHealthAssesmentRecords(item.checkListId, item.id)
                // this.props.startVSafeSpinner();
                // this.props.navigation.navigate('BodyAssessmentPage', { previousRoute: 'DashBoardPage', readOnlyCheckList: true, selectedCheckListName: item.checklistName, lastAssesmentDate: item.lastAssesmentDate, status: item.status });
            }}>
                <Card style={{ flex: 1, flexDirection: 'column',backgroundColor:this.props.alertsCardColor }}>
                    <View style={{flex:1,flexDirection:'row'}}>
                    <View style={{ flex: 0.1, flexDirection: 'column', backgroundColor: this.props.alertsCardColor, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                        <View style={{flex:0.2}}></View>
                        <View style={{flex:0.8,flexDirection:'column',justifyContent:'flex-start'}}><MaterialIcons name="chevron-right" size={25} color="gray"/></View>
                    </View>
                    <CardItem style={{ flex: 0.9, flexDirection: 'column', alignItems: 'flex-start',backgroundColor:this.props.alertsCardColor }}>
                    <View style={{flex:1,flexDirection:'row'}}>
                          <View style={{flex:0.7}}>
                          <Text style={{fontSize:20,color:this.props.primaryColor}}>{item.fromEmployeeId == this.props.user.id ? item.toEmployee.fName : item.fromEmployee.fName}</Text>
                            </View>
                            <View style={{flex:0.3,flexDirection:'row',alignItems:'center'}}>
                            <Text style={{fontSize:14,color:"gray"}}>{finaltime}</Text>
                            </View>
                          </View>
                        <Text numberOfLines={5} style={{ fontSize: 15,color:'gray'}}>{item.description}</Text>
                    </CardItem>
                    </View>
                    <View style={{flex:1,flexDirection:'row'}}>
                        <View style={{flex:0.8,borderWidth:2,borderColor:'lightgray'}}></View>
                        <View style={{flex:0.2,backgroundColor:this.props.alertsCardColor}}></View>
                    </View>
                </Card>

            </TouchableOpacity>
        )
    }

    renderSearchSavedMesssageList(item, index) {
        return (
            <TouchableOpacity style={{ flex: 1, flexDirection: 'column' }} onPress={() => {
                this.setState({
                    tapped: true, textMessage: item.description,
                })
                this.props.clearSearchedSavedMessageList()
            }}>
                <Card style={{ flex: 1, flexDirection: 'row' }}>
                    <CardItem style={{ flex: 0.1, flexDirection: 'column', backgroundColor: this.props.primaryColor, alignItems: 'center', justifyContent: 'center' }}>
                        <View><Text style={{ color: 'white' }}>{index + 1}.</Text></View>
                    </CardItem>
                    <CardItem style={{ flex: 0.8, flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Text>{item.description}</Text>
                    </CardItem>
                </Card>
            </TouchableOpacity>
        )
    }


    validateForm() {
        var errors = false;
        if (this.state.textMessage.length == 0 && this.state.searchMessageText.length == 0) {
            errors = true
            this.setState({ errorMessage: true })
        }
        else {
            var body = {
                messageText: this.state.textMessage.length > 0 ? this.state.textMessage : this.state.searchMessageText,
                toEmployeeList: []
            }
            this.setState({ tapped: false, textMessage: "", searchMessageText: "", showMessageForm: false })
            this.props.clearSearchedSavedMessageList()
            this.props.sendMessage(body)  
        }
    }

    renderMessageForm() {
        if (this.state.showMessageForm) {
            return (
                <Modal
                    visible={this.state.showMessageForm}>
                    <SafeAreaView style={{ flex: 1, backgroundColor: this.props.primaryColor }} edges={['top']}>
                        <Container style={{ backgroundColor: "#FFF" }}>
                            <View style={{ flexDirection: 'row', backgroundColor: this.props.primaryColor, padding: 15 }}>
                                <Left style={{ flex: 0.1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ showMessageForm: false, tapped: false, textMessage: "", searchMessageText: "",errorMessage:false })
                                            this.props.clearSearchedSavedMessageList()
                                        }}><Icon name="close" type="MaterialIcons" style={{ color: 'white' }} /></TouchableOpacity>
                                </Left>
                                <Body style={{ flex: 0.8, flexDirection: 'row', justifyContent: "center" }}><Title>Add New Message</Title></Body>
                            </View>
                            <Content>
                                <View style={{ flex: 1, flexDirection: 'column', padding: 15 }}>
                                    <Card style={{ flex: 1, flexDirection: 'column' }}>
                                        <CardItem style={{ flex: 1, alignSelf: 'stretch' }}>
                                            <View style={{ flex: 1 }}>
                                                <Item floatingLabel >
                                                    <Label>Enter Message</Label>
                                                    <Input multiline={true} style={{ paddingTop: 20 }} value={this.state.tapped ? this.state.textMessage : this.state.searchMessageText}
                                                        onChangeText={text => {
                                                            this.setState({ searchMessageText: text, errorMessage: false })
                                                            this.props.searchSavedMessageList(text)
                                                        }} />
                                                    {this.state.tapped ?
                                                        <Icon name="close" type='MaterialIcons' onPress={() => {
                                                            this.setState({ tapped: false, textMessage: "", searchMessageText: '' })
                                                        }} /> : null}

                                                </Item>
                                                {
                                                    <FlatList
                                                        data={this.props.searchedSavedMessageList}
                                                        contentContainerStyle={{ position: 'relative' }}
                                                        renderItem={({ item, index }) => this.renderSearchSavedMesssageList(item, index)} />
                                                    // <TextInput placeholder="Enter Name" value={this.state.textName} onChangeText={(text) => {
                                                    //   this.setState({ textName: text,errorName:false })
                                                    // }} style={{ borderWidth: 0, borderBottomWidth: 1 }} />
                                                }
                                                <Text style={{ color: 'red', fontSize: 12 }}>{this.state.errorMessage ? 'Please Enter Message' : ''}</Text>
                                            </View>
                                        </CardItem>
                                    </Card>
                                    <View style={{ flex: 1, paddingTop: 10, alignItems: 'stretch' }}>
                                        <Button block style={{ backgroundColor: this.props.primaryColor }} onPress={() => {
                                            this.validateForm()
                                        }}><Text>{this.props.selectedLanguageFile.sendmsgtoadmin}</Text></Button>
                                    </View>
                                </View>
                            </Content>
                        </Container>
                    </SafeAreaView>
                </Modal>
            )
        }
    }
    checkCurrentDateList() {
        return (
            <FlatList
                data={this.props.healthAssesmentsList}
                renderItem={({ item, index }) => this.renderHealthAssesmentList(item, index)}
                keyExtractor={(item) => {
                    return item.id.toString();
                }} />
        )
    }

    DisplaySnackBar = () => {
        if (this.props.showSnackBar) {
            setTimeout(() => {
                var msg = this.props.snackBarMessage
                this.props.hideSnackBar();
                this.ReactNativeSnackBar.ShowSnackBarFunction(msg);
            }, 0)
        }
        else {

        }
    };
    //Render the Component
    render() {
        // this.fillConversationList();
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: this.props.primaryColor }} edges={['top', 'bottom']}>
                <Container style={styles.container}>
                    {/* <StatusBar hidden={true}/> */}
                    <View transparent={true} style={{ flexDirection: 'row', backgroundColor: 'white', padding: 10 }}>
                        <Body style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Image source={vSafeAppLogo} style={{ width: 30, height: 30 }} />
                            <Title style={{ fontWeight: 'bold', fontSize: 32, color: 'black', paddingLeft: 15 }}>VSafeNow</Title></Body>
                        <Right style={{ flex: 0.6, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            {this.props.currentAccessCoarseLocationStatus ? <MaterialIcons name="location-on" size={30} style={{ color: this.props.primaryColor }} /> : <MaterialIcons name="location-off" size={25} style={{ color: 'lightgray', paddingBottom: 3 }} />}
                            {this.props.currentBlueToothState ? <Ionicons name="bluetooth" size={30} style={{ color: this.props.primaryColor }} /> : <Ionicons name="bluetooth" size={25} style={{ color: 'lightgray' }} />}
                            {this.state.scanning ? <SimpleLineIcons name="power" size={30} type="SimpleLineIcons" style={{ color: 'green' }} /> : <SimpleLineIcons name="power" size={25} type="SimpleLineIcons" style={{ color: 'lightgray' }} />}
                            <TouchableOpacity onPress={() => {
                                this.props.navigation.navigate('SettingsPage')
                            }}>
                                <MaterialIcons name="settings" size={25} style={{ color: 'black', paddingBottom: 3 }} />
                            </TouchableOpacity>
                        </Right>
                    </View>
                    <Content refreshControl={
                        <RefreshControl
                            refreshing={this.props.refreshDashBoardPage}
                            onRefresh={this.onRefreshCtrl}
                            title="Pull to refresh"
                            colors={["#0c85e0"]}
                        />
                    }>
                        {
                            //     <View style={{ flex: 1, flexDirection: 'column', padding: 10, backgroundColor: 'white' }}>
                            //     <View bordered style={{ padding: 30, backgroundColor: '#E2D8F9', borderRadius: 10, borderWidth: 2, borderColor: 'lightgray' }}>
                            //         <Body style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 0, }}>
                            //             <View style={{ flex: 1.5, flexDirection: 'column', justifyContent: 'center', }}>
                            //                 <Text style={{ fontSize: 25 }}>Scanning{this.state.scanning ? '  on' : '  off'}</Text>
                            //                 <Text numberOfLines={2} style={{ fontSize: 10 }}>Turn broadcasting on to improve the accuracy of your notifications.</Text>
                            //                 <View style={{ padding: 5, paddingLeft: 0 }}>
                            //                     <Text numberOfLines={3} style={{ fontWeight: 'bold', color: this.props.primaryColor }}>Learn more.</Text>
                            //                 </View>
                            //                 <Text>{this.props.currentBlueToothState ? 'Bluetooth is on:' : 'your bluetooth is off please turn on to get devices'}</Text>
                            //                 <Text>{this.state.accessCoarseLocation ? 'Location is on:' : 'your location is off please turn on to get devices'}</Text>
                            //             </View>
                            //             <TouchableOpacity
                            //                 style={{
                            //                     width: 60,
                            //                     height: 60,
                            //                     borderRadius: 60 / 2,
                            //                     backgroundColor: 'white', alignItems: 'center'
                            //                 }}>
                            //                 <View style={this.state.scanning ? {
                            //                     width: 60,
                            //                     height: 60,
                            //                     borderRadius: 100 / 2,
                            //                     alignItems: 'center', justifyContent: 'center', borderColor: this.props.primaryColor, borderWidth: 2
                            //                 } : {
                            //                         width: 60,
                            //                         height: 60,
                            //                         borderRadius: 100 / 2,
                            //                         alignItems: 'center', justifyContent: 'center', borderColor: 'lightgray', borderWidth: 2
                            //                     }}>
                            //                     <Icon name="power" type="SimpleLineIcons" style={{ color: 'lightgray' }} />
                            //                 </View>
                            //             </TouchableOpacity>
                            //         </Body>
                            //     </View>
                            // </View>

                        }
                        <View style={{ padding: 10 }}>
                        {
                                this.props.todaysMessageLogsList.length > 0 ?
                                    <Card style={{ padding: 15, borderRadius: 10 }}>
                                        <CardItem header bordered>
                                            <Body style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                                    <View style={{ flex: 0.7 }}>
                                                        <Text uppercase={false} style={{ fontSize: 22 }}>{this.props.selectedLanguageFile != undefined ?
                                                            this.props.selectedLanguageFile.healthalerts
                                                            : "Health Alerts"}</Text>
                                                    </View>
                                                </View>
                                                <Text style={{ fontSize: 15 }}>{this.changeDatesFormat()}</Text>
                                            </Body>
                                        </CardItem>
                                        <FlatList
                                            data={this.props.todaysMessageLogsList}
                                            renderItem={({ item, index }) => this.renderMessageLogsList(item, index)}
                                            keyExtractor={(item) => {
                                                return item.id.toString();
                                            }}
                                        />
                                    </Card>
                                    : null
                            }
                            <Card style={{ padding: 15, borderRadius: 10 }}>
                                <CardItem header bordered>
                                    <Body style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <View style={{ flex: 0.7 }}>
                                                <Text uppercase={false} style={{ fontSize: 22 }}>{this.props.selectedLanguageFile != undefined ? this.props.selectedLanguageFile.healthassesments : "Health Assesments"}</Text>
                                            </View>
                                        </View>
                                        <Text style={{ fontSize: 15 }}>{this.changeDatesFormat()}</Text>
                                        <View style={{ flex: 0.2, flexDirection: 'column', paddingTop: 10 }}>
                                            <Button style={{ height: 25, backgroundColor: this.props.primaryColor }} onPress={() => {
                                                this.props.navigation.navigate('CheckListsPage')
                                                this.props.setPath('DashBoardPage')
                                            }}><Text style={{ textTransform: 'uppercase' }}>{this.props.selectedLanguageFile != undefined ? this.props.selectedLanguageFile.takehealthassesments : "take health assesments"}</Text></Button>
                                        </View>
                                    </Body>
                                </CardItem>
                                {
                                    this.props.todaysHealthAssesmentsList != undefined ? this.props.todaysHealthAssesmentsList.length > 0 ?
                                        <FlatList
                                            data={this.props.todaysHealthAssesmentsList}
                                            renderItem={({ item, index }) => this.renderHealthAssesmentList(item, index)}
                                            keyExtractor={(item) => {
                                                return item.id.toString();
                                            }}
                                        />
                                        : <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center',padding:15 }}><Text>{this.props.selectedLanguageFile != undefined ? this.props.selectedLanguageFile.thereisnohealthassesmentreport : "There is no healthAssesment report"}</Text></View>
                                        : null
                                }
                            </Card>
                        </View>
                        <View style={{ padding: 10 }}>
                            <Card style={{ flex: 1, padding: 15, borderRadius: 10 }}>
                                <CardItem style={{ flex: 1 }}>
                                    <Body style={{ flex: 1, flexDirection: 'row', alignSelf: 'stretch' }}>
                                        <View style={{ flex: 1 }}>
                                            <Button block style={{ backgroundColor: this.props.primaryColor }} onPress={() => {
                                                this.props.navigation.navigate('ExposurePage', { goToManualTab: true })
                                            }}><Text style={{ textTransform: 'uppercase' }}>{this.props.selectedLanguageFile != undefined ? this.props.selectedLanguageFile.addexternalexposure : "Add External Exposure"}</Text></Button>
                                        </View>
                                    </Body>
                                </CardItem>
                            </Card>

                        </View>

                        <View style={{ padding: 10 }}>
                            <Card style={{ padding: 15, borderRadius: 10, backgroundColor: 'lightgray' }}>
                                <CardItem cardBody >
                                    <Body style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-evenly', padding: 10, backgroundColor: 'lightgray' }}>
                                        <View style={{ padding: 2 }}>
                                            <Text>{this.props.selectedLanguageFile != undefined ? this.props.selectedLanguageFile.securelyinformationstored : "Any Information collected on VSafeNow is stored securely and locally in your app, and remain private to you."}</Text>
                                        </View>
                                    </Body>
                                </CardItem>
                            </Card>

                        </View>
                        {this.state.showRefreshScan == true ?
                            this.startScanAutoMatically()
                            : null}
                        <SpinnerOverlay visiblespinner={this.props.showVSafeSpinner} />
                        {/* <View>
                            {this.state.ForeGroundperipherals.length > 0 ?
                            this.state.ForeGroundperipherals.map((s, i) => {
                                return (
                                    <View>
                                        <Text>{s.contactId}</Text>
                                    </View>
                                )
                            }) : <Text>no device found</Text>}
                            </View>
                            {
                        this.props.uploadBleDeviceError != undefined ? 
                         <View><Text>Upload Error {this.props.uploadBleDeviceError}</Text></View>
                        : null
                    }
                    {
                        this.props.updateBleDeviceError != undefined ? 
                         <View><Text>Update Error {this.props.updateBleDeviceError}</Text></View>
                        : null
                    }    */}
                    </Content>
                    <SnackBar ref={(ref) => { this.ReactNativeSnackBar = ref; }} />
                    {this.DisplaySnackBar()}
                    {this.renderMessageForm()}
                    <ActionButton renderIcon={()=>{
                                    return (
                                        <View ref={this.alertActionButton} style={{padding:5}}>
                                        <MaterialIcons name="chat-bubble" style={{color:'white',fontSize:25}}/>
                                        </View>
                                    )
                                }} buttonColor={this.props.primaryColor} onLongPress={()=>{
                                    this.setState({showPopover:true})
                                }}
                                onPress={()=>{
                                   this.setState({ active: !this.state.active, showMessageForm: true })
                                }}>
                                </ActionButton>
                        <Popover
                            mode='rn-modal'
                            isVisible = {this.state.showPopover}
                            onRequestClose={() => this.setState({showPopover:false})}
                            from={this.alertActionButton}>
                             <Card style={{borderRadius:0}}>
                                 <CardItem bordered>
                                     <Text>Add New Message</Text>
                                 </CardItem>
                             </Card>
                        </Popover>
                                {
                                // <TouchableOpacity style={{borderWidth:2}} onLongPress={showPopover}  onPress={() => {
                                //     // this.setState({ active: !this.state.active, showMessageForm: true })
                                // }}>
                                // <Fab
                                //     ref={sourceRef}
                                //     active={this.state.active}
                                //     direction="up"
                                //     containerStyle={{}}
                                //     style={{ backgroundColor: this.props.primaryColor }}
                                //     position="bottomRight"
                                //     >
                                //     <MaterialCommunityIcons name="plus" size={20} />
                                // </Fab>
                                // </TouchableOpacity>
    }
                 {/* <TouchableOpacity onPress={()=>{
                     showMessage({
                        message: "Simple message",
                        type: "danger",
                        hideOnPress:true,
                      });
                 }}>
                     <Text>Touched here</Text>
                 </TouchableOpacity> */}
                </Container>
            </SafeAreaView>
        );
    }
    //#endregion
}

//#region Map State and Dispatch region
function mapStateToProps(state) {
    const { scannedDeviceList, currentBlueToothState,
        todaysHealthAssesmentsList, refreshingHealthAssesmentsList, primaryColor,alertsCardColor
        , refreshDashBoardPage, currentAccessCoarseLocationStatus, todaysMessageLogsList, searchedSavedMessageList,
        uploadBleDeviceError,updateBleDeviceError } = state.dashBoardPage;
    const { user, isAuthenticated, error, loading, isLoggedIn, employeeInfoSaved,authData } = state.login;
    const { healthAssesmentsList, showVSafeSpinner } = state.healthReportPage;
    const { showSnackBar, snackBarMessage } = state.checkListsPage;
    const { selectedLanguageFile } = state.settingsPage;
    return {
        scannedDeviceList,
        currentBlueToothState,
        user,
        healthAssesmentsList,
        showVSafeSpinner,
        todaysHealthAssesmentsList,
        refreshingHealthAssesmentsList,
        primaryColor,alertsCardColor, refreshDashBoardPage,
        showSnackBar, snackBarMessage, currentAccessCoarseLocationStatus,
        employeeInfoSaved, selectedLanguageFile,
        todaysMessageLogsList, searchedSavedMessageList,
        uploadBleDeviceError,updateBleDeviceError,authData
    };
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        saveBleScannedDevices: saveBleScannedDevices,
        clearBleScannedDevices: clearBleScannedDevices,
        saveBlueToothStates: saveBlueToothStates,
        startBleAdvertising: startBleAdvertising,
        stopBleAdvertising: stopBleAdvertising,
        getTodaysHealthAssesmentsList: getTodaysHealthAssesmentsList,
        getSelectedHealthAssesmentRecords: getSelectedHealthAssesmentRecords,
        startVSafeSpinner: startVSafeSpinner,
        setPath: setPath,
        hideSnackBar: hideSnackBar,
        saveAccessCoarseLocationStatus: saveAccessCoarseLocationStatus,
        savedEmployeeInfoSuccessfully: savedEmployeeInfoSuccessfully,
        setupPushNotification: setupPushNotification,
        getTodaysMessageLogs: getTodaysMessageLogs,
        searchSavedMessageList: searchSavedMessageList,
        clearSearchedSavedMessageList: clearSearchedSavedMessageList,
        sendMessage: sendMessage,
        _updateAuthData:_updateAuthData
    }, dispatch)
}
//#endregion
export default connect(mapStateToProps, matchDispatchToProps)(DashBoardPage);
