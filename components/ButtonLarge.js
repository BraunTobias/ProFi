import React from "react";
import { Text, TouchableOpacity, Image } from "react-native";
import { icons, colors, boxes, texts } from '../Styles';

export default ButtonLarge = props => {

  const selectBoxStyle = () => {
    if (!props.transparent) {
      return (boxes.buttonLargeSolid);      
    } else {
      return (boxes.buttonLargeTransparent);      
    }
  }
  const selectTextStyle = () => {
    if (!props.transparent) {
      return (texts.buttonLargeSolid);      
    } else {
      return (texts.buttonLargeTransparent);
    }
  }

  return (
    <TouchableOpacity 
      style= { selectBoxStyle() } 
      onPress= { () => props.onPress() }
    >
      <Text style={ selectTextStyle() }>
        { props.title }
      </Text>
    </TouchableOpacity>
  );

};