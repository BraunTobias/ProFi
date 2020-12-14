import React, {useContext} from 'react';
import { View } from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import { icons, colors, boxes, texts } from '../Styles';
import ProfileScreen from '../screens/ProfileScreen';
import AttributeScreen from '../screens/AttributeScreen';
import { ThemeContext } from '../components/ThemeManager';

const HomeStack = createStackNavigator();

export default HomeNavigator = () => {

    const {themeColors} = useContext(ThemeContext);

    return (
        <HomeStack.Navigator 
            initialRouteName="Home" 
            screenOptions={{
                headerStyle: {backgroundColor: themeColors.primary},
                headerTitleStyle: texts.header,
                headerTintColor: themeColors.textHighlight,
            }}
        >
            <HomeStack.Screen 
                name = "Home" 
                component= {ProfileScreen} 
                options={{
                    headerTitle: 'Mein Profil', 
                }}
            />
            <HomeStack.Screen 
                name = "Attributes" 
                component = {AttributeScreen} 
                options={{
                    headerTitle: 'Attribute', 
                    headerBackTitleVisible: false, 
                    headerLeftContainerStyle: {
                        marginHorizontal: 10
                    },
                    headerRight: () => (
                        <View style={{width: 60}}></View>
                    ),
                }}
            />
        </HomeStack.Navigator>
    );
};