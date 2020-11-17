import React, { useState } from 'react';
import { View, Text, Modal, StatusBar, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { icons, colors, boxes, texts } from '../Styles';
import DB from '../api/DB_API';
import InputField from '../components/InputField';
import ButtonLarge from '../components/ButtonLarge';

export default AuthScreen = () => {

    // State Hooks
    const [currentMail, setCurrentMail] = useState("");
    const [currentPW, setCurrentPW] = useState("");
    const [currentConfirmPW, setCurrentConfirmPW] = useState("");
    const [currentName, setCurrentName] = useState("");
    
    // State Hooks für Modals/Fehler
    const [registerVisible, setRegisterVisible] = useState(false);
    const [mailErrorVisible, setMailErrorVisible] = useState(false);
    const [pwErrorVisible, setPwErrorVisible] = useState(false);
    const [confirmPwErrorVisible, setConfirmPwErrorVisible] = useState(false);
    const [nameErrorVisible, setNameErrorVisible] = useState(false);

    // Benutzereingaben-Handling
    const changeMailHandler = (enteredText) => {
        setCurrentMail(enteredText);
        if (enteredText != "") setMailErrorVisible(false);
    };
    const changePWHandler = (enteredText) => {
        setCurrentPW(enteredText);
        if (enteredText != "") setPwErrorVisible(false);
    };
    const changeConfirmPWHandler = (enteredText) => {
        setCurrentConfirmPW(enteredText);
        if (enteredText == currentPW) setConfirmPwErrorVisible(false);
    };
    const changeNameHandler = (enteredText) => {
        setCurrentName(enteredText);
        if (enteredText != "") setNameErrorVisible(false);
    };
    const setRegisterHandler = (visible) => {
        setRegisterVisible(visible);
        setCurrentMail("");
        setCurrentPW("");
        setCurrentConfirmPW("");
        setCurrentName("");
        setNameErrorVisible(false);
        setMailErrorVisible(false);
        setPwErrorVisible(false);
        setConfirmPwErrorVisible(false);
    };

    // Login
    const logInHandler = () => {
        if (currentPW != "" && currentMail != "") {
            DB.logIn(currentMail, currentPW, ((error) => {
                var errorText = error.message;
                switch (error.code) {
                    case "auth/invalid-email": errorText = "Bitte eine gültige E-Mail-Adresse eingeben."; break;
                    case "auth/user-not-found": errorText = "Dieser User existiert nicht."; break;
                    case "auth/wrong-password": errorText = "Falsches Passwort eingegeben."; setCurrentPW(""); break;
                }
                Alert.alert(
                    "Ungültige Eingabe",
                    errorText,
                    [{ text: "OK" }],
                );              
            }));
        } else {
            if (currentMail == "") setMailErrorVisible(true);
            if (currentPW == "") setPwErrorVisible(true);
        }
    }
    // Registrierung
    const registerHandler = () => {
        if (currentName != "" && currentPW.length >= 6 && currentMail != "" && currentPW == currentConfirmPW) {
            DB.signUp(currentName, currentMail, currentPW, () => {}, (error) => {
                var errorText = error.message;
                switch (error.code) {
                    case "auth/email-already-in-use": errorText = "Diese E-Mail-Adresse ist schon vergeben."; break;
                    case "auth/invalid-email": errorText = "Bitte eine gültige E-Mail-Adresse eingeben."; break;
                }
                Alert.alert(
                    "Ungültige Eingabe",
                    errorText,
                    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                );              
            });
        } else {
            if (currentName == "") setNameErrorVisible(true);
            if (currentMail == "") setMailErrorVisible(true);
            if (currentPW.length < 6) setPwErrorVisible(true);
            else if (currentPW != currentConfirmPW) setConfirmPwErrorVisible(true);
        }
    }

    return (
        <View>
            <StatusBar barStyle="dark-content"/>

            {/* Registrierung */}
            <Modal visible={registerVisible} animationType='slide'>
                <ScrollView alwaysBounceVertical={false} contentContainerStyle= {boxes.mainContainer}>
                    <Text style={texts.titleCentered}>Registrierung</Text>
                    <InputField 
                        title="Username"
                        placeholderText= "Username"
                        value={currentName}
                        onChangeText={changeNameHandler}
                    />
                    {nameErrorVisible &&
                        <Text style={[boxes.unPaddedRow, texts.errorLine]}>
                            Bitte einen Namen eingeben.
                        </Text>
                    }
                    <InputField 
                        title="E-Mail-Adresse"
                        placeholderText= "user@haw-hamburg.de"
                        value={currentMail}
                        onChangeText={changeMailHandler}
                    />
                    {mailErrorVisible &&
                        <Text style={[boxes.unPaddedRow, texts.errorLine]}>
                            Bitte eine E-Mail-Adresse eingeben.
                        </Text>
                    }
                    <InputField 
                        title="Passwort"
                        secureTextEntry={true}
                        placeholderText= "mind. 6 Zeichen"
                        value={currentPW}
                        onChangeText={changePWHandler}
                    />
                    {pwErrorVisible &&
                        <Text style={[boxes.unPaddedRow, texts.errorLine]}>
                            Bitte ein Passwort mit mindestens 6 Zeichen eingeben.
                        </Text>
                    }
                    <InputField 
                        // title="Passwort bestätigen"
                        secureTextEntry={true}
                        placeholderText= "Passwort bestätigen"
                        value={currentConfirmPW}
                        onChangeText={changeConfirmPWHandler}
                    />
                    {confirmPwErrorVisible &&
                        <Text style={[boxes.unPaddedRow, texts.errorLine]}>
                            Passwörter stimmen nicht überein.
                        </Text>
                    }
                    <ButtonLarge 
                        title="Konto anlegen" 
                        onPress={registerHandler}>
                    </ButtonLarge>
                    <ButtonLarge 
                        title="Schon ein Konto? Anmelden" 
                        onPress={() => {setRegisterHandler(false)}}
                        transparent={true}>
                    </ButtonLarge>
                </ScrollView>
            </Modal>

            {/* Login */}
            <ScrollView alwaysBounceVertical={false} contentContainerStyle= {boxes.mainContainer}>
                <Text style={texts.titleCentered}>Login</Text>
                <InputField 
                    placeholderText= "E-Mail"
                    value={currentMail}
                    onChangeText={changeMailHandler}
                />
                {mailErrorVisible &&
                    <Text style={[boxes.unPaddedRow, texts.errorLine]}>
                        Bitte eine E-Mail-Adresse eingeben.
                    </Text>
                }
                <InputField 
                    placeholderText="Passwort"
                    secureTextEntry={true}
                    value={currentPW}
                    onChangeText={changePWHandler}
                />
                {pwErrorVisible &&
                    <Text style={[boxes.unPaddedRow, texts.errorLine]}>
                        Bitte ein Passwort eingeben.
                    </Text>
                }
                <ButtonLarge 
                    title="Einloggen" 
                    onPress={logInHandler}>
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