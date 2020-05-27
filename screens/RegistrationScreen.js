import React from 'react';
import {View, TextInput, Text} from 'react-native';
import {Button} from 'react-native-elements';

export default RegistrationScreen = ({navigation}) => {
    return(
        <View style={{flex:1, justifyContent: 'flex-start', alignItems: 'center'}}>
            <Text style={{
                    padding: 40,
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: 'tomato'
            }}>Registration</Text>
            
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text>Benutzername</Text>
                <TextInput placeholder="deincoolerbenutzername"/>
                <Text>E-Mail</Text>
                <TextInput placeholder="student@example.com"/>
                <Text>Passwort</Text>
                <TextInput placeholder="supersicherespasswort"/>
                <Button 
                    title= "Confirm"
                    onPress={() =>navigation.navigate("Main")}
                />
                <Button 
                    title= "Back"
                    onPress={() =>navigation.navigate("Login")}
                />
            </View>
        </View>
    );
}