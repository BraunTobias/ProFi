import React from 'react';
import {createStackNavigator, HeaderBackground} from '@react-navigation/stack';

import { icons, colors, boxes, texts } from '../Styles';
import HomeScreen from '../screens/HomeScreen';
import CourseScreen from '../screens/CourseScreen';
import IdeaScreen from '../screens/IdeaScreen';
import AttributeListScreen from '../screens/AttributeListScreen';

const HomeStack = createStackNavigator();

export default HomeNavigator = () => {
    return (
        <HomeStack.Navigator 
            initialRouteName="Home" 
            screenOptions={{
                headerStyle: boxes.header,
                headerTitleStyle: texts.header,
                headerTintColor: colors.white,
            }}
            navigationOptions={{backgroundColor: "red"}}
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
                            marginHorizontal: 10
                        }
                    }}
                />
                <HomeStack.Screen 
                    name = "Idea" 
                    component = {IdeaScreen} 
                    options={{
                        headerBackTitleVisible: false, 
                        headerLeftContainerStyle: {
                            marginHorizontal: 10
                        }
                    }}
                />
                <HomeStack.Screen 
                    name = "IdeaAttributes" 
                    component = {AttributeListScreen} 
                    options={{
                        headerBackTitleVisible: false, 
                        headerLeftContainerStyle: {
                            marginHorizontal: 10
                        }
                    }}
                />
        </HomeStack.Navigator>
    );
};