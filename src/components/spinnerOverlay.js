import React, { PureComponent } from "react";
import { RefreshControl, Image, StyleSheet,View,Animated, BackHandler, StatusBar,Alert, FlatList, TouchableOpacity, ImageBackground, TouchableHighlight,ActivityIndicator,ScrollView,Modal } from 'react-native';
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
  Badge,Toast
} from "native-base";
import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator,
  } from 'react-native-indicators';
export default class SpinnerOverlay extends PureComponent {
    constructor(props) {
        super(props);
    };
    render(){
      const {visiblespinner} = this.props;
    return(
        <Modal
          transparent={true}
          animationType={'fade'}
          visible={visiblespinner}
          onRequestClose={() => { 
            // console.log('close modal')
           }}>
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
            <BallIndicator color='#0c85e0' size={30} />
            </View>

          </View>
        </Modal>
    )
}
}
const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
      },
      activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 70,
        width: 70,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
      },
  });
  
