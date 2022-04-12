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
  validUser, _resetUser,saveLoginPageKey,_updateAuthData
} from '../../actions/loginAction';
import { TouchableOpacity } from "react-native";
import { Platform } from "react-native";
import jwtDecode from "jwt-decode";
import jwt_decode from "jwt-decode";
import SpinnerOverlay from "../checkListsPage/spinnerOverlay";
import { oneSignalAppID } from "../../config/config";
import { setSelectedLanguage,changeAppLanguage } from "../../actions/dashBoardPageActions";
import API from "../../api";
//#endregion
const vSafeAppLogo = require("../../../assets/vSafeAppLogoTransparent.png")

class LoginPage extends PureComponent {
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
      wrong: false
    };
    // obj = new conversationPage();
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
    // this.changeAppLanguage();
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
    if (this.props.isLoggedIn) {
      let token = this.props.authData.access_token;
      const { exp } = jwtDecode(token)
      const expirationTime = (exp * 1000) - 60000
      // cheking if token expired or not.
      if (Date.now() >= expirationTime) {
        // var refreshToken = this.props.authData.refresh_token
        // console.log("EXECUTING REFRESHING TOKEN CODE NOW.....")
        // API.refreshtoken(refreshToken)
        // .then(res=>{
        //    console.log(res)
        //    var autDataModal =  {
        //     access_token: res.access_token,
        //     expires_in: res.expires_in,
        //     refresh_token: res.refresh_token,
        //     token_type: res.token_type
        //   }
        // this.props._updateAuthData(autDataModal);
        // var params = {};
        // params["route"] = "All";
        // this.props.navigation.navigate('DashBoardPage', params);
        // })
        // .catch(err=>{
        // console.log(err)
        // this.props._resetUser();
        // AsyncStorage.clear()
        // })
        this.props._resetUser();
        AsyncStorage.clear()
      }
      else {
          var params = {};
          params["route"] = "All";
          this.props.navigation.navigate('DashBoardPage', params);
      }
    }
    //Push notification event listeners
  OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.
  // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
  // OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback);
   OneSignal.registerForPushNotifications()
   var keys = this.props.navigation.state.key;
   console.log("KEYS",keys)
   this.props.saveLoginPageKey(keys);

    // OneSignal.addEventListener('received',this.onReceived)
    // OneSignal.addEventListener('opened', this.onOpened);
    // // OneSignal.addEventListener('inAppMessageClicked',this.oninAppMessageClicked)
    // OneSignal.inFocusDisplaying(0);
    // OneSignal.clearOneSignalNotifications();
    // var selectedLanguage =  AsyncStorage.getItem("@app_language",(error,result)=>{
    //   console.log("Error : getting app lan",error)
    //   if(result != null) {
    //     var selectedLanguage = JSON.parse(result);
    //     console.log("Result : getting app lan",JSON.parse(result))
    //     this.props.setSelectedLanguage(selectedLanguage);
    //     this.props.changeAppLanguage(selectedLanguage);
    //   }
    // })  
  }
   
  changeAppLanguage = async () => {
    var selectedLanguage = await AsyncStorage.getItem("@app_language")
    if(selectedLanguage != null) {
      setTimeout(()=>{
        var finalSelectedLanguage = JSON.parse(selectedLanguage);
        console.log("Result : getting app lan",finalSelectedLanguage)
        this.props.setSelectedLanguage(finalSelectedLanguage);
        this.props.changeAppLanguage(finalSelectedLanguage);
      },3000)
    }
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
    if (this.props.error) {
      this.props._resetUser()
      if (this.props.error == 'Email And Password cannot be empty.') {
        return (
          Toast.show({ text: "Email And Password cannot be empty", textStyle: { color: "white" }, buttonText: "okay", type: "danger", duration: 5000, position: 'bottom' })
        );
      }
      else if (this.props.error == "Invalid Credentials  Or Invalid User") {
        return (
          Toast.show({ text: "Invalid Email  Or Password", textStyle: { color: "white" }, buttonText: "okay", type: "danger", duration: 5000, position: 'bottom' })
        );
      }
      else if (this.props.error == "undefined  Or Invalid User") {
        return (
          Toast.show({ text: "Invalid Email  Or Password", textStyle: { color: "white" }, buttonText: "okay", type: "danger", duration: 5000, position: 'bottom' })
        );
      }
      else {
        return (
          Toast.show({ text: "Invalid Email  Or Password", textStyle: { color: "white" }, buttonText: "okay", type: "danger", duration: 5000, position: 'bottom' })
        );
      }

    }
  }

  renderForegetPassword() {
    return (
      <TouchableOpacity><Text>Foreget Passowrd ?</Text></TouchableOpacity>
    )
  }
  renderButton() {
    if (!this.props.error) {
      return (<Animatable.View useNativeDriver={true} animation="bounceIn" duration={1000} style={{ borderWidth:0, flexDirection: 'row', justifyContent: 'center',paddingLeft:30,paddingRight:30,
       }}>
      <Button
        rounded  style={{elevation:10,flex:1,alignItems: 'center', justifyContent: 'center', backgroundColor: this.props.primaryColor }}
        onPress={() => {
          var userLocal = {};
          userLocal.email = this.state.email;
          userLocal.password = this.state.password;
          this.props.validUser(userLocal);
          // this.props.navigation.openDrawer();
          // var params = {};
          // params["route"] = "All";
          // this.props.navigation.navigate('OnBoardingPage', params);
        }
        }
      >
        <Text>{this.props.selectedLanguageFile != undefined ? this.props.selectedLanguageFile.signin : "Sign in"}</Text>
      </Button></Animatable.View>);
    }
    else {
      return (<View style={{ flex: 1, paddingTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}><Button
        rounded style={{ width: 200, alignItems: 'center', justifyContent: 'center' }}
        onPress={() => {
          var userLocal = {};
          userLocal.email = this.state.email;
          userLocal.password = this.state.password;
          this.props.validUser(userLocal);
          // this.props.navigation.openDrawer();
          // var params = {};
          // params["route"] = "All";
          // this.props.navigation.navigate('OnBoardingPage', params);
        }
        }
      >
        <Text>{this.props.selectedLanguageFile != undefined ? this.props.selectedLanguageFile.signin : "Sign in"}</Text>
      </Button></View>);
    }

  }
  _ShowPassword() {
    this.setState(prevState => ({
      passwordHidden: !prevState.passwordHidden
    }))
  }
  renderSpinner() {
    if (this.props.loading) {
      return (
        <SpinnerOverlay visiblespinner={this.props.loading}/>
      )
    }
    else {
        return (
          <SpinnerOverlay visiblespinner={this.props.loading}/>
        )
    }
  }
  onFocus = () => this.setState({ isfocus: true })
  onBlur = () => this.setState({ isfocus: false })
  onFocus1 = () => this.setState({ isfocus1: true })
  onBlur1 = () => this.setState({ isfocus1: false })
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
            this.state.keyboardShown ? <View style={{height:50}}></View> : null
           }
         <View style={{flex:1,flexDirection:'column'}}>
         <View style={{flex:1.9,flexDirection:'column',borderWidth:0,justifyContent:'flex-end',padding:20}}>
         <Form>
            <Item floatingLabel style={this.state.isfocus == true ? { borderColor: '#00B7E2' } : null}>
              <Label>{this.props.selectedLanguageFile != undefined ? this.props.selectedLanguageFile.email : "Email"}</Label>
              <Input
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                value={this.state.email}
                onChangeText={email => this.setState({ email })} />
              {/* <Icon type="MaterialCommunityIcons" name="email" style={{ color: this.props.primaryColor }} /> */}
            <Icon type="MaterialIcons" name="email" style={{color:this.props.primaryColor}}/>
            </Item>
            <Item floatingLabel style={this.state.isfocus1 == true ? { borderColor: '#00B7E2' } : null}>
              <Label>{this.props.selectedLanguageFile != undefined ? this.props.selectedLanguageFile.password : "Password"}</Label>
              <Input
                onFocus={this.onFocus1}
                onBlur={this.onBlur1}
                secureTextEntry={this.state.passwordHidden}
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
              />
              <Icon type='FontAwesome' name={this.state.passwordHidden === true ? "eye-slash" : "eye"} style={{ color: this.props.primaryColor }} onPress={() => this._ShowPassword()} />
            </Item>
          </Form>
         </View>
          {this.renderError()}
          {this.renderSpinner()}
          <View style={{flex:1,flexDirection:'column',alignItems:'flex-end',justifyContent:'flex-end'}}>
          {this.renderButton()}
          </View>
          {
            <View style={{flex:0.5,flexDirection:'row',alignItems:'flex-start',paddingTop:this.state.keyboardShown ? 0 : 10,justifyContent:'center'}}>
            <TouchableOpacity style={{paddingTop:10}} onPress={()=>{
              this.props.navigation.navigate("ForgotPasswordPage")
            }}>
            <Text>{this.props.selectedLanguageFile != undefined ? this.props.selectedLanguageFile.forgotPass : "Forgot Password ?"}</Text>
            </TouchableOpacity>
            </View>
          }
          <View style={{flex:0.5,flexDirection:'row',justifyContent:'center',alignItems:'center'}}><Text>Version {DeviceInfo.getVersion()}.0</Text></View>
         </View>
         </Animatable.View>
         </KeyboardAvoidingView>
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
    selectedLanguageFile
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
    _updateAuthData:_updateAuthData
  }, dispatch)
}
//#endregion
export default connect(mapStateToProps, matchDispatchToProps)(LoginPage);
