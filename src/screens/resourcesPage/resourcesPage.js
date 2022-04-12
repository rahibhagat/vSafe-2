//#region Third party imports
/* eslint-disable */
import React, { PureComponent } from "react";
import {
  RefreshControl, Image, View, Animated, BackHandler, StatusBar, Dimensions, Alert,
  FlatList, TouchableOpacity, ImageBackground, TouchableHighlight,
  ActivityIndicator, ScrollView, Modal
} from 'react-native';
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
  Badge, Toast, Item, Input, Picker,
  CheckBox, CardItem, Card, Accordion
} from "native-base";
import Moment from 'react-moment';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import FastImage from 'react-native-fast-image';
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
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
import styles from "./styles";
const dataArray = [
  { title: "What is the purpose of this app?", content: "Lorem ipsum dolor sit amet" },
  { title: "How does this app benefit me?", content: "Lorem ipsum dolor sit amet" },
  { title: "Who can use VSafe?", content: "Lorem ipsum dolor sit amet" },
  { title: "Who else benefits from my participation with this app?", content: "Lorem ipsum dolor sit amet" },
  { title: "How does VSAfe help public health officials?", content: "Lorem ipsum dolor sit amet" },
];
const dataArray1 = [
  { title: "What is the purpose of this app?", content: "Lorem ipsum dolor sit amet" },
  { title: "How does this app benefit me?", content: "Lorem ipsum dolor sit amet" },
  { title: "Who can use VSafe?", content: "Lorem ipsum dolor sit amet" },
  { title: "Who else benefits from my participation with this app?", content: "Lorem ipsum dolor sit amet" },
  { title: "How does VSAfe help public health officials?", content: "Lorem ipsum dolor sit amet" },
];
//#endregion

class ResourcesPage extends PureComponent {
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

  }
  componentWillUnmount() {
    clearInterval(this.timer);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

  }
  // Exiting Application
  handleBackButtonClick() {
    BackHandler.exitApp();
  }
  //Render the Component
  render() {
    // this.fillConversationList();   
    return (
      <SafeAreaView style={{flex:1,backgroundColor:this.props.primaryColor}} edges={['top','left','right']}>
      <Container style={{backgroundColor: "#FFF"}}>
      <View transparent={true} style={{ flexDirection:'row',backgroundColor: 'white',padding:5 }}>
                    <Body style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Icon name="clipboard-notes" type='Foundation'  style={{color:'black'}} />
                        <Title style={{ fontWeight: 'bold', fontSize: 22, color: 'black', paddingLeft: 15 }}>{this.props.selectedLanguageFile.resources}</Title></Body>
                        <Right style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    </Right>
                </View>
        {
        //   <View transparent={true} style={{ backgroundColor: 'white', height: 80, elevation: 5, flexDirection: 'row' }}>
        //   <Body style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 15 }}>
        //     <Title style={{ fontWeight: 'bold', fontSize: 22, color: 'black', paddingLeft: 15 }}>Resources [Demo]   </Title></Body>
        //   <Right style={{ flex: 0.3, flexDirection: 'row', justifyContent: 'center', paddingTop: 20 }}>
        //     <Icon name="calendar" type="FontAwesome" color={'black'} />
        //   </Right>
        // </View>
        }
        <Content>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={{ flex: 1, flexDirection: 'row', padding: 20, borderBottomWidth: 0.5, borderBottomColor: 'gray' }}>
              <Text style={{ fontSize: 22, color: 'gray', fontWeight: 'bold' }}>Frequently Asked Questions</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', padding: 20, borderBottomWidth: 0.5, borderBottomColor: 'gray' }}>
              <Text style={{ fontSize: 15, color: this.props.primaryColor }}>{this.props.selectedLanguageFile.about}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Accordion
                dataArray={dataArray}
                iconStyle={{ flex: 1, flexDirection: 'row', borderWidth: 1 }}
                contentStyle={{ borderBottomColor: 'gray', borderBottomWidth: 0.5, padding: 15 }}
                renderHeader={(dataArray, expanded) => {
                  return (
                    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'white', padding: 15, borderBottomColor: 'gray', borderBottomWidth: 0.5 }}>
                      <View style={{ flex: 0.9 }}>
                        <Text>{dataArray.title}</Text>
                      </View>
                      <View style={{ flex: 0.1 }}>
                        {expanded ? <Icon name="keyboard-arrow-up" type="MaterialIcons" /> : <Icon name="keyboard-arrow-down" type="MaterialIcons" />}
                      </View>

                    </View>
                  )
                }}
                renderContent={(dataArray) => {
                  return (
                    <View style={{ flex: 1, padding: 20 }}>
                      <Text style={{ fontSize: 15, color: 'gray' }}>{dataArray.content}</Text>
                    </View>
                  )
                }}
              />
            </View>
            <View style={{ flex: 1, flexDirection: 'row', padding: 20, borderBottomWidth: 0.5, borderBottomColor: 'gray' }}>
              <Text style={{ fontSize: 15, color: this.props.primaryColor }}>PRIVACY AND SECURITY</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Accordion
                dataArray={dataArray1}
                contentStyle={{ borderBottomColor: 'gray', borderBottomWidth: 0.5, padding: 15 }}
                renderHeader={(dataArray1, expanded) => {
                  return (
                    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'white', padding: 15, borderBottomColor: 'gray', borderBottomWidth: 0.5 }}>
                      <View style={{ flex: 0.9 }}>
                        <Text>{dataArray1.title}</Text>
                      </View>
                      <View style={{ flex: 0.1 }}>
                        {expanded ? <Icon name="keyboard-arrow-up" type="MaterialIcons" /> : <Icon name="keyboard-arrow-down" type="MaterialIcons" />}
                      </View>

                    </View>
                  )
                }}
                renderContent={(dataArray1) => {
                  return (
                    <View style={{ flex: 1, padding: 20 }}>
                      <Text style={{ fontSize: 15, color: 'gray' }}>{dataArray1.content}</Text>
                    </View>
                  )
                }}
              />
            </View>
            {/* <View style={{ padding: 15 }}>
              <Card style={{ padding: 15, borderRadius: 5 }}>
                <CardItem header bordered>
                  <Body>
                    <Text uppercase={false} style={{ fontSize: 22 }}>Resources</Text>
                  </Body>
                </CardItem>
                <CardItem cardBody >
                  <Body style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-evenly', padding: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', padding: 15 }}>
                      <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 100 / 2,
                        backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderColor: 'lightgray', borderWidth: 1
                      }}>
                        <Image source={require('../../../assets/US-CDC-Logo.png')} style={{ height: 60, width: 60, borderRadius: 100 / 2 }} />
                      </View>
                      <View style={{ flex: 1, flexDirection: 'column', paddingLeft: 25 }}>
                        <Text style={{ fontSize: 18 }}>CDC Guidance</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15 }}>
                      <View>
                        <Image source={require('../../../assets/kclogo.jpg')} style={{ height: 60, width: 60 }} />
                      </View>
                      <View style={{ flex: 1, flexDirection: 'column', paddingLeft: 25 }}>
                        <Text style={{ fontSize: 18 }}>Public Health - Seattle & King Country</Text>
                      </View>
                    </View>
                  </Body>
                </CardItem>
              </Card>

            </View> */}


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
  const { selectedLanguageFile } = state.settingsPage;
  return {
    primaryColor,
    selectedLanguageFile
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators({

  }, dispatch)
}
//#endregion
export default connect(mapStateToProps, matchDispatchToProps)(ResourcesPage);
