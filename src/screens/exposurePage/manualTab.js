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
  Badge, Toast, Item, Input, Label, Picker, CheckBox, CardItem, Card, Tab, Tabs
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { DatePicker } from 'react-native-woodpicker'
import LinearGradient from 'react-native-linear-gradient';
import CalendarStrip from 'react-native-calendar-strip';
// import Autocomplete from 'react-native-autocomplete-input';
import { convertToCompanyTimeZone } from "../../utility/index";
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
import Popover from 'react-native-popover-view';
import ActionButton from 'react-native-action-button';
//#endregion

//#region vSafe imports
import styles from "./styles";
import { TextInput } from "react-native";

//#endregion

class ManualTab extends PureComponent {
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
      showFormToAddNewContact: false, searchContactText: '',
      textName: '', textEmail: '', textPhone: '', textCompany: '',
      showFormToAddExposureContact: false,
      setstartdate: false,
      setenddate: false,
      startdate: new Date(),
      enddate: new Date(),
      date: new Date(),
      show: false,
      mode: 'date',
      selectedContact: {},
      errorDate: false,
      errorName: false,
      errorEmail: false,
      errorPhone: false,
      errorCompany: false,
      tapped: false, opendatetimepicker: false,
      textPurpose: '',showSelectedExternalExposureDetail:false,
      showPopover:false
    }
    this.array = [];
    this.showDatepicker = this.showDatepicker.bind(this);
    this.externalExposureActionButton = React.createRef()
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

  onChange = (event,selectedDate) => {
    if (this.state.mode == "time") {
      // var date = this.state.startdate.getDay() + this.state.startdate.getMonth() + this.state.startdate.getDate() + this.state.startdate.getFullYear()
      const currentDate = this.state.setstartdate ? this.state.startdate : this.state.enddate;
      var currentime = currentDate.getHours()
      var time = {
        scheduleReminder: currentDate
      }
      var hour = selectedDate.getHours()
      var min = selectedDate.getMinutes()
      var sec = selectedDate.getSeconds()
      // var finalDate = new Date(final)
      currentDate.setHours(hour)
      currentDate.setMinutes(min)
      currentDate.setSeconds(sec)
      console.log(currentDate)
      if (this.state.setstartdate) {

        this.setState({ date: currentDate, startdate: currentDate, setstartdate: false, show: false, })
      }
      else {
        this.setState({ date: currentDate, enddate: currentDate, setenddate: false, show: false, errorDate: false })
      }
    }
    else {
      const currentDate = selectedDate;
      var currentime = currentDate.getHours()
      var time = {
        scheduleReminder: currentDate
      }
      if (this.state.setstartdate) {

        this.setState({ date: currentDate, startdate: currentDate, setstartdate: false, show: false, })
      }
      else {
        this.setState({ date: currentDate, enddate: currentDate, setenddate: false, show: false, errorDate: false })
      }
    }
  };

  showMode = currentMode => {
    this.setState({ show: true, mode: currentMode })
  };

  showDatepicker = (type, id) => {
    if (type == "startdate") {
      this.setState({ setstartdate: true, date: this.state.startdate })
    }
    else {
      var date = new Date()
      this.setState({ setenddate: true, date: date })
    }
    this.showMode('date');
  };
  showTimepicker = (type, id) => {
    if (type == "startdate") {
      this.setState({ setstartdate: true, date: this.state.startdate })
    }
    else {
      var date = new Date()
      this.setState({ setenddate: true, date: date })
    }
    this.showMode('time');
  };

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

  validateemail(x) {
    var atposition = x.indexOf("@");
    var dotposition = x.lastIndexOf(".");
    if (atposition < 1 || dotposition < atposition + 2 || dotposition + 2 >= x.length) {
      alert("Please enter a valid e-mail address");
      return false;
    }
    else {
      return true;
    }
  }

  renderContactList(item, index) {
    return (
      <TouchableOpacity style={{ flex: 1, flexDirection: 'column', padding: 10 }} 
      onPress={()=>{
        this.props.getExteranlExposureById(item.id)
        setTimeout(()=>{
          this.setState({showSelectedExternalExposureDetail:true})
        },1000)
      }}>
        <Card style={{ flex: 1, flexDirection: 'row' }}>
          <CardItem style={{ flex: 0.1, flexDirection: 'column', backgroundColor: this.props.primaryColor, alignItems: 'center', justifyContent: 'center' }}>
            <View><Text style={{ color: 'white' }}>{index + 1}.</Text></View>
          </CardItem>
          <CardItem style={{ flex: 0.8, flexDirection: 'column', alignItems: 'flex-start' }}>
            <Text style={{fontSize:17}}>{item.externalContact.name}</Text>
            <Text style={{fontSize:13}}>{item.externalContact.email}</Text>
            <Text style={{fontSize:13}}>From : {convertToCompanyTimeZone(item.startContactDate,this.props.user.account.timeZoneIDStringJS,this.props.user.account.dateFormat,this.props.user.account.is12HRTimeFormat)}</Text>
            <Text style={{fontSize:13}}>To : {convertToCompanyTimeZone(item.endContactDate,this.props.user.account.timeZoneIDStringJS,this.props.user.account.dateFormat,this.props.user.account.is12HRTimeFormat)}</Text>
          </CardItem>
          <CardItem style={{flex:0.1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
          <View>
          <Icon name="chevron-right" type="MaterialIcons"/>
          </View>
          </CardItem>
        </Card>
      </TouchableOpacity>
    )
  }

  info(text) {
    const regex = new RegExp(`${text.trim()}`, `i`)
    if (this.props.searchedContactList == undefined) {
      //do nothing
    } else {
      return this.props.searchedContactList.filter(info => info.name.search(regex) >= 0)
    }
  }

  validateForm() {
    var errors = false;
    if (this.state.textName.length == 0) {
      if (this.props.contactList == undefined) {

      }
      else if (this.props.contactList.length == 0) {

      }
      else {
        errors = true;
        this.setState({ errorName: true })
      }
    }
    if (this.state.textEmail.length == 0) {
      errors = true;
      this.setState({ errorEmail: true })
    }
    if (this.state.textPhone.length == 0) {
      errors = true;
      this.setState({ errorPhone: true })
    }
    if (this.state.textCompany.length == 0) {
      errors = true;
      this.setState({ errorCompany: true })
    }
    if (this.state.textEmail.length > 0) {

      var validateemailreturnvalue = this.validateemail(this.state.textEmail)
      if (validateemailreturnvalue) {
        if (this.state.tapped) {
          var ExposureContactDto = {
            externalContactId: this.state.selectedContact.id,
            rssi: -40,
            startContactDate: this.state.startdate.toUTCString(),
            endContactDate: this.state.enddate.toUTCString(),
            purpose:this.state.textPurpose,
            employeeId: this.props.user.id,
            departmentId: this.props.user.departmentId,
            locationId: this.props.user.locationId
          }
          this.props.closeForm()
          this.props.clearExternalContactList()
          this.props.createExternalExposureContact(ExposureContactDto)
        }
        else {
          var newExternalContactDto = {
            name: this.state.textName.length == 0 ? this.state.searchContactText : this.state.textName,
            email: this.state.textEmail,
            phone: this.state.textPhone,
            purpose: this.state.textPurpose,
            company: this.state.textCompany,
            startContactDate: this.state.startdate.toUTCString(),
            endContactDate: this.state.enddate.toUTCString(),
          }
          this.props.closeForm()
          this.props.clearExternalContactList()
          this.props.createExternalContact(newExternalContactDto)
          this.setState({ currentSelectedDate: new Date() })
          this.calenderStrif.setSelectedDate(new Date())
        }
        this.setState({
          searchContactText: '',
          textName: '', textEmail: '', textPhone: '', textCompany: '',textPurpose: '',
          errorName: false,
          errorEmail: false,
          errorPhone: false,
          errorCompany: false,
          tapped: false,
          setstartdate: false,
          setenddate: false,
          startdate: new Date(),
          enddate: new Date(),
          date: new Date(),
          show: false,
          mode: 'date',
          selectedContact: {},
          errorDate: false
        })
      }
      else {
        errors = true
      }
    }
    else if (errors == false) {
    }

  }

  renderSearchContactList(item, index) {
    return (
      <TouchableOpacity style={{ flex: 1, flexDirection: 'column' }} onPress={() => {
        this.setState({
          tapped: true, textName: item.name, textEmail: item.email,
          textPhone: item.phone, textCompany: item.company, selectedContact: item,
          errorName: false,
          errorEmail: false,
          errorPhone: false,
          errorCompany: false,
        })
        this.props.clearExternalContactList()
      }}>
        <Card style={{ flex: 1, flexDirection: 'row' }}>
          <CardItem style={{ flex: 0.1, flexDirection: 'column', backgroundColor: this.props.primaryColor, alignItems: 'center', justifyContent: 'center' }}>
            <View><Text style={{ color: 'white' }}>{index + 1}.</Text></View>
          </CardItem>
          <CardItem style={{ flex: 0.8, flexDirection: 'column', alignItems: 'flex-start' }}>
            <Text>{item.name}</Text>
            <Text>{item.email}</Text>
          </CardItem>
        </Card>
      </TouchableOpacity>
    )
  }

  renderDateandTimePickerModal() {
    return (
      <Modal animationType='slide'
        transparent={true}
        visible={this.state.opendatetimepicker}
        onRequestClose={() => {
          this.setState({ opendatetimepicker: false })
        }}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper1}>
            <View style={{ flex: 2, flexDirection: 'column', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text>Select date and time</Text>
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
                  maximumDate={new Date()}
                />
              )}

              <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 5, height: 60 }} onPress={this.showDatepicker}>
                <View >
                  <TextInput
                    style={{ height: 55, width: 250, color: 'black', fontSize: 15 }}
                    editable={false}
                    value={moment(this.state.date).format('ddd MMMM DD YYYY')}
                  />
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingRight: 25 }}>
                  <Ionicons style={{ fontSize: 20 }}  name="md-arrow-dropdown" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 5, height: 60 }} onPress={this.showTimepicker}>
                <View >
                  <TextInput
                    style={{ height: 55, width: 250, color: 'black', fontSize: 18 }}
                    editable={false}
                    value={moment(this.state.date).format('hh:mm A')}
                  />
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingRight: 25 }}>
                  <Ionicons style={{ fontSize: 20 }}  name="md-arrow-dropdown" />
                </View>
              </TouchableOpacity>
              <View style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10
              }}>
                <TouchableOpacity onPress={() => this.setState({ opendatetimepicker: false })}><Text>Close</Text></TouchableOpacity>
              </View>
            </View>

          </View>

        </View>
      </Modal>
    )
  }

  handlePlaceholder = () =>{
    if(this.state.date) {
      return this.state.date.toDateString()
    }
    else {
      return (
        <View></View>
        );
    }

  }


  openFormToAddNewContact() {
    if (this.props.showNewFormForNewContact) {
      const info = this.info(this.state.searchContactText)
      return (
        <Modal
          visible={this.props.showNewFormForNewContact}
          onRequestClose={() => {
            this.props.clearExternalContactList();
            this.props.closeForm();
            this.setState({
              searchContactText: '',
              textName: '', textEmail: '', textPhone: '', textCompany: '',textPurpose: '',
              errorName: false,
              errorEmail: false,
              errorPhone: false,
              errorCompany: false,
              tapped: false,
              setstartdate: false,
              setenddate: false,
              startdate: new Date(),
              enddate: new Date(),
              date: new Date(),
              show: false,
              mode: 'date',
              selectedContact: {},
              errorDate: false
            })
          }}
        >
      <SafeAreaView style={{flex:1,backgroundColor:this.props.primaryColor}} edges={['top']}>
      <Container style={{backgroundColor: "#FFF"}}>
        <Content>
      <View style={{flex:1,flexDirection:'row',backgroundColor:this.props.primaryColor,padding:15}}>
                <Left style={{flex:0.1,flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}><TouchableOpacity onPress={() => {
                  this.props.clearExternalContactList();
                  this.props.closeForm();
                  this.setState({
                    searchContactText: '',
                    textName: '', textEmail: '', textPhone: '', textCompany: '',textPurpose: '',
                    errorName: false,
                    errorEmail: false,
                    errorPhone: false,
                    errorCompany: false,
                    tapped: false,
                    setstartdate: false,
                    setenddate: false,
                    startdate: new Date(),
                    enddate: new Date(),
                    date: new Date(),
                    show: false,
                    mode: 'date',
                    selectedContact: {},
                    errorDate: false
                  })
                }}><Icon name="close" type='MaterialIcons' style={{ color: 'white' }} /></TouchableOpacity>
                </Left>
                <Body style={{flex:0.8,flexDirection:'row',justifyContent:'center'}}>
                  <Title>{this.props.selectedLanguage.addextexpo}</Title>
                </Body>
              </View>
              <View style={{ flex: 1, flexDirection: 'column', padding: 15 }}>
                <Card style={{ flex: 1, flexDirection: 'column' }}>
                  <CardItem style={{ flex: 1, alignSelf: 'stretch' }}>
                    <View style={{ flex: 1 }}>
                      <Item floatingLabel >
                        <Label>{this.props.selectedLanguage.name}</Label>

                        {
                          // <Input value={this.state.textName} onChangeText={(text) => {
                          //   this.setState({ textName: text,errorName:false })
                          // }}/>
                        }
                        <Input style={{paddingTop:20}} value={this.state.tapped ? this.state.textName : this.state.searchContactText}
                          onChangeText={text => {
                            this.setState({ searchContactText: text })
                            this.props.searchContactList(text)
                          }} />
                        {this.state.tapped ?
                          <Icon name="close" type='MaterialIcons' onPress={() => {
                            this.setState({ tapped: false, textName: "", textEmail: "", textPhone: "", textCompany: "", searchContactText: '' })
                          }} /> : null}

                      </Item>
                      {
                        <FlatList
                          data={this.props.searchedContactList}
                          contentContainerStyle={{ position: 'relative' }}
                          renderItem={({ item, index }) => this.renderSearchContactList(item, index)} />
                        // <TextInput placeholder="Enter Name" value={this.state.textName} onChangeText={(text) => {
                        //   this.setState({ textName: text,errorName:false })
                        // }} style={{ borderWidth: 0, borderBottomWidth: 1 }} />
                      }
                      <Text style={{ color: 'red', fontSize: 12 }}>{this.state.errorName ? 'Please Enter Name' : ''}</Text>
                    </View>
                  </CardItem>
                  <CardItem style={{ flex: 1, alignSelf: 'stretch' }}>
                    <View style={{ flex: 1 }}>
                      <Item stackedLabel>
                        <Label>{this.props.selectedLanguage.email}</Label>
                        <Input  keyboardType='email-address' value={this.state.textEmail}
                          onChangeText={(text) => {
                            this.setState({ textEmail: text, errorEmail: false })
                          }} />
                      </Item>
                      {
                        // <TextInput keyboardType='email-address' placeholder="Enter Email" value={this.state.textEmail}
                        //   onChangeText={(text) => {
                        //     this.setState({ textEmail: text,errorEmail:false })
                        //   }} style={{ borderWidth: 0, borderBottomWidth: 1 }} />
                      }
                      <Text style={{ color: 'red', fontSize: 12 }}>{this.state.errorEmail ? 'Please Enter Email' : ''}</Text>
                    </View>
                  </CardItem>
                  <CardItem style={{ flex: 1, alignSelf: 'stretch' }}>
                    <View style={{ flex: 1 }}>
                      <Item stackedLabel>
                        <Label>{this.props.selectedLanguage.phone}</Label>
                        <Input keyboardType='number-pad' value={this.state.textPhone}
                          onChangeText={(text) => {
                            this.setState({ textPhone: text, errorPhone: false })
                          }} />
                      </Item>
                      {
                        // <TextInput keyboardType='number-pad' placeholder="Enter Phone" value={this.state.textPhone}
                        // onChangeText={(text) => {
                        //   this.setState({ textPhone: text,errorPhone:false })
                        // }} style={{ borderWidth: 0, borderBottomWidth: 1 }} />
                      }
                      <Text style={{ color: 'red', fontSize: 12 }}>{this.state.errorPhone ? 'Please Enter Phone' : ''}</Text>
                    </View>
                  </CardItem>
                  <CardItem style={{ flex: 1, alignSelf: 'stretch' }}>
                    <View style={{ flex: 1 }}>
                      <Item stackedLabel>
                        <Label>{this.props.selectedLanguage.company}</Label>
                        <Input value={this.state.textCompany}
                          onChangeText={(text) => {
                            this.setState({ textCompany: text, errorCompany: false })
                          }} />
                      </Item>
                      {
                        // <TextInput placeholder="Enter Company" value={this.state.textCompany}
                        // onChangeText={(text) => {
                        //   this.setState({ textCompany: text,errorCompany:false })
                        // }} style={{ borderWidth: 0, borderBottomWidth: 1 }} />
                      }
                      <Text style={{ color: 'red', fontSize: 12 }}>{this.state.errorCompany ? 'Please Enter Company' : ''}</Text>
                    </View>
                  </CardItem>
                  <CardItem style={{ flex: 1, alignSelf: 'stretch' }}>
                    <View style={{ flex: 1 }}>
                      <Item floatingLabel>
                        <Label>{this.props.selectedLanguage.startdate}</Label>
                        <Input style={{ fontSize: 14 }} editable={false} value={this.state.startdate != "" ? moment(this.state.startdate).format('ddd MMMM DD YYYY, h:mm a') : moment(this.state.date).format('ddd MMMM DD YYYY, h:mm a')} onChangeText={(text) => {
                          this.setState({ textName: text })
                        }} />
                        <Icon onPress={this.showDatepicker.bind(this, 'startdate')} type="FontAwesome"  name="calendar" style={{ color: this.props.primaryColor }} />
                        <Icon onPress={this.showTimepicker.bind(this, 'startdate')} type="FontAwesome" name="clock-o"  style={{ color: this.props.primaryColor }} />
                      </Item>
                      {
                        // <TextInput editable={false} placeholder="Enter Name" value={this.state.startdate != "" ? moment(this.state.startdate).format('ddd MMMM DD YYYY') : moment(this.state.date).format('ddd MMMM DD YYYY')} onChangeText={(text) => {
                        //   this.setState({ textName: text })
                        // }} style={{ borderWidth: 0, borderBottomWidth: 1, color: 'black' }} />
                      }
                    </View>
                  </CardItem>
                  <CardItem style={{ flex: 1, alignSelf: 'stretch' }}>
                    <View style={{ flex: 1 }}>
                      <Item floatingLabel>
                        <Label>{this.props.selectedLanguage.enddate}</Label>
                        <Input style={{ fontSize: 14 }} editable={false} value={this.state.enddate == "" ? moment(this.state.enddate).format('ddd MMMM DD YYYY, h:mm a') : moment(this.state.enddate).format('ddd MMMM DD YYYY, h:mm a')} onChangeText={(text) => {
                          this.setState({ textName: text })
                        }} />
                        <Icon onPress={this.showDatepicker.bind(this, 'enddate')} type="FontAwesome"  name="calendar" style={{ color: this.props.primaryColor }} />
                        <Icon onPress={this.showTimepicker.bind(this, 'enddate')} type="FontAwesome" name="clock-o"  style={{ color: this.props.primaryColor }} />
                      </Item>
                      {
                        // <TextInput editable={false} placeholder="Enter End Date" value={this.state.enddate == "" ? "" : moment(this.state.enddate).format('ddd MMMM DD YYYY')} onChangeText={(text) => {
                        //   this.setState({ textName: text })
                        // }} style={{ borderWidth: 0, borderBottomWidth: 1, color: 'black', borderBottomColor: this.state.errorDate ? 'red' : 'black' }} />
                      }
                      {this.state.errorDate ? <Text style={{ fontSize: 12, color: 'red' }}>Please Enter Date</Text> : null}
                    </View>
                  </CardItem>
                  <CardItem style={{ flex: 1, alignSelf: 'stretch' }}>
                    <View style={{ flex: 1 }}>
                      <Item stackedLabel>
                        <Label>{this.props.selectedLanguage.purpose}</Label>
                        <Input value={this.state.textPurpose}
                          onChangeText={(text) => {
                            this.setState({ textPurpose: text })
                          }} />
                      </Item>
                      {
                        // <TextInput placeholder="Enter Company" value={this.state.textCompany}
                        // onChangeText={(text) => {
                        //   this.setState({ textCompany: text,errorCompany:false })
                        // }} style={{ borderWidth: 0, borderBottomWidth: 1 }} />
                      }
                    </View>
                  </CardItem>
                  <CardItem footer style={{ flex: 1, flexDirection: 'row', paddingTop: 20 }}>
                    <View style={{ flex: 1 }}>
                      <Button style={{ backgroundColor: this.props.primaryColor }} block onPress={() => {
                        this.validateForm()
                      }}><Text style={{textTransform:'uppercase'}}>{this.props.selectedLanguage.create}</Text></Button>
                    </View>
                  </CardItem>
                </Card>
              </View>
            </Content>
            {this.state.show && (
              <View>
              {/* <DatePicker
                onDateChange={this.onChange}
                value={this.state.date}
                title="Date Picker"
                placeholder={this.handlePlaceholder()}
                iOSOnlyProps={{style: {color: 'green'} }}
                iosPickerMode={this.state.mode}
                onDonePress={()=>{
                  this.setState({show:false})
                }}
                //androidPickerMode="spinner"
                //locale="fr"
                //isNullable
                //disable
              /> */}
              <DateTimePicker
          testID="dateTimePicker"
          value={this.state.date}
          mode={this.state.mode}
          is24Hour={true}
          display="default"
          onChange={this.onChange}
        />
            </View>
            )}
            {
              // this.renderDateandTimePickerModal()
            }
          </Container>
          </SafeAreaView>
        </Modal>
      )
    }
  }

  validateDate() {
    if (this.state.enddate == "") {
      this.setState({ errorDate: true })
    }
    else {
      var ExposureContactDto = {
        externalContactId: this.state.selectedContact.id,
        rssi: -40,
        startContactDate: this.state.startdate.toUTCString(),
        endContactDate: this.state.enddate.toUTCString(),
        employeeId: this.props.user.id,
        departmentId: this.props.user.departmentId,
        locationId: this.props.user.locationId
      }
      this.setState({
        showFormToAddExposureContact: false,
        setstartdate: false,
        setenddate: false,
        startdate: new Date(),
        enddate: '',
        date: new Date(),
        show: false,
        mode: 'date',
        selectedContact: {},
        errorDate: false
      })
      this.props.createExternalExposureContact(ExposureContactDto)
    }
  }

  openSelectedExternalExposureDetailPage() {
    if(this.props.selectedExternalExposureDetail != undefined && this.state.showSelectedExternalExposureDetail == true ) {
      return (
        <Modal
        visible={this.state.showSelectedExternalExposureDetail}
        onRequestClose={()=>{
          this.setState({showSelectedExternalExposureDetail:false})
        }}>
        <SafeAreaView style={{flex:1,backgroundColor:this.props.primaryColor}} edges={['top']}>
        <Container style={{backgroundColor: "#FFF"}}>
        <View style={{flexDirection:'row',backgroundColor:this.props.primaryColor,padding:15}}>
        <Left style={{flex:0.1,flexDirection:'row',justifyContent:'flex-start'}}>
        <TouchableOpacity
        onPress={()=>{
          this.setState({showSelectedExternalExposureDetail:false})
          this.props.clearSelectedExternalExposureDetail()
        }}><Icon name="close" type="MaterialIcons" style={{color:'white'}}/></TouchableOpacity>
        </Left>
        <Body style={{flex:0.8,flexDirection:'row',justifyContent:"center"}}><Title>External Exposure Details</Title></Body>
        </View>
        <Content>
        {this.props.selectedExternalExposureDetail != undefined ?
          <View style={{ flex: 1, flexDirection: 'column', padding: 15 }}>
                  <Card style={{ flex: 1, flexDirection: 'column' }}>
                    <CardItem style={{ flex: 1, alignSelf: 'stretch' }}>
                      <View style={{ flex: 1 }}>
                        <Item floatingLabel>
                          <Label>Name</Label>
                          <Input value={this.props.selectedExternalExposureDetail.externalContact.name} />
                        </Item>
                      </View>
                    </CardItem>
                    <CardItem style={{ flex: 1, alignSelf: 'stretch' }}>
                      <View style={{ flex: 1 }}>
                        <Item floatingLabel>
                          <Label>Email</Label>
                          <Input keyboardType='email-address' value={this.props.selectedExternalExposureDetail.externalContact.email} />
                        </Item>
                      </View>
                    </CardItem>
                    <CardItem style={{ flex: 1, alignSelf: 'stretch' }}>
                      <View style={{ flex: 1 }}>
                        <Item floatingLabel>
                          <Label>Phone</Label>
                          <Input keyboardType='number-pad' value={this.props.selectedExternalExposureDetail.externalContact.phone}
                            onChangeText={(text) => {
                              this.setState({ textPhone: text, errorPhone: false })
                            }} />
                        </Item>
                      </View>
                    </CardItem>
                    <CardItem style={{ flex: 1, alignSelf: 'stretch' }}>
                      <View style={{ flex: 1 }}>
                        <Item floatingLabel>
                          <Label>Company</Label>
                          <Input value={this.props.selectedExternalExposureDetail.externalContact.company}
                            onChangeText={(text) => {
                              this.setState({ textCompany: text, errorCompany: false })
                            }} />
                        </Item>
                      </View>
                    </CardItem>
                    <CardItem style={{ flex: 1, alignSelf: 'stretch' }}>
                      <View style={{ flex: 1 }}>
                        <Item floatingLabel>
                          <Label>Start Contact Date</Label>
                          <Input style={{ fontSize: 14 }} editable={false} value={convertToCompanyTimeZone(this.props.selectedExternalExposureDetail.startContactDate,this.props.user.account.timeZoneIDStringJS,this.props.user.account.dateFormat,this.props.user.account.is12HRTimeFormat)} />
                        </Item>
                      </View>
                    </CardItem>
                    <CardItem style={{ flex: 1, alignSelf: 'stretch' }}>
                      <View style={{ flex: 1 }}>
                        <Item floatingLabel>
                          <Label>End Contact Date</Label>
                          <Input style={{ fontSize: 14 }} editable={false} value={convertToCompanyTimeZone(this.props.selectedExternalExposureDetail.endContactDate,this.props.user.account.timeZoneIDStringJS,this.props.user.account.dateFormat,this.props.user.account.is12HRTimeFormat)} />
                        </Item>
                      </View>
                    </CardItem>
                    <CardItem style={{ flex: 1, alignSelf: 'stretch' }}>
                      <View style={{ flex: 1 }}>
                        <Item floatingLabel>
                          <Label>Purpose</Label>
                          <Input value={this.props.selectedExternalExposureDetail.purpose}/>
                        </Item>
                      </View>
                    </CardItem>
                  </Card>
                </View>
  : null }
        </Content>
        </Container>
        </SafeAreaView>
        </Modal>
      )
    }
  }
  //Render the Component
  render() {
    // this.fillConversationList();   
    let datesWhitelist = [{
      start: moment().subtract(14, 'days'),
      end: moment()  // total 4 days enabled
    }];
    let datesBlacklist = [moment().add(365 - 14, 'days')]; // 1 day disabled

    const { externalExposureList, contactList, searchContactList, getExternalExposureByDate } = this.props;
    return (
      <Container>
      <View style={{ elevation: 5, borderBottomColor: 'black' }}>
            <CalendarStrip
              ref={(ref) => this.calenderStrif = ref}
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
              onDateSelected={(date) => {
                getExternalExposureByDate(date)
                this.setState({ currentSelectedDate: date._d })
              }}
              selectedDate={new Date()}
            />

          </View>

        <Content>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
            <View style={{ paddingLeft: 20, padding: 20 }}>
              <Text style={{ fontWeight: '300', color: 'gray' }}>{this.changeDatesFormat()}</Text>
            </View>
          </View>
          {externalExposureList != undefined ?
              <FlatList
                data={this.props.externalExposureList}
                renderItem={({ item, index }) => this.renderContactList(item, index)} /> 
            :
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}><Text>{this.props.selectedLanguage.noexternalexpofound}</Text></View>}
        </Content>
        {
          //   <View style={{ flex: 1, flexDirection: 'column', }}>
          //   <View style={{ flexDirection: 'row', padding: 20 }}>
          //     <Text style={{ color: 'gray' }}>Safely add people you've been in contact with directly from your contacts list, or one at a time.</Text>
          //   </View>
          //   <View style={{ flexDirection: 'column', justifyContent: 'center', paddingTop: 30 }}>
          //     <View>
          //       <Image source={require("../../../assets/contacticon.png")} style={{ height: 120, width: 120 }} />
          //     </View>
          //   </View>
          //   <View style={{ flexDirection: 'column', justifyContent: 'center', paddingTop: 10 }}>
          //     <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          //       <Text style={{ fontSize: 22 }}>You have no added Contacts</Text>
          //     </View>
          //     <View>
          //       <Text style={{ color: 'gray' }}>Safely add people you've been in contact</Text>
          //       <Text style={{ color: 'gray' }}>with directly from your contacts list, or</Text>
          //       <Text style={{ color: 'gray' }}>one at a time.</Text>
          //     </View>
          //   </View>
          // </View>
        }
        <ActionButton renderIcon={()=>{
                                    return (
                                        <View ref={this.externalExposureActionButton} style={{padding:5}}>
                                        <FontAwesome name="user-plus" style={{color:'white',fontSize:25}}/>
                                        </View>
                                    )
                                }} buttonColor={this.props.primaryColor} onLongPress={()=>{
                                    this.setState({showPopover:true})
                                }}
                                onPress={()=>{
                                  this.props.openForm();
                                   this.setState({ active: !this.state.active })
                                }}>
                                </ActionButton>
                        <Popover
                            isVisible = {this.state.showPopover}
                            onRequestClose={() => this.setState({showPopover:false})}
                            from={this.externalExposureActionButton}>
                             <Card style={{borderRadius:0}}>
                                 <CardItem bordered>
                                     <Text>{this.props.selectedLanguage.addextexpo}</Text>
                                 </CardItem>
                             </Card>
                        </Popover>
          {/* <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{}}
            style={{ backgroundColor: this.props.primaryColor }}
            position="bottomRight"
            onPress={() => {
              this.props.openForm();
              this.setState({ active: !this.state.active})
            }}>
            <MaterialCommunityIcons name="plus" size={20} />
          </Fab> */}
        {this.openFormToAddNewContact()}
        {this.openSelectedExternalExposureDetailPage()}
      </Container>
    );
  }
  //#endregion
}

export default ManualTab;