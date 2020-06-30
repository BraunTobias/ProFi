import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import {Ionicons} from '@expo/vector-icons';
import RegistrationScreen from '../screens/RegistrationScreen';
import { styles, texts, white, iconsize } from '../Styles';

const AuthenticationStack = createStackNavigator();

export default AuthenticationNavigator = () => {
    return (
        <NavigationContainer>
            <AuthenticationStack.Navigator initialRouteName="Login" screenOptions={{
                headerStyle: styles.header,
                headerTitleStyle: texts.headerText,
                headerTintColor: 'white',
                headerBackImage: (()=>{return(<Ionicons name={'ios-arrow-back'} size={iconsize} color={white} />)})
            }}>
                <AuthenticationStack.Screen name = "Login" component= {LoginScreen} options={{headerTitle: 'Login'}}/>
                <AuthenticationStack.Screen name = "Registration" component = {RegistrationScreen} options={{headerTitle: 'Registrieren' }}/>
            </AuthenticationStack.Navigator>
        </NavigationContainer>
    );
};
