import React, { useContext, useState } from 'react';
import { View, TextInput, Text, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Button from '../components/Button';
//import { LogInContext } from '../data/LogInContext';
//import { USERS } from '../data/dummy-data'
import DB from '../api/DB_API';
import { styles, buttons, texts } from '../Styles';

export default RegistrationScreen = ({navigation}) => {
    //const [authentication, setAuthentication, user, setUser] = useContext(LogInContext);
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
                        placeholderText= "######"
                        value= { currentPW }
                        onChangeText= { changePWHandler }
                    />
                </View>
                <View style= { styles.center }>
                    <ButtonSimple 
                        title= "Registrieren"
                        onClick= { register }
                    />
                </View>
            </ScrollView>
        </View>
    );
}