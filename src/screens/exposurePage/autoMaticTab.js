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
//#endregion

//#region vSafe imports
import styles from "./styles";

//#endregion

class AutomaticTab extends PureComponent {
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
            , active: false,currentSelectedDate:''
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

    renderEmployeeExposureList(item,index) {
        var rssi = 10 ^ ((-69 - item.rssi) / (10 * 2))
        return (
            <TouchableOpacity style={{ flex: 1, flexDirection: 'column', padding: 10 }}>
              <Card style={{ flex: 1, flexDirection: 'row' }}>
                <CardItem style={{ flex: 0.1, flexDirection: 'column', backgroundColor: this.props.primaryColor, alignItems: 'center', justifyContent: 'center' }}>
                  <View><Text style={{ color: 'white' }}>{index + 1}.</Text></View>
                </CardItem>
                <CardItem style={{ flex: 0.8, flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Text style={{fontSize:17}}>{item.contactFName} {item.contactLName}</Text>
                  <Text style={{fontSize:13}}>{item.contactEmail}</Text>
                  {/* <Text style={{fontSize:13}}>Ocuurancies: {item.contactOccurancies}</Text> */}
                  <Text style={{fontSize:13}}>From : {convertToCompanyTimeZone(item.startContactDate,this.props.user.account.timeZoneIDStringJS,this.props.user.account.dateFormat,this.props.user.account.is12HRTimeFormat)}</Text>
                  {/* <Text style={{fontSize:13}}>To : {convertToCompanyTimeZone(item.endContactDate,this.props.user.account.timeZoneIDStringJS,this.props.user.account.dateFormat,this.props.user.account.is12HRTimeFormat)}</Text> */}
                  {
                    //   <Text style={{fontSize:13}}>Distance : {rssi} m</Text>
                    }
                </CardItem>
              </Card>
            </TouchableOpacity>
          )
    }
    //Render the Component
    render() {
        // this.fillConversationList();   
        let datesWhitelist = [{
            start: moment().subtract(14, 'days'),
            end: moment()  // total 4 days enabled
        }];
        let datesBlacklist = [moment().add(365 - 14, 'days')]; // 1 day disabled
        const { employeeExposureList,getEmployessExposureByDate,employeeExposersReport } = this.props;
        return (
            <Container style={styles.container}>
            <View style={{elevation: 5, borderBottomColor: 'black' }}>
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
                                getEmployessExposureByDate(date)
                                this.setState({currentSelectedDate:date._d})
                            }}
                            selectedDate={new Date()}
                        />

                    </View>
                <Content>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                        <View style={{ paddingLeft: 20, padding: 20 }}>
                            <Text style={{ fontWeight: '300', color: 'gray' }}>{this.changeDatesFormat()}</Text>
                        </View>
                        {
                        //     <View style={{ flex: 1, flexDirection: 'column' }}>
                        //     <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', paddingTop: 20 }}>
                        //         <Image source={require('../../../assets/map_header.png')} style={{ height: 120, width: 120 }} />
                        //     </View>
                        //     <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        //         <Text style={{ fontSize: 20, fontWeight: '500' }}>Import your location history</Text>
                        //         <View style={{ width: deviceWidth / 1.7, flexDirection: 'column', justifyContent: 'center' }}>
                        //             <Text numberOfLines={2} style={{ fontSize: 13 }}>Import your timeline data from Google </Text>
                        //             <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        //                 <Text style={{ fontSize: 13 }}>or add locations one by one.</Text>
                        //             </View>

                        //         </View>

                        //     </View>
                        //     <View style={{ flex: 1, flexDirection: 'row', padding: 15, alignItems: 'center', justifyContent: 'center' }}>
                        //         <Button block style={{ backgroundColor: this.props.primaryColor }}>
                        //             <Text uppercase={false} style={{ color: 'white' }} >Import your location history</Text></Button>
                        //     </View>
                        //     <View style={{ flex: 1, flexDirection: 'row', padding: 25, justifyContent: 'center' }}>
                        //         <Text>This information is stored securely and locally on your app, and remians private to you.</Text>
                        //     </View>
                        // </View>
                    }
                    </View>
                    {employeeExposersReport != undefined ?
                        <FlatList 
                        data={employeeExposersReport}
                        renderItem={({item,index})=> this.renderEmployeeExposureList(item,index)}/> :
                        <View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center',paddingTop:20}}><Text>{this.props.selectedLanguage.noempexpofound}</Text></View> }
                </Content>
            </Container>
        );
    }
    //#endregion
}

//#endregion
export default AutomaticTab;
