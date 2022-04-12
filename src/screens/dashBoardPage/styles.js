const React = require("react-native");
import { StyleSheet } from "react-native"
const { Platform, Dimensions } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF"
  },
  imagecontainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backgroundstyle: {
    height: 42,
    width: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40
  },
  textbackgroundstyle: {
    fontSize: 19,
    color: 'white'
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  filters: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    // marginTop: 4,
    // marginBottom: 4,
    alignItems: 'center',
    backgroundColor: '#FFF',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#808080'
  },
  filtersapplied: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    // marginTop: 4,
    // marginBottom: 4,
    alignItems: 'center',
    backgroundColor: 'lightblue',
    justifyContent: 'flex-start',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#0c85e0'
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
  spinnerTextStyle: {
    color: '#0c85e0'
  },
  container1: {
    flex: 1,
    flexDirection: 'row',
    padding: hp('2%'),
    // marginTop: 4,
    // marginBottom: 4,
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    padding: hp('2%'),
    // marginTop: 4,
    // marginBottom: 4,
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  container3: {
    flex: 1,
    flexDirection: 'row',
    padding: hp('2%'),
    // marginTop: 4,
    // marginBottom: 4,
    alignItems: 'flex-start',
    backgroundColor: 'lightblue',
    borderRadius:5
  },
  container4: {
    flex: 1,
    flexDirection: 'row',
    padding: 2,
    // marginTop: 4,
    // marginBottom: 4,
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
    
  },
  title: {
    fontWeight: 'bold',
  },
  container_text: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    fontWeight: 'bold',
    marginLeft: 15,
    marginTop: -2,
    justifyContent: 'flex-start',
  },
  description: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingLeft: 10
  },
  title1: {
    color: '#696969'
  },
  container_text1: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 15,
    marginTop: -2,
    justifyContent: 'flex-start',
  },
  description1: {
    fontSize: 15,
    color: '#696969',
  },
  photo: {
    height: 42,
    width: 42,
    borderRadius: 150 / 2
  },
  spinnerCenter: {
    alignSelf: "center",
    marginBottom: 7
  },
  imagew: {
    width: 80,
    height: 80
  },
  note: {
    color: "#696969",
    fontSize: 14
  },
  icon: {
    fontSize: 17,
    color: '#0c85e0',
  },
  badgeContainerStyle: {
    marginLeft: -4,
    marginTop: -6
  },
  badgeText: {
    fontSize: Platform.OS === "ios" ? 11 : 10,
    fontWeight: "bold",
  },
  time: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black"
  },
  favImageStyle: {
    height: 30,
    width: 30
  },
  viewRead: {
    // borderLeftWidth: 5,
    // borderLeftColor: "#ffff",
  },
  viewUnRead: {
    // width: 0,
    // height: 0,
    // backgroundColor: 'transparent',
    // borderStyle: 'solid',
    // borderRightWidth: 30,
    // borderTopWidth: 30,
    // borderRightColor: 'transparent',
    // borderTopColor: 'red'


  },
  imageIconStyle: {
    height: 15,
    width: 15,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: 'red'
  },
  noconersationcontainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 600
  },
  noconversationcontainericon: {
    fontSize: 170, paddingBottom: 5
  },
  noconversationcontainerview: {
    flexDirection:'column',alignItems:'center',justifyContent:'center'
  },
  noconversationcontainertext1: {
    fontSize: 15, color: 'gray'
  },
  noconversationcontainertext2 : {
    fontSize: 25, color: 'gray'
  },
  conversationtypeimg : {
     height: 17, width: 17 
  },
  conversationlistview1: {
    flexDirection: 'row'
  },
  conversationlistview2 : {
    paddingLeft: 5,width:deviceWidth/2.5
  },
  conversationtimeview1 : {
    flex:0.5,flexDirection: 'column', alignItems: 'flex-end'
  },
  conversationtimeview2 : {
    flex:0.2,flexDirection:'row'
  },
  conversationtimeicon: {
    fontSize: 20,paddingRight:13
  },
  conversationlisttouchableopacity : {
    backgroundColor: '#0c85e0' 
  },
  elasticesearchfilterview : {
     paddingLeft: 5, padding: 5 
  },
  elasticesearchfilterview1 : {
    justifyContent: 'space-between' 
  },
  elasticesearchfiltertag : {
    fontSize: 20, color: 'white', paddingRight: 7, paddingTop: 2 
  },
  elasticesearchmodal : {
    flexDirection: 'column' 
  },
  elasticesearchmodalfilterview: {
     padding: 10, flexDirection: 'row', flexWrap: 'wrap' 
  },
  elasticesearchmodalfilterpicker : {
    height: 50, width: 300 
  },
  elasticesearchemptyconvlist : {
    flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',paddingTop:45 
  },
  elasticesearchemptyconvlisticon : {
    fontSize:130,color:'#0c85e0'
  },
  elasticesearchemptyconvlisttext : {
    fontSize:21,fontWeight:'bold'
  },
  filtermodalview : {
    
      flex: 2,
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: '#00000040',
    
  },
  filteranimatedview : {
    
      backgroundColor: '#FFFFFF',
      height: deviceHeight/ 3 ,
      width: deviceWidth/ 1.2,
      borderRadius: 10,
    
  },
  filteranimatedview1 : {
    
    backgroundColor: '#FFFFFF',
    height: deviceHeight / 4,
    width: deviceWidth,
    borderRadius: 10,
  
},
  filtermodaltouchableopacity : {
    flexDirection: 'row', justifyContent: 'center', paddingRight: 5
  },
  filtermodaltouchableopacityicon : {
     color: 'white' 
  },
  filteranimatedheaderright : {
    flexDirection:'row'
  },
  filteranimatedheaderrighticon : {
     color: 'white' 
  },
  filtermodalitemdivider : {
    fontWeight:'bold'
  },
  filtermodalorderandfilterby : {
    paddingLeft:15
  },
  filtermodalorderandfilterbytouchableopacity : {
    padding:5
  },
  conversationlistheadericon : {
    fontSize: 30 
  }
});
export default styles;
