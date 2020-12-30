import React, {useState} from "react";
import { Text, TouchableOpacity, Image} from "react-native";

import { icons, colors, boxes, texts } from '../Styles';

export default function AttributeTile (props) {

    const [currentIcon, setCurrentIcon] = useState(props.state ? icons.checkTrue : icons.checkFalse);
    const [currentIconState, setCurrentIconState] = useState(props.state);
  
    const colorStyle = {
        backgroundColor: props.index % 2 === 0 ? colors.white : colors.lightGrey
    }

    const changeIconHandler = () => {
    
        if (currentIconState) {
          setCurrentIconState(false);
          setCurrentIcon(icons.checkFalse);
        }
        else {
          setCurrentIconState(true);
          setCurrentIcon(icons.checkTrue);
        }
        props.onPress(props.text);
    }

    return(
        <TouchableOpacity
            style= { [boxes.attributeTile, colorStyle] }
            onPress= { changeIconHandler }
        >
            <Image
                style= { [ boxes.attributeCheckmark ] } 
                source= { currentIcon }
                resizeMode= "contain"
            />
            <Text 
                style = { [texts.subHeader, {color: currentIconState ? colors.darkGrey : colors.mediumBlue } ] }
            > 
                { props.text }
            </Text>
        </TouchableOpacity>
    )
}