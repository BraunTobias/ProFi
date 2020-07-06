import React, { useState } from 'react';
import { View, Text, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DB from '../api/DB_API';
import { styles, buttons, texts } from '../Styles';

export default RegistrationScreen = ({navigation}) => {
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
        DB.signUp(currentName, currentMail, currentPW, () => {setAuthentication(true)},error => {console.log(error); setErrorVisibility(true)});
    }

    return(
        <View style={styles.content}>
            <Modal visible={errorVisibility} transparent = {true}>
                <View style={styles.errorView}>
                    <View style={styles.errorContainer}>
                        <Text style= { texts.headlineCenter } >
                            Eine gültige E-Mail und Passwort eingeben.
                        </Text>
                        <ButtonSimple
                            title='OK'
                            onClick={() => setErrorVisibility(false)}
                            style= { buttons.buttonSimple }
                        />
                    </View>
                </View>
            </Modal>
            
            <ScrollView style= { styles.scrollView }>
                <View style= { styles.center }>
                    <InputTile 
                        title= "Benutzername"
                        placeholderText= "Benutzername"
                        value= { currentName }
                        onChangeText= { changeNameHandler }
                    />
                    <InputTile 
                        title= "E-Mail"
                        placeholderText= "benutzer@haw-hamburg.de"
                        value= { currentMail }
                        onChangeText= { changeMailHandler }
                    />
                    <InputTile 
                        title= "Passwort"
                        secureTextEntry={true}
                        placeholderText= "mind. 6 Zeichen"
                        value= { currentPW }
                        onChangeText= { changePWHandler }
                    />
                </View>
                <View style= { styles.center }>
                    <ButtonSimple 
                        style= { buttons.buttonSimple }
                        title= "Registrieren"
                        onClick= { register }
                    />
                </View>
            </ScrollView>
        </View>
    );
}