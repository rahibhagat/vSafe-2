const React = require("react-native");
const { Platform, Dimensions } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  cardcontainer: {
    shadowColor: '#000000',
    shadowRadius: 3,
    shadowOpacity: 0.5
  },
  drawerCover: {
    flex: 0.5
  },
  header_footer_style: {
    width: '100%',
    height: 45,
    backgroundColor: 'white',
    flexDirection:'row',
    alignItems:'flex-start',
    justifyContent:'flex-start',
    borderBottomWidth:1,paddingLeft:10,borderBottomColor:'gray'
  },
  textStyleheader: {
    textAlign: 'center',
    color: 'black',
    fontSize: 17,
    paddingLeft:24,padding:7
  },
  container1: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    // marginTop: 4,
    // marginBottom: 4,
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    // marginTop: 4,
    // marginBottom: 4,
    alignItems: 'flex-start',
    backgroundColor: 'lightblue',
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  container3: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    marginTop: 4,
    // marginBottom: 4,
    alignItems: 'flex-start',
    backgroundColor: 'lightblue',
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,paddingLeft:15
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
  container_text1: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: 2,
    justifyContent: 'center',
  },
  drawerUserImage: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderRadius: 150 / 2,
    borderColor: "white"
  },
  iconleft:
  {
    color: "#777",
    fontSize: 26,
    width: 30
  },
  drawerHeaderImage: {
    alignSelf: "flex-start",
    position: "absolute",
    top: 5,
    left: 10,
    height: 55,
    width: 80
  },
  drawerheaderbgimg:
  { flex: 1, 
    flexDirection: 'column',                
    alignItems: 'center',
    paddingRight:20,
    backgroundColor:'#4bcbed'
  },
  drawerHeaderStyle: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 2,
  },
  linergradient:{
    flex:1,
    flexDirection: 'column',                
    alignItems: 'center',
    paddingRight:20,
    paddingTop: 20,
   
  },
  linergradientfooter:{
    flex:1,
    flexDirection: 'column',                
    alignItems: 'flex-start',
  },
  useremail:
  { flex: 1,
     flexDirection: 'column', 
     alignItems: 'flex-start',
     paddingBottom:5 
    },
    logoutbutton:
    { flex: 1, 
      flexDirection: 'row', 
      alignItems: 'flex-start', 
      padding: 5, 
      paddingLeft: 15 
    },
    websiteinfo:
    { flex:1, 
      flexDirection: 'row', 
      alignItems: 'flex-start',
      padding: 5, 
      paddingLeft: 15
    },
    footerheight:
    { 
      height: 60,
     
     },
  text: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 16,
    marginLeft: 20,
    marginBottom: 10,
  },
  footerview:
  { 
    flex: 1, 
    flexDirection: 'column', 
    alignItems:'flex-start',
    backgroundColor:'white'
  },
  textactive: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 16,
    marginLeft: 20,
    color: "black",
  },
  badge: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 4,
  },
  badge1: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 2,
  },
  badgeText: {
    fontSize: Platform.OS === "ios" ? 13 : 11,
    fontWeight: "400",
    textAlign: "center",
    marginTop: Platform.OS === "android" ? -3 : undefined
  },
  userText: {
    fontWeight: 'bold',
    fontSize: 22,
    color: "white"
  },
  userText1: {
    fontSize: 15,
    fontWeight: 'bold',
    color: "white",
  },
  textStyle: {
    fontSize: 16,
    fontStyle: "italic",
    color: "black",
    fontWeight: "300",
    paddingBottom: 5
  },
  textStyle1: {
    fontSize: 16,
    fontStyle: "italic",
    fontWeight: "300",
    paddingBottom: 5,
    color: "black",
  }
};
