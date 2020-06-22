import React from 'react';
import  {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import SkillSelect from '../components/SkillSelect';
import PreferenceScreen from '../screens/PreferenceScreen';
import { styles, texts } from '../Styles'

const ProfileStack = createStackNavigator();

export default ProfileNavigator = () => {
    return (
        <ProfileStack.Navigator initialRouteName="Profil" screenOptions={{
            headerStyle: styles.header,
            headerTitleStyle: texts.headerText
        }}>
            <ProfileStack.Screen name = "Mein Profil" component = {ProfileScreen}/>
            <ProfileStack.Screen name = "Fähigkeiten" component = {SkillSelect} options={{headerBackTitle: ' '}}/>
            <ProfileStack.Screen name = "Präferenzen" component = {PreferenceScreen} options={{headerBackTitle: ' '}}/>
        </ProfileStack.Navigator>
    );
};
