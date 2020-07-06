import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { StatusBar, Image } from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { darkBlue, lightBlue, lightGrey, icons } from '../Styles';

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
                        iconName = icons.home;
                    } else if (route.name === 'Profile') {
                        iconName = icons.profile;
                    }
                    
                    return <Image source={iconName} style= { { width: 25, height: 25, tintColor: color}}/>;
                },
                })}
                tabBarOptions={{
                    activeTintColor: darkBlue,
                    inactiveTintColor: lightGrey,
                    activeBackgroundColor: lightBlue,
                    inactiveBackgroundColor: lightBlue,
                    showLabel: false,
                    style: {
                        backgroundColor: lightBlue,
                    },
                }}
            >

                <Tab.Screen name = "Home" component ={HomeNavigator}/>
                <Tab.Screen name = "Profile" component={ProfileNavigator}/>
                                
            </Tab.Navigator>
        </NavigationContainer>
    );
};