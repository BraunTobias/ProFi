import React, {useState, useEffect, useContext} from 'react';
import { View } from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { AppLoading, Permissions, Notifications } from 'expo';
import * as firebase from 'firebase';
import MainNavigator from './navigation/MainTab';
import AuthScreen from './screens/AuthScreen';
import { ThemeProvider } from './components/ThemeManager';
import { AppearanceProvider } from 'react-native-appearance';

export default App => {


  // Schriften laden
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Firebase-Initialisierung
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
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  } catch(err) {
    console.log(err);
  }

  // State Hooks
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Bestimmt, welcher Navigator geladen wird
  const authHandler = (auth) => {
    if (!fontsLoaded) {
      return <View></View>;
      // AppLoading gibt zurzeit Fehlermeldung aus
      // return <AppLoading />;
    }  
    if (auth) {
      return ( <MainNavigator /> )
    } else {
      return ( <AuthScreen/> )
    }
  }

  // Wird aufgerufen wenn der User ein- oder ausgeloggt wird
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // Wenn der User soeben eingeloggt wurde
        setIsLoggedIn(true);
    } else {
        // Wenn der User soeben ausgeloggt wurde
        setIsLoggedIn(false);
    }
  })

  return (
    <AppearanceProvider>
      <ThemeProvider>
        {authHandler(isLoggedIn)}
      </ThemeProvider>
    </AppearanceProvider>
  )

}