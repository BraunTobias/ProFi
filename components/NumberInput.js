import React, { useContext } from 'react';
import InputSpinner from "react-native-input-spinner";

import { View, Text, StyleSheet } from 'react-native';
import { icons, texts } from '../Styles';
import { ThemeContext } from '../components/ThemeManager';

export default NumberInput = props => {

    const {themeColors} = useContext(ThemeContext);
  
    return (
        <View style={{flex: 1, maxWidth: 160}}>
            <Text style={[texts.subHeader, {color: themeColors.textCopy}]}>{props.title}</Text>
            <InputSpinner
                style={styles.numberInput}
                inputStyle={{
                    color: themeColors.textCopy,
                    fontSize: 18,
                    fontFamily: 'Inter_400Regular',
                }}
                buttonStyle={styles.numberInputButton}
                buttonPressStyle={styles.numberInputButton}
                initialValue={props.value}
                value={props.value}
                min= {2}
                max= {20}
                step= {1}
                colorLeft ={props.value <= 2 ? themeColors.secondary : themeColors.primary}
                colorRight ={props.value >= 20 ? themeColors.secondary : themeColors.primary}
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