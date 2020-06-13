import React from 'react';
import  {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import InputScreen from '../screens/InputScreen';
import CourseScreen from '../screens/CourseScreen';
import ProjectScreen from '../screens/ProjectScreen';

const HomeStack = createStackNavigator();

export default HomeNavigator = () => {
    return (
        <HomeStack.Navigator initialRouteName="Home" screenOptions={{
            headerStyle: {
                backgroundColor: "#222f56",
                height: 100,
            },
            headerTitleStyle: {
                fontSize: 32,
                fontWeight: 'bold',
                color: 'white',
            }
        }}>
            <HomeStack.Screen name = "Home" component= {HomeScreen} options={{headerTitle: 'Meine Kurse'}}/>
            <HomeStack.Screen name = "AddCourse" component = {InputScreen} options={{headerTitle: 'Kurs hinzufügen'}}/>
            <HomeStack.Screen name = "AddProject" component = {InputScreen} options={{headerTitle: 'Projekt hinzufügen'}}/>
            <HomeStack.Screen name = "Course" component = {CourseScreen} options={{headerTitle: 'Kurs', headerBackTitle: ' '}}/>
            <HomeStack.Screen name = "Project" component= {ProjectScreen} options={{headerTitle: 'Idee', headerBackTitle: ' '}}/>

        </HomeStack.Navigator>
    );
};