import React from 'react';
import {View, TouchableWithoutFeedback, Keyboard} from 'react-native';
import InputTile from '../components/InputTile';


export default InputScreen = ({route, navigation}) => {
    const{title} = route.params;

    const addHandler= name => {
        if (name !== ''){
            console.log("add this "+ name + " to "+ title)
            navigation.goBack();
        }
        
    }


    return(
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{flex:1, padding: 20}}>
                <InputTile placeholderText ={"Add " + title + " here:"} onAdd={addHandler}/>
            </View>
        </TouchableWithoutFeedback>
    );
}