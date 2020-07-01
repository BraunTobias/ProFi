import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { buttons, texts, darkBlue } from '../Styles';
import { Button } from "react-native-elements";

export default ButtonSimple = props => {
  return (
    <TouchableOpacity 
      style= { buttons.buttonSimple } 
      onPress= { () => props.onClick() }
    >
      <Text style= { texts.buttonBlueCenter }>
        { props.title }
      </Text>
    </TouchableOpacity>
  );
};