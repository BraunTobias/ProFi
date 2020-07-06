import React from "react";
import { Text, TouchableOpacity, Image } from "react-native";
import { darkBlue, icons } from '../Styles';

export default Button = props => {

  var image;
  switch (props.icon) {
    case "checkTrue": image = icons.checkTrue; break;
    case "checkFalse": image = icons.checkFalse; break;
    case "plus": image = icons.plus; break;
    case "find": image = icons.find; break;
    case "exit": image = icons.exit; break;
  }

  return (
    <TouchableOpacity 
      disabled={props.disabled}
      underlayColor= { darkBlue }
      style= { props.buttonStyle } 
      onPress= { () => props.onClick() }
    >
      <Text style= { [props.titleStyle, {opacity: props.disabled ? 0.2 : 1}] }>
        { props.title }
      </Text>
      <Image 
        style= { { width: 30, height: 30, opacity: props.disabled ? 0.2 : 1} }
        source= { image }
        resizeMode= { "contain" }
      />
    </TouchableOpacity>
  );
};