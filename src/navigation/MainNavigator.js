import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CourseScreen from '../screens/CourseScreen';
import IdeaScreen from '../screens/IdeaScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { boxes, texts, colors } from '../Styles';
import AttributeListScreen from '../screens/AttributeListScreen';

const MainStack = createStackNavigator();

export default function AuthenticationNavigator () {

    return (
        <NavigationContainer>
            <MainStack.Navigator 
                initialRouteName="Login" 
                screenOptions={{
                    headerStyle: boxes.header,
                    headerTitleStyle: texts.header,
                    headerTintColor: colors.white,
            }}>
                <MainStack.Screen 
                    name = "Home" 
                    component= {HomeScreen} 
                    options={{
                        headerTitle: 'Meine Kurse', 
                        headerLeftContainerStyle: {
                            marginHorizontal: 15,
                            paddingLeft: '12.5%'
                        },
                        headerRightContainerStyle: {
                            marginHorizontal: 15,
                            paddingRight: '12.5%'
                        },
                    }}
                />
                <MainStack.Screen 
                    name = "Course" 
                    component = {CourseScreen} 
                    options={{
                        headerLeftContainerStyle: {
                            marginHorizontal: 15,
                            paddingLeft: '12.5%'
                        },
                        headerRightContainerStyle: {
                            marginHorizontal: 15,
                            paddingRight: '12.5%'
                        },
                    }}
                />
                <MainStack.Screen 
                    name = "Idea" 
                    component = {IdeaScreen} 
                    options={{
                        headerLeftContainerStyle: {
                            marginHorizontal: 15,
                            paddingLeft: '12.5%'
                        },
                        headerRightContainerStyle: {
                            marginHorizontal: 15,
                            paddingRight: '12.5%'
                        },
                    }}
                />
                <MainStack.Screen 
                    name = "Mein Profil" 
                    component = {ProfileScreen} 
                    options={{
                        headerLeftContainerStyle: {
                            marginHorizontal: 15,
                            paddingLeft: '12.5%'
                        },
                        headerRightContainerStyle: {
                            marginHorizontal: 15,
                            paddingRight: '12.5%'
                        },
                    }}
                />
            </MainStack.Navigator>
        </NavigationContainer>
    );
};