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
            style={[styles.attributeTile, colorStyle]}
            onPress={changeIconHandler}
        >
            <Image
                source={currentIcon}
                tintColor={colors.darkBlue}
                style={styles.attributeCheckmark}
            />
            <Text 
                style = {[texts.subHeader, {color: currentIconState ? colors.darkGrey : colors.mediumBlue}]}
            > 
            {props.text} 
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    attributeTile: {
        paddingLeft: 15,
        paddingRight: 35,
        height: 45,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    attributeCheckmark: {
        height: 25,
        width: 25,
        marginRight: 10,
        tintColor: colors.darkBlue
    },
});