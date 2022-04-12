const React = require("react-native");
import { StyleSheet } from "react-native"
const { Platform, Dimensions } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const styles = StyleSheet.create({
    checklistQuestionMultiOptions : {
        flexDirection:'row',alignItems:'flex-start',
        maxWidth:deviceWidth / 1.2
    },
    FlexGrowOne: {
        flexGrow : 1
    },
    FlexOne: {
        flex : 1
    },
    TextInputWrapper: {
        flex: 1,
        height: 40,
        margin: 20
    },
    ButtonWrapper: {
        backgroundColor: '#0c85e0',
        borderWidth: 0,
        color: '#FFFFFF',
        flex:1,
        borderColor: '#000',
        alignItems: 'center',
        borderRadius: 5,
        flexDirection:'row',justifyContent:'center'
        // marginLeft: 35,
        // marginRight: 35,
        // // marginTop: 30,
        // marginBottom: 30
    },
    ButtonBackgroundColor: {
        flex:1,
        backgroundColor: 'white',
        paddingLeft:30,
        paddingRight:30,
        borderRadius:3,
        padding:10,
        paddingTop:10,
        paddingBottom:10,
        flexDirection:'row',
        justifyContent:'center',alignItems:'center'
    },
    Shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    SubmitText: {
        color: '#FFFFFF', 
        paddingVertical: 10, 
        fontSize: 16
    },
    filtermodalview : {
        flex: 2,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#00000040',
      
    },
    filteranimatedview : {
        flexDirection:"column",
        backgroundColor: '#FFFFFF',
        flex:0.5,
        width: deviceWidth/ 1.2,
        borderRadius: 10,
      
    },
    filteranimatedview1 : {
      
      backgroundColor: '#FFFFFF',
      height: deviceHeight / 4,
      width: deviceWidth,
      borderRadius: 10,
    
  },
});
export default styles;
