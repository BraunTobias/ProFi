import React, {useContext}  from "react";
import { Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { boxes, colors, icons } from "../Styles";
import { ThemeContext } from '../components/ThemeManager';

export default AttributeImage = props => {

    const {themeColors} = useContext(ThemeContext);
    
    var iconName =  "";
    switch(props.title) {
        case "Programmierung": iconName = require("../assets/categories/programmierung.png"); break;
        case "Audio": iconName = require("../assets/categories/audio.png"); break;
        case "Sozial": iconName = require("../assets/categories/sozial.png"); break;
        case "Design": iconName = require("../assets/categories/design.png"); break;
        case "Konzept": iconName = require("../assets/categories/konzept.png"); break;
        case "Hardware": iconName = require("../assets/categories/hardware.png"); break;
        case "Film, Video und Theater": iconName = require("../assets/categories/film.png"); break;
        case "Licht & Event": iconName = require("../assets/categories/licht.png"); break;
        case "Genres": iconName = require("../assets/categories/genres.png"); break;
        case "Medien": iconName = require("../assets/categories/medien.png"); break;
        default: iconName = require("../assets/categories/programmierung.png");
    }

    return (
        <TouchableOpacity 
            style={[styles.attributeImage, {
                marginRight: props.isLast ? 30 : 7, 
                backgroundColor: props.isActive ? themeColors.primary : themeColors.separator
            }]}
            onPress={props.onPress}>
            <Image  
                style={[styles.attributeIcon, {
                    tintColor: props.isActive ? themeColors.textHighlight : themeColors.textInactive
                }]}
                source={iconName}
                resizeMode="contain"
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    attributeImage: {
        height: "100%",
        aspectRatio: 1,
        marginRight: 7,
        flex: 1,
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center",
    },
    attributeIcon: {
        width: "90%",
        height: "90%",
    },
});