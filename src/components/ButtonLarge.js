import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { texts, boxes } from '../Styles';

export default function ButtonLarge (props) {
  
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