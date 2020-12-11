import React from 'react';
import InputSpinner from "react-native-input-spinner";

import { View, TextInput, Text, StyleSheet } from 'react-native';
import { icons, colors, boxes, texts } from '../Styles';

export default NumberInput = props => {
  
    return (
        <View style={{flex: 1, maxWidth: 160}}>
            <Text style={texts.subHeader}>{props.title}</Text>
            <InputSpinner
                style={styles.numberInput}
                inputStyle={texts.numberInput}
                buttonStyle={styles.numberInputButton}
                buttonPressStyle={styles.numberInputButton}
                initialValue={props.value}
                value={props.value}
                min= {2}
                max= {20}
                step= {1}
                colorLeft ={props.value <= 2 ? colors.lightBlue : colors.darkBlue}
                colorRight ={props.value >= 20 ? colors.lightBlue : colors.darkBlue}
                onChange={props.onChange}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    numberInput: {
        maxWidth: "100%",
        alignItems: "center",
    },
    numberInputButton: {
        width: 40, 
        height: 40,
        borderRadius: 7
    },
});