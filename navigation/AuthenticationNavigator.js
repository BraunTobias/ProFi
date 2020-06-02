import React from 'react';
<<<<<<< HEAD
import {NavigationContainer} from '@react-navigation/native';
import  {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';

const AuthenticationStack = createStackNavigator();

export default AuthenticationNavigator = () => {
    return (
        <NavigationContainer>
            <AuthenticationStack.Navigator initialRouteName="Login" screenOptions={{
                headerStyle: {height: 130},
                headerTitleStyle: {
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: 'tomato'
                }
            }}>
                <AuthenticationStack.Screen name = "Login" component= {LoginScreen} options={{headerTitle: 'Login'}}/>
                <AuthenticationStack.Screen name = "Registration" component = {RegistrationScreen} options={{headerTitle: 'Registrieren'}}/>
            </AuthenticationStack.Navigator>
        </NavigationContainer>
    );
>>>>>>> a43f41048d95d9e92f3effc95e0f4f8c67132882
