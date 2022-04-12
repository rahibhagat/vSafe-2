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
        // height: 40,
        alignItems: 'center',
        borderRadius: 5,
        // marginLeft: 35,
        // marginRight: 35,
        // // marginTop: 30,
        // marginBottom: 30
    },
    ButtonBackgroundColor: {
        flex:1,
        backgroundColor: '#C7B7E7',
        paddingLeft:30,
        paddingRight:30,
        borderRadius:3,
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
    }
});
export default styles;
