import React from 'react';
import  {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import SkillSelect from '../components/SkillSelect';
import PreferenceScreen from '../screens/PreferenceScreen';

const ProfileStack = createStackNavigator();

export default ProfileNavigator = () => {
    return (
        <ProfileStack.Navigator initialRouteName="Profil" screenOptions={{
            headerStyle: {
                height: 100,
                backgroundColor: "#222f56"
            },
            headerTitleStyle: {
                fontSize: 32,
                fontWeight: 'bold',
                color: 'white',
            }
        }}>
            <ProfileStack.Screen name = "Mein Profil" component = {ProfileScreen}/>
            <ProfileStack.Screen name = "Fähigkeiten" component = {SkillSelect} options={{headerBackTitle: ' '}}/>
            <ProfileStack.Screen name = "Präferenzen" component = {PreferenceScreen} options={{headerBackTitle: ' '}}/>
        </ProfileStack.Navigator>
    );
};
