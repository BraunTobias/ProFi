import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { icons, boxes } from '../Styles';

export default function ButtonIcon (props) {

  var style;
  switch (props.status) {
    case "active": style = boxes.buttonIconActive; break;
    case "inactive": style = boxes.buttonIconInactive; break;
    case "neg": style = boxes.buttonIconNeg; break;
    case "negactive": style = boxes.buttonIconNegActive; break;
    case "color": style = boxes.buttonIconColor; break;
    default: style = boxes.buttonIconInactive;
  }

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
      style= { style } 
      onPress= { () => props.onPress() }
    >
      <Image
        style= { props.status === 'color'? boxes.buttonLogo : boxes.buttonIcon }
        source= { image }
        resizeMode= { "contain" }
      />
    </TouchableOpacity>
  );

};