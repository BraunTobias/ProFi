import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { icons, boxes, colors } from '../Styles';

export default function ButtonIcon (props) {

  const Styles = StyleSheet.create({
    
    button: {
      height: 45,
      width: 45,
      marginVertical: 5,
      marginHorizontal: 0,
      borderRadius: 7,
      justifyContent: "center",
      alignItems: "center"
    },
    buttonColor: {
      backgroundColor:  props.status === "active" ? colors.darkBlue : 
                        props.status === "inactive" ? colors.lightBlue : 
                        props.status === "neg" ? colors.red : colors.lightRed
    },
    icon: {
        width: 35,
        height: 35,
    },
    iconColor: {
      tintColor:  props.status !== "transparent" && props.status !== "color" ? "white" : 
                  props.icon === "nogo" || props.icon === "delete" ? colors.red : colors.darkBlue
    },
    logo: {
      width: 45,
      height: 45,
    },

  })

  // Button-Einstellungen & -Farbe
  var buttonSettings;
  if (props.status !== "color" && props.status !== "transparent") buttonSettings = [Styles.button, Styles.buttonColor];
  else buttonSettings = Styles.button;

  // Icon-Einstellungen & -Farbe
  var iconSettings;
  // sonstige Buttons
  if (props.status !== "color") iconSettings= [Styles.icon, Styles.iconColor];
  // Logo
  else iconSettings= Styles.logo


  // Icon-Image
  var image;
  switch (props.icon) {
    case "checkTrue": image = icons.checkTrue; break;
    case "checkFalse": image = icons.checkFalse; break;
    case "plus": image = icons.plus; break;
    case "minus": image = icons.minus; break;
    case "find": image = icons.find; break;
    case "exit": image = icons.exit; break;
    case "nogo": image = icons.nogo; break;
    case "fav": image = icons.fav; break;
    case "delete": image = icons.delete; break;
    case "like": image = icons.like; break;
    case "reply": image = icons.reply; break;
    case "profile": image = icons.profile; break;
    case "logo": image = icons.logo; break;
    default: image = icons.logo;
  }

  return (
    <TouchableOpacity 
      style= { buttonSettings } 
      onPress= { () => props.onPress() }
    >
      <Image
        style= { iconSettings }
        source= { image }
        resizeMode= { "contain" }
      />
    </TouchableOpacity>
  );

};