import React, { useState, useContext } from 'react';
import { View, Text, Modal, StatusBar, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeContext } from '../components/ThemeManager';

import { icons, boxes, texts } from '../Styles';
import DB from '../api/DB_API';
import InputField from '../components/InputField';
import Button from '../components/Button';

export default AuthScreen = () => {

    // DB.addTestIdeas();

    // var members ={
    //     "Anton":{
    //       "skills":["skill1","skill10","skill3","skill5","skill8"],
    //       "sorted":false,
    //       "interests":["interest2","interest4","interest6","interest7","interest9"]},
          
    //     "Berta":{
    //       "skills":["skill0","skill10","skill6","skill9"],
    //       "sorted":false,
    //       "interests":["interest0","interest4","interest6","interest9"]},
          
    //     "Charlotte":{
    //       "skills":["skill2","skill8"],
    //       "sorted":false,
    //       "interests":["interest1","interest4","interest9"]},
          
    //     "Dora":{
    //       "skills":["skill10","skill8"],
    //       "sorted":false,
    //       "interests":["interest3","interest5","interest6","interest7","interest8"]},
          
    //     "Emil":{
    //       "skills":["skill1","skill3","skill5","skill6"],
    //       "sorted":false,
    //       "interests":["interest0","interest1","interest2","interest4","interest7"]},
          
    //     "Friedrich":{
    //       "skills":["skill1","skill10","skill11","skill5","skill8"],
    //       "sorted":false,
    //       "interests":["interest0","interest6","interest8","interest9"]},
          
    //     "Gustav":{
    //       "skills":["skill1","skill2","skill4","skill8"],
    //       "sorted":false,
    //       "interests":["interest0","interest3","interest6","interest7","interest8"]},
          
    //     "Heinrich":{
    //       "skills":["skill11","skill3","skill5"],
    //       "sorted":false,
    //       "interests":["interest4","interest5","interest8"]},
          
    //     "Ida":{
    //       "skills":["skill10","skill3","skill4","skill6","skill8"],
    //       "sorted":false,
    //       "interests":["interest2","interest5","interest6","interest7"]},
          
    //     "Julia":{
    //       "skills":["skill10","skill9"],
    //       "sorted":false,
    //       "interests":["interest0","interest6","interest8"]},
          
    //     "Konrad":{
    //       "skills":["skill4","skill5","skill6","skill9"],
    //       "sorted":false,
    //       "interests":["interest0","interest1","interest5","interest7","interest9"]},
          
    //     "Ludwig":{
    //       "skills":["skill0","skill1","skill5","skill8","skill9"],
    //       "sorted":false,
    //       "interests":["interest3","interest4","interest8","interest9"]},
          
    //     "Martha":{
    //       "skills":["skill1","skill3"],
    //       "sorted":false,
    //       "interests":["interest1","interest2","interest3","interest5","interest9"]},
          
    //     "Nina":{
    //       "skills":["skill3","skill7"],
    //       "sorted":false,
    //       "interests":["interest1","interest3","interest4","interest5","interest7"]},
          
    //     "Otto":{
    //       "skills":["skill10","skill3","skill9"],
    //       "sorted":false,
    //       "interests":["interest0","interest1","interest4","interest6","interest9"]},
          
    //     "Paula":{
    //       "skills":["skill0","skill10","skill3","skill5"],
    //       "sorted":false,
    //       "interests":["interest3","interest6","interest9"]},
          
    //     "Quentin":{
    //       "skills":["skill0","skill10","skill11","skill8","skill9"],
    //       "sorted":false,
    //       "interests":["interest1","interest5","interest9"]},
    //     "Richard":{
    //       "skills":["skill0","skill1","skill2"],
    //       "sorted":false,
    //       "interests":["interest0","interest4","interest9"]},
          
    //     "Sophie":{
    //       "skills":["skill1","skill10","skill6","skill7"],
    //       "sorted":false,
    //       "interests":["interest0","interest2","interest4","interest7","interest9"]},
          
    //     "Theo":{
    //       "skills":["skill0","skill11","skill6","skill8"],
    //       "sorted":false,
    //       "interests":["interest1","interest7","interest9"]},
          
    //     "Ulrike":{
    //       "skills":["skill3","skill9"],
    //       "sorted":false,
    //       "interests":["interest1","interest3","interest6","interest8"]},
          
    //     "Vincent":{
    //       "skills":["skill0","skill3","skill6"],
    //       "sorted":false,
    //       "interests":["interest0","interest4","interest5","interest6"]},
          
    //     "Wilhelm":{
    //       "skills":["skill1","skill3","skill4"],
    //       "sorted":false,
    //       "interests":["interest0","interest3","interest4","interest5"]},
          
    //     "Xenia":{
    //       "skills":["skill0","skill2","skill3"],
    //       "sorted":false,
    //       "interests":["interest3","interest4","interest8"]},
          
    //     "Yvonne":{
    //       "skills":["skill1","skill10"],
    //       "sorted":false,
    //       "interests":["interest0","interest3","interest5","interest6","interest7"]},
          
    //     "Zoe":{
    //       "skills":["skill0","skill10","skill3","skill7","skill9"],
    //       "sorted":false,
    //     "interests":["interest0","interest7","interest8","interest9"]}
    // };
    // var memberIds = [];
    
    // for (member in members) {
    //     memberIds.push(member);
    // }
    // console.log(memberIds);
    // DB.fillTestCourse(memberIds);
    

    const {themeColors} = useContext(ThemeContext);

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
        <View style={{backgroundColor: themeColors.base}}>
            <StatusBar barStyle={themeColors.mode == "light" ? "dark-content" : "light-content"}/>

            {/* Registrierung */}
            <Modal visible={registerVisible} animationType='slide' onRequestClose={() => setRegisterVisible(false)}>
                <ScrollView alwaysBounceVertical={false} contentContainerStyle= {[boxes.mainContainer, {backgroundColor: themeColors.base}]}>
                    <Text style={[texts.titleCentered, {color: themeColors.textCopy}]}>Registrierung</Text>
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
                    <Button 
                        title="Konto anlegen" 
                        onPress={registerHandler}>
                    </Button>
                    <Button 
                        title="Schon ein Konto? Anmelden" 
                        onPress={() => {setRegisterHandler(false)}}
                        transparent={true}>
                    </Button>
                </ScrollView>
            </Modal>
            {/* Passwort zurücksetzen */}
            <Modal visible={resetPwVisible} animationType='slide' onRequestClose={() => setResetPwVisible(false)}>
                <ScrollView alwaysBounceVertical={false} contentContainerStyle= {[boxes.mainContainer, {backgroundColor: themeColors.base}]}>
                    <Text style={[texts.titleCentered, {color: themeColors.textCopy}]}>Passwort zurücksetzen</Text>
                    <InputField 
                        showError={mailErrorVisible}
                        placeholderText={mailErrorVisible ? "Bitte eine E-Mail-Adresse eingeben." : "user@haw-hamburg.de"}
                        value={currentMail}
                        onChangeText={changeMailHandler}
                    />
                    <Button 
                        title="E-Mail senden" 
                        onPress={resetPwHandler}>
                    </Button>
                    <Button 
                        title="Abbrechen" 
                        onPress={() => {setResetPwVisible(false)}}
                        transparent={true}>
                    </Button>
                </ScrollView>
            </Modal>

            {/* Login */}
            <ScrollView alwaysBounceVertical={false} contentContainerStyle= {boxes.mainContainer}>
                <Text style={[texts.titleCentered, {color: themeColors.textCopy}]}>Login</Text>
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
                <Button 
                    title="Einloggen" 
                    onPress={logInHandler}>
                </Button>
                <Button 
                    title="Noch kein Konto? Registrieren" 
                    transparent={true}
                    onPress={() => {setRegisterHandler(true)}}>
                </Button>
                <Button 
                    title="Passwort zurücksetzen" 
                    onPress={() => {setResetPwVisible(true)}}
                    transparent={true}>
                </Button>
            </ScrollView>
        </View>
    );
    
};