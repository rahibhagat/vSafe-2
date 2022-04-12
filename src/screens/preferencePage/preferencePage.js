//#region Third party imports
/* eslint-disable */
import React, { PureComponent } from "react";
import { RefreshControl, Image, View, Animated, BackHandler, Platform,StatusBar, Dimensions, Alert, FlatList, TouchableOpacity, ImageBackground, TouchableHighlight, ActivityIndicator, ScrollView, Modal, TextInput, Switch } from 'react-native';
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
    Badge, Toast, Item, Input, Picker, CheckBox, CardItem, Card
} from "native-base";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import FastImage from 'react-native-fast-image';
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import Moment from 'react-moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import Swiper from 'react-native-swiper'
import CustomIcon from '../../customIcons/customIcon';
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
// import { SafeAreaView } from "react-navigation";
import DeviceInfo from "react-native-device-info";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
//#endregion

//#region vSafe imports
import styles from "./styles";
import { enableEmailNotificationSettings,enablePushNotificationSettings,enableSMSNotificationSettings } from "../../actions/dashBoardPageActions";

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
//#endregion
const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'Food Presentation 123',
        color: 'red'
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Grilled Item',
        color: 'green'
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Burger',
        color: 'brown'
    },
    {
        id: '48794a0f-3da1-471f-bd96-145571e29d72',
        title: 'Foods',
        color: 'blue'
    },
];
class PreferencePage extends PureComponent {
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
            date: new Date(),
            show: false,
            mode: 'date',
            nametext: '',
            emailtext: '',
            phonenumbertext: '',
            purposetext: '',
            setstartdate: false,
            setenddate: false,
            startdate: new Date(),
            enddate: new Date(),
            isEnabledBluetooth: false, isEnabledLocation: false, 
            isEnabledNotification: this.props.pushNotificationStatus,
            isEnabledEmail:this.props.emailNotificationStatus,
            isEnabledSMS:this.props.smsNotificationStatus,
        }
        this.array = [];
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
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
    componentDidMount(convList) {
        if (Platform.OS === '' && DeviceInfo.hasNotch()) {
            
          }
    }
    componentDidUpdate() {

    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    // Exiting Application
    handleBackButtonClick() {

    }


    toggleSwitch = (value) => {
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
    //Render the Component
    render() {
        // this.fillConversationList();   
        return (
            <SafeAreaView style={{flex:1,backgroundColor:this.props.primaryColor}} edges={['top']}>
            <Container style={{backgroundColor: "#FFF"}}>
                <Header style={{ height:55,backgroundColor: 'white', shadowOpacity: 1, shadowColor: 'gray' }}>
                    <Left style={{ flexDirection: 'row' }}>
                        {/* <Button transparent onPress={() => {
                            this.props.navigation.navigate('OnBoardingPage')
                        }}>
                            <Ionicons size={20} name='ios-arrow-back' style={{ color: 'black' }} />
                        </Button> */}
                    </Left>
                    <Body><Title style={{ color: 'black' }}>{this.props.selectedLanguageFile.selectPref}</Title></Body>
                </Header>
                <Content>
                    <View style={{ flex: 0.6, flexDirection: 'column', paddingleft: 20 }}>
                        <View style={{ padding: 5, paddingLeft: 20 }}>
                            <Text numberOfLines={3}>{this.props.selectedLanguageFile.enableNotifiNote}</Text>
                        </View>

                        <View style={{ padding: 5, paddingTop: 10, paddingLeft: 20 }}>
                            <Text numberOfLines={2}>{this.props.selectedLanguageFile.vSafeRevealInfo}</Text>
                        </View>

                        <View style={{ padding: 5, paddingLeft: 20 }}>
                            <Text numberOfLines={3} style={{ fontWeight: 'bold', color: this.props.primaryColor }}>{this.props.selectedLanguageFile.learnM}</Text>
                        </View>

                    </View>
                    <View style={{
                        flex: 1, flexDirection: 'column', padding: 10
                    }}>
                        <CardItem bordered >
                            <Body style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 20 }}>
                                <View style={{ flex: 0.5, flexDirection: 'column', justifyContent: 'center', }}>
                                    <Icon name="bell-o" type="FontAwesome" style={{ fontSize: 20 }} />
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
                                        onValueChange={this.toggleSwitch.bind(this, 1)}
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
                                    <Text style={{ fontSize: 12 }}>{this.props.selectedLanguageFile.receicenotification}</Text>
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
                                    <Text style={{ fontSize: 12 }}>{this.props.selectedLanguageFile.receicenotification}</Text>
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
                                    <Icon name="bluetooth-b" type="FontAwesome" style={{ fontSize: 20 }} />
                                </View>
                                <View style={{ flex: 1.5, flexDirection: 'column' }}>
                                    <Text style={{ fontSize: 18 }}>{this.props.selectedLanguageFile.bluetoothtracing}</Text>
                                    <Text style={{ fontSize: 12 }}>{this.props.selectedLanguageFile.emitdetect}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "lightblue" }}
                                        thumbColor={this.state.isEnabledBluetooth ? this.props.primaryColor : "#f4f3f4"}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={this.toggleSwitch.bind(this, 3)}
                                        value={this.state.isEnabledBluetooth}
                                    />
                                </View>
                            </Body>
                        </CardItem>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', padding: 10 }}>
                        <Button block style={{ backgroundColor: this.props.primaryColor }} onPress={() => {
                            this.props.navigation.navigate('DashBoardPage')
                        }}><Text style={{ color: 'white' }}>{this.props.selectedLanguageFile.next}</Text></Button>
                    </View>
                </Content>
            </Container>
            </SafeAreaView>
        );
    }
    //#endregion
}

//#region Map State and Dispatch region
function mapStateToProps(state) {
    const { primaryColor } = state.dashBoardPage;
    const { emailNotificationStatus,smsNotificationStatus,pushNotificationStatus } = state.login;
    const { selectedLanguageFile } = state.settingsPage;
    return {
         primaryColor,
         emailNotificationStatus,
         smsNotificationStatus,
         pushNotificationStatus,
         selectedLanguageFile
    };
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
         enableEmailNotificationSettings:enableEmailNotificationSettings,
         enablePushNotificationSettings:enablePushNotificationSettings,
         enableSMSNotificationSettings:enableSMSNotificationSettings
    }, dispatch)
}
//#endregion
export default connect(mapStateToProps, matchDispatchToProps)(PreferencePage);
