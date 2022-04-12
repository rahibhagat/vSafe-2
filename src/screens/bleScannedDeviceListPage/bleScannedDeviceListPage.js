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
//#endregion

//#region vSafe imports
import styles from "./styles";
import ManualTab from '../exposurePage/manualTab';
import DeviceList from './deviceList';

//#endregion

class BleScannedDeviceListPage extends PureComponent {
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
      , active: false
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
  //Render the Component
  render() {
    let datesWhitelist = [{
      start: moment().subtract(14, 'days'),
      end: moment()  // total 4 days enabled
    }];
    let datesBlacklist = [moment().add(365 - 14, 'days')]; // 1 day disabled
    return (
      <Container style={styles.container}>
        <View transparent={true} style={{ backgroundColor: 'white', height: 80, elevation: 5, flexDirection: 'row' }}>
          <Body style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 15 }}>
          <View style={{flexDirection:'column'}}>
          <Title style={{ fontWeight: 'bold', fontSize: 22, color: 'black', paddingLeft: 15 }}>Scanned Device List [Demo]   </Title>
          <Title style={{ fontWeight: 'bold', fontSize: 12, color: 'gray', paddingLeft: 15 }}>{this.props.currentBlueToothState ? '' : 'your bluetooth is off please turn on to get devices' }   </Title>
          </View>
          </Body>
          <Right style={{ flex: 0.3, flexDirection: 'row', justifyContent: 'center', paddingTop: 20 }}>
            <Icon name="calendar" type="FontAwesome" color={'black'} />
          </Right>
        </View>
        <Tabs tabContainerStyle={{ backgroundColor: 'lightgray' }}>
          <Tab heading="DEVICES" tabStyle={{ backgroundColor: 'white' }} textStyle={{ color: 'mediumpurple' }} activeTabStyle={{ backgroundColor: 'white' }} activeTextStyle={{ color: 'mediumpurple', fontWeight: 'normal' }}>
            <DeviceList scannedDeviceList={this.props.scannedDeviceList} currentBlueToothState={this.props.currentBlueToothState}/>
          </Tab>
          <Tab heading="PEOPLE" tabStyle={{ backgroundColor: 'white' }} textStyle={{ color: 'mediumpurple' }} activeTabStyle={{ backgroundColor: 'white' }} activeTextStyle={{ color: 'mediumpurple', fontWeight: 'normal' }}>
            <ManualTab />
          </Tab>
        </Tabs>
      </Container>
    );
  }
  //#endregion
}

//#region Map State and Dispatch region
function mapStateToProps(state) {
    const { scannedDeviceList,currentBlueToothState } = state.dashBoardPage;
    return {
        scannedDeviceList,currentBlueToothState
    };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators({

  }, dispatch)
}
//#endregion
export default connect(mapStateToProps, matchDispatchToProps)(BleScannedDeviceListPage);
