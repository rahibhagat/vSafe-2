//#region Third party imports
/* eslint-disable */
import React, { PureComponent } from "react";
import { RefreshControl, Image, View, Animated, BackHandler, StatusBar, Dimensions, Alert, FlatList,
   TouchableOpacity, ImageBackground,Platform,PermissionsAndroid,
   TouchableHighlight, ActivityIndicator, ScrollView, Modal,Linking ,Settings, Switch } from 'react-native';
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
import { logoutUserRequested } from "../../actions/loginAction";
import {  saveBlueToothStates,startBleAdvertising,stopBleAdvertising,setSelectedLanguage,saveAccessCoarseLocationStatus,
enableEmailNotificationSettings,
enablePushNotificationSettings,enableSMSNotificationSettings,changeAppLanguage,updateNewPassword } from "../../actions/dashBoardPageActions";
import { startVSafeSpinner,stopVSafeSpinner } from "../../actions/healthReportPageActions";
import { BluetoothStatus } from 'react-native-bluetooth-status';
import FastImage from 'react-native-fast-image';
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
//#endregion

//#region vSafe imports
import styles from "./styles";
import SnackBar from "../bodyAssessmentPage/snackBar";
import { hideSnackBar } from "../../actions/checkListsPageActions";
import SpinnerOverlay from "../../components/spinnerOverlay";
const userID = "c3b7f625-c07f-4d7d-9be1-ddff8ff93b4d";
import { SafeAreaProvider,SafeAreaView } from "react-native-safe-area-context";
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
import NavigatorService from "../../navigatorService/navigator";
import { TextInput } from "react-native-gesture-handler";
//#endregion

class SettingsPage extends PureComponent {
  //#region Constructor
  constructor(props) {
    super(props);
    // this.onRefreshCtrl = this.onRefreshCtrl.bind(this);
    this.state = {
      underlayColor: 'white',
      message: 'No messages.',
      selectedMailboxFilter: '',
      selectedStatusFilter: '',
      selectedUserFilter: '',
      selectedTimeIntervalFilter: 0,
      startforconvupdate: false,
      modalvisible: false,
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
      isEnabledBluetooth: false, isEnabledLocation: false, 
      isEnabledNotification: this.props.pushNotificationStatus,
      isEnabledEmail:this.props.emailNotificationStatus,
      isEnabledSMS:this.props.smsNotificationStatus,
      customUserGuid: userID,
      openModalToChangeAppLanguage:false,
      openModalToChangePassword:false,
      oldPasswordText:"",
      newPasswordText:"",
      errorOldPass:false,
      errorNewPass:false,
      oldPasswordHidden:true,
      newPasswordHidden:true,
      Language : [
        {
          name: 'English (Canada)',
          selected: false,
          id:1
        },
        {
          name: 'Français (Canada)',
          selected: false,
          id:2
        }
      ]
    }
    this.array = [];
    this.toggleSwitch = this.toggleSwitch.bind(this);
  }
  //#endregion

  //#region Other methods
  componentWillMount() {

    // exit application on hardware back button.
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

  }
  componentDidUpdate() {

  }
  componentWillUnmount() {
    clearInterval(this.timer);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

  }
  // Exiting Application
  handleBackButtonClick() {
    BackHandler.exitApp();
  }

  toggleSwitch = (value) => {
    // if (value == 1) {
    //   this.setState({ isEnabledNotification: !this.state.isEnabledNotification })
    // }
    // else if (value == 2) {
    //   this.setState({ isEnabledLocation: !this.state.isEnabledLocation })
    //   setTimeout(()=>{
    //     if(this.state.isEnabledLocation) {
    //       if (Platform.OS === 'android' && Platform.Version >= 23) {
    //         PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
    //             if (result) {
    //                 this.props.saveAccessCoarseLocationStatus(true)
    //             } else {
    //                 PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
    //                     if (result) {
    //                         this.props.saveAccessCoarseLocationStatus(true)
    //                     } else {
    //                         this.props.saveAccessCoarseLocationStatus(false)
    //                     }
    //                 });
    //             }
    //         });
    //     }
    //     }
    //     else {
    //       this.props.saveAccessCoarseLocationStatus(false)
    //       Linking.openSettings()
    //     }
    //   },1500)
    // }
    // else {
    //   this.setState({ isEnabledBluetooth: !this.state.isEnabledBluetooth })
    //   // this.props.saveBlueToothStates(!this.state.isEnabledBluetooth)
    //   // setTimeout(() => {
    //   //   if(this.state.isEnabledBluetooth) {
    //   //     this.props.startBleAdvertising(this.state.customUserGuid)
    //   //   }
    //   //   else {
    //   //     this.props.stopBleAdvertising()
    //   //   }
    //   // }, 5000); 
    //   this.checkInitialBluetoothState(!this.state.isEnabledBluetooth)
    // }
    if (value == 1) {
      this.setState({isEnabledNotification:!this.state.isEnabledNotification})
      this.props.enablePushNotificationSettings(!this.props.pushNotificationStatus)
  }
  else if (value == 2) {
    this.setState({isEnabledEmail:!this.state.isEnabledEmail})
    this.props.enableEmailNotificationSettings(!this.props.emailNotificationStatus)
  }
  else if (value == 3) {
      this.setState({ isEnabledBluetooth: !this.state.isEnabledBluetooth })
  }
  else if (value == 4) {
    this.setState({isEnabledSMS:!this.state.isEnabledSMS})
    this.props.enableSMSNotificationSettings(!this.props.smsNotificationStatus)
  }

  }

  async checkInitialBluetoothState(value) {
    const isEnabled = await BluetoothStatus.state();
    console.log("check bluetooth on or off", isEnabled);
    if (isEnabled == true) {
      this.props.stopBleAdvertising()
      BluetoothStatus.disable()
      this.props.saveBlueToothStates(false)
    } else {
      BluetoothStatus.enable(value);
      this.props.saveBlueToothStates(true);
      setTimeout(() => {
        this.props.startBleAdvertising(this.props.user.id)
      }, 4000);
    }
}

renderLanguageItem(item,index) {
  return (
    <TouchableOpacity style={{flex:1,flexDirection:'row',padding:15}} onPress={()=>{
      this.props.setSelectedLanguage(item)
      this.props.changeAppLanguage(item);
      this.setState({openModalToChangeAppLanguage:false})
    }}>
    <Card style={{flex:1,flexDirection:'row'}}>
     <CardItem style={{flex:0.9}}>
     <Text>{item.name}</Text>
     </CardItem>
     <CardItem style={{flex:0.1,flexDirection:'row',justifyContent:'flex-end',alignItems:'flex-end'}}>
      {this.props.selectedLanguage !== undefined ? this.props.selectedLanguage.id == item.id ? <View><Icon name='check' type='MaterialIcons' style={{color:this.props.primaryColor}}/></View>:null : null}
     </CardItem>
     </Card>
    </TouchableOpacity>
  )
}

renderLanguageChangeModal() {
  if(this.state.openModalToChangeAppLanguage) {
    return (
      <Modal visible={this.state.openModalToChangeAppLanguage} onRequestClose={()=>{
        this.setState({openModalToChangeAppLanguage:false})
      }}>
        <SafeAreaView style={{flex:1,backgroundColor:this.props.primaryColor}}>
      <Container style={{backgroundColor: "#FFF"}}>
      {Platform.OS === "ios" ?
        <View transparent={true} style={{ backgroundColor:this.props.primaryColor,padding:15, elevation: 5, flexDirection: 'row'}}>
        <Left style={{ flex: 0.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
      <TouchableOpacity onPress={()=>{
        this.setState({openModalToChangeAppLanguage:false})
      }}>
      <Icon name="close" type="MaterialIcons" style={{color:'white'}}/>
      </TouchableOpacity>
      </Left>
      <Body style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start' }}>
      <Title>{this.props.selectedLanguageFile.selectlan}</Title>
      </Body>
        </View> :
        <Header style={{height:50,backgroundColor:this.props.primaryColor}}>
      <Left>
      <TouchableOpacity onPress={()=>{
        this.setState({openModalToChangeAppLanguage:false})
      }}>
      <Icon name="close" type="MaterialIcons" style={{color:'white'}}/>
      </TouchableOpacity>
      </Left>
      <Body>
      <Title>{this.props.selectedLanguageFile.selectlan}</Title>
      </Body>
      </Header> 
      }
      <Content>
      <FlatList 
      data={this.props.languages}
      renderItem={({item,index})=>
        this.renderLanguageItem(item,index)
      }
      keyExtractor={(item,index)=>{
        return item.id.toString();
      }}/>
      </Content>
      </Container>
      </SafeAreaView>
      </Modal>
    )
  }
}

_ShowPassword(value) {
  if(value == 1)
  {
    this.setState(prevState => ({
      oldPasswordHidden: !prevState.oldPasswordHidden
    }))
  }
  else {
    this.setState(prevState => ({
      newPasswordHidden: !prevState.newPasswordHidden
    }))
  }
}

renderChangePasswordModal() {
  if(this.state.openModalToChangePassword) {
    return (
      <Modal visible={this.state.openModalToChangePassword} onRequestClose={()=>{
        this.setState({openModalToChangeAppLanguage:false})
      }}>
        <SafeAreaView style={{flex:1,backgroundColor:this.props.primaryColor}}>
      <Container style={{backgroundColor: "#FFF"}}>
      {Platform.OS === "ios" ?
        <View transparent={true} style={{ backgroundColor:this.props.primaryColor,padding:15, elevation: 5, flexDirection: 'row'}}>
        <Left style={{ flex: 0.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
      <TouchableOpacity onPress={()=>{
            this.setState({openModalToChangePassword:false,newPasswordText:"",oldPasswordText:"",errorNewPass:false,errorOldPass:false})
      }}>
      <Icon name="close" type="MaterialIcons" style={{color:'white'}}/>
      </TouchableOpacity>
      </Left>
      <Body style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start' }}>
      <Title>{this.props.selectedLanguageFile.changePassword}</Title>
      </Body>
        </View> :
        <Header style={{height:50,backgroundColor:this.props.primaryColor}}>
      <Left>
      <TouchableOpacity onPress={()=>{
        this.setState({openModalToChangePassword:false})
      }}>
      <Icon name="close" type="MaterialIcons" style={{color:'white'}}/>
      </TouchableOpacity>
      </Left>
      <Body>
      <Title>{this.props.selectedLanguageFile.selectlan}</Title>
      </Body>
      </Header> 
      }
      <Content>
        <View style={{flex:1,flexDirection:'column',padding:15}}>
          <View style={{padding:10}}>
            <Item floatingLabel>
              <Label>{this.props.selectedLanguageFile.oldPass}</Label>
              <Input secureTextEntry={this.state.oldPasswordHidden}  onChangeText={(text)=>{
                  this.setState({oldPasswordText:text,errorOldPass:false})
              }}/>
            <Icon type='FontAwesome' name={this.state.oldPasswordHidden === true ? "eye-slash" : "eye"} style={{ color: this.props.primaryColor }} onPress={() => this._ShowPassword(1)} />
            </Item>
            <Text style={{ color: 'red', fontSize: 12 }}>{this.state.errorOldPass ? 'Please Enter Old Password' : ''}</Text>
          </View>
          <View style={{padding:10}}>
            <Item floatingLabel>
              <Label>{this.props.selectedLanguageFile.newPass}</Label>
              <Input secureTextEntry={this.state.newPasswordHidden} onChangeText={(text)=>{
                  this.setState({newPasswordText:text,errorNewPass:false})
              }}/>
          <Icon type='FontAwesome' name={this.state.newPasswordHidden === true ? "eye-slash" : "eye"} style={{ color: this.props.primaryColor }} onPress={() => this._ShowPassword(2)} />
            </Item>
            <Text style={{ color: 'red', fontSize: 12 }}>{this.state.errorNewPass ? 'Please Enter New Password' : ''}</Text>
          </View>
        <Button block style={{backgroundColor:this.props.primaryColor}} onPress={()=>{
          if(this.state.oldPasswordText == "" && this.state.newPasswordText == "") {
            this.setState({errorOldPass:true,errorNewPass:true})
          }
          else if(this.state.newPasswordText == "") {
            this.setState({errorNewPass:true})
          }
          else if(this.state.oldPasswordText == "") {
            this.setState({errorOldPass:true})
          }
          else {
            var passDto = {
              "oldPassword":this.state.oldPasswordText,
              "newPassword":this.state.newPasswordText
            }
            this.props.updateNewPassword(passDto);
            this.setState({openModalToChangePassword:false,newPasswordText:"",oldPasswordText:"",errorNewPass:false,errorOldPass:false})
          }
        }}><Text>{this.props.selectedLanguageFile.setnewPass}</Text></Button>  
        </View>
      </Content>
      </Container>
      </SafeAreaView>
      </Modal>
    )
  }
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
      <SafeAreaView style={{flex:1,backgroundColor:this.props.primaryColor}} edges={['top']}>
      <Container style={{backgroundColor: "#FFF"}}>
        <View transparent={true} style={{ backgroundColor: 'white', padding:5, elevation: 5, flexDirection: 'row' }}>
          <Left style={{ flex: 0.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => {
              this.props.navigation.goBack()
            }}>
              <Ionicons name="close" size={25} style={{ color: 'black' }} />
            </TouchableOpacity>
          </Left>
          <Body style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            <Title style={{ fontWeight: 'bold', fontSize: 22, color: 'black', paddingLeft: 15 }}>{this.props.selectedLanguageFile.settings}</Title>
          </Body>
        </View>
        <Content>
          <View style={{ flex: 0.6, flexDirection: 'column', paddingleft: 20, padding: 10, borderBottomWidth: 1, borderBottomColor: 'lightgray' }}>
            <View style={{ padding: 5, paddingLeft: 20 }}>
              <Text numberOfLines={3} style={{ fontSize: 22 }}>{this.props.selectedLanguageFile.tracingtools}</Text>
            </View>
          </View>
          <View style={{
            flex: 1, flexDirection: 'column', padding: 0
          }}>
            <CardItem bordered >
              <Body style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 20 }}>
                <View style={{ flex: 0.5, flexDirection: 'column', justifyContent: 'center', }}>
                  <Icon name="bell-o" type="FontAwesome" style={{ fontSize: 25 }} />
                </View>
                <View style={{ flex: 1.5, flexDirection: 'column' }}>
                  <Text style={{ fontSize: 18 }}>{this.props.selectedLanguageFile.pushnotifications}</Text>
                  <Text style={{ fontSize: 12 }}>{this.props.selectedLanguageFile.receicenotification}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'column', }}>
                  <Switch
                    trackColor={{ false: "#767577", true: "lightblue" }}
                    thumbColor={this.props.pushNotificationStatus ? this.props.primaryColor : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onChange={this.toggleSwitch.bind(this, 1)}
                    value={this.props.pushNotificationStatus ? this.state.isEnabledNotification ? this.props.pushNotificationStatus : false : this.state.isEnabledNotification ? this.state.isEnabledNotification : false }
                  />
                </View>
              </Body>
            </CardItem>
            <CardItem bordered >
                            <Body style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 20 }}>
                                <View style={{ flex: 0.5, flexDirection: 'column', justifyContent: 'center', paddingTop: 0 }}>
                                    <Icon name="location-pin" type="SimpleLineIcons" style={{ fontSize: 20 }} />
                                </View>
                                <View style={{ flex: 1.5, flexDirection: 'column' }}>
                                    <Text style={{ fontSize: 18 }}>{this.props.selectedLanguageFile.emailnotification}</Text>
                                    <Text style={{ fontSize: 12 }}>{this.props.selectedLanguageFile.receiceannnotifi}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'column', paddingTop: 0 }}>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "lightblue" }}
                                        thumbColor={this.props.emailNotificationStatus ? this.props.primaryColor : "#f4f3f4"}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={this.toggleSwitch.bind(this, 2)}
                                        value={this.props.emailNotificationStatus ? this.state.isEnabledEmail ? this.props.emailNotificationStatus : false : this.state.isEnabledEmail ? this.state.isEnabledEmail : false}
                                    />
                                </View>
                            </Body>
                        </CardItem>
                        <CardItem bordered >
                            <Body style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 20 }}>
                                <View style={{ flex: 0.5, flexDirection: 'column', justifyContent: 'center', paddingTop: 0 }}>
                                    <Icon name="location-pin" type="SimpleLineIcons" style={{ fontSize: 20 }} />
                                </View>
                                <View style={{ flex: 1.5, flexDirection: 'column' }}>
                                    <Text style={{ fontSize: 18 }}>{this.props.selectedLanguageFile.smsnotification}</Text>
                                    <Text style={{ fontSize: 12 }}>{this.props.selectedLanguageFile.receiceannnotifi}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'column', paddingTop: 0 }}>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "lightblue" }}
                                        thumbColor={this.props.smsNotificationStatus ? this.props.primaryColor : "#f4f3f4"}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={this.toggleSwitch.bind(this, 4)}
                                        value={this.props.smsNotificationStatus ? this.state.isEnabledSMS ? this.props.smsNotificationStatus :false : this.state.isEnabledSMS ? this.state.isEnabledSMS : false }
                                    />
                                </View>
                            </Body>
                        </CardItem>
            <CardItem bordered >
              <Body style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 20 }}>
                <View style={{ flex: 0.5, flexDirection: 'column', justifyContent: 'center' }}>
                  <Icon name="bluetooth-b" type="FontAwesome" style={{ fontSize: 25 }} />
                </View>
                <View style={{ flex: 1.5, flexDirection: 'column' }}>
                  <Text style={{ fontSize: 18 }}>{this.props.selectedLanguageFile.bluetoothtracing}</Text>
                  <Text style={{ fontSize: 12 }}>{this.props.selectedLanguageFile.emitdetect}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                  <Switch
                    trackColor={{ false: "#767577", true: "lightblue" }}
                    thumbColor={this.props.currentBlueToothState ? this.props.primaryColor : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChaOnge={this.toggleSwitch.bind(this, 3)}
                    value={this.props.currentBlueToothState}
                  />
                </View>
              </Body>
            </CardItem>
            <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'lightgray' }}><Text style={{ fontSize: 22 }}>{this.props.selectedLanguageFile.more}</Text></View>
          </View>
          <CardItem bordered >
            <Body style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 20 }}>
              <View style={{ flex: 0.5, flexDirection: 'column', justifyContent: 'center', }}>
                <MaterialCommunityIcons name="heart-circle-outline"  style={{ fontSize: 25 }} />
              </View>
              <TouchableOpacity style={{ flex: 1.5, flexDirection: 'column' }}
              onPress={()=>{
                this.props.navigation.navigate('ResourcesPage')
              }}>
                <Text style={{ fontSize: 18 }}>{this.props.selectedLanguageFile.about}</Text>
              </TouchableOpacity>
            </Body>
          </CardItem>
          <CardItem bordered >
            <Body style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 20 }}>
              <View style={{ flex: 0.5, flexDirection: 'column', justifyContent: 'center', }}>
                <Icon name="user-circle" type="FontAwesome" style={{ fontSize: 25 }} />
              </View>
              <View style={{ flex: 1.5, flexDirection: 'column' }}>
                <Text style={{ fontSize: 18 }}>{this.props.selectedLanguageFile.username}</Text>
                <Text>{this.props.user.fName} {this.props.user.lName}</Text>
              </View>
            </Body>
          </CardItem>
          <CardItem bordered >
            <Body style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 20 }}>
              <View style={{ flex: 0.5, flexDirection: 'column', justifyContent: 'center', }}>
                <Icon name="earth" type="AntDesign" style={{ fontSize: 25 }} />
              </View>
              <View style={{ flex: 1.3, flexDirection: 'column' }}>
                <Text style={{ fontSize: 18 }}>{this.props.selectedLanguage !== undefined ? this.props.selectedLanguage.name : 'Language'}</Text>
                <Text>{this.props.selectedLanguageFile.changelan}</Text>
              </View>
              <View style={{flex:0.2}}>
              <TouchableOpacity onPress={()=>{
                this.setState({openModalToChangeAppLanguage:true})
              }}><MaterialCommunityIcons name="pencil" size={20}/></TouchableOpacity>
              </View>
            </Body>
          </CardItem>
          <CardItem bordered >
            <Body style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 20 }}>
              <View style={{ flex: 0.5, flexDirection: 'column', justifyContent: 'center', }}>
                <Icon name="lock" type="MaterialIcons" style={{ fontSize: 25 }} />
              </View>
              <TouchableOpacity style={{ flex: 1.3, flexDirection: 'column' }}
              onPress={()=>{
                this.setState({openModalToChangePassword:true})
              }}>
                <Text style={{ fontSize: 18 }}>{this.props.selectedLanguageFile.changePassword}</Text>
              </TouchableOpacity>
            </Body>
          </CardItem>
          <CardItem bordered >
          <Body style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 20 }}>
            <View style={{ flex: 0.5, flexDirection: 'column', justifyContent: 'center', }}>
            <MaterialCommunityIcons name="logout"  style={{ fontSize: 20, color: 'black' }} />
            </View>
            <TouchableOpacity style={{ flex: 1.5, flexDirection: 'column' }} onPress={()=>{
              // this.props.startVSafeSpinner()
              this.props.navigation.goBack()
              // this.props.stopVSafeSpinner()
              setTimeout(()=>{
                this.props.logoutUserRequested()
                const returnValue = NavigatorService.resetTabPages(this.props.loginPageKey)
                console.log("RETURNVALUE : ",returnValue)
                this.props.navigation.dispatch(returnValue)
                NavigatorService.navigate("LoginPage")
              },1000)
            }}>
              <Text style={{ fontSize: 18 }}>{this.props.selectedLanguageFile.logout}</Text>
            </TouchableOpacity>
          </Body>
        </CardItem>
        {this.renderLanguageChangeModal()}
        {this.renderChangePasswordModal()}
        <SpinnerOverlay visiblespinner={this.props.showVSafeSpinner}/>
        </Content>
        <SnackBar ref={(ref) => { this.ReactNativeSnackBar = ref; }} />
                    {this.DisplaySnackBar()}
      </Container>
      </SafeAreaView>
    );
  }
  //#endregion
}

//#region Map State and Dispatch region
function mapStateToProps(state) {
  const { user, isAuthenticated, error, loading, isLoggedIn,emailNotificationStatus,
    smsNotificationStatus,pushNotificationStatus,loginPageKey } = state.login;
  const { currentBlueToothState,primaryColor,currentAccessCoarseLocationStatus } = state.dashBoardPage;
  const { languages,selectedLanguage,selectedLanguageFile } = state.settingsPage;
  const { showVSafeSpinner } = state.healthReportPage;
  const { showSnackBar, snackBarMessage } = state.checkListsPage;

  return {
    currentBlueToothState,
    isAuthenticated,
    user,
    error,
    loading,
    isLoggedIn,
    languages,selectedLanguage,
    showVSafeSpinner,
    primaryColor,currentAccessCoarseLocationStatus,
    emailNotificationStatus,smsNotificationStatus,pushNotificationStatus,
    loginPageKey,selectedLanguageFile,showSnackBar, snackBarMessage
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    saveBlueToothStates: saveBlueToothStates,
    startBleAdvertising:startBleAdvertising,
    stopBleAdvertising:stopBleAdvertising,
    setSelectedLanguage:setSelectedLanguage,
    logoutUserRequested:logoutUserRequested,
    startVSafeSpinner:startVSafeSpinner,
    stopVSafeSpinner:stopVSafeSpinner,
    saveAccessCoarseLocationStatus:saveAccessCoarseLocationStatus,
    enableEmailNotificationSettings:enableEmailNotificationSettings,
    enablePushNotificationSettings:enablePushNotificationSettings,
    enableSMSNotificationSettings:enableSMSNotificationSettings,
    changeAppLanguage:changeAppLanguage,
    updateNewPassword:updateNewPassword,
    hideSnackBar: hideSnackBar,
  }, dispatch)
}
//#endregion
export default connect(mapStateToProps, matchDispatchToProps)(SettingsPage);
