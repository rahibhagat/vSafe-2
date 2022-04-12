import {Platform } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
// import RNFetchBlob from 'rn-fetch-blob'
import { tokenEndPoint, apiEndPoint, serviceBasePath } from '../config/config';
var baseUrl = serviceBasePath;
var apiUrl = apiEndPoint;
var token = null;
module.exports = {
    login: function(user){
        // the message body
            /*
            The encodeURIComponent() function encodes a URI component.
            This function encodes special characters. In addition, it encodes the following characters: , / ? : @ & = + $ #
            */
            var dataForBody = "grant_type=password&" +
            "username=" + encodeURIComponent(user.email) + "&" +
            "password=" + encodeURIComponent(user.password) + "&" +
            "scope=" + encodeURIComponent("openid profile vsafeapi offline_access");

        // RFC requirements: when clientid/secret are provided,
        // they must be sent through the Authorization header.
        // cfr:https://tools.ietf.org/html/rfc6749#section-4.3

        // encode the client id & client secret (btoa = built-in function
        // for Base64 encoding)
        var encodedClientIdAndSecret = 'dnNhZmVfbW9iaWxlX2NsaWVudDpzZWNyZXQ=';//btoa("vSafe.client:secret");
        //'dnNhZmVfbW9iaWxlX2NsaWVudDpzZWNyZXQ=';
        // the header
        var messageHeaders = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + encodedClientIdAndSecret
        };

        //Remove old token first as it causes 400 bad request error
        //localStorageService.remove('authorizationData');        
        var token = "";
        AsyncStorage.setItem("accessToken", token);
        this.setToken(token);
        
        return fetch(tokenEndPoint+'connect/token',{
            method: 'POST',
            headers: messageHeaders,
            body: dataForBody
        }) .then(response => response.json())
            .then(json => {
                this.setToken(json.access_token);
                return json;
                
            })
            .catch(err => {
                
                alert(err);
            });

            // localStorageService.set('authorizationData', {
            //     token: data.access_token,
            //     userName: user.email,
            //     refreshToken: data.refresh_token,
            //     useRefreshTokens: true
            // });

            // UserService.getUserLanguage(user.email).then(function (userData) {

            //     //Set the user lang in the local storage so that it will be used to set the initial Resource and the accept language before logging in 
            //     localStorageService.set('lang', userData.language);

            //     //Load the resource according to the language that is set in localStorageService.
            //     $rootScope.loadResourceAccordingToLanguage();

            // }, CommonHttpHelperService.handleError);

            //_getROPCRefreshToken();
       // }).error(CommonHttpHelperService.handleError);

    },
    refreshtoken: function(refreshToken){
      // the message body
          /*
          The encodeURIComponent() function encodes a URI component.
          This function encodes special characters. In addition, it encodes the following characters: , / ? : @ & = + $ #
          */
          var dataForBody = "grant_type=refresh_token&" +
          "refresh_token=" + refreshToken + "&" +
          "scope=" + encodeURIComponent("openid profile vsafeapi offline_access");

      // RFC requirements: when clientid/secret are provided,
      // they must be sent through the Authorization header.
      // cfr:https://tools.ietf.org/html/rfc6749#section-4.3

      // encode the client id & client secret (btoa = built-in function
      // for Base64 encoding)
      var encodedClientIdAndSecret = 'dnNhZmVfbW9iaWxlX2NsaWVudDpzZWNyZXQ=';//btoa("vSafe.client:secret");
      //'dnNhZmVfbW9iaWxlX2NsaWVudDpzZWNyZXQ=';
      // the header
      var messageHeaders = {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + encodedClientIdAndSecret
      };

      //Remove old token first as it causes 400 bad request error
      //localStorageService.remove('authorizationData');        
      var token = "";
      AsyncStorage.setItem("accessToken", token);
      this.setToken(token);
      
      return fetch(tokenEndPoint+'connect/token',{
          method: 'POST',
          headers: messageHeaders,
          body: dataForBody
      }) .then(response => response.json())
          .then(json => {
              this.setToken(json.access_token);
              return json;
              
          })
          .catch(err => {
              
              alert(err);
          });

          // localStorageService.set('authorizationData', {
          //     token: data.access_token,
          //     userName: user.email,
          //     refreshToken: data.refresh_token,
          //     useRefreshTokens: true
          // });

          // UserService.getUserLanguage(user.email).then(function (userData) {

          //     //Set the user lang in the local storage so that it will be used to set the initial Resource and the accept language before logging in 
          //     localStorageService.set('lang', userData.language);

          //     //Load the resource according to the language that is set in localStorageService.
          //     $rootScope.loadResourceAccordingToLanguage();

          // }, CommonHttpHelperService.handleError);

          //_getROPCRefreshToken();
     // }).error(CommonHttpHelperService.handleError);

  },

    logout: function(){
        var token = "";
        //Remove old token first as it causes 400 bad request error
        //localStorageService.remove('authorizationData');        t
        AsyncStorage.setItem("accessToken", token);
        this.setToken(token);
    },
    getUserInfo: function(url, params) {
     
      var rootUrl;
      // if (opts && opts.base) {
      //   rootUrl = baseUrl;
      // } else {
      //   rootUrl = apiUrl;
      // }
      if(!params){
        params="";
      }
      rootUrl = apiUrl;
      if(params) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(params);
      }
      return fetch(`https://vsafeapi.azurewebsites.net/` + url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          // "X-Abhisi-Device-Type": Platform.OS,
          // "X-Abhisi-App": "Abhisi"
          // "X-Abhisi-Geo-Track": getLastCachedPosition()
        },
      })
        .then(response => response.json())
        .then(res => {
          try {
            return res;
          } catch (error) {
            console.warn(error + 'There is no internet')
          }
        });
    },
    get: function(url, params) {
     
      var rootUrl;
      // if (opts && opts.base) {
      //   rootUrl = baseUrl;
      // } else {
      //   rootUrl = apiUrl;
      // }
      if(!params){
        params="";
      }
      rootUrl = apiUrl;
      if(params) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(params);
      }
      return fetch(rootUrl + url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          // "X-Abhisi-Device-Type": Platform.OS,
          // "X-Abhisi-App": "Abhisi"
          // "X-Abhisi-Geo-Track": getLastCachedPosition()
        },
      })
        .then(response => response.json())
        .then(res => {
          try {
            return res;
          } catch (error) {
            console.warn(error + 'There is no internet')
          }
        });
    },
    post: function(url, body, opts) {
      var rootUrl;
      
      // if (opts && opts.base) {
      //   rootUrl = baseUrl;
      // } else {
      //   rootUrl = apiUrl;
      // }
      rootUrl = apiUrl;
      return fetch(rootUrl + url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Abhisi-Device-Type": Platform.OS,
          "X-Abhisi-App": "Abhisi"
        },
        body: JSON.stringify(body)
      })
        .then(response => response.json())
        .then(res => {
          try {
            return res;
          } catch (error) {
            throw new Error(error);
          }
        });
    },
    put: function(url, body, opts) {
      var rootUrl;
      // if (opts && opts.base) {
      //   rootUrl = baseUrl;
      // } else {
      //   rootUrl = apiUrl;
      // }
      rootUrl = apiUrl;
      return fetch(rootUrl + url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Abhisi-Device-Type": Platform.OS,
          "X-Abhisi-App": "Abhisi"
        },
        body: JSON.stringify(body)
        
      })
        .then(response => response.json())
        .then(res => {
          try {
            return res;
          } catch (error) {
            throw new Error(error);
          }
        });
    },
    putPass: function(url, body, opts) {
      var rootUrl;
      // if (opts && opts.base) {
      //   rootUrl = baseUrl;
      // } else {
      //   rootUrl = apiUrl;
      // }
      rootUrl = apiUrl;
      return fetch(rootUrl + url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Abhisi-Device-Type": Platform.OS,
          "X-Abhisi-App": "Abhisi"
        },
        body: JSON.stringify(body)
        
      })
        .then(response => {
            return response.ok;
        })
        // .then(res => {
        //   try {
        //     return res;
        //   } catch (error) {
        //     throw new Error(error);
        //   }
        // });
    },
    patch: function(url, body, opts) {
      var rootUrl;
      // if (opts && opts.base) {
      //   rootUrl = baseUrl;
      // } else {
      //   rootUrl = apiUrl;
      // }
      rootUrl = apiUrl;
      return fetch(rootUrl + url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json-patch+json",
          "X-Abhisi-Device-Type": Platform.OS,
          "X-Abhisi-App": "Abhisi"
        },
        body: JSON.stringify(body)
        
      })
        .then(response => {
          response
        })
        .then(res => {
          try {
            return res;
          } catch (error) {
            throw new Error(error);
          }
        });
    },
    delete: function(url,body,opts){
       var rootUrl;
       rootUrl = apiUrl;
       return fetch(rootUrl + url,{
         method: "DELETE",
         headers:{
           Authorization: `Bearer ${token}`,
           "Content-Type": "application/json",
           "X-Abhisi-Device-Type": Platform.OS,
           "X-Abhisi-App": "Abhisi"
         },
         body: JSON.stringify(body)
       })
       .then(response => response.json())
       .then(res => {
         try{
           return res;
         }catch (error) {
           throw new Error(error);
         }
       })
    },
    setToken: function(newToken) {
      token = newToken;
    },
    download: function (url, params, originalFileName){
      const { config, fs } = RNFetchBlob;
      if(!params){
        params="";
      }
      if(params) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(params);
      }
        const downloads = Platform.OS === "ios" ? fs.dirs.DocumentDir : fs.dirs.DownloadDir  ;
        return config({
        // add this option that makes response data to be stored as a file,
        // this is much more performant.
        fileCache : true,
        addAndroidDownloads : {
            useDownloadManager : true,
            notification : true,
            path:  downloads + '/' + originalFileName,
        },
        path: downloads + '/me_' + originalFileName
        })
        .fetch('GET', apiUrl + url, {
            Authorization :  `Bearer ${token}`,
            "X-Abhisi-Device-Type": Platform.OS,
            "X-Abhisi-App": "Abhisi"
            // more headers  ..
          })
        .then((res) => {
            // the path should be dirs.DocumentDir + 'path-to-file.anything'
            if(Platform.OS === "ios"){
              RNFetchBlob.ios.openDocument(res.data)
            }
            else{
              return res;
            }
          return res;
        })
        .catch((err) => {
          return alert(err);
        })
    },
    upload: function(url, formDataBody){
      var rootUrl;
      rootUrl = apiUrl;
      return fetch(rootUrl + url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          "X-Abhisi-Device-Type": Platform.OS,
          "X-Abhisi-App": "Abhisi"
        },
        body: formDataBody
      })
        .then(response => response.json())
        .then(res => {
          try {
            return res;
          } catch (error) {
            throw new Error(error);
          }
        });
    }
  };
  function queryParams(params) {
    return Object.keys(params)
        .map(k => {
              if (Array.isArray(params[k])) {
              return params[k]
                  .map(val => `${encodeURIComponent(k)}[]=${encodeURIComponent(val)}`)
                  .join('&')
              }
              return `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`
            
            })
        .join('&');
}