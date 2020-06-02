<<<<<<< HEAD
import React, { useState, useContext } from 'react';
import { View, TextInput, Text, Modal } from 'react-native';
import { Button } from 'react-native-elements';
import { BackHandler } from 'react-native';
import { LogInContext } from '../data/LogInContext';
import { USERS } from '../data/dummy-data'

export default LoginScreen = ({navigation}) => {
    const [authentication, setAuthentication, user, setUser] = useContext(LogInContext);
    const [currentMail, setCurrentMail] = useState("");
    const [currentPW, setCurrentPW] = useState("");
    const [errorVisibility, setErrorVisibility] = useState(false);

    // Benutzereingaben
    const changeMailHandler = (enteredText) => {
        setCurrentMail(enteredText);
      };
    const changePWHandler = (enteredText) => {
        setCurrentPW(enteredText);
    };
    
    // Authentifizierung
    const checkAuth = () => {
        const user = USERS.find(user => user.mail === currentMail && user.pw === currentPW);
        if (user) {
            setUser(user);
            console.log("User: " + user.username);
            setAuthentication(true);
            console.log("authenticated true");
        }
        else {
            setErrorVisibility(true);
        }
    }

    return(
        <View style={{flex:1, justifyContent: 'flex-start', alignItems: 'center'}}>
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                <Modal visible={errorVisibility} animationType='slide'>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
                        <Text>Falsche Mail oder PW.</Text>
                        <Button title='OK'onPress={() => setErrorVisibility(false)}/>
                    </View>
                </Modal>
                
                <Text>E-Mail</Text>
                <TextInput 
                    placeholder="student@example.com"
                    onChangeText={changeMailHandler}
                />
                <Text>Passwort</Text>
                <TextInput
                    placeholder="####"
                    onChangeText={changePWHandler}
                />
                <Button 
                    title= "Login"
                    onPress={checkAuth}
                />
                <Button 
                    title= "Registrieren"
=======
import React from 'react';
import {View, TextInput, Text} from 'react-native';
import {Button} from 'react-native-elements';
import { BackHandler } from 'react-native';

export default LoginScreen = ({navigation}) => {
    return(
        <View style={{flex:1, justifyContent: 'flex-start', alignItems: 'center'}}>
            <Text style={{
                    padding: 40,
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: 'tomato'
            }}>Login</Text>
            
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Benutzername oder E-Mail</Text>
                <TextInput placeholder="student@example.com"/>
                <Text>Passwort</Text>
                <TextInput placeholder="supersicherespasswort"/>
                <Button 
                    title= "Login"
                    onPress={() =>navigation.navigate("Main")}
                />
                <Button 
                    title= "Registration"
>>>>>>> a43f41048d95d9e92f3effc95e0f4f8c67132882
                    onPress={() =>navigation.navigate("Registration")}
                />
                <Button 
                    title= "Beenden"
                    onPress={() =>BackHandler.exitApp()}
                />
            </View>
        </View>
    );
}