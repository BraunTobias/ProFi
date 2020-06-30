import React, { useState } from "react";
import AuthenticationNavigator from './navigation/AuthenticationNavigator';
import MainNavigator from './navigation/MainNavigator';
import { LogInContext } from './data/LogInContext';
import * as firebase from 'firebase';
import 'firebase/firestore';
import {decode, encode} from 'base-64';
console.disableYellowBox = true;

if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

export default App => {
  const [user, setUser] = useState(null);
  const [authentication, setAuthentication] = useState(false);

  // Initialize Firebase
  const firebaseConfig = {
      apiKey: "AIzaSyDbvERxsJQae79DoUlieAvImJ8MyYg_6bg",
      authDomain: "teamfinder-be2e3.firebaseapp.com",
      databaseURL: "https://teamfinder-be2e3.firebaseio.com",
      projectId: "teamfinder-be2e3",
      storageBucket: "teamfinder-be2e3.appspot.com",
      messagingSenderId: "773821416512",
      appId: "1:773821416512:web:0a6f083afd99313a20cba5"
  };
  try {
      firebase.initializeApp(firebaseConfig);
  } catch(err) {
  }

  // DB.logIn("nicolas@1.de", "test123");

  const authHandler = (auth) => {
    if (auth) {
      return ( <MainNavigator /> )
    } else {
      return ( <AuthenticationNavigator /> )
    }
  }

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log("Navigation zur App");
        setAuthentication(true);
      } else {
        console.log("Bitte einloggen");
        setAuthentication(false);
    }
  })

  return (
    <LogInContext.Provider value={[authentication, setAuthentication, user, setUser]}>
        {authHandler(authentication)}
    </LogInContext.Provider>
  )
};