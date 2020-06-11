import React, { useContext, useState } from 'react';
import { View, TextInput, Text, Modal } from 'react-native';
import { Button } from 'react-native-elements';
import { LogInContext } from '../data/LogInContext';
import { USERS } from '../data/dummy-data'
import DB from '../api/DB_API';

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
        <View style={{flex:1, justifyContent: 'flex-start', alignItems: 'center'}}>
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Modal visible={errorVisibility} transparent = {true}>
                    <View style={{flex: 1, margin: 100, marginBottom: 300, marginTop: 300, padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
                        <Text>Error.</Text>
                        <Button title='OK'onPress={() => setErrorVisibility(false)}/>
                    </View>
                </Modal>
                
                <Text>Benutzername</Text>
                <TextInput
                    placeholder="Benutzername"
                    onChangeText={changeNameHandler}
                />
                <Text>E-Mail</Text>
                <TextInput
                    placeholder="student@example.com"
                    onChangeText={changeMailHandler}
                />
                <Text>Passwort</Text>
                <TextInput
                    placeholder="####"
                    onChangeText={changePWHandler}
                />
                <Button 
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
        </View>
    );
}