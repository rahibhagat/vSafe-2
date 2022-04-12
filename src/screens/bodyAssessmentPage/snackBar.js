/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import { Icon } from "native-base";
import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import { StyleSheet, Text, View, Animated } from "react-native";
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
import { snackBarMessages } from "../../constants/vSafeEnum";


class SnackBar extends Component
{
   constructor() {
   super();

   this.animatedValue = new Animated.Value(50);
   this.ShowSnackBar = false;
   this.HideSnackBar = true;
   this.state = {
     SnackBarInsideMsgHolder: ''
   };
 }

  ShowSnackBarFunction(SnackBarInsideMsgHolder="Default SnackBar Message...", duration=3000)
  {
    if( this.ShowSnackBar === false )
    {
      this.setState({ SnackBarInsideMsgHolder: SnackBarInsideMsgHolder });

      this.ShowSnackBar = true;

      Animated.timing
      (
          this.animatedValue,
          {
              toValue: 0,
              duration: 400
          }
      ).start(this.hide(duration));
    }
  }

    hide = (duration) =>
    {
      this.timerID = setTimeout(() =>
      {
        if(this.HideSnackBar === true)
        {
            this.HideSnackBar = false;

            Animated.timing
            (
              this.animatedValue,
              {
                toValue: 50,
                duration: 400
              }
            ).start(() =>
            {
              this.HideSnackBar = true;
              this.ShowSnackBar = false;
              clearTimeout(this.timerID);
            })
        }
      }, 2000);
    }

    SnackBarCloseFunction = () =>
    {
      if(this.HideSnackBar === true)
      {
          this.HideSnackBar = false;
          clearTimeout(this.timerID);

          Animated.timing
          (
              this.animatedValue,
              {
                toValue: 50,
                duration: 400
              }
          ).start(() =>
          {
              this.ShowSnackBar = false;
              this.HideSnackBar = true;
          });
      }
    }

    renderBackGroundColor(text) {
      var color = "";
      if(text == snackBarMessages.updatePassFail) {
        color = "red"
      }
      else if(text == snackBarMessages.resetPassFail) {
        color = "red"        
      }
      else if(text == snackBarMessages.resetPassSuccess) {
        color = "#1e983b"
      }
      else {
        color = "#1e983b"
      }
      return color;
    }

    render()
    {
      return(

         <Animated.View style = {[{ transform: [{ translateY: this.animatedValue }]}, styles.SnackBarContainter,{backgroundColor:this.renderBackGroundColor(this.state.SnackBarInsideMsgHolder)}]}>

            <Text numberOfLines = { 1 } style = { styles.SnackBarMessage }>{ this.state.SnackBarInsideMsgHolder }</Text>

            <TouchableOpacity style = { styles.SnackBarUndoText} onPress = { this.SnackBarCloseFunction } ><MaterialCommunityIcons name='close' size={25} style={{color:'white'}}/></TouchableOpacity>

         </Animated.View>

      );
    }
}

export default SnackBar;


const styles = StyleSheet.create({

  SnackBarContainter:
  {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    left: 0,
    bottom: 0,
    right: 0,
    height: 50,
    paddingLeft: 10,
    paddingRight: 55
  },

  SnackBarMessage:
  {
    color: '#fff',
    fontSize: 15
  },

  SnackBarUndoText:{
    color: '#FFEB3B',
    fontSize: 18,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    padding: 5

  }
});