import React, {useState, useContext} from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image} from "react-native";

import { icons, texts } from '../Styles';
import { ThemeContext } from '../components/ThemeManager';

export default AttributeTile = props => {

    const {themeColors} = useContext(ThemeContext);

    const [currentIcon, setCurrentIcon] = useState(props.state ? icons.checkTrue : icons.checkFalse);
    const [currentIconState, setCurrentIconState] = useState(props.state);
  
    const colorStyle = {
        backgroundColor: props.index % 2 === 0 ? themeColors.tile1 : themeColors.tile2,
        borderColor: themeColors.separator,
        borderBottomWidth: 1    
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
                style={[styles.attributeCheckmark, {tintColor: themeColors.textHl}]}
            />
            <Text 
                style = {[texts.subHeader, {color: currentIconState ? themeColors.textCopy : themeColors.textInactive}]}
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
    },
});