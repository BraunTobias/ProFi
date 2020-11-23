import React from "react";
import { Text, TouchableOpacity, Image } from "react-native";
import { icons, colors, boxes, texts } from '../Styles';

export default ButtonSmall = props => {

  const selectBoxStyle = () => {
    if (!props.inactive) {
      return (boxes.buttonSmall);      
    } else {
      return (boxes.buttonSmallInactive);      
    }
  }
  // var image;
  // switch (props.icon) {
  //   case "checkTrue": image = icons.checkTrue; break;
  //   case "checkFalse": image = icons.checkFalse; break;
  //   case "plus": image = icons.plus; break;
  //   case "find": image = icons.find; break;
  //   case "exit": image = icons.exit; break;
  // }

  return (
    <TouchableOpacity 
      style= { selectBoxStyle() } 
      onPress= { () => props.onPress() }
    >
      <Text style= { texts.buttonSmall }>
        { props.title }
      </Text>
      <Image
        style= { boxes.buttonIcon }
        source= { props.icon }
        resizeMode= { "contain" }
      />
    </TouchableOpacity>
  );

};