import React, {useContext} from 'react';
import { View } from 'react-native';
import {createStackNavigator, HeaderBackground} from '@react-navigation/stack';

import { icons, colors, boxes, texts } from '../Styles';
import HomeScreen from '../screens/HomeScreen';
import CourseScreen from '../screens/CourseScreen';
import IdeaScreen from '../screens/IdeaScreen';
import AttributeListScreen from '../screens/AttributeListScreen';
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
                    component= {HomeScreen} 
                    options={{
                        headerTitle: 'Meine Kurse', 
                    }}
                />
                <HomeStack.Screen 
                    name = "Course" 
                    component = {CourseScreen} 
                    options={{
                        headerBackTitleVisible: false, 
                        headerLeftContainerStyle: {
                            marginHorizontal: 10,
                        },
                        headerRight: () => (
                            <View style={{width: 60}}></View>
                        )                
                    }}
                />
                <HomeStack.Screen 
                    name = "Idea" 
                    component = {IdeaScreen} 
                    options={{
                        headerBackTitleVisible: false, 
                        headerLeftContainerStyle: {
                            marginHorizontal: 10
                        },
                        headerRight: () => (
                            <View style={{width: 60}}></View>
                        )              
                    }}
                />
                <HomeStack.Screen 
                    name = "IdeaAttributes" 
                    component = {AttributeListScreen} 
                    options={{
                        headerBackTitleVisible: false, 
                        headerLeftContainerStyle: {
                            marginHorizontal: 10
                        },
                        headerRight: () => (
                            <View style={{width: 60}}></View>
                        )   
                    }}
                />
        </HomeStack.Navigator>
    );
};