import React from 'react';
import  {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import InputScreen from '../screens/InputScreen';
import CourseScreen from '../screens/CourseScreen';
import ProjectScreen from '../screens/ProjectScreen';
import {Ionicons} from '@expo/vector-icons';
import { styles, texts, white, iconsize } from '../Styles'

const HomeStack = createStackNavigator();

export default HomeNavigator = () => {
    return (
        <HomeStack.Navigator initialRouteName="Home" screenOptions={{
            headerStyle: styles.header,
            headerTitleStyle: texts.headerText,
            headerTintColor: 'white',
            headerBackImage: (()=>{return(<Ionicons name={'ios-arrow-back'} size={iconsize} color={white} />)})
        }}>
            <HomeStack.Screen name = "Home" component= {HomeScreen} options={{headerTitle: 'Meine Kurse'}}/>
            <HomeStack.Screen name = "AddCourse" component = {InputScreen} options={{headerTitle: 'Kurs hinzufügen'}}/>
            <HomeStack.Screen name = "AddProject" component = {InputScreen} options={{headerTitle: 'Projekt hinzufügen'}}/>
            <HomeStack.Screen name = "Course" component = {CourseScreen} options={{headerTitle: 'Kurs', headerBackTitle: ' '}}/>
            <HomeStack.Screen name = "Project" component= {ProjectScreen} options={{headerTitle: 'Idee', headerBackTitle: ' '}}/>

        </HomeStack.Navigator>
    );
};