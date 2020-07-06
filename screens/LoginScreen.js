import React, { useState } from 'react';
import { View, Text, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DB from '../api/DB_API';
import ButtonSimple from '../components/ButtonSimple';
import InputTile from '../components/InputTile';
import { styles, texts, buttons } from '../Styles';


export default LoginScreen = ({navigation}) => {
    const [currentMail, setCurrentMail] = useState("");
    const [currentPW, setCurrentPW] = useState("");
    const [errorVisibility, setErrorVisibility] = useState(false);

    // Benutzereingaben
    const changeMailHandler = (enteredText) => {
        //console.log(currentMail)
        setCurrentMail(enteredText);
    };
    const changePWHandler = (enteredText) => {
        //console.log(currentPW)
        setCurrentPW(enteredText);
    };
    
    // Authentifizierung
    const checkAuth = () => {
        //console.log(currentMail + " " + currentPW)
        DB.logIn(currentMail, currentPW, (error) => { setErrorVisibility(true) });
    }

    return(
        <View style={styles.content}>
            <Modal visible={errorVisibility} transparent = {true}>
                <View style={styles.errorView}>
                    <View style={styles.errorContainer}>
                        <Text style= { texts.headlineCenter } >
                            Falsche E-Mail oder Passwort eingegeben.
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
                        title= "Login"
                        onClick= { checkAuth }
                        style= { buttons.buttonSimple }
                    />
                    <ButtonSimple 
                        title= "Registrieren"
                        onClick= { () => navigation.navigate("Registration") }
                        style= { buttons.buttonSimple }
                    />
                </View>
            </ScrollView>
        </View>
    );
}