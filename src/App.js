import React, { PureComponent } from "react";
import { Root, Icon, View } from "native-base";
import NavigatorService from './navigatorService/navigator';
import { createDrawerNavigator, createStackNavigator, createBottomTabNavigator, createAppContainer } from "react-navigation";
import LoginPage from "./screens/login/index";
import SideBar from "./screens/sidebar";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import DeviceInfo from "react-native-device-info";
// import CustomIcon from './customIcons/customIcon';
import AssignConversation from "./screens/testBodyReportPage/testBodyReportPage";
import OnBoardingPage from "./screens/onBoardingPage/onBoardingPage";
import PreferencePage from "./screens/preferencePage/preferencePage"
import DashBoardPage from "./screens/dashBoardPage/dashBoardPage";
import ExposurePage from "./screens/exposurePage/exposurePage"
import ResourcesPage from "./screens/resourcesPage/resourcesPage"
import HealthReportPage from "./screens/healthReportPage/healthReportPage";
import SettingsPage from "./screens/settings/settingsPage";
import CreateLogPage from "./screens/createLog/createLogPage";
import BleScannedDeviceList from "./screens/bleScannedDeviceListPage/bleScannedDeviceListPage";
import BodyAssessmentPage from "./screens/bodyAssessmentPage/bodyAssessmentPage";
import CheckListsPage from "./screens/checkListsPage/checkListsPage";
import ForgotPasswordPage from "./screens/forgotPassword/forgotPasswordPage";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import App from "../App";
import FlashMessage from "react-native-flash-message";

class AppNavigatorMainClass extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const Drawer = createDrawerNavigator(
      {

        AssignConversation: { screen: AssignConversation },
        OnBoardingPage: { screen: OnBoardingPage },
        PreferencePage: { screen: PreferencePage },
      },
      {
        initialRouteName: "OnBoardingPage",
        drawerWidth: 300,
        drawerType: 'slide',
        contentOptions: {
          activeTintColor: "#e91e63"
        },
        contentComponent: props => <SideBar {...props} />
      }
    );

    const HealthAssesmentsMainStackNavigator = createStackNavigator({
      HealthReportPage: { screen: HealthReportPage },
      CheckListsPage: { screen: CheckListsPage },
      BodyAssessmentPage: { screen: BodyAssessmentPage },
    }, {
      headerMode: "none",
    })
    const DashBoardMainStackNavigator = createStackNavigator(
      {

        DashBoardPage: { screen: DashBoardPage },
        SettingsPage: { screen: SettingsPage },
        CheckListsPage: { screen: CheckListsPage },
        BodyAssessmentPage: { screen: BodyAssessmentPage }
      },
      {
        headerMode: "none",

      },
    )
    const TabNavigator = createBottomTabNavigator({
      DashBoardPage: {
        screen: DashBoardMainStackNavigator,
        navigationOptions: {
          tabBarLabel: this.props.selectedLanguageFile != undefined ? this.props.selectedLanguageFile.home : "Home",
          tabBarIcon: ({ tintColor }) => (
            <Icon type="MaterialIcons" name="home" style={{ paddingTop: 0, color: tintColor }} />
          )
        }
      },
      ExposurePage: {
        screen: ExposurePage,
        navigationOptions: {
          tabBarLabel: this.props.selectedLanguageFile != undefined ? this.props.selectedLanguageFile.exposure : "Exposures",
          tabBarIcon: ({ tintColor }) => (
            <Icon name="graph-horizontal" type='Foundation' style={{ color: tintColor }} />
          )
        }
      },
      HealthReportPage: {
        screen: HealthAssesmentsMainStackNavigator,
        navigationOptions: {
          tabBarLabel: this.props.selectedLanguageFile != undefined ? this.props.selectedLanguageFile.healthassesments : "Health Assesments",
          tabBarIcon: ({ tintColor }) => (
            <Icon name="heart" type="SimpleLineIcons" style={{ color: tintColor, fontSize: 20 }} />
          )
        }
      },
      ResourcesPage: {
        screen: ResourcesPage,
        navigationOptions: {
          tabBarLabel: this.props.selectedLanguageFile != undefined ? this.props.selectedLanguageFile.resources : "Resources",
          tabBarIcon: ({ tintColor }) => (
            <Icon name="clipboard-notes" type='Foundation' style={{ color: tintColor }} />
          )
        }
      },
      // BleScannedDeviceList:{screen : BleScannedDeviceList,
      //   navigationOptions: {
      //     tabBarLabel:"List",
      //     tabBarIcon: ({ tintColor }) => (
      //       <Icon name="clipboard-notes" type='Foundation'  style={{color:tintColor}} />
      //     )
      //   }},
      // CheckListsPage:{screen : Main2StackNavigator,
      //   navigationOptions: {
      //     tabBarLabel:"Self-Assessment",
      //     tabBarIcon: ({ tintColor }) => (
      //       <Icon name="doctor" type='MaterialCommunityIcons'  style={{color:tintColor}} />
      //     )
      //   }}


    }, {
      initialRouteName: "DashBoardPage",
      tabBarOptions: {
        activeTintColor: '#0c85e0',
        inactiveTintColor: 'gray',
        style: {
          backgroundColor: 'white',
        }
      },
    });
    const AppNavigator = createStackNavigator(
      {
        LoginPage: { screen: LoginPage },
        ForgotPasswordPage: { screen: ForgotPasswordPage },
        OnBoardingPage: { screen: OnBoardingPage },
        PreferencePage: { screen: PreferencePage },
        TabNavigator: { screen: TabNavigator }
        // CustomerInfo: {screen: CustomerInfo}   
      },
      {
        initialRouteName: "LoginPage",
        headerMode: "none",

      },

    );
    const AppNavigatorMain = createAppContainer(AppNavigator)
    var modalName = DeviceInfo.getModel().includes("iPhone 12") && !DeviceInfo.getModel().includes("iPhone 12 mini")
    // console.log("mmmmoooodaaalla name",modalName)
    return (
      <Root>
        {modalName == true ?
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <AppNavigatorMain
          ref={navigatorRef => {
            NavigatorService.setContainer(navigatorRef);
          }} />
          </SafeAreaView> : 
          <AppNavigatorMain
            ref={navigatorRef => {
              NavigatorService.setContainer(navigatorRef);
            }} />}
          <FlashMessage position="top" icon="auto" hideOnPress={true} floating={true} autoHide={false}/> 
      </Root>
    )
  }
}


function mapStateToProps(state) {
  const { selectedLanguageFile } = state.settingsPage;
  return {
    selectedLanguageFile
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(AppNavigatorMainClass);
  // export default () =>
  // <Root>
  //   <AppNavigatorMain
  //       ref={navigatorRef => {
  //         NavigatorService.setContainer(navigatorRef);
  //       }}/>
  //   {/* <AppNavigator /> */}
  // </Root>;
