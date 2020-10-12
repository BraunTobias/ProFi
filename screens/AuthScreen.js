import React, { useState } from 'react';
import { View, Text, Modal, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { icons, colors, boxes, texts } from '../Styles';
import DB from '../api/DB_API';
import InputField from '../components/InputField';
import ButtonLarge from '../components/ButtonLarge';

export default AuthScreen = () => {

    // State Hooks
    const [currentMail, setCurrentMail] = useState("");
    const [currentPW, setCurrentPW] = useState("");
    const [currentName, setCurrentName] = useState("");
    const [errorVisibility, setErrorVisibility] = useState(false);

    // State Hooks für Modals
    const [registerVisible, setRegisterVisible] = useState(false);


    // Benutzereingaben-Handling
    const changeMailHandler = (enteredText) => {
        setCurrentMail(enteredText);
    };
    const changePWHandler = (enteredText) => {
        setCurrentPW(enteredText);
    };
    const changeNameHandler = (enteredText) => {
        setCurrentName(enteredText);
    };
    const setRegisterHandler = (visible) => {
        setRegisterVisible(visible);
        setCurrentMail("");
        setCurrentPW("");
        setCurrentName("");
    };

    // Login
    const logIn = () => {
        DB.logIn("nicolas.kolbeck@haw-hamburg.de", "123456", ((error) => {console.log(error)}));
    }

    return (
        <View>
            <StatusBar barStyle="dark-content"/>

            {/* Registrierung */}
            <Modal visible={registerVisible} animationType='slide'>
                <ScrollView contentContainerStyle= {boxes.mainContainer}>
                    <Text style={texts.titleCentered}>Registrierung</Text>
                    <InputField 
                        title="Username"
                        placeholderText= "Username"
                        value={currentName}
                        onChangeText={changeNameHandler}
                    />
                    <InputField 
                        title="E-Mail-Adresse"
                        placeholderText= "user@haw-hamburg.de"
                        value={currentMail}
                        onChangeText={changeMailHandler}
                    />
                    <InputField 
                        title="Passwort"
                        secureTextEntry={true}
                        placeholderText= "mind. 6 Zeichen"
                        value={currentPW}
                        onChangeText={changePWHandler}
                    />
                    <ButtonLarge 
                        title="Konto anlegen" 
                        onPress={logIn}>
                    </ButtonLarge>
                    <ButtonLarge 
                        title="Schon ein Konto? Anmelden" 
                        onPress={() => {setRegisterHandler(false)}}
                        transparent={true}>
                    </ButtonLarge>
                </ScrollView>
            </Modal>

            {/* Login */}
            <ScrollView contentContainerStyle= {boxes.mainContainer}>
                <Text style={texts.titleCentered}>Login</Text>
                <InputField 
                    placeholderText= "E-Mail"
                    value={currentMail}
                    onChangeText={changeMailHandler}
                />
                <InputField 
                    placeholderText="Passwort"
                    secureTextEntry={true}
                    value={currentPW}
                    onChangeText={changePWHandler}
                />
                <ButtonLarge 
                    title="Einloggen" 
                    onPress={logIn}>
                </ButtonLarge>
                <ButtonLarge 
                    title="Noch kein Konto? Registrieren" 
                    transparent={true}
                    onPress={() => {setRegisterHandler(true)}}>
                </ButtonLarge>
            </ScrollView>
        </View>
    );
    
};