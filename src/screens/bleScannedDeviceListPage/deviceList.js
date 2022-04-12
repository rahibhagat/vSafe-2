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

//#endregion

class DeviceList extends PureComponent {
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

    getUserGuid(object) {
        var userGuid = Object.keys(object)
        console.log(userGuid,'HELLLOOOO')
        return userGuid[0];
      }

    renderItem(item,index) {
        return (
            <View style={{flex:1,padding:10}}>
          <Card style={{flex:1,flexDirection:'column'}}>
              <CardItem header style={{backgroundColor:'mediumpurple'}}>
              <View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'space-evenly'}}>
              <Text style={{fontSize: 15, color: '#333333', padding: 2,color:'white'}}>{item.userGUID}</Text>
              </View>
              </CardItem>    
              <CardItem cardBody>
              <View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'space-evenly',paddingLeft:0,padding:5}}>
              <Text style={{fontSize: 13, color: '#333333', padding: 2}}>{item.serviceUUID}</Text>
              <Text style={{fontSize: 13, color: '#333333', padding: 2}}>{item.lastScannedTime}</Text>
              </View>
              </CardItem>
          </Card>
          </View>
        );
      }
    //Render the Component
    render() {  
        const { scannedDeviceList,currentBlueToothState } = this.props;
        return (
            <Container style={styles.container}>
                <Content>
                    <FlatList 
                    data={scannedDeviceList.params}
                    renderItem={({item,index}) => this.renderItem(item,index) }
                    keyExtractor={item => item.id} />
                </Content>
            </Container>
        );
    }
    //#endregion
}

//#endregion
export default DeviceList;
