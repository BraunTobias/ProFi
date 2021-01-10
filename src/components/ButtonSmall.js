import React from "react";
import { Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { icons, boxes, texts, colors } from '../Styles';

export default function ButtonSmall (props) {

  const Styles = StyleSheet.create({
    button: {
      height: 45,
      width: 150,
      paddingLeft: 15,
      paddingRight: 5,
      marginVertical: 5,
      borderRadius: 7,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    buttonColor: {
      backgroundColor:  props.status === "inactive" ? colors.lightBlue : colors.darkBlue
    },
    icon: {
      height:
        props.icon === "plus" ? 30 :
        // props.icon === "fav" ? 30 : 
        props.icon === "checkTrue" ? 25 : 
        props.icon === "checkFalse" ? 25 :
        props.icon === "edit" ? 40 :
        35,
      width: 
        props.icon === "plus" ? 30 :
        // props.icon === "fav" ? 30 : 
        props.icon === "checkTrue" ? 25 : 
        props.icon === "checkFalse" ? 25 :
        props.icon === "edit" ? 40 :
        35,
      tintColor: colors.white,
      marginRight: 
        props.icon === "checkTrue" ? 5 : 
        props.icon === "checkFalse" ? 5 :
        0
    },
  })

  var image;
  switch (props.icon) {
    case "checkTrue": image = icons.checkTrue; break;
    case "checkFalse": image = icons.checkFalse; break;
    case "plus": image = icons.plus; break;
    case "find": image = icons.find; break;
    case "exit": image = icons.exit; break;
    case "nogo": image = icons.nogo; break;
    case "logo": image = icons.logo; break;
    case "edit": image = icons.edit; break;
    case "fav": image = icons.fav; break;
    default: image = icons.logo;
  }

  return (
    <TouchableOpacity 
      style= { [Styles.button, Styles.buttonColor] } 
      onPress= { () => props.onPress() }
    >
      <Text style= { texts.buttonSmall }>
        { props.title }
      </Text>
      <Image
        style= { [Styles.icon, Styles.iconColor] }
        source= { image }
        resizeMode= { "contain" }
      />
    </TouchableOpacity>
  );

};