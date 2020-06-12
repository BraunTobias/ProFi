import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import DB from '../api/DB_API';

import HomeNavigator from './HomeNavigator';
import ProfileNavigator from './ProfileNavigator';

const Tab = createBottomTabNavigator();

export default MainNavigator = () => {

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
                    /*
                    else if (route.name === 'Logout') {
                        iconName = 'ios-log-out';
                    } 
                    */

                    return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
                tabBarOptions={{
                    activeTintColor: 'tomato',
                    inactiveTintColor: 'gray',
                }}
            >
                <Tab.Screen name = "Home" component ={HomeNavigator}/>
                <Tab.Screen name = "Profile" component={ProfileNavigator}/>
                                
            </Tab.Navigator>
        </NavigationContainer>
    );
};