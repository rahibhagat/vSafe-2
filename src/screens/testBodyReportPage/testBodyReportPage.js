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
import { BackHandler, View, FlatList, TouchableOpacity, ImageBackground } from 'react-native';

//#endregion

//#region Abhisi imports
import styles from './styles';
import {
  loadUserListRequested,
  assignUserRequested,
  assignUserRequestedforCompose, setUserReport
} from '../../actions/testBodyReportPageActions';
import { setImageUrlForConversation, getStatusText, convertTimeToCompanyTimezone, gettagnameforselectedfilter, setconversationtypefromselectedfilterfilterby } from "../../utility"
const HTTP_CHECK = /^https:\/\//
const steps = [
  {
    id: '1',
    message: 'Please note that infromation from this chat will be used for monitoring and management of the current health crisis and research in the fight against COVID-19.',
    trigger: '2',
  },
  {
    id: '2',
    message: 'Are you experiencing any of the following symptons?',
    trigger: '3',
  },
  {
    id: '3',
    options: [
      { value: 1, label: 'Cough', trigger: '4' },
      { value: 2, label: 'Fever', trigger: '4' },
      { value: 3, label: 'Difficulty in Breathing', trigger: '4' },
      { value: 4, label: 'None of the Above', trigger: '4' }

    ]
  },
  {
    id: '4',
    message: 'Have you ever had any of the following?',
    trigger: '5'
  },
  {
    id: '5',
    //  message:'Have you ever had any of the following?',
    options: [
      { value: 1, label: 'Diabetes', trigger: '6' },
      { value: 2, label: 'Hypertension', trigger: '6' },
      { value: 3, label: 'Lung disease', trigger: '6' },
      { value: 4, label: 'Heart Disease', trigger: '6' },
      { value: 5, label: 'None of the Above', trigger: '6' }
    ]
  },
  {
    id: '6',
    message: 'Have you traveled anywhere internationally in the last 28-45 days?',
    trigger: '7'
  },
  {
    id: '7',
    options: [
      { value: 1, label: 'Yes', trigger: '8' },
      { value: 2, label: 'No', trigger: '8' }
    ]
  },
  {
    id: '8',
    message: 'Which of the following apply to you?',
    trigger: '13'
  },
  {
    id: '13',
    options: [
      { value: 1, label: 'I have recently interacted or lived with smeone who has tested positive for COVID -19', trigger: '9' },
      { value: 2, label: 'I am healthcare worker and i examined a COVID-19 confirmed case without protective gear', trigger: '9' },
      { value: 3, label: 'None of the above', trigger: '9' }
    ]

  },
  {
    id: '9',
    message: 'Your infection risk is low.We recommended that you stay at hometo avoid any chances of exposure to the Novel Coronavirus.',
    trigger: ({ value, steps }) => {
      if (steps['5'].value !== 5) {
        if (steps['3'].value !== 4) {
          return '14';
        }

      }
      else {
        return '10';
      }
    }
  },
  {
    id: '14',
    component: <View style={{ backgroundColor: "red" }}>
      <CardItem header style={{ backgroundColor: 'red' }}>
        <Text style={{ fontSize: 20, color: 'white' }}>You are not Safe</Text>
      </CardItem>
      <CardItem style={{ backgroundColor: 'red' }}>
        <Body style={{ flexDirection: 'column' }}>
          <Text style={{ fontSize: 20, color: 'white' }}>User: sam</Text>
          <Text style={{ fontSize: 20, color: 'white' }}>Age: 30</Text>
          <Text style={{ fontSize: 20, color: 'white' }}>Add: Vadodara,Gujarat,India</Text>
        </Body>
      </CardItem>
      <CardItem footer style={{ backgroundColor: 'red' }}>
        <Text style={{ fontSize: 20, color: 'white' }}>Thank you</Text>
      </CardItem>
    </View>,
    trigger: 11
  },
  {
    id: '10',
    component: <View style={{ backgroundColor: "green" }}>
      <CardItem header style={{ backgroundColor: 'green' }}>
        <Text style={{ fontSize: 20, color: 'white' }}>You are safe</Text>
      </CardItem>
      <CardItem style={{ backgroundColor: 'green' }}>
        <Body style={{ flexDirection: 'column' }}>
          <Text style={{ fontSize: 20, color: 'white' }}>User: sam</Text>
          <Text style={{ fontSize: 20, color: 'white' }}>Age: 30</Text>
          <Text style={{ fontSize: 20, color: 'white' }}>Add: Vadodara,Gujarat,India</Text>
        </Body>
      </CardItem>
      <CardItem footer style={{ backgroundColor: 'green' }}>
        <Text style={{ fontSize: 20, color: 'white' }}>Thank you</Text>
      </CardItem>
    </View>,
    trigger: 11
  },
  {
    id: '11',
    message: 'Stay Safe , Stay Healthy',
    trigger: '12'
  },
  {
    id: '12',
    message: ({ previousValue, steps }) => 'Bye',
    end: true,
  }


];

//#endregion

class TestBodyReportPage extends PureComponent {
  //#region Constructor
  constructor(props) {
    super(props);
    // Hardware back button
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      steps: [
        {
          id: '1',
          message: 'Please note that infromation from this chat will be used for monitoring and management of the current health crisis and research in the fight against COVID-19.',
          trigger: '2',
        },
        {
          id: '2',
          message: 'Are you experiencing any of the following symptons?',
          trigger: '3',
        },
        {
          id: '3',
          options: [
            { value: 1, label: 'Cough', trigger: '4' },
            { value: 2, label: 'Fever', trigger: '4' },
            { value: 3, label: 'Difficulty in Breathing', trigger: '4' },
            { value: 4, label: 'None of the Above', trigger: '4' }

          ]
        },
        {
          id: '4',
          message: 'Have you ever had any of the following?',
          trigger: '5'
        },
        {
          id: '5',
          //  message:'Have you ever had any of the following?',
          options: [
            { value: 1, label: 'Diabetes', trigger: '6' },
            { value: 2, label: 'Hypertension', trigger: '6' },
            { value: 3, label: 'Lung disease', trigger: '6' },
            { value: 4, label: 'Heart Disease', trigger: '6' },
            { value: 5, label: 'None of the Above', trigger: '6' }
          ]
        },
        {
          id: '6',
          message: 'Have you traveled anywhere internationally in the last 28-45 days?',
          trigger: '7'
        },
        {
          id: '7',
          options: [
            { value: 1, label: 'Yes', trigger: '8' },
            { value: 2, label: 'No', trigger: '8' }
          ]
        },
        {
          id: '8',
          message: 'Which of the following apply to you?',
          trigger: '13'
        },
        {
          id: '13',
          options: [
            { value: 1, label: 'I have recently interacted or lived with smeone who has tested positive for COVID -19', trigger: '9' },
            { value: 2, label: 'I am healthcare worker and i examined a COVID-19 confirmed case without protective gear', trigger: '9' },
            { value: 3, label: 'None of the above', trigger: '9' }
          ]

        },
        {
          id: '9',
          message: 'Your infection risk is low.We recommended that you stay at hometo avoid any chances of exposure to the Novel Coronavirus.',
          trigger: ({ value, steps }) => {
            if (steps['5'].value !== 5 && steps['3'].value !== 4) {
              if (steps['3'].value !== 4) {
                var riskLevel = 'High Risk';
                var Note = 'Please consult to Doctor and report to your supervisor';
                var color = 'red'
                this.setUserRecord(riskLevel, Note, color)
                return '14';
              }

            }
            else if (steps['5'].value !== 5 && steps['3'].value == 4) {
              var riskLevel = 'Moderate Risk';
              var Note = 'Please consult to Doctor';
              var color = 'orange'
              this.setUserRecord(riskLevel, Note, color)
              return '15';
            }
            else if (steps['5'].value == 5 && steps['3'].value !== 4) {
              var riskLevel = 'Moderate Risk';
              var Note = 'Please consult to Doctor';
              var color = 'orange'
              this.setUserRecord(riskLevel, Note, color)
              return '15';
            }
            else {
              var riskLevel = 'No Risk';
              var color = 'green';
              var Note = 'Please maintain social distancing';
              this.setUserRecord(riskLevel, Note, color)
              // this.setState({showUserReport:true})
              return '10';

            }
          }
        },
        {
          id: '15',
          component: <View style={{ backgroundColor: "orange" }}>
            <CardItem header style={{ backgroundColor: 'orange' }}>
              <Text style={{ fontSize: 20, color: 'white' }}>You are at low risk</Text>
            </CardItem>
            <CardItem style={{ backgroundColor: 'orange' }}>
              <Body style={{ flexDirection: 'column' }}>
                <Text style={{ fontSize: 20, color: 'white' }}>User: {this.props.user.userName}</Text>
                <Text style={{ fontSize: 20, color: 'white' }}>Email: {this.props.user.userEmail}</Text>
                <Text style={{ fontSize: 20, color: 'white' }}>Age: 30</Text>
                <Text style={{ fontSize: 20, color: 'white' }}>Add: Vadodara,Gujarat,India</Text>
              </Body>
            </CardItem>
            <CardItem footer style={{ backgroundColor: 'orange' }}>
              <Text style={{ fontSize: 20, color: 'white' }}>Thank you</Text>
            </CardItem>
          </View>,
          trigger: 11
        },
        {
          id: '14',
          component: <View style={{ backgroundColor: "red" }}>
            <CardItem header style={{ backgroundColor: 'red' }}>
              <Text style={{ fontSize: 20, color: 'white' }}>You are not safe</Text>
            </CardItem>
            <CardItem style={{ backgroundColor: 'red' }}>
              <Body style={{ flexDirection: 'column' }}>
                <Text style={{ fontSize: 20, color: 'white' }}>User: {this.props.user.userName}</Text>
                <Text style={{ fontSize: 20, color: 'white' }}>Email: {this.props.user.userEmail}</Text>
                <Text style={{ fontSize: 20, color: 'white' }}>Age: 30</Text>
                <Text style={{ fontSize: 20, color: 'white' }}>Add: Vadodara,Gujarat,India</Text>
              </Body>
            </CardItem>
            <CardItem footer style={{ backgroundColor: 'red' }}>
              <Text style={{ fontSize: 20, color: 'white' }}>Thank you</Text>
            </CardItem>
          </View>,
          trigger: 11
        },
        {
          id: '10',
          component: <View style={{ backgroundColor: "green" }}>
            <CardItem header style={{ backgroundColor: 'green' }}>
              <Text style={{ fontSize: 20, color: 'white' }}>You are safe</Text>
            </CardItem>
            <CardItem style={{ backgroundColor: 'green' }}>
              <Body style={{ flexDirection: 'column' }}>
                <Text style={{ fontSize: 20, color: 'white' }}>User: {this.props.user.userName}</Text>
                <Text style={{ fontSize: 20, color: 'white' }}>Email: {this.props.user.userEmail}</Text>
                <Text style={{ fontSize: 20, color: 'white' }}>Age: 30</Text>
                <Text style={{ fontSize: 20, color: 'white' }}>Add: Vadodara,Gujarat,India</Text>
              </Body>
            </CardItem>
            <CardItem footer style={{ backgroundColor: 'green' }}>
              <Text style={{ fontSize: 20, color: 'white' }}>Thank you</Text>
            </CardItem>
          </View>,
          trigger: 11
        },
        {
          id: '11',
          message: 'Stay Safe , Stay Healthy',
          trigger: '12'
        },
        {
          id: '12',
          message: ({ previousValue, steps }) => 'Bye',
          end: true,
        }


      ],
      showUserReport: false
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
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
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
  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left style={{ flexDirection: 'row' }}>
            <Button transparent onPress={() => {
              this.props.navigation.navigate('ConversationList')
            }}>
              <Icon type='Ionicons' name='ios-arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Test Board</Title>
          </Body>
          <Right><Button transparent onPress={
            this.getuserreport
          }><Text>show report</Text></Button></Right>
        </Header>
        <View style={{ flex: 1 }}>
          {this.renderTestChatBot()}
          {this.showUserReport()}
        </View>
      </Container>
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

export default connect(
  mapStateToProps,
  matchDispatchToProps,
)(TestBodyReportPage);
