import React from 'react';
import  {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import AttributeScreen from '../components/AttributeScreen';
import { Ionicons } from '@expo/vector-icons';
import { styles, texts, white, iconsize } from '../Styles'

const ProfileStack = createStackNavigator();

export default ProfileNavigator = () => {
    return (
        <ProfileStack.Navigator initialRouteName="Profil" screenOptions={{
            headerStyle: styles.header,
            headerTintColor: 'white',
            headerBackImage: ( () => { return ( <Ionicons name= { 'ios-arrow-back' } size= { iconsize } color= { white } />)})
        }}>
            <ProfileStack.Screen 
                name = "Mein Profil" 
                component = { ProfileScreen } 
                options= { { headerTitleStyle: texts.header } }
            />
            <ProfileStack.Screen 
                name = "Fähigkeiten" 
                component = { AttributeScreen }
                 options= { { headerBackTitle: ' ', headerTitleStyle: texts.headerWithBackIcon } }
            />
        </ProfileStack.Navigator>
    );
};
