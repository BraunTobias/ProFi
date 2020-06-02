<<<<<<< HEAD
import React, { useContext, useState } from 'react';
import { View, TextInput, Text, Modal } from 'react-native';
import { Button } from 'react-native-elements';
import { LogInContext } from '../data/LogInContext';
import { USERS } from '../data/dummy-data'

export default RegistrationScreen = ({navigation}) => {
    const [authentication, setAuthentication, user, setUser] = useContext(LogInContext);
    const [currentName, setCurrentName] = useState("");
    const [currentMail, setCurrentMail] = useState("");
    const [currentPW, setCurrentPW] = useState("");
    const [errorVisibility, setErrorVisibility] = useState(false);

    // Benutzereingaben
    const changeNameHandler = (enteredText) => {
        setCurrentName(enteredText);
      };
    const changeMailHandler = (enteredText) => {
        setCurrentMail(enteredText);
      };
    const changePWHandler = (enteredText) => {
        setCurrentPW(enteredText);
    };

    // Benutzer registrieren
    const register = () => {
        const newUser = new user(USERS.length, currentName, currentMail, currentPW)
        if (newUser) {
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
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Modal visible={errorVisibility} animationType='slide'>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
                        <Text>Error.</Text>
                        <Button title='OK'onPress={() => setErrorVisibility(false)}/>
                    </View>
                </Modal>
                
                <Text>Benutzername</Text>
                <TextInput
                    placeholder="Benutzername"
                    onChangeText={changeNameHandler}
                />
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
                    title= "Registrieren"
                    onPress={register}
                    onPress={() => {
                        setUser(USERS[1])
                        console.log("setUser(USERS[1])")
                        setAuthentication(true)
                        console.log("setAuthentication(true)")
                    }}
=======
import React from 'react';
import {View, TextInput, Text} from 'react-native';
import {Button} from 'react-native-elements';

export default RegistrationScreen = ({navigation}) => {
    return(
        <View style={{flex:1, justifyContent: 'flex-start', alignItems: 'center'}}>
            <Text style={{
                    padding: 40,
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: 'tomato'
            }}>Registration</Text>
            
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text>Benutzername</Text>
                <TextInput placeholder="deincoolerbenutzername"/>
                <Text>E-Mail</Text>
                <TextInput placeholder="student@example.com"/>
                <Text>Passwort</Text>
                <TextInput placeholder="supersicherespasswort"/>
                <Button 
                    title= "Confirm"
                    onPress={() =>navigation.navigate("Main")}
                />
                <Button 
                    title= "Back"
                    onPress={() =>navigation.navigate("Login")}
>>>>>>> a43f41048d95d9e92f3effc95e0f4f8c67132882
                />
            </View>
        </View>
    );
}