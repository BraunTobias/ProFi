import React  from "react";
import { Image, TouchableOpacity } from "react-native";
import { boxes, colors } from "../Styles";

export default function AttributeImage (props) {
    
    var iconName =  "";
    switch(props.title) {
        case "Programmierung": iconName = require("../assets/icons/programmierung.png"); break;
        case "Audio": iconName = require("../assets/icons/audio.png"); break;
        case "Sozial": iconName = require("../assets/icons/sozial.png"); break;
        case "Design": iconName = require("../assets/icons/design.png"); break;
        case "Konzept": iconName = require("../assets/icons/konzept.png"); break;
        case "Hardware": iconName = require("../assets/icons/hardware.png"); break;
        case "Film, Video und Theater": iconName = require("../assets/icons/film.png"); break;
        case "Licht & Event": iconName = require("../assets/icons/licht.png"); break;
        default: iconName = require("../assets/icons/programmierung.png");
    }

    return (
        <TouchableOpacity 
            style= { [boxes.attributeImage, { backgroundColor: props.isActive ? colors.darkBlue : colors.lightBlue } ] }
            onPress= { () => { props.onPress() } } >
            <Image 
                style= { [ boxes.attributeIcon, { tintColor: props.isActive ? colors.white : colors.mediumBlue } ] } 
                source= { iconName }
                resizeMode= "contain"
            />
        </TouchableOpacity>
    )
}