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
            <HomeStack.Screen name = "Course" component = {CourseScreen} options={{headerTitle: 'Kurs', headerBackTitleVisible: false, headerLeftContainerStyle: {paddingLeft: 10}}}/>
            <HomeStack.Screen name = "Project" component= {IdeaScreen} options={{headerTitle: 'Idee', headerBackTitleVisible: false, headerLeftContainerStyle: {paddingLeft: 10}}}/>
            <HomeStack.Screen name = "IdeaSkills" component= {AttributeListScreen} options={{headerTitle: 'Passende Fähigkeiten', headerBackTitleVisible: false, headerLeftContainerStyle: {paddingLeft: 10}}}/>

        </HomeStack.Navigator>
    );
};