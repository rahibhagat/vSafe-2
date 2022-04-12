export const bleScannedDevicesList = 
    {
        deviceName: '',
        deviceAddress: '',
        rssi: 0,
        serviceUUID:'',
        userGUID:'',
        deviceType:0
    }

export const snackBarMessages = {
    updatePassSuccess:'Password has been Updated Successfully',
    updatePassFail: 'Please Enter Correct Old Password',
    resetPassSuccess: 'Password has been Reset Successfully',
    resetPassFail: 'Please Enter Registered User Name'
}
export const userRole = 
    {
        Normal: 0,
        Admin: 1,
        Owner: 2
    }

export const sidebarListEnum =
{
    All: 0,
    Mine: 1,
    Unassigned: 2,
    Closed: 3,
    Spam: 4,
    Unread: 5, // use for unread conversation.
    Team: 6
}
export const defaultFilter = {
    filterby:'All',orderby:'newest'
}
export const timeFormatEnum = {
    _12Hour: 0,
    _24Hour: 1
}
export const messageType =
{
    Message : 0,
        Draft : 1,
        Note : 2, 
        Twitter : 3,
        FacebookPost : 4,
        FacebookMessage : 5,
        Chat : 6,
        Call : 7,
        LineMessage : 8,
        TwilioSMS : 9,
        InternalTwilioSms : 10,
        ThreeCXCall : 11,
        PlivoInboundCall : 12,
        PlivoOutboundCall : 13,
        FreshdeskTicket : 14,
        LineExt : 15
}
export const conversationType =
    {
        InternalMail: 0,
        ExternalMail: 1,
        Call: 2,
        Twitter: 3,
        FacebookPost: 4,
        FacebookMessage: 5,
        Chat: 6,
        InternalLineConv: 7,
        ExternalLineConv: 8,
        TwilioSMS: 9,
        InternalTwilioSms: 10,
        ThreeCXCall: 11,
        PlivoInboundCall: 12,
        PlivoOutboundCall: 13,
        FreshdeskTicket: 14,
        LineExt: 15,
        // This is a virtual conversation type used to represent facebook post & facebook message type of conversation
        // This is currently used while setting up and executing the workflow on facebook type conversation
        Facebook: 999,
        Line: 998
    }

export const  conversationStatus = {
    Open: 1,
    Pending: 2,
    Closed: 3,
    Spam: 4
}

export const loadActivity = {
    LoadInitial: 1,
    LoadMore: 2,
    Refresh: 3
}
export const activityIDs = {
    StatusChanged: 1,
    AssignedTo: 2,
    NewConversation: 3,
    NewTag: 4,
    RemoveTag: 5,
    EditMessage: 6,
    ChangeAttachment: 7,
    ChangeCustomer: 8,
    MoveConversation : 9,
    ForwardConversastion: 10,
    NewConversationFromForward: 11,
    ChangeConversationSubject: 12,
    AssignedToByDefaultSettings: 13,
    AutomaticWorkFlowExecuted: 14,
    ManualWorkflowExecuted: 15,
    EditFacebookComment: 16,
}
export const Colors = {
    bgBlue: '#0c85e0',
    bgPink: '#f08080',
    bgGreen: '#20b2aa',
    bgOrange:'#ffa500',
    bgRed:'#ff6347',
    bgPurple:'#9289ca'
}
export const CustomFieldTypes = {
    singleLine: 0,
    multiLine: 1,
    dropDown: 2,
    number: 3,
    date: 4,
    checkBox: 5,
    decimal: 6
}
export const Filters = [
    FilterBy,OrderBy
] 
export const FilterBy = [
    {name:'All',value:'all'},
    {name: "Unread", value: "unread"},
    {name: "Read", value: "read"},
    {name: "Pending", value: "pending"},
    {name: "Twitter", value: "twitter"},
    {name: "Draft", value: "draft"},
    {name: "Facebook", value: "facebook"},
    {name: "Phone", value: "phone"},
    {name: "Line", value: "line"},
    {name: "Twilio", value: "twilio"},
    {name: "ThreeCX", value: "threecx"},
    {name: "Plivo", value: "plivo"},
    {name: "Chat", value: "chat"},
    {name: "Line Ext", value: "line@"}
]
export const OrderBy = [
    {name: "Newest",value: "newest"},
    {name: "Oldest", value: "oldest"}
]

    export const MESSAGE_PAGE_SIZE = 50