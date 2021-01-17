import React, { useState } from 'react';
import { View, Text, Modal, ScrollView, useWindowDimensions } from 'react-native';
import DB from '../api/DB_API';
import ButtonLarge from '../components/ButtonLarge';
import ButtonIcon from '../components/ButtonIcon';
import InputField from '../components/InputField';
import ModalContent from "../components/ModalContent";
import { texts, boxes, colors } from '../Styles';
import Padding from '../components/Padding';

//export default function LoginScreen ({navigation}) {
export default function LoginScreen () {
    
    // State Hooks
    const [currentMail, setCurrentMail] = useState("");
    const [currentPW, setCurrentPW] = useState("");
    const [currentName, setCurrentName] = useState("");
    const [currentConfirmPW, setCurrentConfirmPW] = useState("");
    const [currentMailError, setCurrentMailError] = useState("");
    const [currentPWError, setCurrentPWError] = useState("");
    const [currentNameError, setCurrentNameError] = useState("");
    const [currentConfirmPWError, setCurrentConfirmPWError] = useState("");

    // State Hooks für Modals
    const [registerVisible, setRegisterVisible] = useState(false);

    // Benutzereingaben-Handling
    const changeMailHandler = (enteredText) => {
        setCurrentMail(enteredText);
    };
    const changePWHandler = (enteredText) => {
        setCurrentPW(enteredText);
    };
    const changeConfirmPWHandler = (enteredText) => {
        setCurrentConfirmPW(enteredText);
    };
    const changeNameHandler = (enteredText) => {
        setCurrentName(enteredText);
    };
    const setRegisterHandler = (visible) => {
        setRegisterVisible(visible);
        setCurrentMail("");
        setCurrentPW("");
        setCurrentConfirmPW("");
        setCurrentName("");
        setCurrentNameError("");
        setCurrentMailError("");
        setCurrentPWError("");
        setCurrentConfirmPWError("");
    };

    // Login
    const logIn = () => {
        if (currentPW != "" && currentMail != "") {
            DB.logIn(currentMail, currentPW, (error) => {
                switch (error.code) {
                    case "auth/invalid-email": setCurrentMailError("Bitte eine gültige E-Mail-Adresse eingeben."); break;
                    case "auth/user-not-found": setCurrentMailError("Dieser User existiert nicht."); break;
                    case "auth/wrong-password": setCurrentPWError("Falsches Passwort eingegeben."); setCurrentPW(""); break;
                }
            });
        }
    }
    
    // Registrierung
    const registerHandler = () => {
        if (currentName != "" && currentPW.length >= 6 && currentMail != "" && currentPW == currentConfirmPW) {
            DB.signUp(currentName, currentMail, currentPW, () => {}, (error) => {
                switch (error.code) {
                    case "auth/email-already-in-use": setCurrentMailError("Diese E-Mail-Adresse ist schon vergeben."); break;
                    case "auth/invalid-email": setCurrentMailError("Bitte eine gültige E-Mail-Adresse eingeben."); break;
                }
                setCurrentPWError("");
                setCurrentConfirmPWError("");
            });
        } else {
            if (currentName == "") setCurrentNameError("Bitte einen Namen eingeben.");
            else setCurrentMailError("");
            
            if (currentMail == "") setCurrentMailError("Bitte eine E-Mail-Adresse eingeben.");
            else setCurrentMailError("");
            
            if (currentPW.length < 6) { 
                setCurrentPWError("Bitte mind. 6 Zeichen eingeben."); 
                setCurrentPW("");
                setCurrentConfirmPW("");
            } else setCurrentPWError("");

            if (currentPW != currentConfirmPW) setCurrentConfirmPWError( "Passwörter stimmen nicht überein.");
            else setCurrentConfirmPWError("");
        }
    }

    const ErrorInfoHandler = ( props ) => {
        if (props.visible) return (
            <Text style= { [boxes.unPaddedRow, texts.errorLine] } >
                { props.message }
            </Text>
        );
        else return (
            <Padding height= { 18.5 } />
        );
    }

    return(
        <View style= { { height: useWindowDimensions().height } } >
            
            {/* Registrierung */}
            <Modal 
                transparent= {true}
                visible= { registerVisible } 
                animationType= 'slide' 
                style= { { 
                    width: window.width,
                    height: window.height,
            } } >
                <View style= { {
                    flex: 1,
                    marginTop: 80,
                    height: '100%',
                    width: '100%',
                    backgroundColor: colors.lightGrey,
                } } >
                    <View style= { [boxes.subHeader, {
                        height: 70,
                        width: window.width,
                        justifyContent: 'center',
                        alignContent: 'center',
                    } ] } >
                        <Text style= { [texts.titleCentered, { alignSelf: 'center' }] } >Registrieren</Text>
                    </View>
                    <ScrollView contentContainerStyle= { [boxes.mainContainer, { alignItems: 'center' } ] } >
                        <InputField 
                            title= "Username"
                            placeholderText= "Username"
                            value= { currentName }
                            onChangeText= { changeNameHandler }
                        />
                        <ErrorInfoHandler 
                            visible= { currentNameError }
                            message= { currentNameError }
                        />
                        <InputField 
                            title= "E-Mail-Adresse"
                            placeholderText= "user@haw-hamburg.de"
                            value= { currentMail }
                            onChangeText= { changeMailHandler }
                        />
                        <ErrorInfoHandler 
                            visible= { currentMailError }
                            message= { currentMailError }
                        />
                        <InputField 
                            title= "Passwort"
                            secureTextEntry= { true }
                            placeholderText= "mind. 6 Zeichen"
                            value= { currentPW }
                            onChangeText= { changePWHandler }
                        />
                        <ErrorInfoHandler 
                            visible= { currentPWError }
                            message= { currentPWError }
                        />
                        <InputField 
                            title= "Passwort bestätigen"
                            secureTextEntry= { true }
                            placeholderText= "Passwort bestätigen"
                            value= { currentConfirmPW }
                            onChangeText= { changeConfirmPWHandler }
                        />
                        <ErrorInfoHandler 
                            visible= { currentConfirmPWError }
                            message= { currentConfirmPWError }
                        />
                        <ButtonLarge 
                            title= "Konto anlegen" 
                            onPress= { registerHandler } 
                        />
                        <ButtonLarge 
                            title= "Schon ein Konto? Anmelden" 
                            onPress= { () => { setRegisterHandler(false) } }
                            transparent= { true } 
                        />
                    </ScrollView>
                </View>
            </Modal>

            {/* Login */}
            <View style= { { 
                height: '100%', 
                backgroundColor: colors.lightGrey} } >
                
                {/* Fake Header */}
                <View style= { boxes.headerFake } >
                    <ButtonIcon
                        icon= { "logo" }
                        status= { "color" }
                        onPress= { () => {  } }
                    />
                    <Text style= { texts.header } >ProFi</Text>
                    <View style= { boxes.buttonIconActive } />
                </View>

                {/* Subheader */}
                <View style= { [boxes.subHeader, { height: 70, justifyContent: 'center'} ] } >
                    <Text style= { [texts.titleCentered, { alignSelf: 'center' }] } >Login</Text>
                </View>

                {/* Content */}
                <ScrollView contentContainerStyle= { [boxes.mainContainer, { alignItems: 'center' } ] } >
                {/* <View style= { boxes.mainContainer } > */}
                    <InputField
                        title= "E-Mail"
                        placeholderText= "benutzer@haw-hamburg.de"
                        value= { currentMail }
                        onChangeText= { changeMailHandler }
                    />
                    <ErrorInfoHandler 
                        visible= { currentMailError }
                        message= { currentMailError }
                    />
                    <InputField 
                        title= "Passwort"
                        secureTextEntry= { true }
                        placeholderText= "mind. 6 Zeichen"
                        value= { currentPW }
                        onChangeText= { changePWHandler }
                    />
                    <ErrorInfoHandler 
                        visible= { currentPWError }
                        message= { currentPWError }
                    />
                    <ButtonLarge 
                        title= "Einloggen"
                        onPress= { logIn }
                    />
                    <ButtonLarge 
                        title= "Noch kein Konto? Registrieren" 
                        transparent= { true }
                        onPress= { () => { setRegisterHandler(true) } }
                    />
                {/* </View> */}
                </ScrollView>
            </View>
        </View>
    );
}