//#region Third Party imports
import React, { PureComponent } from "react";
import { ImageBackground, View, StatusBar, Keyboard, KeyboardAvoidingView, Alert, Modal, ActivityIndicator, Animated, Image } from "react-native";
import { Container, Button, H3, Text, Header, Content, Form, Item, Input, Label,Icon, CardItem, Toast, Spinner, } from "native-base";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as Animatable from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from "@react-native-community/async-storage";
import OneSignal from 'react-native-onesignal';

//#endregion

//#region Abhisi imports
import styles from "./styles";
import {
  validUser, _resetUser,saveLoginPageKey,resetPassword
} from '../../actions/loginAction';
import { TouchableOpacity } from "react-native";
import { Platform } from "react-native";
import jwtDecode from "jwt-decode";
import jwt_decode from "jwt-decode";
import SnackBar from "../bodyAssessmentPage/snackBar";
import { hideSnackBar } from "../../actions/checkListsPageActions";
import SpinnerOverlay from "../checkListsPage/spinnerOverlay";
import { oneSignalAppID } from "../../config/config";
import { setSelectedLanguage,changeAppLanguage } from "../../actions/dashBoardPageActions";
//#endregion
const vSafeAppLogo = require("../../../assets/vSafeAppLogoTransparent.png")

class ForgotPasswordPage extends PureComponent {
  //#region Constructor
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      passwordHidden: true,
      keyboardShown: false,
      isfocus: false,
      isfocus1: false,
      wrong: false,
      userID:"",
      errorUserID:false
    };
    // obj = new conversationPage();
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }
  //#endregion

  //#region Other methods
  componentWillMount() {

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }
  _keyboardDidShow() {
    this.setState({ keyboardShown: true });
  }
  _keyboardDidHide() {
    this.setState({ keyboardShown: false });
  }
  componentDidMount() {
    //To navigate user to conversationlist page when already logged in.
  }
   

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    //Push notification event listeners
    // OneSignal.removeEventListener('received', this.onReceived)
    // OneSignal.removeEventListener('opened', this.onOpened);

    // OneSignal.addEventListener('inAppMessageClicked',this.oninAppMessageClicked)
  }
  //Onesignal on notification open event
  //navigating to the new conversation and assigned from push notification
  //setting URL for navigation via addtitional data
  // it will fire when  app will be open
  // onReceived = (notification) => {
  //   // if (openResult.notification.payload.additionalData){
  //   //   console.log("Notification received: ", notification);;
  //   // }
  //   // onsole.log("Notification received: ", notification);;c
  //   var id1 = notification.payload.notificationID
  // //   OneSignal.cancelNotification(parseInt(id));
  //   if(notification.payload.additionalData){
  //     var url = notification.payload.additionalData.value;
  //      //string manipulation of URL to get specific route
  //      const route = url.replace(/.*?:\/\//g, '');
  //      const messageId = route.split('/')[2];
  //      const mailboxId = route.split('/')[1];
  //      const routeName = route.split('/')[0];
  //      if (routeName === 'conversationPage') {
  //       //get current route to check if current route is same as url route
  //       var routes = NavigatorService.getCurrentRoute().routes;
  //       var index = NavigatorService.getCurrentRoute().index;
  //       if (routes == undefined) {
  //         // do nothing
  //       }
  //       else if (routes.findIndex(route => route.key === "ConversationPage") === NavigatorService.getCurrentRoute().index) {
  //         //load conversation if already on the ConversationPage
  //         // this.props.resetCustomerInfo();
  //         // // this.props.loadConversationStart();
  //         // this.props.loadConversationRequested(messageId, 0, MESSAGE_PAGE_SIZE);
  //         // this.props.setSelectedConversationId(messageId)
  //       }
  //       else {
  //         // NavigatorService.navigate("ConversationPage", { messageId });
  //         // do nothing
  //         return (
  //           Alert.alert(
  //             notification.payload.title,
  //             notification.payload.body,
  //             [
  //               {
  //                 text: 'Cancel',
  //                 onPress: () => {
  //                   // OneSignal.cancelNotification(parseInt(id1));
  //                   // console.log('Cancel ')
  //                 },
  //                 style: 'cancel'
  //               },
  //               {
  //                 text: 'View', onPress: () => {
  //                  //load conversation if already on the ConversationPage
  //                  this.props.setSelectedSidebarListItem(sidebarListEnum.All);
  //                  this.props.setSelectedNotificationMailbox(null);
  //                  this.props.setSelectedMailbox(parseInt(mailboxId));
  //                  this.props.loadMailboxTeamListRequested()
  //         NavigatorService.navigate("ConversationPage", { messageId });
  //                 }
  //               }
  //             ]
  //           )
  //         )
  //       }
  //     }
  //     else if (routeName === 'conversationList') {
  //       return (
  //         Alert.alert(
  //           notification.payload.title,
  //           notification.payload.body,
  //           [
  //             {
  //               text: 'Cancel',
  //               onPress: () => {
  //                 // OneSignal.cancelNotification(parseInt(id1));
  //                 // console.log('Cancel ')
  //               },
  //               style: 'cancel'
  //             },
  //             {
  //               text: 'View', onPress: () => {
  //                 this.props.setSelectedSidebarListItem(sidebarListEnum.All);
  //                 this.props.setSelectedNotificationMailbox(null);
  //                 this.props.setSelectedMailbox(parseInt(mailboxId));
  //                 this.props.unloadConversationList();
  //                 this.props.loadMailboxTeamListRequested()
  //                 NavigatorService.navigate("ConversationList");
  //               }
  //             }
  //           ]
  //         )
  //       )

  //     }
  //  }
  // }
  // // it will fire when app will be close
  // onOpened = (openResult) => {
  //   //check for additional data in onesignal notification payload
  //   if (openResult.notification.payload.additionalData) {
  //     var url = openResult.notification.payload.additionalData.value;
  //     //string manipulation of URL to get specific route
  //     const route = url.replace(/.*?:\/\//g, '');
  //     const messageId = route.split('/')[2];
  //     const mailboxId = route.split('/')[1];
  //     const routeName = route.split('/')[0];
  //     if (routeName === 'conversationPage') {
  //       //get current route to check if current route is same as url route
  //       var routes = NavigatorService.getCurrentRoute().routes;
  //       var index = NavigatorService.getCurrentRoute().index;
  //       // if (routes == undefined) {
  //       //   // do nothing
  //       // }
  //       // else if (routes.findIndex(route => route.key === "ConversationPage") === NavigatorService.getCurrentRoute().index) {
  //       //   //load conversation if already on the ConversationPage
  //         this.props.resetCustomerInfo();
  //         this.props.loadConversationStart();
  //         this.props.loadConversationRequested(messageId, 0, MESSAGE_PAGE_SIZE);
  //         this.props.setSelectedSidebarListItem(sidebarListEnum.All);
  //         this.props.setSelectedNotificationMailbox(null);
  //         this.props.setSelectedMailbox(parseInt(mailboxId));
  //         this.props.loadMailBoxCustomFields(mailboxId)
  //         this.props.setSelectedConversationId(parseInt(messageId))
  //         this.props.loadMailboxTeamListRequested()
  //         this.props.navigation.navigate("ConversationPage", { messageId });
  //       // }
  //       // else {
  //       //   NavigatorService.navigate("ConversationPage", { messageId });
  //       // }
  //     }
  //     else if (routeName === 'conversationList') {
  //       this.props.setSelectedSidebarListItem(sidebarListEnum.All);
  //       this.props.setSelectedNotificationMailbox(null);
  //       this.props.setSelectedMailbox(parseInt(mailboxId));
  //       this.props.unloadConversationList();
  //       this.props.loadMailboxTeamListRequested()
  //       NavigatorService.navigate("ConversationList");
  //     }
  //   }
  // }
  // oninAppMessageClicked = (openResult) => {
  //   // console.log(openResult,'HIIIIIIIII')
  // }

  //#endregion

  //#region Render methods 
  // show error message if username or password invalid
  renderError() {
    if (this.state.errorUserID) {
      this.setState({errorUserID:false})
        return (
          Toast.show({ text: "Invalid User Id", textStyle: { color: "white" }, buttonText: "okay", type: "danger", duration: 5000, position: 'bottom' })
        );
        }
  }

  renderForegetPassword() {
    return (
      <TouchableOpacity><Text>Foreget Passowrd ?</Text></TouchableOpacity>
    )
  }
  renderButton() {
      return (<Animatable.View useNativeDriver={true} animation="bounceIn" duration={1000} style={{ borderWidth:0, flexDirection: 'row', justifyContent: 'center',paddingLeft:30,paddingRight:30,
       }}>
      <Button
        rounded  style={{elevation:10,flex:1,alignItems: 'center', justifyContent: 'center', backgroundColor: this.props.primaryColor }}
        onPress={() => {
          if(this.state.userID == "") {
            this.setState({errorUserID:true})
          }
          else {
            var userLocal = {};
            userLocal.username = this.state.userID;
            this.props.resetPassword(userLocal)
            this.setState({userID:"",errorUserID:false})
          }
        //   this.props.validUser(userLocal);
          // this.props.navigation.openDrawer();
          // var params = {};
          // params["route"] = "All";
          // this.props.navigation.navigate('OnBoardingPage', params);
        }
        }
      >
        <Text>{this.props.selectedLanguageFile != undefined ? this.props.selectedLanguageFile.resetPass : "Reset Password"}</Text>
      </Button></Animatable.View>
      );

  }

  renderBackButton() {
        return (
            <Animatable.View useNativeDriver={true} animation="bounceIn" duration={1000} style={{ borderWidth:0, flexDirection: 'row', justifyContent: 'center',paddingLeft:30,paddingRight:30,
        }}><Button
          rounded style={{elevation:10,flex:1,alignItems: 'center', justifyContent: 'center', backgroundColor: this.props.primaryColor }}
          onPress={() => {
            this.setState({userID:"",errorUserID:false})
              this.props.navigation.goBack()
          }
          }
        >
          <Text>{this.props.selectedLanguageFile != undefined ? this.props.selectedLanguageFile.backtologin : "Back to Login"}</Text>
        </Button>
        </Animatable.View>
        );
  }
  _ShowPassword() {
    this.setState(prevState => ({
      passwordHidden: !prevState.passwordHidden
    }))
  }
  renderSpinner() {
      return (
        <SpinnerOverlay visiblespinner={this.props.showVSafeSpinner}/>
      )
  }
  onFocus = () => this.setState({ isfocus: true })
  onBlur = () => this.setState({ isfocus: false })
  onFocus1 = () => this.setState({ isfocus1: true })
  onBlur1 = () => this.setState({ isfocus1: false })

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
  render() {
    return (
      <Container style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar barStyle="light-content" />
         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{flex:1,flexDirection:'column'}}>
         <Animatable.View useNativeDriver={true} animation="fadeInDownBig" duration={1500}  style={this.state.keyboardShown ?{flex:0.4,flexDirection:'column',backgroundColor:this.props.primaryColor,borderBottomLeftRadius:100} : {flex:0.4,flexDirection:'column',backgroundColor:this.props.primaryColor,borderBottomLeftRadius:100}}>
         <View style={this.state.keyboardShown ? {flex:1,flexDirection:'column',justifyContent:'flex-end',alignItems:'center'} : {flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
         <Image resizeMode={'stretch'} source={vSafeAppLogo} style={this.state.keyboardShown ? { height: 80, width: 80, borderRadius: 5 } :{ height: 120, width: 120, borderRadius: 5 }} />
         </View>
         <View style={{flex:0.2,flexDirection:'row',justifyContent:'flex-end',paddingRight:25,alignItems:'flex-start'}}>
         <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>VSafeNow</Text>
         </View>
         </Animatable.View>
         <Animatable.View style={this.state.keyboardShown ? {flex:1,backgroundColor:'white'}  : {flex:0.6,backgroundColor:'white'}} useNativeDriver={true} animation="fadeInUpBig" duration={1500}>
         {
            // this.state.keyboardShown ? <View style={{height:20}}></View> : null
           }
         <View style={{flex:1.4,flexDirection:'column',borderWidth:0,justifyContent:'flex-end',padding:20}}>
         <Form>
            <Item floatingLabel style={this.state.isfocus1 == true ? { borderColor: '#00B7E2' } : null}>
              <Label>{this.props.selectedLanguageFile != undefined ? this.props.selectedLanguageFile.username : "User Name"}</Label>
              <Input
                onFocus={this.onFocus1}
                onBlur={this.onBlur1}
                value={this.state.userID}
                onChangeText={(text) =>{
                  this.setState({ userID : text }) 
                }}
              />
            </Item>
          </Form>
         </View>
          <View style={{flex:1,flexDirection:'column',alignItems:'flex-end',justifyContent:'space-evenly'}}>
          {this.renderButton()}
          {this.renderBackButton()}
          {this.renderError()}
          {this.renderSpinner()}
          </View>
          <View style={{flex:0.5,flexDirection:'row',justifyContent:'center',alignItems:'center'}}><Text>Version {DeviceInfo.getVersion()}.0</Text></View>
         </Animatable.View>
         </KeyboardAvoidingView>
         <SpinnerOverlay visiblespinner={this.props.showVSafeSpinner}/>
         <SnackBar ref={(ref) => { this.ReactNativeSnackBar = ref; }} />
                    {this.DisplaySnackBar()}
      </Container>
    );
  }
  //#endregion
}

//#region Map State and Dispatch region
function mapStateToProps(state) {
  const { user, isAuthenticated, error, loading, isLoggedIn,authData,loginPageKey } = state.login;
  const { primaryColor } = state.dashBoardPage;
  const { selectedLanguage,selectedLanguageFile } = state.settingsPage;
  const { showVSafeSpinner } = state.healthReportPage;
  const { showSnackBar, snackBarMessage } = state.checkListsPage;
  return {
    user,
    isAuthenticated,
    error,
    loading,
    isLoggedIn,
    authData,
    primaryColor,
    loginPageKey,
    selectedLanguage,
    selectedLanguageFile,
    showVSafeSpinner,
    showSnackBar,
    snackBarMessage
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    validUser: validUser,
    // , loadConversationStart: loadConversationStart
    // , loadConversationRequested: loadConversationRequested
    // , setSelectedSidebarListItem: setSelectedSidebarListItem
    // , setSelectedConversationId: setSelectedConversationId
    // , setSelectedMailbox: setSelectedMailbox
    // , unloadConversationList: unloadConversationList,
    // setSelectedNotificationMailbox: setSelectedNotificationMailbox,
    // loadMailBoxCustomFields: loadMailBoxCustomFields,
     _resetUser: _resetUser,
    // resetCustomerInfo: resetCustomerInfo,
    // loadMailboxTeamListRequested: loadMailboxTeamListRequested,
    // setSelectedNotificationMailbox: setSelectedNotificationMailbox
    saveLoginPageKey:saveLoginPageKey,
    setSelectedLanguage:setSelectedLanguage,
    changeAppLanguage:changeAppLanguage,
    hideSnackBar:hideSnackBar,
    resetPassword:resetPassword
  }, dispatch)
}
//#endregion
export default connect(mapStateToProps, matchDispatchToProps)(ForgotPasswordPage);
