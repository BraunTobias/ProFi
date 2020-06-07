import React, { useState, useLayoutEffect } from 'react';
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
import { FlatList } from 'react-native-gesture-handler';
import {Ionicons} from '@expo/vector-icons';
//import FUNCTIONS from '../data/dummy-data';

export default FunctionsScreen = ({navigation})  => {
    // const [authentication, setAuthentication, user, setUser] = useContext(LogInContext);
    // const functions = FUNCTIONS;
    // const userProp = props.user;
    const [skills, setSkills] = useState ([
        { name: 'Programmieren', id: '1' },
        { name: 'Design', id: '2' },
        { name: 'Sozial', id: '3' },
        { name: 'Sonstiges', id: '4' },
    ]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight : () => (
                <Button 
                    type ='clear'
                    icon={<Ionicons name='ios-add' size={32} color="rgb(0,122,255)"/>}
                    // onPress={() => Modal}
                />)
        });
    }, [navigation]);


    return (
        <View>
            {/* Fähigkeiten-Body */}
            <View>
                <FlatList 
                    keyExtractor={(item) => (item.id)}
                    data={skills}
                    renderItem={({ item }) => (
                        <Text style={styles.item}>{item.name}</Text>
                    )}
                />
                {/* <FlatList
                    data={userProp.functions.design}
                    renderItem={(itemData) => { 
                        return (
                            <TouchableOpacity>
                                <Text> {itemData.item} </Text>
                            </TouchableOpacity>
                        );
                    }}
                /> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        marginTop: 24,
        padding: 30,
        backgroundColor: 'tomato',
        color: 'white',
        fontSize: 24,
        marginHorizontal: 10
    }
})