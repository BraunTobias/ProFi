import React, { useState, useContext } from 'react';
import { 
    View, 
    TouchableOpacity, 
    TouchableWithoutFeedback, 
    Text, 
    TextInput, 
    Keyboard, 
    Alert, 
    StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { LogInContext } from '../data/LogInContext';
//import FUNCTIONS from '../data/dummy-data';

export default FunctionsScreen = (props)  => {
    const [authentication, setAuthentication, user, setUser] = useContext(LogInContext);
    //const functions = FUNCTIONS;
    const user = props.user;

    return (
        <View>
            {/* Fähigkeiten-Header */}
            <View style={{ backgroundColor: 'tomato' }}>
                <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white' }}>Fähigkeiten</Text>
            </View>
            {/* Fähigkeiten-Body */}
            <View>
                <TextInput></TextInput>

                <FlatList
                    data={user.functions.design}
                    renderItem={(itemData) => { 
                        return (
                            <TouchableOpacity>
                                <Text> {itemData.item} </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        </View>
    )
}