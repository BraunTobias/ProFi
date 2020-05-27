import React from 'react';
import {View, Text, BackHandler } from 'react-native';
import {Button} from 'react-native-elements';

export default ProfileScreen =  ({navigation})  => {
    return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text>ProfileScreen!</Text>
        </View>
    );
}