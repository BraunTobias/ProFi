import React from 'react';
import  {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import AttributeScreen from '../components/AttributeScreen';

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
            <ProfileStack.Screen name = "Fähigkeiten" component = {AttributeScreen} options={{headerBackTitle: ' '}}/>
            <ProfileStack.Screen name = "Präferenzen" component = {AttributeScreen} options={{headerBackTitle: ' '}}/>
        </ProfileStack.Navigator>
    );
};
