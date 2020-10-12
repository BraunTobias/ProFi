import React from 'react';
import InputSpinner from "react-native-input-spinner";

import { View, TextInput, Text } from 'react-native';
import { icons, colors, boxes, texts } from '../Styles';

export default NumberInput = props => {
  
    return (
        <View>
            <Text style={texts.subHeader}>{props.title}</Text>
            <InputSpinner
                style={boxes.numberInput}
                inputStyle={texts.numberInput}
                buttonStyle={boxes.numberInputButton}
                buttonPressStyle={boxes.numberInputButton}
                initialValue={props.value}
                value={props.value}
                min= {2}
                max= {20}
                step= {1}
                // buttonPressStyle ={{opacity: "0.2"}}
                colorLeft ={props.value <= 2 ? colors.lightBlue : colors.darkBlue}
                colorRight ={props.value >= 20 ? colors.lightBlue : colors.darkBlue}
                onChange={props.onChange}
            />
        </View>
    );
};