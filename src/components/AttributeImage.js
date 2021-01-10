import React  from "react";
import { Image, TouchableOpacity } from "react-native";
import { boxes, colors } from "../Styles";

export default function AttributeImage (props) {
    
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