import React, { useState, useContext } from 'react';
import { View, TextInput, Text, Modal, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import { BackHandler } from 'react-native';
import { LogInContext } from '../data/LogInContext';
import { USERS } from '../data/dummy-data'
import DB from '../api/DB_API';
import { styles, buttons, texts } from '../Styles'

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
        DB.logIn(currentMail, currentPW, (error) => {setErrorVisibility(true)});
    }

    return(
        <View style={styles.content}>

            <Modal visible={errorVisibility} transparent = {true}>
                <View style={styles.error}>
                    <Text style= { texts.headlineCenter } >Falsche E-Mail oder Passwort eingegeben.</Text>
                    <Button 
                        buttonStyle= { buttons.buttonColumn }
                        titleStyle= { texts.buttonBlueCenter }
                        title='OK'
                        onClick={() => setErrorVisibility(false)}
                    />

                </View>
            </Modal>
            
            <View style= { styles.loginInput } >
                <Text style= { texts.headline } >E-Mail</Text>
                <TextInput
                    textAlign= {'center'}
                    style= { texts.inputText }
                    placeholder= "benutzer@haw-hamburg.de"
                    onChangeText= { changeMailHandler }
                />
            </View>

            <View style= { styles.loginInput } >
                <Text style= { texts.headline } >Passwort</Text>
                <TextInput
                    textAlign= {'center'}
                    style= { texts.inputText }
                    placeholder="######"
                    onChangeText={changePWHandler}
                />
            </View>

            <Button 
                buttonStyle= { buttons.buttonColumn }
                titleStyle= { texts.buttonBlueCenter }
                title= "Login"
                onClick={checkAuth}
            />

            <Button 
                buttonStyle={ buttons.buttonColumn }
                titleStyle= { texts.buttonBlueCenter }
                title= "Registrieren"
                onClick={() =>navigation.navigate("Registration")}
            />

            <Button 
                buttonStyle={ buttons.buttonColumn }
                titleStyle= { texts.buttonBlueCenter }
                title= "Beenden"
                onClick={() =>BackHandler.exitApp()}
            />
        </View>
    );
}