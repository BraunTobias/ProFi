import React from 'react';
import  {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import Skill2Screen from '../screens/Skill2Screen';
import PreferenceScreen from '../screens/PreferenceScreen';

const ProfileStack = createStackNavigator();

export default ProfileNavigator = () => {
    return (
        <ProfileStack.Navigator initialRouteName="Profil" screenOptions={{
            headerStyle: {height: 130},
            headerTitleStyle: {
                fontSize: 32,
                fontWeight: 'bold',
                color: 'tomato'
            }
        }}>
            <ProfileStack.Screen name = "Profil" component = {ProfileScreen}/>
            <ProfileStack.Screen name = "Fähigkeiten" component = {Skill2Screen}/>
            <ProfileStack.Screen name = "Präferenzen" component = {PreferenceScreen}/>
        </ProfileStack.Navigator>
    );
};
