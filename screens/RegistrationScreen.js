import React, { useContext, useState } from 'react';
import { View, TextInput, Text, Modal } from 'react-native';
import { Button } from 'react-native-elements';
import { LogInContext } from '../data/LogInContext';
import { USERS } from '../data/dummy-data'
import DB from '../api/DB_API';
import { styles, buttons, texts } from '../Styles';

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
        DB.signUp(currentName, currentMail, currentPW, () => {setAuthentication(true)},error => {console.log(error); setErrorVisibility(true)});
    }

    return(
        <View style={styles.content}>

            <Modal visible={errorVisibility} transparent = {true}>
                <View style={ styles.error }>
                <Text style= { texts.headlineCenter } >Eine gültige E-Mail und Passwort eingeben.</Text>
                    <Button 
                        buttonStyle= { buttons.button1 }
                        titleStyle= { texts.buttonBlue }
                        title='OK'
                        onPress={() => setErrorVisibility(false)}
                    />
                </View>
            </Modal>
            
            <View style= { styles.loginInput } >
                <Text style= { texts.headline } >Benutzername</Text>
                <TextInput
                    textAlign={'center'}
                    style= { texts.inputText }
                    placeholder='Benutzername'
                    onChangeText={changeNameHandler}
                />
            </View>

            <View style= { styles.loginInput } >
                <Text style= { texts.headline } >E-Mail</Text>
                <TextInput
                    textAlign={'center'}
                    style= { texts.inputText }
                    placeholder='benutzer@haw-hamburg.de'
                    onChangeText={changeMailHandler}
                />
            </View>

            <View style= { styles.loginInput } >
                <Text style= { texts.headline } >Passwort</Text>
                <TextInput
                    textAlign={'center'}
                    style= { texts.inputText }
                    placeholder='min. 6 Zeichen'
                    onChangeText={changePWHandler}
                />
            </View>
            
            <Button 
                buttonStyle= { buttons.button1 }
                titleStyle= { texts.buttonBlue }
                title= "Registrieren"
                onPress={register}
                // onPress={() => {
                //     setUser(USERS[1])
                //     console.log("setUser(USERS[1])")
                //     setAuthentication(true)
                //     console.log("setAuthentication(true)")
                // }}
            />
        </View>
    );
}