import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { StatusBar } from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import DB from '../api/DB_API';
import { darkBlue, lightBlue, lightGrey, darkGrey } from '../Styles';

import HomeNavigator from './HomeNavigator';
import ProfileNavigator from './ProfileNavigator';

const Tab = createBottomTabNavigator();

export default MainNavigator = () => {

    StatusBar.setBarStyle('light-content', true);

    return(
        <NavigationContainer>
            <Tab.Navigator screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
        
                    if (route.name === 'Home') {
                        iconName = 'ios-home';
                    } else if (route.name === 'Profile') {
                        iconName = 'ios-contact';
                    }
                    
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                })}
                tabBarOptions={{
                    activeTintColor: darkBlue,
                    inactiveTintColor: lightGrey,
                    activeBackgroundColor: darkGrey,
                    inactiveBackgroundColor: darkGrey,
                    showLabel: false,
                    style: {
                        backgroundColor: darkGrey,
                    },
                }}
            >

                <Tab.Screen name = "Home" component ={HomeNavigator}/>
                <Tab.Screen name = "Profile" component={ProfileNavigator}/>
                                
            </Tab.Navigator>
        </NavigationContainer>
    );
};