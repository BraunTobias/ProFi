import React from "react";
import { Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { colors, texts } from '../Styles';

export default Button = props => {
  const selectTextStyle = () => {
    if (props.icon) return (texts.buttonSmall);
    else if (props.transparent) return (texts.buttonLargeTransparent);      
    else return (texts.buttonLargeSolid);
  }
  return (
    <TouchableOpacity 
      style= { [styles.button, {
        backgroundColor: props.transparent ? "transparent" : props.inactive ? colors.lightBlue : colors.darkBlue,
        width: props.icon ? "auto" : "100%",
        flexGrow: props.icon ? 1 : 0,
        paddingLeft: props.icon ? 15 : 10,
        paddingRight: props.icon ? 5 : 10,
        justifyContent: props.icon ? "space-between" : "center",
      }]} 
      onPress= { () => props.onPress() }
    >
      <Text style= { selectTextStyle() }>
        { props.title }
      </Text>
      { props.icon &&
        <Image
          style= { styles.buttonIcon }
          source= { props.icon }
          resizeMode= { "contain" }
        />
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 45,
    width: "100%",
    marginVertical: 5,
    borderRadius: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: colors.white,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  buttonIcon: {
    width: 25,
    height: 25,
    marginEnd: 5,
    tintColor: colors.white
  },
});