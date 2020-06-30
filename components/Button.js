import React , {useState, useEffect} from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import {Ionicons} from '@expo/vector-icons';
import { Icon } from 'react-native-elements';
import { buttons, texts, white, darkBlue, lightGrey, darkGrey, black, iconsize, iconsizeAdd, icons } from '../Styles';
import DB from '../api/DB_API';

export default Button = props => {

  var image;
  switch (props.icon) {
    case "checkTrue": image = icons.checkTrue; break;
    case "checkFalse": image = icons.checkFalse; break;
    case "plus": image = icons.plus; break;
    case "find": image = icons.find; break;
  }

  return (
        <TouchableOpacity 
            underlayColor={darkBlue}
            style={props.buttonStyle} 
            onPress={() => props.onClick()}
        >
            <Text
                style={props.titleStyle}
            >
              {props.title}
            </Text>
            <Image 
                style={{width: 30, height: 30}}
                source={image}
                resizeMode={"contain"}
            />
        </TouchableOpacity>
  );
};

// const styles = StyleSheet.create({
//   itemContainer: {
//     marginRight: 15,
//     // marginVertical: 10,
//     backgroundColor: lightGrey,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     aspectRatio: 1, 
//     height: 70,
//     padding: 12
//   },
//   icon: {
//     width: "100%",
//     height: "100%",
//   },
// });
