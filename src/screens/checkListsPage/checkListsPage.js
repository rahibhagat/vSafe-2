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
    Toast, Card, CardItem, CheckBox
} from 'native-base';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ChatBot from 'react-native-chatbot';
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import AsyncStorage from '@react-native-community/async-storage';
import {
    BackHandler, View, FlatList, TouchableOpacity,
    ImageBackground, Dimensions, Alert, Modal, TextInput, Image, KeyboardAvoidingView
    , Platform
} from 'react-native';
import { SafeAreaProvider,SafeAreaView } from "react-native-safe-area-context";
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

//#endregion

//#region Abhisi imports
import styles from './styles';
import CheckBoxQuestionsOptions from '../bodyAssessmentPage/checkBoxQuestionsOptions';
import CheckBoxQuestions from '../bodyAssessmentPage/checkBoxQuestions';
import SubmitButton from '../bodyAssessmentPage/submitButton';
import AnswerButtonYes from "../bodyAssessmentPage/answerButtonYes";
import AnswerButtonNo from "../bodyAssessmentPage/answerButtonNo";
import {
    loadUserListRequested,
    assignUserRequested,
    assignUserRequestedforCompose, setUserReport
} from '../../actions/testBodyReportPageActions';
import { getCheckLists,selectedCheckListId,hideSnackBar } from '../../actions/checkListsPageActions';
import { getSelectedCheckList } from "../../actions/bodyAssessmentPageActions";
import { setImageUrlForConversation, getStatusText, convertTimeToCompanyTimezone, gettagnameforselectedfilter, setconversationtypefromselectedfilterfilterby } from "../../utility"
import * as Animatable from 'react-native-animatable';
import SpinnerOverlay from './spinnerOverlay';
import SnackBar from "../bodyAssessmentPage/snackBar";

const HTTP_CHECK = /^https:\/\//
const checklistJson = require('../bodyAssessmentPage/checklist.json');
const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

//#endregion

class CheckListsPage extends PureComponent {
    //#region Constructor
    constructor(props) {
        super(props);
        // Hardware back button
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.array = [],
            this.array1 = [],
            this.state = {
                showUserReport: false,
                checkListSteps: [],
                checkListTriggerSteps: [],
                noteText: "",
                visibleNoteModal: false
            }
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
        //This will load the users for the Mailbox to which the Conversation Belongs to.
        // this.props.loadUserListRequested();
    }

    componentDidMount() {
        this.props.getCheckLists()
        this.addSelecteDFieldForCheckbox(checklistJson.questions)
        var array = [checklistJson.questions[0]];
        this.setState({ checkListSteps: array });
        // to assign new array of answered questions to checklistSteps after user selects options from rendered qustions or to render new questions
        this.array = array;
        // using to push each new question to this.array 
        this.array1 = checklistJson.questions;
    }

    addSelecteDFieldForCheckbox(questionsList) {
        var newQuestionsList = []
        for (var i = 0; i < questionsList.length; i++) {
            for (var j = 0; j < questionsList[i].checklistQuestionMultiOptions.length; j++) {
                questionsList[i].checklistQuestionMultiOptions[j].selected = false;
            }
            newQuestionsList.push(questionsList[i]);
        }
        return newQuestionsList;
    }
    // using to reset AssignPage
    componentWillUnmount() {
        BackHandler.removeEventListener(
            'hardwareBackPress',
            this.handleBackButtonClick,
        );
    }
    // using to reset AssignPage
    handleBackButtonClick() {
        this.props.navigation.navigate(
            this.props.navigation.state.params.previousRoute,
        );
        return true;
    }

    updateCheckBoxValue = (checked, selectedValue, stepId, optionId) => {
        var newcheckList = this.array1[stepId]
        var value1 = false;
        if (newcheckList !== undefined) {
            var value = this.array.map((s, i) => {
                if (s.step == stepId + 1) {
                    value1 = true;
                    return true;
                }
            })
            if (value1 == true) {
                // this.array1[stepId + 1].answerYes = <AnswerButtonYes/>
                // this.array1[stepId + ].answerYes = <AnswerButtonYes/>
                for (var i = stepId; i < this.array.length; i++) {
                    this.array1[i].button = <SubmitButton />
                }
                var value4 = this.array.slice(0, stepId)
                value4[stepId - 1].button = <SubmitButton />
                if (selectedValue == "No") {
                    value4[stepId - 1].answerYes = <AnswerButtonYes stepId={stepId} value={'Yes'} checked={false} changeCheckBoxValue={this.updateCheckBoxValue} />;
                    value4[stepId - 1].answerNo = <AnswerButtonNo stepId={stepId} value={'No'} checked={true} changeCheckBoxValue={this.updateCheckBoxValue} />;
                }
                else {
                    value4[stepId - 1].answerYes = <AnswerButtonYes stepId={stepId} value={'Yes'} checked={true} changeCheckBoxValue={this.updateCheckBoxValue} />;
                    value4[stepId - 1].answerNo = <AnswerButtonNo stepId={stepId} value={'No'} checked={false} changeCheckBoxValue={this.updateCheckBoxValue} />;
                }
                this.array = []
                this.array = value4;
            }
            else {
                if (selectedValue == "No") {
                    delete this.array[stepId - 1].button
                }
                if (selectedValue == "No") {
                    this.array[stepId - 1].answerYes = <AnswerButtonYes stepId={stepId} value={'Yes'} checked={false} changeCheckBoxValue={this.updateCheckBoxValue} />;
                    this.array[stepId - 1].answerNo = <AnswerButtonNo stepId={stepId} value={'No'} checked={true} changeCheckBoxValue={this.updateCheckBoxValue} />;
                }
                else {
                    this.array[stepId - 1].answerYes = <AnswerButtonYes stepId={stepId} value={'Yes'} checked={true} changeCheckBoxValue={this.updateCheckBoxValue} />;
                    this.array[stepId - 1].answerNo = <AnswerButtonNo stepId={stepId} value={'No'} checked={false} changeCheckBoxValue={this.updateCheckBoxValue} />;
                }
                if (selectedValue == "No") {
                    this.array.push(newcheckList)
                    setTimeout(() => {
                        this.flatListRef.scrollToIndex({ animated: true, index: stepId, viewPosition: 0.5 })
                    }, 500);
                }
            }

            this.setState({ checkListSteps: [...this.array] })
            console.log(this.state.checkListTriggerSteps)
        }
    }
    setUserRecord(riskLevel, Note, color) {
        var userrecord = {
            companyName: this.props.company.companyName,
            userName: this.props.user.userName,
            userEmail: this.props.user.userEmail,
            lastaccessedOn: convertTimeToCompanyTimezone(new Date(), this.props.company),
            userRiskLevel: riskLevel,
            note: Note,
            color: color
        }
        console.warn(userrecord)

        this.props.setUserReport(userrecord)
        setTimeout(() => {
            this.setState({ showUserReport: true })
        }, 4000)

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

    moveToNextQuestion(item, selectedOption, index) {
        var value1 = false;
        var newcheckList = this.array1[index + 1]
        this.array[index].checklistQuestionMultiOptions.map((s, i) => {
            if (s.id !== selectedOption.id) {
                s.selected = false
            }
            else {
                s.selected = true
            }
            return s;
        })
        var value = this.array.map((s, i) => {
            if (i == index + 1) {
                value1 = true;
                return true;
            }
        })
        setTimeout(() => {
            this.flatListRef.scrollToIndex({ animated: true, index: index, viewPosition: 0 })
        }, 500);
        if (value1 == true) {
            var value4 = this.array.slice(0, index + 1)
            this.array = []
            this.array = value4;
            // setTimeout(() => {
            //     Alert.alert(
            //         Alert,
            //         selectedOption.name,
            //         [
            //             {
            //                 text: 'OK', onPress: () => {
            //                     console.log('Yes')
            //                     this.setState({ visibleNoteModal: true })
            //                 }
            //             },
            //             { text: 'No', onPress: () => console.log('No') }
            //         ]

            //     )

            // }, 1500);
        }
        else {
            if (item.terminateOnError == false) {
                if (selectedOption.type == 1) {
                    if (newcheckList !== undefined) {
                        this.array.push(newcheckList)
                    }
                }
                else {
                    // Alert.alert(
                    //     Alert,
                    //     selectedOption.name,
                    //     [
                    //         {
                    //             text: 'OK', onPress: () => {
                    //                 console.log('Yes')
                    //                 this.setState({ visibleNoteModal: true })
                    //             }
                    //         },
                    //         { text: 'No', onPress: () => console.log('No') }
                    //     ]

                    // )
                }
            }
            else {
                // Alert.alert(
                //     Alert,
                //     selectedOption.name,
                //     [
                //         {
                //             text: 'OK', onPress: () => {
                //                 console.log('Yes')
                //                 this.setState({ visibleNoteModal: true })
                //             }
                //         },
                //         { text: 'No', onPress: () => console.log('No') }
                //     ]

                // )
            }
        }
        this.setState({ checkListSteps: [...this.array] })
    }

    renderItem(item, index) {
        return (
            <TouchableOpacity style={{flex:1,flexDirection:'row',padding:10}} onPress={()=>{
                this.props.selectedCheckListId(item.id);
                this.props.getSelectedCheckList(item.id);
                this.props.navigation.navigate('BodyAssessmentPage',{selectedCheckListName:item.name});
            }}>
             <Card style={{flex:1,flexDirection:'row'}}>
             <CardItem style={{flex:0.1,flexDirection:'column',backgroundColor:this.props.primaryColor}}><Text style={{color:'white'}}>{index + 1}.</Text></CardItem>
             <CardItem style={{flex:0.8,flexDirection:'column',alignItems:'flex-start'}}><Text>{item.name}</Text></CardItem>
             <CardItem style={{flex:0.1,flexDirection:'row',alignItems:'flex-end',justifyContent:'flex-end'}}><MaterialCommunityIcons name="chevron-right" size={20} /></CardItem>
             </Card>
            </TouchableOpacity>
            );
    }

    //Loads more conversation as user scrolls down
    loadMoreQuestion = (event) => {
        let scrollHeight = Math.floor(event.nativeEvent.contentOffset.y + event.nativeEvent.layoutMeasurement.height);
        if (scrollHeight == Math.floor(event.nativeEvent.contentSize.height)) {
            this.setState({ scrollheight: scrollHeight })
            console.log(scrollHeight);
        }
    }

    renderCheckList() {
        return (
            <FlatList
                ref={(ref) => { this.flatListRef = ref; }}
                data={this.state.checkListSteps}
                renderItem={({ item, index }) => this.renderItem(item, index)}
                onScroll={this.loadMoreQuestion}
                keyExtractor={item => {
                    return item.id.toString()
                }}
                extraData={this.state.checkListSteps}
            />
        )
    }


    renderTitle() {
        if (this.props.conversation.conversationType !== undefined) {
            return <Title>Assign</Title>;
        }
    }
    getuserreport = () => {
        this.setState({ showUserReport: true })
    }
    setAsyncStorageUserReport() {
        if (this.props.userreport !== undefined) {
            AsyncStorage.setItem('userreport', JSON.stringify(this.props.userreport));
        }
    }
    getUserReport = async () => {
        try {
            let user = await AsyncStorage.getItem('userreport');
            let parsed = JSON.parse(user);
            if (parsed !== null) {
                this.props.setUserReport(parsed)
            }

        }
        catch (error) {
            alert(error)
        }
    }
    showhideuserreport = (value) => {
        this.setState({ showUserReport: value })
    }
    showUserReport() {
        this.setAsyncStorageUserReport()
        if (this.state.showUserReport) {
            return (
                <UserReport userreport={this.props.userreport} showuserreport={this.state.showUserReport} showhideUserReport={this.showhideuserreport} />
            )
        }

    }

    renderNoteModal() {
        return (
            <Modal visible={this.state.visibleNoteModal} onRequestClose={() => {
                this.setState({ visibleNoteModal: !this.state.visibleNoteModal })
            }}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Header style={{ backgroundColor: this.props.primaryColor }}>
                        <Left><TouchableOpacity onPress={() => {
                            this.setState({ visibleNoteModal: false })
                        }}><MaterialCommunityIcons name="close" size={25} style={{ color: 'white' }} /></TouchableOpacity></Left>
                        <Body style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Title>Add Note</Title>
                        </Body>
                        <Right style={{ flex: 0.3, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        </Right>
                    </Header>
                    <View style={{ flex: 0.5, flexDirection: "row", alignItems: 'flex-start', paddingTop: 50, justifyContent: "center" }}>
                        <TextInput placeholder="Add Note Here..." style={{ borderWidth: 1, width: deviceWidth / 1.3, padding: 10 }} value={this.state.noteText} onChangeText={(text) => {
                            this.setState({ noteText: text })
                        }} />
                    </View>
                    <View style={{ flex: 0.5, flexDirection: "row", alignItems: 'flex-end', paddingBottom: 30, justifyContent: 'center' }}>
                        <View style={{ flex: 0.2 }}></View>
                        <View style={{ flex: 0.5 }}>
                            <Button rounded block><Text>Save Note</Text></Button>
                        </View>
                        <View style={{ flex: 0.2 }}></View>
                    </View>
                </View>
            </Modal>
        )
    }

    DisplaySnackBar = () => {
        if(this.props.showSnackBar) {
            setTimeout(()=>{
                this.ReactNativeSnackBar.ShowSnackBarFunction(this.props.snackBarMessage);
                // this.props.hideSnackBar();
            },500)
        }
        else {

        }
      };
    render() {
        return (
            <SafeAreaView style={{flex:1,backgroundColor:this.props.primaryColor}} edges={['top']}>
            <Container style={{backgroundColor: "#FFF"}}>
                <View transparent={true} style={{ backgroundColor: 'white', height: 80, elevation: 5, flexDirection: 'row' }}>
                <Left style={{ flex: 0.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <View>
                    <TouchableOpacity onPress={()=>{
                        this.props.navigation.goBack()
                    }}><FontAwesome name="chevron-left" size={25} /></TouchableOpacity>
                    </View> 
                </Left>   
                <Body style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 0 }}>   
                    <View style={{ flexDirection: 'column' }}>
                            <Title style={{ fontWeight: 'bold', fontSize: 22, color: 'black', paddingLeft: 15 }}>CheckLists</Title>
                        </View>
                    </Body>
                    <Right style={{ flex: 0.3, flexDirection: 'row', justifyContent: 'center', paddingTop: 20 }}>
                    </Right>
                </View>
                {this.props.configuredCheckList !== undefined ? 
                    <FlatList
                ref={(ref) => { this.flatListRef = ref; }}
                data={this.props.configuredCheckList}
                renderItem={({ item, index }) => this.renderItem(item, index)}
                onScroll={this.loadMoreQuestion}
                keyExtractor={item => {
                    return item.id.toString()
                }}
                extraData={this.props.configuredCheckList}
            /> : <SpinnerOverlay visiblespinner={true}/> }
            {this.props.showSpinnerToSubmitHealtAssesmentReport ? <SpinnerOverlay visiblespinner={true}/> :<SpinnerOverlay visiblespinner={false}/> }
            {
            //     <SnackBar ref={(ref)=>{this.ReactNativeSnackBar = ref; }} />
            // {this.DisplaySnackBar()}
        }
            </Container>
            </SafeAreaView>
        );
    }
    //#endregion
}

//#region Map State and Dispatch region
function mapStateToProps(state) {
  const { configuredCheckList,selectedCheckListId,showSnackBar,snackBarMessage } = state.checkListsPage;
  const { selectedCheckList,showSpinnerToSubmitHealtAssesmentReport } = state.bodyAssessmentPage;
  const { primaryColor } = state.dashBoardPage;
  const { selectedLanguageFile } = state.settingsPage;
    // const { user, company } = state.login;
    return {
        // users,
        // showSpinnerAssign,
        // user, company, userreport,
        configuredCheckList,
        selectedCheckListId,
        selectedCheckList,showSpinnerToSubmitHealtAssesmentReport,
        showSnackBar,snackBarMessage,primaryColor,selectedLanguageFile
    };
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            loadUserListRequested: loadUserListRequested,
            assignUserRequested: assignUserRequested,
            assignUserRequestedforCompose: assignUserRequestedforCompose,
            setUserReport: setUserReport,
            getCheckLists:getCheckLists,
            selectedCheckListId:selectedCheckListId,
            getSelectedCheckList:getSelectedCheckList,
            hideSnackBar:hideSnackBar
        },
        dispatch,
    );
}
//#endregion

export default connect(
    mapStateToProps,
    matchDispatchToProps,
)(CheckListsPage);
