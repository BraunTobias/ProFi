import React from 'react';
import  {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import InputScreen from '../screens/InputScreen';
import CourseScreen from '../screens/CourseScreen';
import IdeaScreen from '../screens/IdeaScreen';
import EvaluationScreen from '../screens/EvaluationScreen';
import AttributeListScreen from '../components/AttributeListScreen';
import { Ionicons } from '@expo/vector-icons';
import { styles, texts, white, iconsize } from '../Styles'

const HomeStack = createStackNavigator();

export default HomeNavigator = () => {
    return (
        <HomeStack.Navigator initialRouteName="Home" screenOptions={{
            headerStyle: styles.header,
            headerTitleStyle: texts.headerWithBackIcon,
            headerTintColor: white,
            headerBackImage: (()=>{return(<Ionicons style={styles.backIcon} name={'ios-arrow-back'} size={iconsize} color={white} />)})
        }}>
            <HomeStack.Screen name = "Home" component= {HomeScreen} options={{headerTitle: 'Meine Kurse', headerTitleStyle: texts.header}}/>
            <HomeStack.Screen name = "AddCourse" component = {InputScreen} options={{headerTitle: 'Kurs hinzufügen'}}/>
            <HomeStack.Screen name = "AddProject" component = {InputScreen} options={{headerTitle: 'Projekt hinzufügen'}}/>
            <HomeStack.Screen name = "Course" component = {CourseScreen} options={{headerTitle: 'Kurs', headerBackTitle: ' '}}/>
            <HomeStack.Screen name = "Project" component= {IdeaScreen} options={{headerTitle: 'Idee', headerBackTitle: ' '}}/>
            <HomeStack.Screen name = "Evaluation" component= {EvaluationScreen} options={{headerTitle: 'Dein Team', headerBackTitle: ' '}}/>
            <HomeStack.Screen name = "IdeaSkills" component= {AttributeListScreen} options={{headerTitle: 'Passende Fähigkeiten', headerBackTitle: ' '}}/>

        </HomeStack.Navigator>
    );
};