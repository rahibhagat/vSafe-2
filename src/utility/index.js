import { frontendPath, serviceBasePath } from '../config/config';
// import moment from 'moment-time';
var moment = require('moment-timezone');
import { timeFormatEnum, conversationStatus, CustomFieldTypes, conversationType } from "../constants/vSafeEnum";
const HTTP_CHECK = /^https:\/\//;
import AsyncStorage from "@react-native-community/async-storage";
// import { Debugger } from 'electron';

export function getAgentInitials(mailAddress, initial) {
    if (mailAddress) {
        //Removes quotes if available in name
        mailAddress = _removeQuotes(mailAddress);
        var initials;

        //Split mailAddress by whitespace, To Get Initials of first name & last name      
        if (mailAddress.indexOf(' ') >= 0) {
            var names = mailAddress.split(' ');
            initials = names[0].substr(0, 1) + "" + names[1].substr(0, 1);
        }
        //Use First letter of mail address if no whitespace found
        else {
            initials = mailAddress.substr(0, 1);
        }
        return initials;
    }
}
export function getcustomfieldDropDownData(data) {
    data.map((s, i) => {
        var datadropdownList = data.match(/\[(.*?)\]/);
        var list = datadropdownList[1].split(',')
        var listData = []
        list.map((s, i) => {
            listData.push({ key: i, id: i + 1, name: s.substr(1, s.length - 2) })
        })
        return listData
    })

}
export function getMailboxCustomFieldDropDown(data) {
    var listdropdown = []
    var data = data.map((s, i) => {
        if (s.customFieldType == CustomFieldTypes.dropDown) {
            return listdropdown.push({ key: i, value: s.id, name: s.data })
        }
        else {
            // do nothing
        }
    })
    return listdropdown
}
export function getSystemGravatarUrl(email) {
    return 'https://abhisiblob.blob.core.windows.net/abhisi/12/12/widget/ChatTeamChatTeamlogo-single.png'
}
export function getUserAvatarorInitials(user) {
    if (HTTP_CHECK.test(user.avatar) == true) {
        var user = {
            _id: user._id,
            avatar: user.avatar
        }
        return user
    } else {
        var user = {
            _id: user._id,
            name: user.name
        }
        return user
    }
}
export function getCustomerGravatarUrl(email) {

    //sets default pic
    var defaultGravatarPic = frontendPath + "/app/img/user/avatar2.png";

    emailAdd = _getEmailFromMailAddress(email);

    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //returns default pic if email is not valid
    if (!regex.test(emailAdd)) { return defaultGravatarPic; }

    //generates MD5 of email address
    var MD5 = function (s) { function L(k, d) { return (k << d) | (k >>> (32 - d)) } function K(G, k) { var I, d, F, H, x; F = (G & 2147483648); H = (k & 2147483648); I = (G & 1073741824); d = (k & 1073741824); x = (G & 1073741823) + (k & 1073741823); if (I & d) { return (x ^ 2147483648 ^ F ^ H) } if (I | d) { if (x & 1073741824) { return (x ^ 3221225472 ^ F ^ H) } else { return (x ^ 1073741824 ^ F ^ H) } } else { return (x ^ F ^ H) } } function r(d, F, k) { return (d & F) | ((~d) & k) } function q(d, F, k) { return (d & k) | (F & (~k)) } function p(d, F, k) { return (d ^ F ^ k) } function n(d, F, k) { return (F ^ (d | (~k))) } function u(G, F, aa, Z, k, H, I) { G = K(G, K(K(r(F, aa, Z), k), I)); return K(L(G, H), F) } function f(G, F, aa, Z, k, H, I) { G = K(G, K(K(q(F, aa, Z), k), I)); return K(L(G, H), F) } function D(G, F, aa, Z, k, H, I) { G = K(G, K(K(p(F, aa, Z), k), I)); return K(L(G, H), F) } function t(G, F, aa, Z, k, H, I) { G = K(G, K(K(n(F, aa, Z), k), I)); return K(L(G, H), F) } function e(G) { var Z; var F = G.length; var x = F + 8; var k = (x - (x % 64)) / 64; var I = (k + 1) * 16; var aa = Array(I - 1); var d = 0; var H = 0; while (H < F) { Z = (H - (H % 4)) / 4; d = (H % 4) * 8; aa[Z] = (aa[Z] | (G.charCodeAt(H) << d)); H++ } Z = (H - (H % 4)) / 4; d = (H % 4) * 8; aa[Z] = aa[Z] | (128 << d); aa[I - 2] = F << 3; aa[I - 1] = F >>> 29; return aa } function B(x) { var k = "", F = "", G, d; for (d = 0; d <= 3; d++) { G = (x >>> (d * 8)) & 255; F = "0" + G.toString(16); k = k + F.substr(F.length - 2, 2) } return k } function J(k) { k = k.replace(/rn/g, "n"); var d = ""; for (var F = 0; F < k.length; F++) { var x = k.charCodeAt(F); if (x < 128) { d += String.fromCharCode(x) } else { if ((x > 127) && (x < 2048)) { d += String.fromCharCode((x >> 6) | 192); d += String.fromCharCode((x & 63) | 128) } else { d += String.fromCharCode((x >> 12) | 224); d += String.fromCharCode(((x >> 6) & 63) | 128); d += String.fromCharCode((x & 63) | 128) } } } return d } var C = Array(); var P, h, E, v, g, Y, X, W, V; var S = 7, Q = 12, N = 17, M = 22; var A = 5, z = 9, y = 14, w = 20; var o = 4, m = 11, l = 16, j = 23; var U = 6, T = 10, R = 15, O = 21; s = J(s); C = e(s); Y = 1732584193; X = 4023233417; W = 2562383102; V = 271733878; for (P = 0; P < C.length; P += 16) { h = Y; E = X; v = W; g = V; Y = u(Y, X, W, V, C[P + 0], S, 3614090360); V = u(V, Y, X, W, C[P + 1], Q, 3905402710); W = u(W, V, Y, X, C[P + 2], N, 606105819); X = u(X, W, V, Y, C[P + 3], M, 3250441966); Y = u(Y, X, W, V, C[P + 4], S, 4118548399); V = u(V, Y, X, W, C[P + 5], Q, 1200080426); W = u(W, V, Y, X, C[P + 6], N, 2821735955); X = u(X, W, V, Y, C[P + 7], M, 4249261313); Y = u(Y, X, W, V, C[P + 8], S, 1770035416); V = u(V, Y, X, W, C[P + 9], Q, 2336552879); W = u(W, V, Y, X, C[P + 10], N, 4294925233); X = u(X, W, V, Y, C[P + 11], M, 2304563134); Y = u(Y, X, W, V, C[P + 12], S, 1804603682); V = u(V, Y, X, W, C[P + 13], Q, 4254626195); W = u(W, V, Y, X, C[P + 14], N, 2792965006); X = u(X, W, V, Y, C[P + 15], M, 1236535329); Y = f(Y, X, W, V, C[P + 1], A, 4129170786); V = f(V, Y, X, W, C[P + 6], z, 3225465664); W = f(W, V, Y, X, C[P + 11], y, 643717713); X = f(X, W, V, Y, C[P + 0], w, 3921069994); Y = f(Y, X, W, V, C[P + 5], A, 3593408605); V = f(V, Y, X, W, C[P + 10], z, 38016083); W = f(W, V, Y, X, C[P + 15], y, 3634488961); X = f(X, W, V, Y, C[P + 4], w, 3889429448); Y = f(Y, X, W, V, C[P + 9], A, 568446438); V = f(V, Y, X, W, C[P + 14], z, 3275163606); W = f(W, V, Y, X, C[P + 3], y, 4107603335); X = f(X, W, V, Y, C[P + 8], w, 1163531501); Y = f(Y, X, W, V, C[P + 13], A, 2850285829); V = f(V, Y, X, W, C[P + 2], z, 4243563512); W = f(W, V, Y, X, C[P + 7], y, 1735328473); X = f(X, W, V, Y, C[P + 12], w, 2368359562); Y = D(Y, X, W, V, C[P + 5], o, 4294588738); V = D(V, Y, X, W, C[P + 8], m, 2272392833); W = D(W, V, Y, X, C[P + 11], l, 1839030562); X = D(X, W, V, Y, C[P + 14], j, 4259657740); Y = D(Y, X, W, V, C[P + 1], o, 2763975236); V = D(V, Y, X, W, C[P + 4], m, 1272893353); W = D(W, V, Y, X, C[P + 7], l, 4139469664); X = D(X, W, V, Y, C[P + 10], j, 3200236656); Y = D(Y, X, W, V, C[P + 13], o, 681279174); V = D(V, Y, X, W, C[P + 0], m, 3936430074); W = D(W, V, Y, X, C[P + 3], l, 3572445317); X = D(X, W, V, Y, C[P + 6], j, 76029189); Y = D(Y, X, W, V, C[P + 9], o, 3654602809); V = D(V, Y, X, W, C[P + 12], m, 3873151461); W = D(W, V, Y, X, C[P + 15], l, 530742520); X = D(X, W, V, Y, C[P + 2], j, 3299628645); Y = t(Y, X, W, V, C[P + 0], U, 4096336452); V = t(V, Y, X, W, C[P + 7], T, 1126891415); W = t(W, V, Y, X, C[P + 14], R, 2878612391); X = t(X, W, V, Y, C[P + 5], O, 4237533241); Y = t(Y, X, W, V, C[P + 12], U, 1700485571); V = t(V, Y, X, W, C[P + 3], T, 2399980690); W = t(W, V, Y, X, C[P + 10], R, 4293915773); X = t(X, W, V, Y, C[P + 1], O, 2240044497); Y = t(Y, X, W, V, C[P + 8], U, 1873313359); V = t(V, Y, X, W, C[P + 15], T, 4264355552); W = t(W, V, Y, X, C[P + 6], R, 2734768916); X = t(X, W, V, Y, C[P + 13], O, 1309151649); Y = t(Y, X, W, V, C[P + 4], U, 4149444226); V = t(V, Y, X, W, C[P + 11], T, 3174756917); W = t(W, V, Y, X, C[P + 2], R, 718787259); X = t(X, W, V, Y, C[P + 9], O, 3951481745); Y = K(Y, h); X = K(X, E); W = K(W, v); V = K(V, g) } var i = B(Y) + B(X) + B(W) + B(V); return i.toLowerCase() };

    //gets host url with http or https
    var siteurl = frontendPath;

    //s stands for size of image and d stands for default image url
    var imageurl = 'https://www.gravatar.com/avatar/' + MD5(emailAdd) + '.jpg?s=45&d=' + siteurl + '/app/img/user/avatar2.png';
    return imageurl;

}
function _removeQuotes(input) {
    //Do nothing if input is undefined
    if (input) {
        var text = String(input);
        text = text.replace(/["']/g, "");
        var res = text.split(' ');

        //Capitalize first character of first name and last name
        if (res.length > 1) {
            text = res[0].charAt(0).toUpperCase() + res[0].substr(1).toLowerCase() + " " + res[1].charAt(0).toUpperCase() + res[1].substr(1).toLowerCase();
        }
        else if (res.length == 1) {
            if (res[0].charAt(0) == "<") {
                res[0] = res[0].substr(1, res[0].length - 2);
            }
            text = res[0].charAt(0).toUpperCase() + res[0].substr(1).toLowerCase();
        }
        return text;
    }
}

export function getStatusText(statusId) {
    switch (statusId) {
        case 1: {
            return 'Open';
        }
        case 2: {
            return 'Pending';
        }
        case 3: {
            return 'Closed';
        }
        case 4: {
            return 'Spam';
        }
        default: {
            return statusId;
        }
    }
}

export function getUserName(userID) {
    //We might need to make the first character capital
    if (userID.indexOf("<") != -1) {
        res = userID.split("<");
        res = res[0].substring(0, res[0].length);
        return res;
    }
}

function _getEmailFromMailAddress(mailAddress) {
    var email = mailAddress;
    if (mailAddress && mailAddress.indexOf('<') >= 0) {
        var res = mailAddress.split('<');
        email = res[1].substr(0, res[1].length - 1);
    }
    return email;
}

//This will set the image URL to be displayed for user
export function setUserImageUrl(user) {
    user.imageUrl = "";
    if (user.imageURL) {
        user.imageUrl = user.imageURL;
        if (user.imageUrl.indexOf("abhisiblob.blob.core.windows.net") == -1
            && user.imageUrl.indexOf("abhisitestblob.blob.core.windows.net") == -1) {

            user.imageUrl = frontendPath + "/" + user.imageUrl;
        }
    }
    else {
        user.imageUrl = getCustomerGravatarUrl(user.userEmail);
    }
    return user.imageUrl;
}

// This will set the image URL to be displayed for the Conversation
export function setImageUrlForConversation(conv) {
    conv.imageUrl = "";
    if (conv.customerImageURL) {
        if (conv.customerImageURL.indexOf("abhisiblob.blob.core.windows.net") == -1) {
              if(conv.conversationType == conversationType.FacebookPost){
                  return conv.imageUrl = "Facebookgroup"
              }
              else {
                  return conv.imageUrl = conv.customerImageURL;
              }
        }
        else {
            return conv.imageUrl = conv.customerImageURL;
        }
    }
    else {
        return conv.initials = getAgentInitials(conv.fromWhom);
    }
    // if (conv.lastMessage.from == 0) {
    //   if (conv.customerImageURL) {
    //     conv.imageUrl = conv.customerImageURL;
    //   }
    //   else {
    //     conv.initials =getAgentInitials(conv.fromWhom);
    //   }
    // }
    // //sets agents image url
    // else if (conv.agentImageURL) {
    //     conv.imageUrl = conv.agentImageURL;
    //     if (conv.imageUrl.indexOf("abhisiblob.blob.core.windows.net") == -1
    //         && conv.imageUrl.indexOf("abhisitestblob.blob.core.windows.net") == -1) {

    //         conv.imageUrl = frontendPath + "/" + conv.imageUrl;
    //     }  
    // }
    // else if (conv.agentImageURL == undefined) {
    //     if(conv.lastMessage.repliedFrom == undefined){
    //         conv.initials = getAgentInitials(conv.fromWhom);
    //     }
    //     else{
    //         conv.initials = getAgentInitials(conv.fromWhom);
    //     }      
    //     // Need to Look into this 
    // }
    // else if(conv.agentImageURL == ''){
    //     conv.initials = getAgentInitials(conv.fromWhom);
    // }
    // else {
    //     conv.imageUrl = frontendPath + "/" + conv.agentImageURL;
    // }   

    // return  conv.imageUrl 
}
export function getUserId(from, userid) {
    if (from !== 0) {
        return userid
    }
    else {
        return 0
    }
}
export function setChatUserId(chatmessage, userID) {
    var chats = chatmessage
    var chatuserid = []
    for (var i = 0; i < chats.length; i++) {
        if (chatmessage[i].user._id == userID) {
            chatuserid.push(chatmessage[i].user._id)
        }
        else if (chatmessage[i].user._id == -2) {
            chatmessage[i].user._id == 346
            chatuserid.push(chatmessage[i].user._id)
        }
        else {
            chatmessage[i].user._id == 0
            chatuserid.push(chatmessage[i].user._id)
        }
    }
    return chatuserid;
}
// Set the image url for individual messages 
export function setImageForMessages(msg, customerImageURL) {
    if (msg.from == 0) {
        if (customerImageURL) {
            msg.imageUrl = customerImageURL
        } else if (msg.repliedFrom !== null && msg.type == 6) {
            msg.imageUrl = getCustomerGravatarUrl(msg.repliedFrom);
        }
        else if (msg.repliedFrom !== null) {
            msg.agentInitials = getAgentInitials(msg.repliedFrom);
        }
        else {
            msg.imageUrl = getCustomerGravatarUrl(msg.repliedFrom);
        }
    }
    else if (msg.from == -2) {
        if (msg.repliedFrom !== null) {
            msg.imageUrl = getSystemGravatarUrl(msg.repliedFrom);
        } else {
            msg.imageUrl = getSystemGravatarUr(msg.repliedFrom);
        }
    }
    else if (msg.agentImageURL || msg.imageUrl) {

        msg.imageUrl = msg.agentImageURL || msg.imageUrl;

        // Need to check if this works
        if (msg.imageUrl.indexOf("abhisiblob.blob.core.windows.net") == -1
            && msg.imageUrl.indexOf("abhisitestblob.blob.core.windows.net") == -1) {
            msg.imageUrl = frontendPath + "/" + msg.imageUrl;
        }
    }
    else if (msg.conversation !== undefined) {
        if (msg.conversation.userImageUrl !== undefined) {
            var userImageUrl = frontendPath + msg.conversation.userImageUrl
            return userImageUrl;
        }
    }
    else {
        return msg.agentInitials = getAgentInitials(msg.repliedFrom);
    }
    return msg.imageUrl
}
//check contains of received chat message
export function setTextforChat(data, userName, lastName) {
    var contain = data.includes('<a href')
    if (contain == true) {
        //    console.log(true)
        var data1 = data.match(/\bhttps?:\/\/\S+/gi)
        var test = (/\.(gif|jpg|jpeg|tiff|png)$/i).test(data1[0].replace(/'/g, ''))
        if (test == false) {
            return data
        }
        else {
            return null
        }
    }
    else if (data.includes('{%user.fullName%}')) {
        return `<b><i>Hello&nbsp;${userName} ${lastName}</i></b><div><b><i>Quick Reply Test...</i></b></div>`
    }
    else {
        return data
    }
}
export function setImageforChat(data) {
    var contain = data.includes('<a href')
    if (contain == true) {
        var data1 = data.match(/\bhttps?:\/\/\S+/gi)
        var test = (/\.(gif|jpg|jpeg|tiff|png)$/i).test(data1[0].replace(/'/g, ''))
        if (test == true) {
            return data1[0].replace(/'/g, '');
        }
        else {
            return null
        }

    }
}
export function setconversationtypefromselectedfilterfilterby(selectedfilter) {
   if(selectedfilter == 'Phone'){
      return "&& ConversationType==" + conversationType.Call
   }
   else if (selectedfilter == 'Draft') {
       return "&& Messages.Any(Type == 1)"
   }
   else if (selectedfilter == 'Twitter') {
       return "&& ConversationType==" + conversationType.Twitter
   }
   else if (selectedfilter == 'Facebook') {
       return "&& (ConversationType==" + conversationType.FacebookMessage + "||" + " ConversationType==" + conversationType.FacebookPost +")"
   }
   else if (selectedfilter == 'Line') {
       return "&& ConversationType==" + conversationType.Line
   }
   else if (selectedfilter == 'Twilio') {
       return "&& ConversationType==" + conversationType.TwilioSMS
   }
   else if (selectedfilter == 'ThreeCX') {
       return  "&& ConversationType==" + conversationType.ThreeCXCall
   }
   else if (selectedfilter == 'Plivo') {
       return "&& ConversationType==" + conversationType.PlivoInboundCall
   }
   else if (selectedfilter == 'Chat') {
       return "&& ConversationType==" + conversationType.Chat
   }
   else if (selectedfilter == 'Line Ext') {
       return "&& ConversationType==" + conversationType.LineExt
   }
   else if (selectedfilter == 'Unread') {
       return "&& Messages.Any(ReadStatus == false)"
   }
   else if (selectedfilter == 'Read') {
       return "&& Messages.All(ReadStatus == true)"
   }
   else if (selectedfilter == 'Pending') {
       return "&& Status==2"
   }
}
export function getReminderValue(value) {
    if (value == 1){
        var d = new Date().getTime() + (1 * 60 * 60 * 1000)
        var time = new Date(d)
        return time
    }
    else if (value == 2) {
        var d = new Date().getTime() + (2 * 60 * 60 * 1000)
        var time = new Date(d)
        return time
    }
    else if (value == 3) {
        var d = new Date().getTime() + (24 * 60 * 60 * 1000)
        var time = new Date(d)
        return time
    }
    else if (value == 4) {
        var d = new Date().getTime() + (48 * 60 * 60 * 1000)
        var time = new Date(d)
        return time
    }
}
export function getErrors(errors, sequence) {
    if (errors == undefined) {
        return null
    }
    else if (errors) {
        if (errors == 'Enter Valid Value') {
            return 'Enter Valid Value'
        }
        else {
            return 'Required'
        }
    }
}

// get quick reply for chatbot
export function renderqrforchat(qr) {
    var value1 = ''
    var value = [];
    if (value.length == 0 && qr.length > 0) {
        for (var chatqr = 0; chatqr < qr.length; chatqr++) {
            var values = {
                title: qr[chatqr].name,
                value: qr[chatqr].message
            }

            value.push(values)
            return value1 = undefined
        }
    }
    else {
        // do nothing
    }
    return value
}
export function  messageIdGenerator() {
        // generates uuid.
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
export function getChatMessageModelByMediaType(data, imgSource, messages) {
    var data1 = data
    var _chatMessageModel = {}
    var media = {
        originalDocumentName: data1.filename,
        uploadPath: getMediauploadPath(data1)
    }
    switch (messages.type.charAt(0)) {
        case "i":

            _chatMessageModel.contentType = "image";
            media.type = "image";
            _chatMessageModel.contentHtml = "<a href='" + media.uploadPath + "' target='_blank'>"
                + "<img class='img-thumbnail' src='"
                + imgSource + "' height='200' width='200' />";
            _chatMessageModel.contentText = "Image"

            break;

        case "v":

            _chatMessageModel.contentType = "video";
            media.type = "video";
            _chatMessageModel.contentHtml = "<div><video width='200' controls><source src='"
                + media.uploadPath + "'>"
                + "Your browser does not support HTML5 video.</video></div>";
            _chatMessageModel.contentText = "Video";
            break;

        default:

            _chatMessageModel.contentType = "file";
            media.type = "file";
            _chatMessageModel.contentHtml = "<a href='" + media.uploadPath + "' target='_blank'>"
                + data.filename + "</a>";
            _chatMessageModel.contentText = "File";

    }

    _chatMessageModel.from = 0;
    _chatMessageModel.media = media
    return _chatMessageModel
}
export function getMediauploadPath(data) {
    var blobId = new Blob([data])
    return "blob:" + serviceBasePath + blobId._data.blobId
}
export function gettagnameforselectedfilter(item, filters) {
    if (item.fieldName == 'statuses') {
        switch (item.bucketKey) {
            case 1: {
                return 'Open';
            }
            case 2: {
                return 'Pending';
            }
            case 3: {
                return 'Closed';
            }
            case 4: {
                return 'Spam';
            }
            default: {
                return item.bucketKey;
            }
        }
    }
    else if (item.fieldName == 'timeinterval') {
        return item.fieldName
    }
    else {
        var keyfilter = item.bucketKey.split('|')

        if (item.fieldName == 'mailboxes') {
            var filter = filters.mailboxes.filter(filter => {
                if (filter.key == parseInt(keyfilter[0])) {
                    return filter.name
                }
            })
            return filter.length == 0 ? null : filter[0].name
        }
        else if (item.fieldName == 'users' && keyfilter[0] == "Unassigned") {
            return keyfilter[0] = "Unassigned"
        }
        else {
            return keyfilter[1]
        }
    }
}
export function getSelectedQR(qrmessages) {
    qrmessages.map((qr, i) => {
        return qr.message
    })
}
export function getSalutation(conversation, text) {
    if (conversation.conversationType !== conversationType.Twitter) {
        return conversation.salutation + "<br><br><p></p>" + text;
    }
    else {
        if (conversation.fromWhomEmail.indexOf("<") != -1) {
            var res = conversation.fromWhomEmail.split("<");
            res = res[1].substring(0, res[1].length - 1);
            return "@" + res + " " + text;
        }
        else {
            return "@" + _model.conversation.fromWhomEmail + " " + text;
        }
    }
}
export function getDropDownValue(customfield, value) {
    var listdropdown = []
    customfield.map((v, i) => {
        if (v.customFieldType == CustomFieldTypes.dropDown) {
            listdropdown.push(JSON.parse(v.data))
        }
    })
    var dropdownOptionsfield = undefined
    var defaultValue = 'select Value';
    listdropdown.map((v, i) => {
        v.dropdownOptions.splice(0, 0, defaultValue)
        v.dropdownOptions.map((x, y) => {
            if (x == value) {
                dropdownOptionsfield = y
            }
        })
    })
    return dropdownOptionsfield;
}
//Convert utc time to company timezone

export function convertToCompanyTimeZone(date,timezone,strFormat,is12HRTimeFormat) {
   var res = '';
   var timeFormat = undefined;
   if(is12HRTimeFormat == true) {
    timeFormat = '  hh:mm:ss A';
   }
   else {
    timeFormat = '  HH:mm:ss'
   }
   res = moment.utc(date).tz(timezone).format(strFormat + timeFormat)
   return res;
}

export function convertToCompanyTimeZoneShowOnlyDate(date,timezone,strFormat,is12HRTimeFormat) {
    var res = '';
    var timeFormat = undefined;
    if(is12HRTimeFormat == true) {
     timeFormat = '  hh:mm:ss A';
    }
    else {
     timeFormat = '  HH:mm:ss'
    }
    res = moment.utc(date).tz(timezone).format(strFormat)
    return res;
 }
export const saveDeviceLocally = async (deviceList) => {
    try {
        const jsonValue = JSON.stringify(deviceList)
        await AsyncStorage.setItem('@localstorage_ble_device_list', jsonValue)
        return true;
    }
 catch (err) {
     console.log(err)
     return false
 }
    }
    
    export const getDeciveFromLocal = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@localstorage_ble_device_list')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
            // if(jsonValue != null) {
            //    var parsedDeviceList =  JSON.parse(jsonValue)
            //     console.log(parsedDeviceList)
            //     return parsedDeviceList
            // }
            // else {
            //       return nulls
            // }
        }
        catch(err) {
            console.log(err)
            return false
        }   
    }

    export function getStartAndEndTimeDate(startdate,enddate,timezone,strFormat,is12HRTimeFormat) {
    //     var strFormatDate =  'MM/DD/YYYY'
    //     var startdatetime = moment.utc(startDateTime).tz(timezone).format(strFormatDate + ' ' + '00:00:00')
    //     // var startdatetime = (startDateTime.getMonth() + 1) + "/"
    //     // + startDateTime.getDate() + "/"
    //     // + startDateTime.getFullYear() + " "
    //     // + "00" + ":"
    //     // + "00" + ":"
    //     // + "00";
    //     var enddatetime = moment.utc(endDateTime).tz(timezone).format(strFormatDate + ' ' + '23:59:59')
    // //   var enddatetime = (endDateTime.getMonth() + 1) + "/"
    // //     + endDateTime.getDate() + "/"
    // //     + endDateTime.getFullYear() + " "
    // //     + "23" + ":"
    // //     + "59" + ":"
    // //     + "59";
    var startdatetime = moment(startdate).tz(timezone).set({hour:0,minute:0,second:0,millisecond:0}).toISOString()
    var enddatetime = moment(enddate).tz(timezone).set({hour:23,minute:59,second:59,millisecond:0}).toISOString()
        var dates = {
            startdatetime: startdatetime,
            enddatetime: enddatetime
        }
        return (
               dates
        )
    }