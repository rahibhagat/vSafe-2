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
import { convertToCompanyTimeZone } from "../../utility/index";
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

//#endregion

class AssesmentsTab extends PureComponent {
    //#region Constructor
    constructor(props) {
        super(props);
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
            currentSelectedDate:'',
            showPopover:false
        }
        this.array = [];
        this.healthAssesmentActionButton = React.createRef();
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
        if(this.state.currentSelectedDate != "") {
            var date = new Date(this.state.currentSelectedDate)
        }
        else {
            var date = new Date() 
        }
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

    renderHealthAssesmentList(item,index) {
        return (
            <TouchableOpacity style={{ flex: 1, flexDirection: 'column', padding: 10 }} onPress={()=>{
                this.props.getSelectedHealAssesmentRecords(item.checkListId,item.id,item.checklistName,item.lastAssesmentDate,item.status)
            }}>
            <Card style={{ flex: 1, flexDirection: 'row' }}>
              <CardItem style={{ flex: 0.1, flexDirection: 'column', backgroundColor: item.status == 1 ? 'green' : 'red', alignItems: 'center', justifyContent: 'center' }}>
                <View><Text style={{ color: 'white' }}>{index + 1}.</Text></View>
              </CardItem>
              <CardItem style={{ flex: 0.8, flexDirection: 'column', alignItems: 'flex-start' }}>
              <Text numberOfLines={1} style={{ fontSize: 18 }}>{item.checklistName}</Text>
              <Text style={{fontSize:14}}>{convertToCompanyTimeZone(item.createdOn,this.props.user.account.timeZoneIDStringJS,this.props.user.account.dateFormat,this.props.user.account.is12HRTimeFormat)}</Text>
                {
                  //   <Text style={{fontSize:13}}>Distance : {rssi} m</Text>
                  }
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
    //Render the Component
    render() {
        // this.fillConversationList();   
        let datesWhitelist = [{
            start: moment().subtract(60, 'days'),
            end: moment()  // total 4 days enabled
        }];
        let datesBlacklist = [moment().add(365 - 14, 'days')]; // 1 day disabled
        const { getHealthAssesmentListBySelectedDate,healthAssesmentList } = this.props;
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
                                getHealthAssesmentListBySelectedDate(date)
                                this.setState({currentSelectedDate:date._d})
                            }}
                            selectedDate={new Date()}
                        />

                    </View>

                <Content>
                    <View style={{ padding: 0 }}>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                    <View style={{ paddingLeft: 20, padding: 20 }}>
                      <Text style={{ fontWeight: '300', color: 'gray' }}>{this.changeDatesFormat()}</Text>
                    </View>
                  </View>
                        {
                            healthAssesmentList != undefined ? healthAssesmentList.length > 0 ?
                            <FlatList
                        data={healthAssesmentList}
                        renderItem={({item,index})=>this.renderHealthAssesmentList(item,index)} 
                        keyExtractor={(item)=>{
                            return item.id.toString();
                        }}/> :<View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center', paddingTop: 20}}><Text>{this.props.selectedLanguage.nohealthassmreport}</Text></View>
                        : <View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center', paddingTop: 20}}><Text>{this.props.selectedLanguage.nohealthassmreport}</Text></View> 
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
                      <ActionButton renderIcon={()=>{
                                    return (
                                        <View ref={this.healthAssesmentActionButton} style={{padding:5}}>
                                        <MaterialCommunityIcons name="heart-plus" style={{color:'white',fontSize:25}}/>
                                        </View>
                                    )
                                }} buttonColor={this.props.primaryColor} onLongPress={()=>{
                                    this.setState({showPopover:true})
                                }}
                                onPress={()=>{
                                    this.props.navigateToCheckListsPage()
                                    this.props.setPath('HealthReportPage')
                                    this.setState({ active: !this.state.active})
                                }}>
                                </ActionButton>
                        <Popover
                            isVisible = {this.state.showPopover}
                            onRequestClose={() => this.setState({showPopover:false})}
                            from={this.healthAssesmentActionButton}>
                             <Card style={{borderRadius:0}}>
                                 <CardItem bordered>
                                     <Text>{this.props.selectedLanguage.takehealthassesments}</Text>
                                 </CardItem>
                             </Card>
                        </Popover>
            </Container>
        );
    }
    //#endregion
}

//#endregion
export default AssesmentsTab;
