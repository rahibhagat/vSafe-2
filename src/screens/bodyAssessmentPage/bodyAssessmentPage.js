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
    Toast, Card, CardItem
} from 'native-base';
import Moment from 'react-moment';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ChatBot from 'react-native-chatbot';
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import CheckBox from '@react-native-community/checkbox';
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
import CheckBoxQuestionsOptions from './checkBoxQuestionsOptions';
import CheckBoxQuestions from './checkBoxQuestions';
import SubmitButton from './submitButton';
import AnswerButtonYes from "./answerButtonYes";
import AnswerButtonNo from "./answerButtonNo";
import {
    loadUserListRequested,
    assignUserRequested,
    assignUserRequestedforCompose, setUserReport
} from '../../actions/testBodyReportPageActions';
import { getCheckLists } from '../../actions/checkListsPageActions';
import { getSelectedCheckList,resetSelectedCheckList,submitYourReport } from "../../actions/bodyAssessmentPageActions";
import { resetAttemptedReadOnlyCheckList } from "../../actions/healthReportPageActions";
import { setImageUrlForConversation, getStatusText, convertTimeToCompanyTimezone, gettagnameforselectedfilter, setconversationtypefromselectedfilterfilterby,convertToCompanyTimeZone } from "../../utility"
import * as Animatable from 'react-native-animatable';
import SnackBar from './snackBar'
import SpinnerOverlay from '../checkListsPage/spinnerOverlay';

const HTTP_CHECK = /^https:\/\//
const checklistJson = require('./checklist.json');
const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

//#endregion

class BodyAssessmentPage extends PureComponent {
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
                visibleNoteModal: false,
                showModalToSubmitReport:false,
                fetchedCheckListLength:undefined,
                showErrorMessage:false,
                IsDisclaimerTrue:false
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
        // this.props.getSelectedCheckList(this.props.selectedCheckListId);
        // this.addSelecteDFieldForCheckbox(checklistJson.questions)
        // var array = [checklistJson.questions[0]];
        // this.setState({ checkListSteps: array });
        // // to assign new array of answered questions to checklistSteps after user selects options from rendered qustions or to render new questions
        // this.array = array;
        // // using to push each new question to this.array 
        // this.array1 = checklistJson.questions;
    }

    componentDidUpdate(prevProps,prevState) {
        if(this.props.selectedCheckList !== undefined) {
            if(prevProps.selectedCheckList !== this.props.selectedCheckList) {
                this.addSelecteDFieldForCheckbox(this.props.selectedCheckList.checklistQuestions)
                if(this.props.selectedCheckList.checklistQuestions.length > 0) {
                    var array = [this.props.selectedCheckList.checklistQuestions[0]];
                    this.setState({ checkListSteps: array,fetchedCheckListLength:this.props.selectedCheckList.checklistQuestions.length });
                    // to assign new array of answered questions to checklistSteps after user selects options from rendered qustions or to render new questions
                    this.array = array;
                    // // using to push each new question to this.array 
                    this.array1 = this.props.selectedCheckList.checklistQuestions;  
                }
                else {
                    var array = [];
                    this.setState({ checkListSteps: array });
                    // to assign new array of answered questions to checklistSteps after user selects options from rendered qustions or to render new questions
                    this.array = array;
                    // // using to push each new question to this.array 
                    this.array1 = []; 
                    Alert.alert(
                        'Alert',
                        'There is no question exist',
                        [
                            {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                              },
                              { text: "OK", onPress: () =>{
                                this.setState({
                                    showUserReport: false,
                                    checkListSteps: [],
                                    checkListTriggerSteps: [],
                                    noteText: "",
                                    visibleNoteModal: false,
                                    showModalToSubmitReport:false,
                                    showNextButton:false
                                })
                                this.array = [];
                                this.array1 = [];
                                this.props.resetSelectedCheckList()
                                this.props.navigation.navigate('CheckListsPage')
                              }}
                        ]
                    )
                }
  
            }
            else if (prevState.checkListSteps !== this.state.checkListSteps) {
                console.log('SDFSDFSDFSD')
            }

        }
        // this.addSelecteDFieldForCheckbox(checklistJson.questions)
        // var array = [checklistJson.questions[0]];
        // this.setState({ checkListSteps: array });
        // // to assign new array of answered questions to checklistSteps after user selects options from rendered qustions or to render new questions
        // this.array = array;
        // // using to push each new question to this.array 
        // this.array1 = checklistJson.questions;
    }

    addSelecteDFieldForCheckbox(questionsList) {
        var newQuestionsList = []
        if(questionsList !== undefined) {
            for (var i = 0; i < questionsList.length; i++) {
                if(questionsList[i].checklistQuestionMultiOptions !== undefined) {
                    for (var j = 0; j < questionsList[i].checklistQuestionMultiOptions.length; j++) {
                        questionsList[i].checklistQuestionMultiOptions[j].selected = false;
                    }
                }
                newQuestionsList.push(questionsList[i]);
            }
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
        this.props.navigation.navigate('CheckListsPage')
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
        // if(selectedOption.selected) {
        //     if(item.isMultiAnswer) {
        //         this.array
        //         selectedOption.selected = !selectedOption.selected
        //     }
        // }
        // else {
            var value1 = false;
            var newcheckList = this.array1[index + 1]
            if(newcheckList != undefined) {
                if(newcheckList.checklistQuestionMultiOptions.length != undefined) {
                    newcheckList.checklistQuestionMultiOptions.map((s,i)=>{
                        if(s.selected == true) {
                            s.selected = false
                        }
                    })
                }
            }
            var value = this.array.map((s, i) => {
                if (i == index + 1) {
                    value1 = true;
                    return true;
                }
            })
            if(value1 == true) {
                if(item.isMultiAnswer) {

                }
                else {
                    if(selectedOption.selected) {

                    }
                    else {
                        for(var i = index + 1;i < this.array1.length;i ++) {
                            this.array1[i].checklistQuestionMultiOptions.map((s,i)=>{
                                s.selected = false;
                            })
                    }
                    this.array[index].checklistQuestionMultiOptions.map((s, i) => {
                        s.selected = false;
            
                        // else if(s.id !== selectedOption.id) {
                        //     if(selectedOption.type == 2) {
                        //         s.selected = true
                        //     }
                        // }
                        return s;
                    })
                    }
                }
            }
            if(selectedOption.type == 2) {
                this.setState({showErrorMessage:true})
            }
            else {
                this.setState({showErrorMessage:!this.state.showErrorMessage})
            }
            // this.array[index].checklistQuestionMultiOptions.map((s, i) => {
            //     if(item.isMultiAnswer) {

            //     }
            //     else if (selectedOption.selected) {

            //     }
            //     else if(selectedOption.type == 1)  {
            //         if (s.id == selectedOption.id) {
            //             s.selected = !s.selected
            //         }
            //         else {
            //             s.selected = false
            //         }
            //     }
            //     else{
            //         if (s.id == selectedOption.id) {
            //             if(s.type == 1 && s.selected == true){
            //                 s.selected == false
            //             }
            //             else {
            //                 s.selected = !s.selected
            //             }
            //         }
            //     }
    
            //     // else if(s.id !== selectedOption.id) {
            //     //     if(selectedOption.type == 2) {
            //     //         s.selected = true
            //     //     }
            //     // }
            //     return s;
            // })
            setTimeout(() => {
                if(newcheckList !== undefined){
                    this.flatListRef.scrollToIndex({ animated: true, index: index, viewPosition: 0 })
                }
            }, 200);
            if (value1 == true) {
                if (item.terminateOnError == false) {
                    if(item.isMultiAnswer){
                        this.setState({showNextButton:true})
                        if(selectedOption.type == 1) {
                            selectedOption.selected = !selectedOption.selected;
                            item.checklistQuestionMultiOptions.map((s,i)=>{
                                if(s.type == 2) {
                                    s.selected = false
                                }
                            })
                            var value = false;
                            item.checklistQuestionMultiOptions.map((s,i)=>{
                                if(s.selected == true){
                                   value = true;
                                }
                            })
                            if(value == false) {
                                this.setState({showNextButton:false})
                            }
                        }
                        else {
                            selectedOption.selected = !selectedOption.selected;
                            item.checklistQuestionMultiOptions.map((s,i)=>{
                                if(s.type == 1) {
                                    s.selected = false
                                }
                            })
                            var value = false;
                            item.checklistQuestionMultiOptions.map((s,i)=>{
                                if(s.selected == true){
                                   value = true;
                                }
                            })
                            if(value == false) {
                                this.setState({showNextButton:false})
                            }
                        }
                        var value4 = this.array.slice(0, index + 1)
                        value4 = item
                        this.array = []
                        this.array = value4;
                    }
                    else if(selectedOption.selected) {

                    }
                   else if (selectedOption.type == 1) {
                       selectedOption.selected = !selectedOption.selected
                    if (newcheckList !== undefined) {
                        this.array.push(newcheckList)
                        this.setState({showNextButton:false})
                        var value4 = this.array.slice(0, index + 1)
                        this.array = []
                        this.array = value4;
                        this.array.push(newcheckList)
                    }
                    else {
                        this.setState({showNextButton:false})
                    }
                }
                else {
                    selectedOption.selected = !selectedOption.selected
                    if (newcheckList !== undefined) {
                        this.array.push(newcheckList)
                        this.setState({showNextButton:false})
                        var value4 = this.array.slice(0, index + 1)
                        this.array = []
                        this.array = value4;
                        this.array.push(newcheckList)
                    }
                } 
                }
                else if (item.terminateOnError == true) {
                    if(item.isMultiAnswer){
                        this.setState({showNextButton:true})
                        if(selectedOption.type == 1) {
                            selectedOption.selected = !selectedOption.selected;
                            item.checklistQuestionMultiOptions.map((s,i)=>{
                                if(s.type == 2) {
                                    s.selected = false
                                }
                            })
                            var value = false;
                            item.checklistQuestionMultiOptions.map((s,i)=>{
                                if(s.selected == true){
                                   value = true;
                                }
                            })
                            if(value == false) {
                                this.setState({showNextButton:false})
                            }
                        }
                        else {
                            selectedOption.selected = !selectedOption.selected;
                            item.checklistQuestionMultiOptions.map((s,i)=>{
                                if(s.type == 1) {
                                    s.selected = false
                                }
                            })
                            var value = false;
                            item.checklistQuestionMultiOptions.map((s,i)=>{
                                if(s.selected == true){
                                   value = true;
                                }
                            })
                            if(value == false) {
                                this.setState({showNextButton:false})
                            }
                        }
                        var value4 = this.array.slice(0, index + 1)
                        // value4 = [item]
                        this.array = []
                        this.array = value4;
                    }
                    else if(selectedOption.selected) {
                        
                    }
                   else if (selectedOption.type == 1) {
                       selectedOption.selected = !selectedOption.selected
                        if (newcheckList !== undefined) {
                            this.array.push(newcheckList)
                            this.setState({showNextButton:false})
                        }
                        else{
                            this.setState({showModalToSubmitReport:true,showNextButton:false})
                        }
                    }
                    else if(item.isMultiAnswer) {
                        this.setState({showNextButton:true})
                    }
                    else{
                        selectedOption.selected = !selectedOption.selected
                        this.setState({showModalToSubmitReport:true,showNextButton:false})
                    }
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
                    if(item.isMultiAnswer) {
                        this.setState({showNextButton:true})
                        if(selectedOption.type == 1) {
                            selectedOption.selected = !selectedOption.selected;
                            item.checklistQuestionMultiOptions.map((s,i)=>{
                                if(s.type == 2) {
                                    s.selected = false
                                }
                            })
                            var value = false;
                            item.checklistQuestionMultiOptions.map((s,i)=>{
                                if(s.selected == true){
                                   value = true;
                                }
                            })
                            if(value == false) {
                                this.setState({showNextButton:false})
                            }
                        }
                        else {
                            selectedOption.selected = !selectedOption.selected;
                            item.checklistQuestionMultiOptions.map((s,i)=>{
                                if(s.type == 1) {
                                    s.selected = false
                                }
                            })
                            var value = false;
                            item.checklistQuestionMultiOptions.map((s,i)=>{
                                if(s.selected == true){
                                   value = true;
                                }
                            })
                            if(value == false) {
                                this.setState({showNextButton:false})
                            }
                        }
                    }
                   else if (selectedOption.type == 1) {
                    selectedOption.selected = !selectedOption.selected
                        if (newcheckList !== undefined) {
                            this.array.push(newcheckList)
                            this.setState({showNextButton:false})
                        }
                        else {
                            this.setState({showModalToSubmitReport:true,showNextButton:false})
                        }
                    }
                    else {
                        selectedOption.selected = !selectedOption.selected
                        if (newcheckList !== undefined) {
                            this.array.push(newcheckList)
                            this.setState({showNextButton:false})
                        }
                        else {
                            this.setState({showModalToSubmitReport:true,showNextButton:false})
                        }
                    }
                }
                else if (item.terminateOnError == true) {
                        if(item.isMultiAnswer) {
                            this.setState({showNextButton:true})
                            if(selectedOption.type == 1) {
                                selectedOption.selected = !selectedOption.selected;
                                item.checklistQuestionMultiOptions.map((s,i)=>{
                                    if(s.type == 2) {
                                        s.selected = false
                                    }
                                })
                                var value = false;
                                item.checklistQuestionMultiOptions.map((s,i)=>{
                                    if(s.selected == true){
                                       value = true;
                                    }
                                })
                                if(value == false) {
                                    this.setState({showNextButton:false})
                                }
                            }
                            else {
                                selectedOption.selected = !selectedOption.selected;
                                item.checklistQuestionMultiOptions.map((s,i)=>{
                                    if(s.type == 1) {
                                        s.selected = false
                                    }
                                })
                                var value = false;
                                item.checklistQuestionMultiOptions.map((s,i)=>{
                                    if(s.selected == true){
                                       value = true;
                                    }
                                })
                                if(value == false) {
                                    this.setState({showNextButton:false})
                                }
                            }
                        }
                        else if(selectedOption.type == 1){
                            selectedOption.selected = !selectedOption.selected
                            if (newcheckList !== undefined) {
                                this.array.push(newcheckList)
                                this.setState({showNextButton:false})
                            }
                            else{
                                this.setState({showModalToSubmitReport:true,showNextButton:false})
                            }
                        }
                    // else if(item.isMultiAnswer) {
                    //     this.setState({showNextButton:true})
                    // }
                    else{
                        selectedOption.selected = !selectedOption.selected
                        this.setState({showModalToSubmitReport:true,showNextButton:false})
                    }
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
        // }
        
    }

    renderItem(item, index) {
        if(item.name !== undefined) {
            return (
                <Animatable.View useNativeDriver={true} animation="fadeInLeft" style={{ flex: 1, flexDirection: 'column', padding: 15, elevation: 10 }}>
                    <Card style={{ flexDirection: 'column' }}>
                        <CardItem header style={{ backgroundColor: this.props.primaryColor }}>
                            <View style={{ flex: 1, flexDirection: 'row', padding: 5 }}>
                                <View><Text style={{ fontWeight: 'bold', color: 'white' }}>{index + 1}.</Text></View>
                                <View style={{ paddingLeft: 5, }}><Text style={{ fontWeight: 'bold', color: 'white' }}>{item.name}</Text></View>
                            </View>
                        </CardItem>
                        <CardItem cardBody>
                            <View style={{ flex: 1, flexDirection: 'column', paddingLeft: 15, padding: 5 }}>{item.checklistQuestionMultiOptions !== undefined ? item.checklistQuestionMultiOptions.map((s, i) => {
                                return (
                                    <View style={styles.checklistQuestionMultiOptions}>
                                        <View style={{ padding: 5 }}>
                                        {item.isMultiAnswer == true ?
                                        <CheckBox value={s.selected} style={{borderRadius: 2}} onValueChange={()=>{
                                            this.moveToNextQuestion(item, s, index)
                                        }}/>
                                            // <TouchableOpacity onPress={() => {
                                            //     this.moveToNextQuestion(item, s, index)
                                            // }}>
                                            // {/* {s.selected ?
                                            //     <View style={{height:22,width:22,borderWidth:1,borderRadius:0,borderColor:this.props.primaryColor,backgroundColor:this.props.primaryColor,flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}>
                                            // <View style={{bottom:5,right:3}}><MaterialCommunityIcons name="check" size={26} style={{color:'white'}}/></View>
                                            // </View> 
                                            // : 
                                            // <View style={{height:22,width:22,borderWidth:1,borderRadius:0,borderColor:this.props.primaryColor}}>
                                            // </View>
                                            // } */}
                                            // </TouchableOpacity>
                                             : <TouchableOpacity onPress={() => {
                                                this.moveToNextQuestion(item, s, index)
                                            }}>
                                            <View style={{borderWidth:1,borderRadius:50,height: 24,
                                                width: 24,borderColor: this.props.primaryColor,
                                                alignItems: 'center',
                                                justifyContent: 'center',}}>
                                                {s.selected ?<View style={{
                                                    height: 12,
                                                    width: 12,
                                                    borderRadius: 6,
                                                    backgroundColor: this.props.primaryColor,
                                                  }}/>: null}
                                                </View>
                                            </TouchableOpacity> 
                                            }
                                            
                                        </View>
                                        <View style={{flex:1,paddingLeft:15}}>
                                            <Text style={{ color: 'black', fontSize: 15 }}>{s.name}</Text>
                                        </View>
                                    </View>
                                )
                            }) : null}</View>
    
                        </CardItem>
                        </Card>
                </Animatable.View>
            );
        }
    }

    renderReadOnlyCheckListItem(item,index) {
        if(item.name !== undefined) {
            return (
                <Animatable.View useNativeDriver={true} animation="fadeInLeft" style={{ flex: 1, flexDirection: 'column', padding: 15, elevation: 10 }}>
                    <Card style={{ flexDirection: 'column' }}>
                        <CardItem header style={{ backgroundColor: this.props.primaryColor }}>
                            <View style={{ flex: 1, flexDirection: 'row', padding: 5 }}>
                                <View><Text style={{ fontWeight: 'bold', color: 'white' }}>{index + 1}.</Text></View>
                                <View style={{ paddingLeft: 5, }}><Text style={{ fontWeight: 'bold', color: 'white' }}>{item.name}</Text></View>
                            </View>
                        </CardItem>
                        <CardItem cardBody>
                            <View style={{ flex: 1, flexDirection: 'column', paddingLeft: 15, padding: 5 }}>{item.checklistQuestionMultiOptions !== undefined ? item.checklistQuestionMultiOptions.map((s, i) => {
                                return (
                                    <View style={styles.checklistQuestionMultiOptions}>
                                        <View style={{ padding: 5 }}>
                                        {item.isMultiAnswer == true ?
                                        <CheckBox value={s.selected} style={{borderRadius: 2}}/>
                                            // <TouchableOpacity onPress={() => {
                                            // }}>
                                            // {s.selected ?
                                            //     <View style={{height:22,width:22,borderWidth:1,borderRadius:0,borderColor:this.props.primaryColor,backgroundColor:this.props.primaryColor,flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}>
                                            // <View style={{bottom:5,right:3}}><MaterialCommunityIcons name="check" size={26} style={{color:'white'}}/></View>
                                            // </View> : <View style={{height:22,width:22,borderWidth:1,borderRadius:0,borderColor:this.props.primaryColor}}>
                                            // </View>}
                                            // </TouchableOpacity>
                                             : <TouchableOpacity onPress={() => {
                                            }}>
                                            <View style={{borderWidth:1,borderRadius:50,height: 24,
                                                width: 24,borderColor: this.props.primaryColor,
                                                alignItems: 'center',
                                                justifyContent: 'center',}}>
                                                {s.selected ?<View style={{
                                                    height: 12,
                                                    width: 12,
                                                    borderRadius: 6,
                                                    backgroundColor: this.props.primaryColor,
                                                  }}/>: null}
                                                </View>
                                            </TouchableOpacity> }
                                            
                                        </View>
                                        <View style={{flex:1,paddingLeft:15}}>
                                            <Text style={{ color: 'black', fontSize: 15 }}>{s.name}</Text>
                                        </View>
                                    </View>
                                )
                            }) : null}</View>
    
                        </CardItem>
                        </Card>
                </Animatable.View>
            );
        }
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
        if(this.state.checkListSteps.length > 0) {
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
        else if(this.props.attemptedReadOnlyCheckList !== undefined) {
            return (
            <FlatList
            ref={(ref) => { this.flatListRef = ref; }}
            data={this.props.attemptedReadOnlyCheckList.checklistQuestions}
            renderItem={({ item, index }) => this.renderReadOnlyCheckListItem(item, index)}
            ListFooterComponent={({})=>{
                return (
                    <View style={{padding:15}}>
                    <Card style={{ borderRadius: 5, padding: 15 }}>
                    <CardItem header style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 0.2 }}><Image source={require('../../../assets/clipboard.png')} style={{ width: 50, height: 50 }} /></View>
                      <View style={{ flex: 0.7, alignItems: 'center', flexDirection: 'row' }}><Text style={{ fontWeight: '900', fontSize: 25 }}>Note</Text></View>
                    </CardItem>
                    <CardItem cardBody style={{ flexDirection: 'column', padding: 10 }}>
                      <View style={{ alignSelf: 'stretch',paddingLeft: 15 }}>
                      <Text style={{fontSize:15}}>{this.props.selectedHealthAssesmentRecord.notes}</Text>
                      </View>
                    </CardItem>
                  </Card>
                  </View>
                    )}}
            onScroll={this.loadMoreQuestion}
            keyExtractor={item => {
                return item.id.toString()
            }}
            extraData={this.state.checkListSteps}
        />
            )}
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

    DisplaySnackBar = () => {
        this.ReactNativeSnackBar.ShowSnackBarFunction("Submitted Successfully");
      };

    renderNoteModal() {
        var lastCheckListQuestion = this.state.checkListSteps[this.state.checkListSteps.length -1]
        if(lastCheckListQuestion !== undefined) {
            return (
                <Modal transparent={true} visible={this.state.showModalToSubmitReport} onRequestClose={() => {
                    this.setState({ showModalToSubmitReport: !this.state.showModalToSubmitReport })
                }}>
                    <View  style={{flex:0.1,padding:10,flexDirection:'column',alignItems:'flex-end',justifyContent:'flex-end',backgroundColor:'#00000040'}}>
                    <TouchableOpacity onPress={()=>{
                        this.setState({
                            checkListSteps: [],
                            checkListTriggerSteps: [],
                            noteText: "",
                            visibleNoteModal: false,
                            showModalToSubmitReport:false,
                            showNextButton:false
                        })
                        this.array = [];
                        this.array1 = [];
                        this.props.resetSelectedCheckList()
                        this.props.navigation.goBack()
                    }}><MaterialCommunityIcons name="close" size={25} style={{color:'white'}}/></TouchableOpacity>
                    </View>
                    <KeyboardAvoidingView style={styles.filtermodalview}>
                    <View style={styles.filteranimatedview}>
                    {
                //         <CardItem cardBody style={{ flex: 1, flexDirection: 'column',alignItems:'stretch' }}>
                //     <Image source={require('../../../assets/warning.png')} style={{
                //       flex:1,resizeMode:'stretch',width:null
                //     }} />
                //   </CardItem>
        }
                    <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',padding:5,paddingTop:20}}>
                    <View style={{ flex: 0.2,flexDirection:'row',justifyContent:'center',alignItems:'center' }}><Image source={require('../../../assets/icon_symptoms.png')} style={{ width: 30, height: 30 }} /></View>
                    {lastCheckListQuestion.errorMessage !== "" ?
                    <View style={{flex:0.8,flexDirection:'row',justifyContent:'center',alignItems:'center'}}><Text style={{fontSize: 15,color:"red"}}>{lastCheckListQuestion.errorMessage}</Text></View>: <View style={{flex:0.8,flexDirection:'row',justifyContent:'center',alignItems:'center'}}><Text style={{fontSize: 15}}>Error Message Will display here</Text></View> }
                    </View>
                    <View style={{flex:0.5,flexDirection: "row", alignItems: 'flex-start', paddingTop: 50, justifyContent: "center" }}>
                            <TextInput placeholder="Add Note Here..." placeholderTextColor="lightgray" style={{ color:"black",borderWidth: 0,borderBottomWidth:1, width: deviceWidth / 1.3, padding: 10 }} value={this.state.noteText} onChangeText={(text) => {
                                this.setState({ noteText: text })
                            }} />
                        </View>
                        <View style={{flex:1, flexDirection: 'row',justifyContent:'space-evenly',paddingLeft:2,paddingRight:0 }}>
              <View style={{ flex: 0.2, flexDirection: 'row', alignItems: 'center',justifyContent:'center' }}>
                {/* <CheckBox   checked={this.state.IsDisclaimerTrue} color="gray" style={{ borderRadius: 2 }} onPress={()=>{
                    this.setState({IsDisclaimerTrue:!this.state.IsDisclaimerTrue})
                }} /> */}
                <View style={{alignItems:'center'}}>
                <CheckBox value={this.state.IsDisclaimerTrue} style={{borderRadius: 2}} onValueChange={()=>{
                    this.setState({IsDisclaimerTrue:!this.state.IsDisclaimerTrue})
                }}/>
                </View>
              </View>
              <View style={{ flex: 1, flexDirection: 'row',alignItems: 'center',justifyContent:'center' }}><Text numberOfLines={6} style={{ fontSize: 15 }}>I certify that the imformation submitted in this report is true and correct to the best of my knowledge.</Text>
              </View>
            </View>
                    <View style={{ flex: 0.5, flexDirection: "column",justifyContent:"space-evenly",padding:10, }}>
                            <View style={{ flex: 1,paddingLeft:10,paddingRight:10 }}>
                            <TouchableOpacity disabled={this.state.IsDisclaimerTrue ? false : true} style={[styles.ButtonWrapper, styles.Shadow]}
                                activeOpacity={0.5}
                                onPress={() =>{
                                    this.props.submitYourReport(this.state.checkListSteps,this.state.noteText)
                                    this.setState({
                                        showUserReport: false,
                                        checkListSteps: [],
                                        checkListTriggerSteps: [],
                                        noteText: "",
                                        visibleNoteModal: false,
                                        showModalToSubmitReport:false,
                                        showNextButton:false
                                    })
                                    this.array = [];
                                    this.array1 = [];
                                    this.props.navigation.goBack()
                                }}>
                                <Text style={styles.SubmitText}>SUBMIT YOUR REPORT</Text>
                            </TouchableOpacity>
                        </View>
                            </View>
                            </View>
                    </KeyboardAvoidingView>
                </Modal>
            )
        }
    }

    checkGivenAnswer () {
        var lastAttainedQuestion = this.state.checkListSteps[this.state.checkListSteps.length -1]
        var positiveAns = false;
        var negativeAns = false;
        lastAttainedQuestion.checklistQuestionMultiOptions.map((s,i)=>{
            if(s.selected == true) {
                if(s.type == 1) {
                    positiveAns = true
                }
                else {
                    negativeAns = true;
                }
            }
        })
        if(positiveAns == true) {
            setTimeout(() => {
                this.flatListRef.scrollToIndex({ animated: true, index: this.state.checkListSteps.length -1, viewPosition: 0 })
            }, 400);
            var newQues = this.array1[this.state.checkListSteps.length]
            this.array.push(newQues)
            this.setState({ checkListSteps: [...this.array],showNextButton:false })
        }
        else {
            this.setState({showModalToSubmitReport:true,showNextButton:false})
        }
    }

    getLastAssesmentDate(lastAssesmentDate) {
        var date = new Date(lastAssesmentDate)
        var day = date.getTimezoneOffset() * 60000;
        date.setTime(date.getTime() - day);
        var finalTime = moment(date).format("MMMM Do YYYY, h:mm a");
        return finalTime;
    }

    getSelectedHealthAssesmentStatus() {
        var Icon = this.props.navigation.state.params.status == 1 ? <AntDesign name="checkcircle" size={20} style={{ color: 'green' }} /> : <AntDesign name="closecircle" size={20} style={{ color: 'red' }} /> ;
      return (
          <View><AntDesign name="checkcircle" size={20} style={{ color: 'green' }} /></View>
      )
    }
    render() {
        return (
            <SafeAreaView style={{flex:1,backgroundColor:this.props.primaryColor}} edges={['top']}>
            <Container style={{backgroundColor: "#FFF"}}>
                <View transparent={true} style={{backgroundColor: 'white', height: 80, elevation: 5, flexDirection: 'row' }}>
                <Left style={{ flex: 0.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <View><TouchableOpacity onPress={()=>{
                    this.setState({
                        showUserReport: false,
                        checkListSteps: [],
                        checkListTriggerSteps: [],
                        noteText: "",
                        visibleNoteModal: false,
                        showModalToSubmitReport:false,
                        showNextButton:false
                    })
                    this.array = [];
                    this.array1 = [];
                    this.props.resetSelectedCheckList()
                    this.props.resetAttemptedReadOnlyCheckList()
                    if(this.props.navigation.state.params.previousRoute == "DashBoardPage") {
                        this.props.navigation.navigate("DashBoardPage")
                        this.props.navigation.state.params.previousRoute = undefined
                    }
                    else if(this.props.navigation.state.params.previousRoute == "HealthReportPage") {
                        this.props.navigation.navigate("HealthReportPage")
                        this.props.navigation.state.params.previousRoute = undefined
                    }
                    else {
                        if(this.props.navigation.state.params.onle1CheckList == true) {
                            if(this.props.savedPath == "DashBoardPage") {
                                this.props.navigation.navigate("DashBoardPage")
                                this.props.navigation.state.params.onle1CheckList = undefined
                            }
                            else if(this.props.savedPath == "HealthReportPage") {
                                this.props.navigation.navigate("HealthReportPage")
                                this.props.navigation.state.params.onle1CheckList = undefined
                                
                            }
                        }
                        else {
                            this.props.navigation.goBack()
                        }
                    }
                }}><MaterialCommunityIcons name="close" size={25}/></TouchableOpacity></View>
                </Left>
                    <Body style={{flex:1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'column' }}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                        <View style={{flexDirection:'row'}}>
                        <Title style={{ fontWeight: 'bold', fontSize: 22, color: 'black', paddingLeft: 15 }}>{this.props.navigation.state.params.selectedCheckListName}</Title>
                        </View>
                        {this.props.navigation.state.params.previousRoute == 'DashBoardPage' ?
                        <View style={{
                            paddingLeft:10,
                    }}>{this.props.navigation.state.params.status == 1 ? <AntDesign name="checkcircle"  style={{ color: 'green',fontSize:18 }}/>  : <AntDesign name="closecircle"  style={{ color: 'red',fontSize:18 }}/>}
                    </View> : this.props.navigation.state.params.previousRoute == 'HealthReportPage' ?
                    <View style={{
                        paddingLeft:10,
                }}>{this.props.navigation.state.params.status == 1 ? <AntDesign name="checkcircle"  style={{ color: 'green',fontSize:18 }}/>  : <AntDesign name="closecircle"  style={{ color: 'red',fontSize:18 }}/>}
                </View> : null  }
                        </View>
                            {
                                this.props.navigation.state.params.previousRoute == 'DashBoardPage' ? 
                                <View style={{flexDirection:'row',paddingLeft: 15}}>
                                <Text>{convertToCompanyTimeZone(this.props.navigation.state.params.lastAssesmentDate,this.props.user.account.timeZoneIDStringJS,this.props.user.account.dateFormat,this.props.user.account.is12HRTimeFormat)}</Text></View>
                                : this.props.navigation.state.params.previousRoute == 'HealthReportPage' ? 
                                <View style={{paddingLeft: 15}}><Text>{convertToCompanyTimeZone(this.props.navigation.state.params.lastAssesmentDate,this.props.user.account.timeZoneIDStringJS,this.props.user.account.dateFormat,this.props.user.account.is12HRTimeFormat)}</Text></View>
                                : null }
                        </View>
                    </Body>
                    <Right style={{flex:0.25}}></Right>
                </View>
                <View style={{ flex: 1 }}>
                    {this.renderCheckList()}
                    {this.renderNoteModal()}
                </View>
                {this.state.showNextButton ?<View style={{flex:0.1,paddingRight:12,paddingLeft:12,paddingBottom:10}}>   
                    <View style={[styles.Shadow,{flex:1,paddingLeft:15,paddingRight:15,padding:10,
                        paddingTop:10,
                        paddingBottom:0,}]}>
                <TouchableOpacity style={[styles.ButtonWrapper, styles.Shadow]}
                    activeOpacity={0.5}
                    onPress={() => {
                        this.checkGivenAnswer()
                    }}>
                    <Text style={styles.SubmitText}>NEXT</Text>
                </TouchableOpacity>
            </View>
                </View> : null}
                <SpinnerOverlay visiblespinner={this.props.showVSafeSpinner} />
            </Container>
            </SafeAreaView>
        );
    }
    //#endregion
}

//#region Map State and Dispatch region
function mapStateToProps(state) {
    // const { users, showSpinnerAssign, userreport } = state.testBodyReportPage;
    const { user } = state.login;
    const { selectedHealthAssesmentRecord,showVSafeSpinner } = state.healthReportPage;
    const { selectedCheckList,attemptedReadOnlyCheckList } = state.bodyAssessmentPage;
    const { configuredCheckList,selectedCheckListId } = state.checkListsPage;
    const { primaryColor,savedPath } = state.dashBoardPage;
    const { selectedLanguageFile } = state.settingsPage;
    return {
        // users,
        // showSpinnerAssign,
        user,
        configuredCheckList,
        selectedCheckListId,
        selectedCheckList,
        selectedHealthAssesmentRecord,
        attemptedReadOnlyCheckList,
        primaryColor,
        savedPath,
        showVSafeSpinner,
        selectedLanguageFile
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
            getSelectedCheckList:getSelectedCheckList,
            resetSelectedCheckList:resetSelectedCheckList,
            submitYourReport:submitYourReport,
            resetAttemptedReadOnlyCheckList:resetAttemptedReadOnlyCheckList
        },
        dispatch,
    );
}
//#endregion

export default connect(
    mapStateToProps,
    matchDispatchToProps,
)(BodyAssessmentPage);
