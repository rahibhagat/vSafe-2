//#region Third party imports
/* eslint-disable */
import React, { PureComponent } from "react";
import { RefreshControl, Image, View, Animated, BackHandler, StatusBar, Dimensions, Alert, FlatList, TouchableOpacity, ImageBackground, TouchableHighlight, ActivityIndicator, ScrollView, Modal } from 'react-native';
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
  Badge, Toast, Item, Input, Picker, CheckBox, CardItem, Card, Tab, Tabs
} from "native-base";
import Moment from 'react-moment';
import moment from 'moment';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import FastImage from 'react-native-fast-image';
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import CalendarStrip from 'react-native-calendar-strip';
import SpinnerOverlay from "../../components/spinnerOverlay";
import { SafeAreaProvider,SafeAreaView,useSafeAreaFrame} from "react-native-safe-area-context";
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
//#endregion

//#region vSafe imports
import styles from "./styles";
import ManualTab from './manualTab';
import AutomaticTab from './autoMaticTab';
import SnackBar from "../bodyAssessmentPage/snackBar";
import { hideSnackBar } from '../../actions/checkListsPageActions';
import { getStartAndEndTimeDate } from "../../utility/index";
import {
  getAllContacts, getContactListFromSearchedText,
  createNewExternalContact, createNewExternalExposureContact,
  getAllEmployeeExposures,clearExternalContactList,getAllExteranlExposure,
  getExteranlExposureById,clearSelectedExternalExposureDetail,getEmployeeExposuresReport,
  _showFormToAddNewContacts
} from "../../actions/exposurePageActions";
import { validate } from "email-validator";


//#endregion

class ExposurePage extends PureComponent {
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
      initialscrollindex: 10, scrollheight: 0, showUserReport: false, userreport: undefined
      , active: false,
      activeTab: 0, initialTab: 0,showFormToAddNewContact:false
    }
    this.array = [];
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
    var enddate = moment.tz(this.props.user.account.timeZoneIDStringJS).toDate();
    var startdate = moment.tz(this.props.user.account.timeZoneIDStringJS).toDate();
    var dates = getStartAndEndTimeDate(startdate, enddate, this.props.user.account.timeZoneIDStringJS, this.props.user.account.dateFormat, this.props.user.account.is12HRTimeFormat)
    this.props.getAllExteranlExposure(dates.startdatetime,dates.enddatetime);
    // this.props.getAllEmployeeExposures(dates.startdatetime,dates.enddatetime)
    this.props.getEmployeeExposuresReport(dates.startdatetime,dates.enddatetime,this.props.navigation.state.params)
    setTimeout(() => {
      if (this.props.navigation.state.params != undefined) {
        if (this.props.navigation.state.params.goToManualTab == true) {
          // this._tabs.goToPage(1)
          this.props.navigation.state.params = undefined
        }
      }
    }, 1000)
  }
  componentDidUpdate() {
    // this.fillConversationList(false);
    setTimeout(() => {
      if (this.props.navigation.state.params != undefined) {
        if (this.props.navigation.state.params.goToManualTab == true) {
          if(this.props.showVSafeSpinner == false) {
            if(this.props.showFormForNewContacts == false) {
              // this._tabs.goToPage(1)
              this.props._showFormToAddNewContacts(true)
              this.props.navigation.state.params = undefined
            }
          }
        }
      }
    }, 1000)
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

  }
  // Exiting Application
  handleBackButtonClick() {
    BackHandler.exitApp();
  }

  changeDatesFormat() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const days = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
    ];
    var date = new Date()
    var day = days[date.getDay()]
    var month = monthNames[date.getMonth()]
    var date = date.getDate()
    var finaldate = day + ',' + " " + month + " " + date
    return finaldate
  }

  _searchContactList = (text) => {
    this.props.getContactListFromSearchedText(text)
  }

  _createNewExternalContact = (dto) => {
    this.props.createNewExternalContact(dto)
  }

  _createExternalExposureContact = (dto) => {
    this.props.createNewExternalExposureContact(dto)
  }

  _getEmployeeExposureListByDate = (datetime) => {
    var time = moment(datetime._d).toDate()
    var date = new Date()
    var time1 = time.setHours(date.getHours())
    var time2 = time.setMinutes(date.getMinutes())
    var time3 = time.setSeconds(date.getSeconds())
    var enddate = moment.tz(time,this.props.user.account.timeZoneIDStringJS).toDate();
    var startdate = moment.tz(time,this.props.user.account.timeZoneIDStringJS).toDate();
    var dates = getStartAndEndTimeDate(startdate, enddate, this.props.user.account.timeZoneIDStringJS, this.props.user.account.dateFormat, this.props.user.account.is12HRTimeFormat)
    // this.props.getAllEmployeeExposures(dates.startdatetime,dates.enddatetime)
    this.props.getEmployeeExposuresReport(dates.startdatetime,dates.enddatetime,undefined)
  }

  _getExternalExposureByDate = (datetime) => {
    var time = moment(datetime._d).toDate()
    var date = new Date()
    var time1 = time.setHours(date.getHours())
    var time2 = time.setMinutes(date.getMinutes())
    var time3 = time.setSeconds(date.getSeconds())
    var enddate = moment.tz(time,this.props.user.account.timeZoneIDStringJS).toDate();
    var startdate = moment.tz(time,this.props.user.account.timeZoneIDStringJS).toDate();
    var dates = getStartAndEndTimeDate(startdate, enddate, this.props.user.account.timeZoneIDStringJS, this.props.user.account.dateFormat, this.props.user.account.is12HRTimeFormat)
    this.props.getAllExteranlExposure(dates.startdatetime,dates.enddatetime)
  }

  _clearExternalContactList = () => {
    this.props.clearExternalContactList()
  }

  _closeForm = () => {
    this.props._showFormToAddNewContacts(false)
  }
  
  _openForm = () => {
    this.props._showFormToAddNewContacts(true)
  }
  _getSelectedExternalExposure = (id) => {
    this.props.getExteranlExposureById(id)
  }

  _clearSelectedExternalExposureDetail = () =>{
    this.props.clearSelectedExternalExposureDetail()
  }

  _showformToAddNewContacts = (value) => {
    this.props._showFormToAddNewContacts(value)
  }



  DisplaySnackBar = () => {
    if (this.props.showSnackBar) {
      setTimeout(() => {
        this.ReactNativeSnackBar.ShowSnackBarFunction(this.props.snackBarMessage);
        // this.props.hideSnackBar();
      }, 500)
    }
    else {

    }
  };
  //Render the Component
  render() {
    let datesWhitelist = [{
      start: moment().subtract(14, 'days'),
      end: moment()  // total 4 days enabled
    }];
    let datesBlacklist = [moment().add(365 - 14, 'days')]; // 1 day disabled
    return (
      <SafeAreaView style={{flex:1,backgroundColor:this.props.primaryColor}} edges={['top']}>
      <Container style={{backgroundColor: "#FFF"}}>
      <View transparent={true} style={{flexDirection:'row',backgroundColor: 'white',padding:5}}>
                    <Body style={{ flex:0.8,flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Icon name="graph-horizontal" type='Foundation'  style={{color:'black'}} />
                        <Title style={{ fontWeight: 'bold', fontSize: 22, color: 'black', paddingLeft: 15 }}>Exposures</Title></Body>
                        <Right style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    </Right>
                </View>
        {
        //   <View transparent={true} style={{ backgroundColor: 'white', height: 80, elevation: 5, flexDirection: 'row' }}>
        //   <Body style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 15 }}>
        //     <Title style={{ fontWeight: 'bold', fontSize: 22, color: 'black', paddingLeft: 15 }}>Exposure</Title></Body>
        //   <Right style={{ flex: 0.3, flexDirection: 'row', justifyContent: 'center', paddingTop: 20 }}>
        //   </Right>
        // </View>
                      }
        <Tabs ref={component => this._tabs = component} tabContainerStyle={{ backgroundColor: 'lightgray' }}>
          <Tab heading={this.props.selectedLanguageFile.manual} tabStyle={{ backgroundColor: 'white' }} textStyle={{ color: this.props.primaryColor }} activeTabStyle={{ backgroundColor: 'white' }} activeTextStyle={{ color: this.props.primaryColor, fontWeight: 'normal' }}>
            <ManualTab
              externalExposureList={this.props.externalExposureList}
              contactList={this.props.contactsList}
              searchContactList={this._searchContactList}
              searchedContactList={this.props.searchedContactList}
              createExternalContact={this._createNewExternalContact}
              createExternalExposureContact={this._createExternalExposureContact}
              getExternalExposureByDate={this._getExternalExposureByDate}
              user={this.props.user} 
              clearExternalContactList={this._clearExternalContactList}
              showFormToAddNewContact={this.state.showFormToAddNewContact}
              _showFormToAddNewContact={this._showformToAddNewContacts}
              closeForm={this._closeForm}
              openForm={this._openForm}
              primaryColor={this.props.primaryColor}
              selectedExternalExposureDetail={this.props.selectedExternalExposureDetail}
              getExteranlExposureById={this._getSelectedExternalExposure}
              clearSelectedExternalExposureDetail={this._clearSelectedExternalExposureDetail}
              selectedLanguage={this.props.selectedLanguageFile}
              showNewFormForNewContact={this.props.showFormForNewContacts}/>
          </Tab>
          <Tab heading={this.props.selectedLanguageFile.automatic} tabStyle={{ backgroundColor: 'white' }} textStyle={{ color: this.props.primaryColor }} activeTabStyle={{ backgroundColor: 'white' }} activeTextStyle={{ color: this.props.primaryColor, fontWeight: 'normal' }}>
            <AutomaticTab
              employeeExposureList={this.props.employeeExposuresList}
              employeeExposersReport={this.props.employeeExposersReport}
              getEmployessExposureByDate={this._getEmployeeExposureListByDate}
              primaryColor={this.props.primaryColor}
              user={this.props.user}
              selectedLanguage={this.props.selectedLanguageFile}  />
          </Tab>
        </Tabs>
        <SpinnerOverlay visiblespinner={this.props.showVSafeSpinner} />
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
  const { contactsList, searchedContactList, employeeExposuresList,
    externalExposureList,selectedExternalExposureDetail,employeeExposersReport,showFormForNewContacts } = state.exposurePage;
  const { showVSafeSpinner } = state.healthReportPage;
  const { showSnackBar, snackBarMessage } = state.checkListsPage;
  const { user } = state.login;
  const { primaryColor } = state.dashBoardPage;
  const { selectedLanguageFile } = state.settingsPage;
  return {
    contactsList,
    showVSafeSpinner,
    searchedContactList,
    showSnackBar,
    snackBarMessage,
    user,
    employeeExposuresList,
    externalExposureList,
    primaryColor,
    selectedExternalExposureDetail,
    employeeExposersReport,
    selectedLanguageFile,
    showFormForNewContacts
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    getAllContacts: getAllContacts,
    getContactListFromSearchedText: getContactListFromSearchedText,
    createNewExternalContact: createNewExternalContact,
    createNewExternalExposureContact: createNewExternalExposureContact,
    hideSnackBar: hideSnackBar,
    getAllEmployeeExposures: getAllEmployeeExposures,
    clearExternalContactList:clearExternalContactList,
    getAllExteranlExposure:getAllExteranlExposure,
    getExteranlExposureById:getExteranlExposureById,
    clearSelectedExternalExposureDetail:clearSelectedExternalExposureDetail,
    getEmployeeExposuresReport:getEmployeeExposuresReport,
    _showFormToAddNewContacts:_showFormToAddNewContacts
  }, dispatch)
}
//#endregion
export default connect(mapStateToProps, matchDispatchToProps)(ExposurePage);
