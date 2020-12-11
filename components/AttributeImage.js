import React  from "react";
import { Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { boxes, colors, icons } from "../Styles";

export default AttributeImage = props => {
    
    var iconName =  "";
    switch(props.title) {
        case "Programmierung": iconName = require("../assets/skills/programmierung.png"); break;
        case "Audio": iconName = require("../assets/skills/audio.png"); break;
        case "Sozial": iconName = require("../assets/skills/sozial.png"); break;
        case "Design": iconName = require("../assets/skills/design.png"); break;
        case "Konzept": iconName = require("../assets/skills/konzept.png"); break;
        case "Hardware": iconName = require("../assets/skills/hardware.png"); break;
        case "Film, Video und Theater": iconName = require("../assets/skills/film.png"); break;
        case "Licht & Event": iconName = require("../assets/skills/licht.png"); break;
        default: iconName = require("../assets/skills/programmierung.png");
    }

    return (
        <TouchableOpacity 
            style={[styles.attributeImage, {marginRight: props.isLast ? 30 : 7, backgroundColor: props.isActive ? colors.darkBlue : colors.lightGrey}]}
            onPress={props.onPress}>
            <Image  
                style={[styles.attributeIcon, {tintColor: props.isActive ? colors.white : colors.mediumBlue}]}
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
        backgroundColor: colors.lightGrey,
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center",
    },
    attributeIcon: {
        width: "75%",
        height: "75%",
        tintColor: colors.mediumBlue,
    },
});