import React from 'react';
import {View, TextInput, Text} from 'react-native';
import {Button} from 'react-native-elements';
import { BackHandler } from 'react-native';

export default LoginScreen = ({navigation}) => {
    return(
        <View style={{flex:1, justifyContent: 'flex-start', alignItems: 'center'}}>
            <Text style={{
                    padding: 40,
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: 'tomato'
            }}>Login</Text>
            
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Benutzername oder E-Mail</Text>
                <TextInput placeholder="student@example.com"/>
                <Text>Passwort</Text>
                <TextInput placeholder="supersicherespasswort"/>
                <Button 
                    title= "Login"
                    onPress={() =>navigation.navigate("Main")}
                />
                <Button 
                    title= "Registration"
                    onPress={() =>navigation.navigate("Registration")}
                />
                <Button 
                    title= "Beenden"
                    onPress={() =>BackHandler.exitApp()}
                />
            </View>
        </View>
    );
}