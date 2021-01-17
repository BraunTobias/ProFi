import React, {useState} from "react";
import { Text, TouchableOpacity, Image, StyleSheet } from "react-native";

import { icons, colors, texts } from '../Styles';

// Attribut-Listen-Komponent bei der Attribut-Auswahl
export default function AttributeTile (props) {

    const [currentIcon, setCurrentIcon] = useState(props.state ? icons.checkTrue : icons.checkFalse);
    const [currentIconState, setCurrentIconState] = useState(props.state);
  
    // Hintergrundfarbe zwischen Weiß zu Grau von Element zu Element abwechseln 
    const colorStyle = {
        backgroundColor: props.index % 2 === 0 ? colors.white : colors.lightGrey
    }

    // Ändern des Icons von "Ausgewählt" zu "nicht Ausgewählt"
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
            style= { [styles.attributeTile, colorStyle] }
            onPress= { changeIconHandler }
        >
            <Image
                style= { [ styles.attributeCheckmark ] } 
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