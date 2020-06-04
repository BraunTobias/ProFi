import React from 'react';
import  {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import FunctionsScreen from '../screens/FunctionsScreen';

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
            <ProfileStack.Screen name = "Functions" component = {FunctionsScreen}/>
        </ProfileStack.Navigator>
    );
};
