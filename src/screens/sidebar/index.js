//#region Third Party imports
/* eslint-disable */
import React, { PureComponent } from "react";
import {
  Image, Alert, Linking, ActivityIndicator,
  Picker, ScrollView, ImageBackground, FlatList, TouchableOpacity, StatusBar, Platform
} from "react-native";
import {
  Content,
  Text,
  List,
  ListItem,
  Icon,
  Container,
  Left,
  Right,
  Badge,
  Item,
  Footer,
  FooterTab,
  Button,
  View,
  Card,
  CardItem,
  Accordion,
  Header,
  Spinner,
  Toast,
} from "native-base";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from "lodash";
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';
//#endregion

//#region Abhisi imports
import styles from "./style";
//#endregion

class SideBar extends PureComponent {
  //#region Constructor
  setMenuRef = ref => {
    this._menu = ref;
  };
  showMenu = () => {
    this._menu.show();
  };
  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4,
      open: 5,
      close: 10,
      logoutPressed: false,
      selected: "Select your Mailbox",
      openteamlist: false,
      selectedTeam: ''
    };
  }
  //#endregion

  //#region Other Methods
  componentDidMount() {
  }  
  //#endregion


  render() {
    return (
      <Container>
        <StatusBar hidden={true} />
        
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
  }
    , dispatch)
}
//#endregion

export default connect(mapStateToProps, matchDispatchToProps)(SideBar);