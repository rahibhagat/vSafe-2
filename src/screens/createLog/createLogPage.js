//#region Third party imports
/* eslint-disable */
import React, { PureComponent } from "react";
import { RefreshControl, Image, View, Animated, BackHandler, StatusBar, Dimensions, Alert, FlatList, TouchableOpacity, ImageBackground, TouchableHighlight, ActivityIndicator, ScrollView, Modal, Settings, Switch, TextInput } from 'react-native';
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
  Badge, Toast, Item, Input, Picker, CheckBox, CardItem, Card, Accordion
} from "native-base";
import moment from 'moment';
import Moment from 'react-moment';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import FastImage from 'react-native-fast-image';
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
//#endregion

//#region Abhisi imports
import styles from "./styles";
//#endregion

class CreateLogPage extends PureComponent {
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
      isEnabledBluetooth: false, isEnabledLocation: false, isEnabledNotification: false,
      setstartdate: false,
      setenddate: false,
      startdate: new Date(),
      enddate: new Date(),
      date: new Date(),
      show: false,
      mode: 'date',
      checked: [],
      openedAccordianId: '',
      savedLogModalVisible: false,
      checkedCertify: false,
      dataArray1: [
        { id: 1, title: "Fever", title1: "A high temperature of over 100F - you feel hot to touch on your chest or back.", checked: false, OnsetDate: '', temp: '', daysExperienced: '' },
        { id: 2, title: "Abdominal pain", title1: "A high temperature of over 100F - you feel hot to touch on your chest or back.", checked: false },
        { id: 3, title: "Chills", title1: "A high temperature of over 100F - you feel hot to touch on your chest or back.", checked: false },
        { id: 4, title: "Cough", title1: "A high temperature of over 100F - you feel hot to touch on your chest or back.", checked: false, OnsetDate: '', daysExperienced: '' },
        { id: 5, title: "Diarrhea", title1: "A high temperature of over 100F - you feel hot to touch on your chest or back.", checked: false },
        { id: 6, title: "Difficulty breathing", title1: "A high temperature of over 100F - you feel hot to touch on your chest or back.", checked: false },
        { id: 7, title: "Headache", title1: "A high temperature of over 100F - you feel hot to touch on your chest or back.", checked: false },
        { id: 8, title: "Sore throat", title1: "A high temperature of over 100F - you feel hot to touch on your chest or back.", checked: false },
        { id: 9, title: "Vomiting", title1: "A high temperature of over 100F - you feel hot to touch on your chest or back.", checked: false },
        { id: 10, title: "No symptons", title1: "A high temperature of over 100F - you feel hot to touch on your chest or back.", checked: false },
      ]
    }
    this.array = [];
    this.toggleSwitch = this.toggleSwitch.bind(this);
    this.showDatepicker = this.showDatepicker.bind(this);
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

  onChange = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.date;
    var currentime = currentDate.getHours()
    var time = {
      scheduleReminder: currentDate
    }
    if (this.state.setstartdate) {
      var newData = this.state.dataArray1.map((s, i) => {
        if (s.id == this.state.openedAccordianId) {
          s.OnsetDate = currentDate
        }
        return s;
      })
      this.setState({ date: currentDate, startdate: currentDate, setstartdate: false, show: false, dataArray1: newData, openedAccordianId: '' })
    }
    else {
      this.setState({ date: currentDate, enddate: currentDate, setenddate: false, show: false })
    }

  };

  showMode = currentMode => {
    this.setState({ show: true, mode: currentMode })
  };

  showDatepicker = (type, id) => {
    if (type == "startdate") {
      this.setState({ setstartdate: true, date: this.state.startdate, openedAccordianId: id })
    }
    else {
      this.setState({ setenddate: true, date: this.state.enddate })
    }
    this.showMode('date');
  };

  toggleSwitch = (value) => {
    if (value == 1) {
      this.setState({ isEnabledNotification: !this.state.isEnabledNotification })
    }
    else if (value == 2) {
      this.setState({ isEnabledLocation: !this.state.isEnabledLocation })
    }
    else {
      this.setState({ isEnabledBluetooth: !this.state.isEnabledBluetooth })
    }

  }

  changeDatesFormat() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const days = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
    ];
    var date = new Date()
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    var year = date.getFullYear();
    var hour = date.getHours();
    var min = date.getMinutes();
    var day = days[date.getDay()]
    var month = monthNames[date.getMonth()]
    var date = date.getDate()
    var finaldate = month + " " + date + ',' + year + " " + "|" + " " + strTime
    return finaldate
  }

  renderSavedLogModal() {
    if (this.state.savedLogModalVisible) {
      return (
        <Content>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Image source={require('../../../assets/symptom_confirm_header.png')} style={{
              width: deviceWidth,
              height: deviceHeight / 8,
              resizeMode: 'stretch'
            }} />
          </View>
          <View style={{ flex: 1, flexDirection: 'column', borderBottomWidth: 0.5, borderBottomColor: 'gray', padding: 15 }}>
            <View style={{ flexDirection: 'row', padding: 25 }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Your log has been saved</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'center' }}><Image source={require('../../../assets/symptom_confirm.png')} style={{ width: 50, height: 50, resizeMode: 'stretch' }} /></View>
              <View style={{ flex: 0.8, flexDirection: 'column' }}>
                <Text style={{ fontSize: 18 }}>A.M.</Text>
                <Text style={{ fontSize: 16 }}>{this.changeDatesFormat()}</Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'column', padding: 15 }}>
            <View style={{ flex: 1, flexDirection: 'row', padding: 15 }}>
              <Text style={{ fontSize: 20 }}>Symptoms</Text>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', padding: 25 }}>
            <View style={{ backgroundColor: '#f5f3f5', padding: 15 }}><Text>This information is stored securely and locally on your app, and remains private to you.</Text></View>
          </View>
        </Content>
      )
    }

  }
  //Render the Component
  render() {
    // this.fillConversationList();   
    return (
      <Container style={styles.container}>
        <View transparent={true} style={{ backgroundColor: 'white', height: 80, elevation: 5, flexDirection: 'row' }}>
          <Left style={{ flex: 0.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => {
              this.props.navigation.goBack()
            }}>
              <Icon name="close" type="Ionicons" style={{ color: 'black' }} />
            </TouchableOpacity>
          </Left>
          <Body style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            <Title style={{ fontWeight: 'bold', fontSize: 22, color: 'black', paddingLeft: 15 }}>Create New Log</Title>
          </Body>
        </View>
        {this.state.savedLogModalVisible ? this.renderSavedLogModal() :
          <Content>

            <View style={{ flex: 0.6, flexDirection: 'column', paddingleft: 20, padding: 10, borderBottomWidth: 1, borderBottomColor: 'lightgray' }}>
              <View style={{ flexDirection: 'column', padding: 5, paddingLeft: 20 }}>
                <Text numberOfLines={3} style={{ fontSize: 18 }}>Stop and call 911 if you are experiencing:</Text>
                <Text numberOfLines={3} style={{ fontSize: 15 }}>1. Severe,constant chest pain or pressure</Text>
                <Text numberOfLines={3} style={{ fontSize: 15 }}>2. Extreme difficulty breathing</Text>
                <Text numberOfLines={3} style={{ fontSize: 15 }}>3. Severe,constant lightheadedness</Text>
                <Text numberOfLines={3} style={{ fontSize: 15 }}>4. Serious disorientation or unresponsiveness</Text>
              </View>
            </View>
            <View style={{
              flex: 1, flexDirection: 'column', padding: 0
            }}>
              <View style={{ flex: 1 }}>
                <Accordion
                  dataArray={this.state.dataArray1}
                  contentStyle={{ borderBottomColor: 'gray', borderBottomWidth: 0.5, padding: 15 }}
                  renderHeader={(dataArray1, expanded) => {
                    return (
                      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'white', padding: 15, borderBottomColor: 'gray', borderBottomWidth: 0.5 }}>
                        <View style={{ flex: 0.1, flexDirection: 'column', justifyContent: "center" }}>
                          <CheckBox checked={dataArray1.checked} color={dataArray1.checked ? 'mediumpurple' : 'gray'} onPress={() => {
                            var newdata = this.state.dataArray1.map((s, i) => {
                              if (s.id == dataArray1.id) {
                                s.checked = !s.checked
                              }
                              return s
                            })
                            this.setState({ dataArray1: newdata })
                          }} />
                        </View>
                        <View style={{ flex: 0.8, flexDirection: 'column', paddingLeft: 10 }}>
                          <Text style={{ fontSize: 22 }}>{dataArray1.title}</Text>
                          <Text style={{ fontSize: 14 }}>{dataArray1.title1}</Text>
                        </View>
                        {dataArray1.id == 1 || dataArray1.id == 4 ?
                          <View style={{ flex: 0.1, flexDirection: 'column', justifyContent: "center" }}>
                            {expanded ? <Icon name="keyboard-arrow-up" type="MaterialIcons" /> : <Icon name="keyboard-arrow-down" type="MaterialIcons" />}
                          </View> : null}


                      </View>
                    )
                  }}
                  renderContent={(dataArray1, index, expanded) => {
                    if (dataArray1.id == 1 || dataArray1.id == 4) {
                      return (
                        <View style={{ flex: 1, padding: 20, flexDirection: 'column', justifyContent: 'space-between' }}>
                          <TouchableOpacity onPress={this.showDatepicker.bind(this, 'startdate', dataArray1.id)}>
                            <TextInput editable={false} value={moment(dataArray1.OnsetDate).format('ddd MMMM DD YYYY') != 'Invalid date' ? moment(dataArray1.OnsetDate).format('ddd MMMM DD YYYY') : 'Onset Date (MM/DD)'} placeholder="Onset Date (MM/DD)" style={{ borderWidth: 1, padding: 15, borderRadius: 5, color: 'black' }} />
                          </TouchableOpacity>
                          <View style={{ paddingTop: 10 }}><TextInput keyboardType="number-pad" onChangeText={(text) => {
                            var newData = this.state.dataArray1.map((s, i) => {
                              if (s.id == dataArray1.id) {
                                s.temp = text
                              }
                              return s;
                            })
                            this.setState({ dataArray1: newData })
                          }} value={dataArray1.temp} placeholder="Highest temperature" style={{ borderWidth: 1, padding: 15, borderRadius: 5 }} /></View>
                          <View style={{ paddingTop: 10 }}><TextInput
                            keyboardType="number-pad" onChangeText={(text) => {
                              var newData = this.state.dataArray1.map((s, i) => {
                                if (s.id == dataArray1.id) {
                                  s.daysExperienced = text
                                }
                                return s;
                              })
                              this.setState({ dataArray1: newData })
                            }}
                            value={dataArray1.daysExperienced} placeholder="Days experienced" style={{ borderWidth: 1, padding: 15, borderRadius: 5 }} /></View>
                        </View>
                      )
                    }
                    else {
                      return null;
                    }

                  }}
                />
              </View>

              <View style={{ flex: 1, flexDirection: 'row', padding: 25 }}>
                <View style={{ backgroundColor: 'lightgray', padding: 15 }}><Text>This information is stored securely and locally on your app, and remains private to you.</Text></View>
              </View>
              <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ flex: 0.1 }}><CheckBox checked={this.state.checkedCertify} color={this.state.checkedCertify ? 'mediumpurple' : 'gray'} onPress={() => {
                    this.setState({ checkedCertify: !this.state.checkedCertify })
                  }} /></View>
                  <View style={{ flex: 0.9, paddingLeft: 10 }}><Text>I certify that the information submitted in this report is true and correct to the best of my knowledge.</Text></View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ flex: 0.5, padding: 15 }}><Button block style={{ backgroundColor: 'white', elevation: 2 }}><Text style={{ color: 'gray' }}>CLEAR ALL</Text></Button></View>
                  <View style={{ flex: 0.5, padding: 15 }}><Button block style={{ backgroundColor: 'mediumpurple', elevation: 3 }} onPress={() => {
                    this.setState({ savedLogModalVisible: !this.state.savedLogModalVisible })
                  }}><Text style={{ color: 'white' }}>SAVE</Text></Button></View>
                </View>
              </View>

            </View>
            {this.state.show && (
              <DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={0}
                value={this.state.date}
                mode={this.state.mode}
                is24Hour={true}
                display="default"
                onChange={this.onChange}
                minimumDate={new Date()}
              />
            )}


          </Content>}
      </Container>
    );
  }
  //#endregion
}

//#region Map State and Dispatch region
function mapStateToProps(state) {
  return {
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch)
}
//#endregion
export default connect(mapStateToProps, matchDispatchToProps)(CreateLogPage);
