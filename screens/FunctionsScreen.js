import React, { useState, useLayoutEffect, Component } from 'react';
import { 
    View, 
    TouchableOpacity, 
    TouchableWithoutFeedback, 
    Text, 
    TextInput, 
    Keyboard, 
    Alert, 
    StyleSheet
    } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';
import {Ionicons} from '@expo/vector-icons';
import CheckboxList from "rn-checkbox-list";
//import FUNCTIONS from '../data/dummy-data';

export default FunctionsScreen = ({navigation})  => {
    // const [authentication, setAuthentication, user, setUser] = useContext(LogInContext);
    // const functions = FUNCTIONS;
    // const userProp = props.user;

    const [skills, setSkills] = useState ([
        { name: 'Programmieren', id: '1' },
        { name: 'Design', id: '2' },
        { name: 'Sozial', id: '3' },
        { name: 'Grafik', id: '4' },
        { name: 'Sonstiges', id: '5' },
    ]);

    return (
        <View>
            {/* Fähigkeiten-Header */}
            <View style={{justifyContent: 'center', flexDirection: 'row', backgroundColor: 'tomato'}}>
                {/* Programmierung */}
                <TouchableHighlight 
                    onPress={()=>{}}
                    underlayColor="tomato"
                    >
                    <Icon 
                        class="toggle"
                        raised
                        name={"ios-desktop"} 
                        size={35} 
                        type="ionicon"
                        color={"tomato"} 
                    />
                </TouchableHighlight>
                {/* Design */}
                <TouchableHighlight 
                    onPress={()=>{}}
                    underlayColor="tomato"
                >
                <Icon 
                    raised 
                    name={"ios-color-palette"} 
                    size={35} 
                    type="ionicon"
                    color={"tomato"} 
                />
                </TouchableHighlight>
                {/* Sozial */}
                <TouchableHighlight 
                    onPress={()=>{}}
                    underlayColor="tomato"
                >
                <Icon 
                    raised 
                    name={"ios-people"} 
                    size={35} 
                    type="ionicon"
                    color={"tomato"} 
                />
                </TouchableHighlight>
                {/* Audio */}
                <TouchableHighlight 
                    onPress={()=>{}}
                    underlayColor="tomato"
                >
                <Icon 
                    raised 
                    name={"ios-volume-high"} 
                    size={35} 
                    type="ionicon"
                    color={"tomato"} 
                />
                </TouchableHighlight>
            </View>
            {/* Fähigkeiten-Body */}
            {/* <View style={{ flexDirection: 'column'}}>
            <CheckboxList
                headerName="Movies"
                theme="red"
                listItems={data}
                onChange={(data) => console.log("My updated list :: ", data)}
                listItemStyle={{ borderBottomColor: '#eee', borderBottomWidth: 1 }}
                onLoading={() => (<LoaderComponent />)}
            />
            </View> */}
            <View>
                <FlatList 
                    keyExtractor={(item) => (item.id)}
                    data={skills}
                    renderItem={({ item }) => (
                        <Text style={styles.item}>{item.name}</Text>
                    )}
                    scrollEnabled= {true}
                />
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