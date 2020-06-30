import React , {useState, useEffect} from "react";
import { StyleSheet, Text, TouchableHighlight, View, Image } from "react-native";
import {Ionicons} from '@expo/vector-icons';
import { Icon } from 'react-native-elements';
import { buttons, texts, white, darkBlue, lightGrey, darkGrey, black, iconsize, iconsizeAdd } from '../Styles';
import DB from '../api/DB_API';

export default CategoryIcon = props => {

  const imageUrl = "https://firebasestorage.googleapis.com/v0/b/teamfinder-be2e3.appspot.com/o/images%2F630cd127-959e-d3b4-ed92-0d16a2269b35?alt=media&token=ff4ec588-0901-4040-81fa-b842db768c58";
    var iconName =  "";
    switch(props.title) {
        case "Programmierung": iconName = require("../assets/Icons/programmierung.png"); break;
        case "Audio": iconName = require("../assets/Icons/audio.png"); break;
        case "Sozial": iconName = require("../assets/Icons/sozial.png"); break;
        case "Design": iconName = require("../assets/Icons/design.png"); break;
        case "Konzept": iconName = require("../assets/Icons/konzept.png"); break;
        case "Hardware": iconName = require("../assets/Icons/hardware.png"); break;
        case "Film, Video und Theater": iconName = require("../assets/Icons/film.png"); break;
        case "Licht & Event": iconName = require("../assets/Icons/licht.png"); break;
        default: iconName = require("../assets/Icons/programmierung.png");
    }
    console.log(props.title);

  return (
        <TouchableHighlight 
            underlayColor={darkBlue}
            style={styles.itemContainer} 
            onPress={() => props.onClick()}
            underlayColor="#aeb8c3"
        >
        <Image
            source={iconName}
            style={[styles.icon, {tintColor: props.isActive ? darkBlue : darkGrey}]} 
            resizeMode="contain"
        />
        {/* <Ionicons style={styles.icon}
            raised 
            name={iconName} 
            size={35} 
            type="ionicon"
            color={"#222f56"} 
        /> */}
        </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginRight: 15,
    // marginVertical: 10,
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
