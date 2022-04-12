import React from "react";
import { StyleProvider } from "native-base";
import Navigation from "./src/App";
import { PersistGate } from 'redux-persist/lib/integration/react';
import getTheme from "./src/theme/components";
import variables from "./src/theme/variables/commonColor";
import material from './native-base-theme/variables/material'
import {Provider} from 'react-redux';
import {logNetworkCalls} from './src/config/config';
import configStore from './src/config/configStore';
import SplashScreen from 'react-native-splash-screen';

//GLOBAL.XMLHttpRequest = GLOBALdevtool
if(logNetworkCalls)
{
  global._fetch = fetch;
  global.fetch = function(uri, options, ...args) {
    return global._fetch(uri, options, ...args).then((response) => {
      // console.log('Fetch', { request: { uri, options, ...args }, response });
      return response;
    });
  };
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storeCreated: false,
      store: null,
    };
  }
  componentDidMount() {
    configStore()
      .then(({ persistor, store }) =>
        this.setState({ persistor, store, storeCreated: true }));
        SplashScreen.hide();
       
  }

  render() {
    if (!this.state.storeCreated) {
      return null
    };
    console.disableYellowBox = true;
    return(
      <Provider store= {this.state.store}>
        <PersistGate persistor={this.state.persistor}>
          <StyleProvider style={getTheme(material)}>
            <Navigation />
          </StyleProvider>
        </PersistGate>
      </Provider>
    );
    //return <Navigation/>;
  }
}