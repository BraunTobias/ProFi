import React from 'react';
import  {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import FunctionsScreen from '../screens/FunctionsScreen';
import SkillScreen from '../screens/SkillScreen';
import Skill2Screen from '../screens/Skill2Screen';

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
            {/* <ProfileStack.Screen name = "Fähigkeiten" component = {FunctionsScreen}/> */}
            <ProfileStack.Screen name = "Fähigkeiten" component = {Skill2Screen}/>
            {/* <ProfileStack.Screen name = "Fähigkeiten" component = {SkillScreen}/> */}
            {/* <ProfileStack.Screen name = "Interessen" component = {InterestsScreen}/> */}
        </ProfileStack.Navigator>
    );
};
