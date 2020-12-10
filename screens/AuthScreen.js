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
    const [resetPwVisible, setResetPwVisible] = useState(false);
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
    const resetPwHandler = () => {
        DB.resetPassword(currentMail, () => {
            Alert.alert(
                "E-Mail versendet",
                "Du kannst dein Passwort mit dem Link in der E-Mail zurücksetzen.",
                [{ text: "OK", onPress: () => setResetPwVisible(false) }],
            );              
        }, (error) => {
            Alert.alert(
                "Ungültige Eingabe",
                "Es existiert kein User mit dieser E-Mail-Adresse",
                [{ text: "OK" }],
            );              
        });
    }
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
            if (currentPW.length < 6) {
                setPwErrorVisible(true); setCurrentPW("");
            } else if (currentPW != currentConfirmPW) {
                setConfirmPwErrorVisible(true);
            }
        }
    }

    return (
        <View>
            <StatusBar barStyle="dark-content"/>

            {/* Registrierung */}
            <Modal visible={registerVisible} animationType='slide' onRequestClose={() => setRegisterVisible(false)}>
                <ScrollView alwaysBounceVertical={false} contentContainerStyle= {boxes.mainContainer}>
                    <Text style={texts.titleCentered}>Registrierung</Text>
                    <InputField 
                        title="Username"
                        showError={nameErrorVisible}
                        placeholderText={nameErrorVisible ? "Bitte einen Namen eingeben." : "Username"}
                        value={currentName}
                        onChangeText={changeNameHandler}
                    />
                    <InputField 
                        title="E-Mail-Adresse"
                        showError={mailErrorVisible}
                        placeholderText={mailErrorVisible ? "Bitte eine E-Mail-Adresse eingeben." : "user@haw-hamburg.de"}
                        value={currentMail}
                        onChangeText={changeMailHandler}
                    />
                    <InputField 
                        title="Passwort"
                        secureTextEntry={true}
                        showError={pwErrorVisible}
                        placeholderText= {pwErrorVisible ? "Bitte mind. 6 Zeichen eingeben." : "mind. 6 Zeichen"}
                        value={currentPW}
                        onChangeText={changePWHandler}
                    />
                    <InputField 
                        secureTextEntry={true}
                        showError={confirmPwErrorVisible}
                        placeholderText= {confirmPwErrorVisible ? "Passwörter stimmen nicht überein." : "Passwort bestätigen"}
                        value={currentConfirmPW}
                        onChangeText={changeConfirmPWHandler}
                    />
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
            {/* Passwort zurücksetzen */}
            <Modal visible={resetPwVisible} animationType='slide' onRequestClose={() => setResetPwVisible(false)}>
                <ScrollView alwaysBounceVertical={false} contentContainerStyle= {boxes.mainContainer}>
                    <Text style={texts.titleCentered}>Passwort zurücksetzen</Text>
                    <InputField 
                        showError={mailErrorVisible}
                        placeholderText={mailErrorVisible ? "Bitte eine E-Mail-Adresse eingeben." : "user@haw-hamburg.de"}
                        value={currentMail}
                        onChangeText={changeMailHandler}
                    />
                    <ButtonLarge 
                        title="E-Mail senden" 
                        onPress={resetPwHandler}>
                    </ButtonLarge>
                    <ButtonLarge 
                        title="Abbrechen" 
                        onPress={() => {setResetPwVisible(false)}}
                        transparent={true}>
                    </ButtonLarge>
                </ScrollView>
            </Modal>

            {/* Login */}
            <ScrollView alwaysBounceVertical={false} contentContainerStyle= {boxes.mainContainer}>
                <Text style={texts.titleCentered}>Login</Text>
                <InputField 
                    placeholderText= {mailErrorVisible ? "Bitte eine E-Mail-Adresse eingeben." : "E-Mail"}
                    showError = {mailErrorVisible}
                    value={currentMail}
                    onChangeText={changeMailHandler}
                />
                <InputField 
                    placeholderText={pwErrorVisible ? "Bitte ein Passwort eingeben." : "Passwort"}
                    showError = {pwErrorVisible}
                    secureTextEntry={true}
                    value={currentPW}
                    onChangeText={changePWHandler}
                />
                <ButtonLarge 
                    title="Einloggen" 
                    onPress={logInHandler}>
                </ButtonLarge>
                <ButtonLarge 
                    title="Noch kein Konto? Registrieren" 
                    transparent={true}
                    onPress={() => {setRegisterHandler(true)}}>
                </ButtonLarge>
                <ButtonLarge 
                    title="Passwort zurücksetzen" 
                    onPress={() => {setResetPwVisible(true)}}
                    transparent={true}>
                </ButtonLarge>
            </ScrollView>
        </View>
    );
    
};