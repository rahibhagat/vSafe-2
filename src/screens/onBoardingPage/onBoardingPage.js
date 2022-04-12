//#region Third party imports
/* eslint-disable */
import React, { PureComponent } from "react";
import { RefreshControl, Image, View, Animated, BackHandler, StatusBar, Dimensions, Alert, FlatList, TouchableOpacity, ImageBackground, TouchableHighlight, ActivityIndicator, ScrollView, Modal, TextInput } from 'react-native';
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
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
//#endregion

//#region vSafe imports
import styles from "./styles";
import NavigatorService from '../../navigatorService/navigator';

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
class OnBoardingPage extends PureComponent {
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
      enddate: new Date()
    }
    this.array = [];
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  //#endregion

  //#region Other methods
  componentWillMount() {

    // exit application on hardware back button.
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

  }
  componentDidMount(convList) {
 
  }
  componentDidUpdate() {
    // this.fillConversationList(false);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  // Exiting Application
  handleBackButtonClick() {
     BackHandler.exitApp();
  }


  //Render the Component
  render() {
    // this.fillConversationList();   
    return (
      <SafeAreaView style={{flex:1,backgroundColor:this.props.primaryColor}} edges={['bottom']}>
      <Container style={styles.container}>

        <Swiper
          style={styles.wrapper}
          height={240}
          onMomentumScrollEnd={(e, state, context) => {

          }
          }
          loop={false}
        >
          <View
            style={styles.slide}
          >
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'purple'}}>
              <ImageBackground
              resizeMode="stretch"
                style={styles.image}
                source={require('../../../assets/vSafeNowOnBoard1.png')}
              />
            </View>
            <View style={{ flex: 0.5, flexDirection: 'column', backgroundColor: this.props.primaryColor, padding: 5, paddingLeft: 10 }}>
              <Text style={{ fontSize: 30, color: 'white' }}>{this.props.selectedLanguageFile.welcometovsafenow}</Text>
              <Text numberOfLines={3} style={{ fontSize: 15, color: 'white' }}>{this.props.selectedLanguageFile.onBoarding0}</Text>
            </View>
          </View>
          <View
            style={styles.slide}
          >
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'purple' }}>
              <Image
                resizeMode="stretch"
                style={styles.image}
                source={require('../../../assets/vSafeNowOnBoard2.png')}
              />
            </View>
            <View style={{ flex: 0.5, flexDirection: 'column', backgroundColor: this.props.primaryColor, padding: 5, paddingLeft: 10 }}>
              <Text style={{ fontSize: 30, color: 'white' }}>{this.props.selectedLanguageFile.onBoarding1}</Text>
              <Text numberOfLines={3} style={{ fontSize: 15, color: 'white' }}>{this.props.selectedLanguageFile.onBoarding2}</Text>
            </View>
          </View>
          <View
            style={styles.slide}
          >
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'purple', alignItems: 'center' }}>
              <ImageBackground
                resizeMode="stretch"
                style={styles.image}
                source={require('../../../assets/vSafeNowOnBoard3.png')}
              >
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', padding: 10, }}>
                  <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button rounded style={{ backgroundColor: this.props.primaryColor }}>
                      <Icon name="lock" type="FontAwesome" style={{ color: 'white' }} />
                      <Text uppercase={false} style={{ color: 'white', fontSize: 12 }}>{this.props.selectedLanguageFile.onBoarding7}</Text></Button>
                  </View>
                </View>
              </ImageBackground>
            </View>
            <View style={{ flex: 0.5, flexDirection: 'column', backgroundColor: this.props.primaryColor, padding: 5, paddingLeft: 15, alignItems: 'center', justifyContent: 'flex-start' }}>
              <View style={{ paddingLeft: 20 }}>
                <Text style={{ fontSize: 30, color: 'white' }}>{this.props.selectedLanguageFile.onBoarding8}</Text>
              </View>
              <View style={{ paddingTop: 10, width: deviceWidth / 1.2 }}>
                <Button block style={{ backgroundColor: 'white' }} onPress={() => {
                  NavigatorService.navigate('PreferencePage')
                }}><Text style={{ color: this.props.primaryColor }}>{this.props.selectedLanguageFile.onBoarding9}</Text></Button>
              </View>
            </View>
          </View>
        </Swiper>
      </Container>
      </SafeAreaView>
    );
  }
  //#endregion
}

//#region Map State and Dispatch region
function mapStateToProps(state) {
  const { user, isAuthenticated, error, loading, isLoggedIn } = state.login;
  const { primaryColor } = state.dashBoardPage;
  const { selectedLanguageFile } = state.settingsPage;
  return {
    user,
    isAuthenticated,
    error,
    loading,
    isLoggedIn,
    primaryColor,
    selectedLanguageFile
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators({

  }, dispatch)
}
//#endregion
export default connect(mapStateToProps, matchDispatchToProps)(OnBoardingPage);
