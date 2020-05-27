import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import MainNavigator from '../navigation/MainNavigator';

const AuthenticationNavigator = createSwitchNavigator({
    Login: LoginScreen,
    Registration: RegistrationScreen,
    Main: MainNavigator,
});

export default createAppContainer(AuthenticationNavigator);
