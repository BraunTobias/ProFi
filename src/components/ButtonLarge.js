import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, texts } from '../Styles';

// Komponent für Buttons mit Titel ohne Icon
export default function ButtonLarge (props) {
  
  const selectBoxStyle = () => {
    if (!props.transparent) {
      return (Styles.buttonLargeSolid);      
    } else {
      return (Styles.buttonLargeTransparent);      
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

const Styles = StyleSheet.create({
  buttonLargeSolid: {
    height: 45,
    width: 150,
    paddingHorizontal: 10,
    marginVertical: 5,
    backgroundColor: colors.darkBlue,
    borderRadius: 7,
    justifyContent: "center",
  },
  buttonLargeTransparent: {
    height: 40,
    width: 150,
    paddingHorizontal: 10,
    marginVertical: 5,
    backgroundColor: "none",
    borderRadius: 0,
    justifyContent: "center",
  },
})