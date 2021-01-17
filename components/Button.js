import React, {useContext} from "react";
import { Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { texts } from '../Styles';
import { ThemeContext } from '../components/ThemeManager';

export default Button = props => {

  const {themeColors} = useContext(ThemeContext);

  const selectTextStyle = () => {
    if (props.icon) return (texts.buttonSmall);
    else if (props.transparent) return (texts.buttonLargeTransparent);      
    else return (texts.buttonLargeSolid);
  }
  return (
    <TouchableOpacity 
      style= { [styles.button, {
        backgroundColor: props.transparent ? "transparent" : props.inactive ? themeColors.secondary : themeColors.primary,
        shadowColor: props.transparent ? "transparent" : themeColors.textHighlight,
        width: props.icon ? "auto" : "100%",
        flexGrow: props.icon ? 1 : 0,
        paddingLeft: props.icon ? 15 : 10,
        paddingRight: props.icon ? 5 : 10,
        justifyContent: props.icon ? "space-between" : "center",
      }]} 
      onPress= { () => props.onPress() }
    >
      <Text style= { [selectTextStyle(), {color: props.inactive ? themeColors.buttonInactive : props.transparent ? themeColors.textHl : themeColors.textHighlight}] }>
        { props.title }
      </Text>
      { props.icon &&
        <Image
          style= { [styles.buttonIcon, { tintColor: props.inactive ? themeColors.buttonInactive : themeColors.textHighlight }] }
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
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  buttonIcon: {
    width: 25,
    height: 25,
    marginEnd: 5,
  },
});