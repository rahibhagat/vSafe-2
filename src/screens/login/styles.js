const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  imageContainer: {
    flex: 1,
    width: null,
    height: null,
    flexDirection:'column',
    backgroundColor:'white'
  },
  logoContainer: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center'
    // marginTop: deviceHeight / 8,
    // marginBottom: deviceHeight / 6,
    // marginLeft:deviceWidth/10,
    // marginRight:deviceWidth/10,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 90,
    width: 90,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    flexDirection:'column',
    justifyContent: 'space-around'
  },
  logoContainerSmall: {
    flex: 0.5,
    flexDirection:'row',
    alignItems:'flex-start',
    justifyContent:'center',
    
  },
  logoSmall:{
    width: 120,
    height: 120
  },
  logo: {
    // position: "absolute",
    // left: Platform.OS === "android" ? 40 : 50,
    // top: Platform.OS === "android" ? 35 : 60,
    width: deviceWidth/1.5,
    height: deviceHeight/3.5
  },
  text: {
    color: "#D8D8D8",
    bottom: 6,
    marginTop: 5
  },
  errorText: {
    fontSize: 20, 
    alignSelf: 'center', 
    color: 'red'
  }
};
