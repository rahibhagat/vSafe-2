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
import moment from "moment";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import FastImage from 'react-native-fast-image';
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { setPath } from "../../actions/dashBoardPageActions";
import { hideSnackBar } from "../../actions/checkListsPageActions";
import {
  getHealthAssesmentsByDate, startVSafeSpinner, stopVSafeSpinner
  , getSelectedHealthAssesmentRecords ,getMessageLogsByDate,clearMessageLogs
} from "../../actions/healthReportPageActions";
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
//#endregion

//#region vSafe imports
import SnackBar from "../bodyAssessmentPage/snackBar";
import SpinnerOverlay from "../../components/spinnerOverlay";
import AssesmentsTab from "./assesmentsTab";
import AlertsTab from "./alertsTab";
import styles from "./styles";
import { getStartAndEndTimeDate } from "../../utility/index";
//#endregion

class HealthReportPage extends PureComponent {
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
      pageNumber:1
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
    this.props.getHealthAssesmentsByDate(dates.startdatetime, dates.enddatetime)
    this.props.getMessageLogsByDate(dates.startdatetime, dates.enddatetime,this.state.pageNumber,10,false,true)
  }
  componentDidUpdate() {
    // this.fillConversationList(false);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

  }
  // Exiting Application
  handleBackButtonClick() {
    BackHandler.exitApp();
  }

  getHealtAssesmentsListByDate = (datetime) => {
    var time = moment(datetime._d).toDate()
    var date = new Date()
    var time1 = time.setHours(date.getHours())
    var time2 = time.setMinutes(date.getMinutes())
    var time3 = time.setSeconds(date.getSeconds())
    var enddate = moment.tz(time,this.props.user.account.timeZoneIDStringJS).toDate();
    var startdate = moment.tz(time,this.props.user.account.timeZoneIDStringJS).toDate();
    var dates = getStartAndEndTimeDate(startdate, enddate, this.props.user.account.timeZoneIDStringJS, this.props.user.account.dateFormat, this.props.user.account.is12HRTimeFormat)
    this.props.getHealthAssesmentsByDate(dates.startdatetime, dates.enddatetime)
    this.props.startVSafeSpinner()
  }

  getMessageLogsListBySelectedDate = (datetime,onScroll,onDateChange) => {
    if(datetime == undefined) {
      var newDate = new Date();
      var time = moment(newDate).toDate()
    }
    else {
      var time = moment(datetime._d).toDate()
    }
    var date = new Date()
    var time1 = time.setHours(date.getHours())
    var time2 = time.setMinutes(date.getMinutes())
    var time3 = time.setSeconds(date.getSeconds())
    var enddate = moment.tz(time,this.props.user.account.timeZoneIDStringJS).toDate();
    var startdate = moment.tz(time,this.props.user.account.timeZoneIDStringJS).toDate();
    var dates = getStartAndEndTimeDate(startdate, enddate, this.props.user.account.timeZoneIDStringJS, this.props.user.account.dateFormat, this.props.user.account.is12HRTimeFormat)
    if(onScroll) {
     this.setState({pageNumber:this.state.pageNumber + 1})
     this.props.getMessageLogsByDate(dates.startdatetime, dates.enddatetime,this.state.pageNumber + 1,this.props.messageLogsList.length + 10,onScroll,onDateChange)
    }
    else if(onDateChange) {
      this.props.clearMessageLogs()
      this.setState({pageNumber:1})
      this.props.getMessageLogsByDate(dates.startdatetime, dates.enddatetime,1,this.props.messageLogsList.length + 10,onScroll,onDateChange)
    }
    // this.props.getMessageLogsByDate(dates.startdatetime, dates.enddatetime,this.props.messageLogsList.length + 10,onScroll,onDateChange)
    this.props.startVSafeSpinner()
  }

  _getSelectedHealthAssesmentRecords = (checkListId, id, checkListName, lastAssesmentDate, status) => {
    this.props.getSelectedHealthAssesmentRecords(checkListId, id);
    this.props.startVSafeSpinner();
    this.props.navigation.navigate('BodyAssessmentPage', { previousRoute: 'HealthReportPage', readOnlyCheckList: true, selectedCheckListName: checkListName, lastAssesmentDate: lastAssesmentDate, status: status });
  }
  _moveToCheckListPage = () => {
    this.props.navigation.navigate('CheckListsPage')
  }

  _setPath = (path) => {
    this.props.setPath(path)
  }

  DisplaySnackBar = () => {
    if (this.props.showSnackBar) {
      setTimeout(() => {
        var msg = 'submitted successfully'
        // this.props.hideSnackBar();
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
        <View transparent={true} style={{ flexDirection:'row',backgroundColor: 'white',padding:5 }}>
          <Body style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Icon name="heart" type="SimpleLineIcons" color={'black'} />
            <Title style={{ fontWeight: 'bold', fontSize: 22, color: 'black', paddingLeft: 15 }}>Health Assesments</Title></Body>
          <Right style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'space-evenly' }}>
          </Right>
        </View>
        {
          //   <View transparent={true} style={{ backgroundColor: 'white', height: 80, elevation: 5, flexDirection: 'row' }}>
          //   <Body style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 15 }}>
          //     <Title style={{ fontWeight: 'bold', fontSize: 22, color: 'black', paddingLeft: 15 }}>Health Assesments</Title></Body>
          //   <Right style={{ flex: 0.3, flexDirection: 'row', justifyContent: 'center', paddingTop: 20 }}>
          //     <Icon name="calendar" type="FontAwesome" color={'black'} />
          //   </Right>
          // </View>
        }
        <Tabs tabContainerStyle={{ backgroundColor: 'lightgray' }}>
          <Tab heading={this.props.selectedLanguageFile.assesments} tabStyle={{ backgroundColor: 'white' }} textStyle={{ color: this.props.primaryColor }} activeTabStyle={{ backgroundColor: 'white' }} activeTextStyle={{ color: this.props.primaryColor, fontWeight: 'normal' }}>
            <AssesmentsTab healthAssesmentList={this.props.healthAssesmentsList}
              getHealthAssesmentListBySelectedDate={this.getHealtAssesmentsListByDate}
              getSelectedHealAssesmentRecords={this._getSelectedHealthAssesmentRecords}
              navigateToCheckListsPage={this._moveToCheckListPage}
              setPath={this._setPath}
              primaryColor={this.props.primaryColor}
              user={this.props.user}
              selectedLanguage={this.props.selectedLanguageFile} />
          </Tab>
          <Tab heading={this.props.selectedLanguageFile.alerts} tabStyle={{ backgroundColor: 'white' }} textStyle={{ color: this.props.primaryColor }} activeTabStyle={{ backgroundColor: 'white' }} activeTextStyle={{ color: this.props.primaryColor, fontWeight: 'normal' }}>
            <AlertsTab 
            primaryColor={this.props.primaryColor}
            getMessageLogsListBySelectedDate={this.getMessageLogsListBySelectedDate}
            messagesLogsList={this.props.messageLogsList}
            user={this.props.user}
            selectedLanguage={this.props.selectedLanguageFile}
            alertsCardColor={this.props.alertsCardColor} />
          </Tab>
          {
            // <SpinnerOverlay visiblespinner={this.props.showVSafeSpinner}/>
          }
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
  const { user } = state.login;
  const { configuredCheckList, selectedCheckListId, showSnackBar, snackBarMessage } = state.checkListsPage;
  const { healthAssesmentsList, showVSafeSpinner,messageLogsList } = state.healthReportPage;
  const { primaryColor,alertsCardColor } = state.dashBoardPage;
  const { selectedLanguageFile } = state.settingsPage;
  return {
    user,
    healthAssesmentsList,
    showVSafeSpinner,
    primaryColor,alertsCardColor,
    configuredCheckList, selectedCheckListId, showSnackBar, snackBarMessage,
    selectedLanguageFile,messageLogsList
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    getHealthAssesmentsByDate: getHealthAssesmentsByDate,
    startVSafeSpinner: startVSafeSpinner,
    stopVSafeSpinner: stopVSafeSpinner,
    setPath: setPath,
    getSelectedHealthAssesmentRecords: getSelectedHealthAssesmentRecords,
    hideSnackBar: hideSnackBar,
    getMessageLogsByDate:getMessageLogsByDate,
    clearMessageLogs:clearMessageLogs
  }, dispatch)
}
//#endregion
export default connect(mapStateToProps, matchDispatchToProps)(HealthReportPage);
