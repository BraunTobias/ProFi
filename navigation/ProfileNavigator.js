import React from 'react';
import  {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';

const ProfileStack = createStackNavigator();

export default ProfileNavigator = () => {
    return (
<<<<<<< HEAD
>>>>>>> a43f41048d95d9e92f3effc95e0f4f8c67132882
            headerStyle: {height: 130},
            headerTitleStyle: {
                fontSize: 32,
                fontWeight: 'bold',
                color: 'tomato'
            }
        }}>
            <ProfileStack.Screen name = "Profile" component = {ProfileScreen}/>
        </ProfileStack.Navigator>
    );
};