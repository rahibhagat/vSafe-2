// #region global imports
import {combineReducers} from 'redux';
// #endregion

// #region vSafe imports
import LoginReducer from './loginReducer.js';
import SidebarReducer from './sidebarReducer.js';
import TestBodyReportPageReducer from './testBodyReportPageReducer';
import onBoardingPageReducer from './onBoardingPageReducer.js';
import preferencePageReducer from './preferencePageReducer.js';
import dashBoardPageReducer from './dashBoardPageReducer.js';
import settingsPageReducer from './settingsPageReducer.js';
import createLogPageReducer from './createLogPageReducer.js';
import bodyAssessmentPageReducer from './bodyAssessmentPageReducer';
import checkListsPageReducer from './checkListsPageReducer';
import healthReportPageReducer from './healthReportPageReducer';
import exposurePageReducer from "./exposurePageReducer";
import PushNotificationReducer from "./pushNotificationReducer";

// #endregion

const allReducers= combineReducers({

  login: LoginReducer, 
  sidebar: SidebarReducer,
  testBodyReportPage: TestBodyReportPageReducer,
  OnBoardingPage:onBoardingPageReducer,
  preferencePage:preferencePageReducer,
  dashBoardPage:dashBoardPageReducer,
  settingsPage:settingsPageReducer,
  createLogPage:createLogPageReducer,
  bodyAssessmentPage:bodyAssessmentPageReducer,
  checkListsPage:checkListsPageReducer,
  healthReportPage:healthReportPageReducer,
  exposurePage:exposurePageReducer,
  pushNotification: PushNotificationReducer
});

export default allReducers;
