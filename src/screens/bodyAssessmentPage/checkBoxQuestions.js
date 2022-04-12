//#region Third party imports
/* eslint-disable */
import React, { PureComponent } from 'react';
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Icon,
    ListItem,
    Text,
    Left,
    Right,
    Body,
    Spinner,
    List,
    Form,
    Footer,
    Toast, Card, CardItem,
} from 'native-base';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ChatBot from 'react-native-chatbot';
import AsyncStorage from '@react-native-community/async-storage';
import { BackHandler, View, FlatList, TouchableOpacity, ImageBackground,Dimensions } from 'react-native';

//#endregion

//#region Abhisi imports
import styles from './styles';
import {
    loadUserListRequested,
    assignUserRequested,
    assignUserRequestedforCompose, setUserReport
} from '../../actions/testBodyReportPageActions';
import { setImageUrlForConversation, getStatusText, convertTimeToCompanyTimezone, gettagnameforselectedfilter, setconversationtypefromselectedfilterfilterby } from "../../utility"
import { CheckBox } from 'react-native';
const HTTP_CHECK = /^https:\/\//;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

//#endregion

class CheckBoxQuestions extends PureComponent {
    //#region Constructor
    constructor(props) {
        super(props);
        // Hardware back button
    }
    //#endregion

    //#region Other methods
    doProcessingOnUserSelection(selectedUser) {
        if (this.props.conversation.userID == selectedUser.id) {
            // Show that the conversation is already assigned to this user
        }
        // using while creating new conversation..
        else if (this.props.conversation.conversationType !== undefined) {
            this.props.assignUserRequested(selectedUser);
        }
        // using while going to assign to already created conversation
        else {
            this.props.assignUserRequestedforCompose(selectedUser);
        }
    }
    componentWillMount() {
        
    }
    //#endregion

    //#region Render methods
    // using to show which user is assigned
    renderTestChatBot() {
        console.warn(this.props.company)
        return (
            <ChatBot steps={this.state.steps}
                optionBubbleColor={'white'}
                optionFontColor={'black'}
                optionElementStyle={{ paddingLeft: 15 }}
                contentStyle={{ flex: 1, paddingTop: 10 }}
                headerComponent={() => {
                    return (
                        <Text>HIII..USER</Text>
                    )
                }}
            />
        );
    }

    renderItem(item,index) {
        const color = item.connected ? 'green' : '#fff';
        return (
          <View style={{flex:1,flexDirection:'column'}}>
              <View style={{flex:1,flexDirection:'row',padding:15}}>
              <Text>{item.message}</Text>
              </View>    
              <View>{item.options.map((s,i)=>{
                  return s.message;
              })}</View>
          </View>
        );
      }

    render() {
        return (
                <View style={{ flex: 1,flexDirection:'row',width:deviceWidth/ 1.1 }}>
                   <Text style={{fontWeight:'bold'}}>{this.props.question} <Icon name="star-of-life" type="FontAwesome5" style={{color:'red',fontSize:9}}/></Text>
                </View>
        );
    }
    //#endregion
}

//#region Map State and Dispatch region
function mapStateToProps(state) {
    const { users, showSpinnerAssign, userreport } = state.testBodyReportPage;
    const { user, company } = state.login;
    return {
        users,
        showSpinnerAssign,
        user, company, userreport
    };
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            loadUserListRequested: loadUserListRequested,
            assignUserRequested: assignUserRequested,
            assignUserRequestedforCompose: assignUserRequestedforCompose,
            setUserReport: setUserReport
        },
        dispatch,
    );
}
//#endregion

export default CheckBoxQuestions;
