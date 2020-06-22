import React , {useState, useEffect} from "react";
import { StyleSheet, Text, TouchableHighlight, View, Image } from "react-native";
import {Ionicons} from '@expo/vector-icons';
import { Icon } from 'react-native-elements';
import DB from '../api/DB_API';

export default CategoryIcon = props => {

  const imageUrl = "https://firebasestorage.googleapis.com/v0/b/teamfinder-be2e3.appspot.com/o/images%2F630cd127-959e-d3b4-ed92-0d16a2269b35?alt=media&token=ff4ec588-0901-4040-81fa-b842db768c58";
    var iconName =  "";
    switch(props.title) {
        case "Programmieren": iconName = "ios-desktop"; break;
        case "Audio": iconName = "ios-volume-high"; break;
        case "PrefCat1": iconName = "ios-people"; break;
        case "PrefCat2": iconName = "ios-color-palette"; break;
        default: iconName = "ios-volume-high";
    }
    console.log(props.title);

  return (
        <TouchableHighlight 
            style={styles.itemContainer} 
            onPress={() => props.onClick()}
            underlayColor="#aeb8c3"
        >
        <Icon style={styles.icon}
            raised 
            name={iconName} 
            size={35} 
            type="ionicon"
            color={"#222f56"} 
        />
        </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingLeft: 15,
    paddingVertical: 10,
  },
  icon: {
    borderRadius: 100,
    aspectRatio: 1, 
    height: 70,
    backgroundColor: "#aeb8c3"
  },
});
