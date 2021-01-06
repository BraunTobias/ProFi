import React , {useEffect, useContext} from 'react';
import { NavigationContainer, } from '@react-navigation/native';
import { Image, StatusBar } from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { Appearance, AppearanceProvider, useColorScheme } from 'react-native-appearance';

import DB from '../api/DB_API';
import { icons, colors } from '../Styles';
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';
import { ThemeContext } from '../components/ThemeManager';

const Tab = createBottomTabNavigator(); 

export default MainNavigator = () => {

    const {themeColors} = useContext(ThemeContext);
          
    return(
        <NavigationContainer>
            <StatusBar barStyle="light-content"/>

            <Tab.Navigator 
                initialRouteName={"Home"}
                screenOptions={({ route }) => ({
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
                    activeTintColor: themeColors.textHl,
                    inactiveTintColor: themeColors.buttonInactive,
                    activeBackgroundColor: themeColors.secondary,
                    inactiveBackgroundColor: themeColors.secondary,
                    showLabel: false,
                    style: {
                        backgroundColor: themeColors.secondary,
                    },
                }}
            >
                <Tab.Screen
                    name = "Profile"
                    component = {ProfileStack}
                />
                <Tab.Screen
                    name = "Home" 
                    component = {HomeStack}
                />
            </Tab.Navigator>

        </NavigationContainer>
    )

}