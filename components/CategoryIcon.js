import React from "react";
import { StyleSheet, TouchableHighlight, Image } from "react-native";
import { darkBlue, lightGrey, lightBlue } from '../Styles';

export default CategoryIcon = props => {

  const imageUrl = "https://firebasestorage.googleapis.com/v0/b/teamfinder-be2e3.appspot.com/o/images%2F630cd127-959e-d3b4-ed92-0d16a2269b35?alt=media&token=ff4ec588-0901-4040-81fa-b842db768c58";
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
        <TouchableHighlight 
            underlayColor={darkBlue}
            style={[styles.itemContainer, {marginEnd: props.isLast ? 30 : 15}]} 
            onPress={() => props.onClick()}
            underlayColor="#aeb8c3"
        >
          <Image
              source={iconName}
              style={[styles.icon, {tintColor: props.isActive ? darkBlue : lightBlue}]} 
              resizeMode="contain"
          />
        </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginRight: 15,
    backgroundColor: lightGrey,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 1, 
    height: 70,
    padding: 12
  },
  icon: {
    width: "100%",
    height: "100%",
  },
});
