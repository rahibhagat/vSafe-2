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
import { convertToCompanyTimeZone } from "../../utility/index";
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import CalendarStrip from 'react-native-calendar-strip';
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

//#endregion

class AlertsTab extends PureComponent {
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
      , active: false,currentSelectedDate:undefined,
      onEndReachedCalledDuringMomentum:false
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
  openDrawer = () => {
    this.props.navigation.openDrawer()
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
    // var date2 = date.toLocaleDateString("en-US", { month: 'word', day: 'numeric' })
    // var arraydate = date2.split(' ')
    // var odate = arraydate[1];
    // var omon = arraydate[0];
    var finaldate = day + ',' + " " + month + " " + date
    return finaldate
  }

  renderIconName(item) {
    var iconName = ""
    if(item.fromEmployeeId == item.toEmployeeId) {
      iconName = "chevron-right"
    }
    else if(item.fromEmployeeId == this.props.user.id) {
      iconName = "chevron-left"
    }
    else if (item.toEmployeeId == this.props.user.id) {
      iconName = "chevron-right"
    }
    return iconName;
  }

  renderMessageLogList(item,index) {
    var time = convertToCompanyTimeZone(item.updatedOn,this.props.user.account.timeZoneIDStringJS,this.props.user.account.dateFormat,this.props.user.account.is12HRTimeFormat)
    var string = time.split(" ");
    var hours = time.split(" ")[2].split(':')[0];
    var mins = time.split(" ")[2].split(':')[1];
    var ampm = time.split(" ")[3];
    // var finaltime = string[2] + " " + string[3];
    var finaltime = hours + ':' + mins + ' ' + ampm;
    return (
        <TouchableOpacity style={{ flex: 1, flexDirection: 'column', padding: 10 }} onPress={()=>{
            // this.props.getSelectedHealAssesmentRecords(item.checkListId,item.id,item.checklistName,item.lastAssesmentDate,item.status)
        }}>
                <Card style={{ flex: 1, flexDirection: 'column',backgroundColor:this.props.alertsCardColor }}>
                    <View style={{flex:1,flexDirection:'row'}}>
                    <View style={{ flex: 0.1, flexDirection: 'column', backgroundColor: this.props.alertsCardColor, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                    <View style={{flex:0.2}}></View>
                    <View style={{flex:0.8,flexDirection:'column',justifyContent:'flex-start'}}><MaterialIcons name={this.renderIconName(item)} size={25} color="gray"/></View>
                    </View>
                    <CardItem style={{ flex: 0.9, flexDirection: 'column', alignItems: 'flex-start',backgroundColor:this.props.alertsCardColor }}>
                        <View style={{flex:1,flexDirection:'row'}}>
                          <View style={{flex:0.8}}>
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

_onMomentumScrollBegin = () => {
  //  this.setState({ onEndReachedCalledDuringMomentum: true });
  this.props.getMessageLogsListBySelectedDate(this.state.currentSelectedDate,true,false)
}
_loadMoreData = () => {
  if (this.state.onEndReachedCalledDuringMomentum) {
      this.setState({ onEndReachedCalledDuringMomentum: false }, () => {

          setTimeout(() => {
            // this.props.getMessageLogsListBySelectedDate(this.state.currentSelectedDate,true,false)
          }, 1500);
      });
  };
};

 //Loads more message logs list as user scrolls down
 loadMoreMessageLogsList = (event) => {
  let scrollHeight = Math.floor(event.nativeEvent.contentOffset.y + event.nativeEvent.layoutMeasurement.height);
  if (scrollHeight == Math.floor(event.nativeEvent.contentSize.height)) {
    this.props.getMessageLogsListBySelectedDate(this.state.currentSelectedDate,true,false)
  }
}
  //Render the Component
  render() {
    // this.fillConversationList();   
    let datesWhitelist = [{
        start: moment().subtract(60, 'days'),
        end: moment()  // total 4 days enabled
    }];
    let datesBlacklist = [moment().add(365 - 14, 'days')]; // 1 day disabled
    const { getMessageLogsListBySelectedDate,messagesLogsList } = this.props;
    return (
        <Container style={styles.container}>
        <View style={{elevation: 1, borderBottomColor: 'black' }}>
                    <CalendarStrip
                        calendarAnimation={{ type: 'sequence', duration: 30 }}
                        daySelectionAnimation={{ type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: 'gray', backgroundColor: this.props.primaryColor }}
                        style={{ height: 130, paddingTop: 5, paddingBottom: 10 }}
                        calendarHeaderStyle={{ color: 'gray' }}
                        calendarColor={'white'}
                        dateNumberStyle={{ color: 'black' }}
                        dateNameStyle={{ color: 'black' }}
                        highlightDateNumberStyle={{ color: this.props.primaryColor, }}
                        highlightDateNameStyle={{ color: this.props.primaryColor }}
                        disabledDateNameStyle={{ color: 'grey' }}
                        disabledDateNumberStyle={{ color: 'grey' }}
                        datesWhitelist={datesWhitelist}
                        datesBlacklist={datesBlacklist}
                        // iconLeft={require('./img/left-arrow.png')}
                        // iconRight={require('./img/right-arrow.png')}
                        iconContainer={{ flex: 0.1 }}
                        onDateSelected={(date)=>{
                          getMessageLogsListBySelectedDate(date,false,true)
                            this.setState({currentSelectedDate:date})
                        }}
                        selectedDate={new Date()}
                    />

                </View>
            <Content contentContainerStyle={{flex:1}}>
                <View style={{ padding: 0 }}>
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                <View style={{ paddingLeft: 20, padding: 20 }}>
                  <Text style={{ fontWeight: '300', color: 'gray' }}>{this.changeDatesFormat()}</Text>
                </View>
              </View>
                    {
                         messagesLogsList.length > 0 ?
                        <FlatList
                    data={messagesLogsList}
                    onScroll={this.loadMoreMessageLogsList}
                    renderItem={({item,index})=>this.renderMessageLogList(item,index)} 
                    keyExtractor={(item)=>{
                        return item.id.toString();
                    }}/> :
                    <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center', paddingTop: 20}}><Text> There is no health alerts</Text></View>
                }
                </View>
                {
                //     <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', padding: 20, backgroundColor: '#f5f4f5' }}>
                //     <Text>RECENT LOGS</Text>
                // </View>
                // <View style={{ flex: 1, flexDirection: 'column', padding: 20, justifyContent: 'space-evenly', alignItems: 'flex-start', backgroundColor: 'lightgray' }}>
                //     <View style={{ padding: 0 }}><Text style={{ fontWeight: '700', color: 'gray' }}>DISCLAIMER</Text></View>
                //     <View style={{ paddingTop: 15 }}><Text style={{ fontSize: 15 }}>This information is stored securely and locally on your app, and remians private to you.</Text></View>
                // </View>
            }

            </Content>
            {/* <View style={{ flex: 0.1 }}>
            <Fab
              active={this.state.active}
              direction="up"
              containerStyle={{}}
              style={{ backgroundColor: this.props.primaryColor }}
              position="bottomRight"
              onPress={() => {
                this.props.navigateToCheckListsPage()
                this.props.setPath('HealthReportPage')
                this.setState({ active: !this.state.active})
              }}>
              <MaterialCommunityIcons name="plus" size={20} />
            </Fab>
          </View> */}
        </Container>
    );
}
  //#endregion
}

export default AlertsTab;