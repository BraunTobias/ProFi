import React from 'react';
import  {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CourseScreen from '../screens/CourseScreen';
import IdeaScreen from '../screens/IdeaScreen';
import AttributeListScreen from '../screens/AttributeListScreen';
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
            <HomeStack.Screen name = "Course" component = {CourseScreen} options={{headerTitle: 'Kurs', headerBackTitleVisible: false, headerLeftContainerStyle: {paddingHorizontal: 10}}}/>
            <HomeStack.Screen name = "Project" component= {IdeaScreen} options={{headerTitle: 'Idee', headerBackTitleVisible: false, headerLeftContainerStyle: {paddingHorizontal: 10}}}/>
            <HomeStack.Screen name = "IdeaSkills" component= {AttributeListScreen} options={{headerTitle: 'Passende Fähigkeiten', headerBackTitleVisible: false, headerLeftContainerStyle: {paddingHorizontal: 10}}}/>

        </HomeStack.Navigator>
    );
};