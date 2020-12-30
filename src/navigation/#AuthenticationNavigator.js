import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
//import {Ionicons} from '@expo/vector-icons';
//import { Icon } from 'react-native-elements'
//import RegistrationScreen from '../screens/RegistrationScreen';
import { styles, texts, colors, iconsize } from '../Styles';

const AuthenticationStack = createStackNavigator();

export default function AuthenticationNavigator () {
    return (
        <NavigationContainer>
            <AuthenticationStack.Navigator 
                initialRouteName="Login" 
                screenOptions={{
                    headerStyle: styles.header,
                    headerTintColor: colors.white,
                    // headerBackImage: (()=>{return(
                    //     <Ionicons name={'ios-arrow-back'} size={iconsize} color={white} />
                    //     // <Icon
                    //     //     name='g-translate'
                    //     //     color='#00aced'
                    //     // />
                    // )})
                }}>
                <AuthenticationStack.Screen 
                    name = "Login" 
                    component= {LoginScreen} 
                    options={{
                        headerTitle: 'Login', 
                        headerTitleStyle: texts.header
                    }}
                />
                <AuthenticationStack.Screen 
                    name = "Registration" 
                    component = {LoginScreen} 
                    options={{
                        headerTitle: 'Registrieren', 
                        headerBackTitleVisible: false, 
                        headerLeftContainerStyle: {paddingHorizontal: 10}, 
                        headerTitleStyle: texts.header
                    }}
                />
            </AuthenticationStack.Navigator>
        </NavigationContainer>
    );
};