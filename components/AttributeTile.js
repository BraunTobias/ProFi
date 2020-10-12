import React, {useState} from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image} from "react-native";

import { icons, colors, boxes, texts } from '../Styles';

export default AttributeTile = props => {

    const [currentIcon, setCurrentIcon] = useState(props.state ? icons.checkTrue : icons.checkFalse);
    const [currentIconState, setCurrentIconState] = useState(props.state);
  
    const colorStyle = {
        backgroundColor: props.index % 2 === 0 ? colors.white : colors.lightGrey
    }

    const changeIconHandler = () => {
    
        if (currentIconState) {
          setCurrentIcon(icons.checkFalse)
          setCurrentIconState(false)
        }
        else {
          setCurrentIcon(icons.checkTrue)
          setCurrentIconState(true)
        }
        props.onPress(props.text);
    }
       
    return(
        <TouchableOpacity
            style={[boxes.attributeTile, colorStyle]}
            onPress={changeIconHandler}
        >
            <Image
                source={currentIcon}
                style={boxes.attributeCheckmark}
            />
            <Text 
                style = {[texts.subHeader, {color: currentIconState ? colors.darkGrey : colors.mediumBlue}]}
            > 
            {props.text} 
            </Text>
        </TouchableOpacity>
    )
}