import React from "react";
import { TouchableOpacity, Image } from "react-native";

import { icons, boxes } from '../Styles';

export default function SwipeButton (props) {
  return (
    <TouchableOpacity
      style={[boxes.swipeButton, {backgroundColor: props.backgroundColor}]}
      onPress={props.onPress}
    >
        <Image 
            style= {boxes.swipeIcon}
            source= { icons.nogo }
            resizeMode= { "contain" }
        />
    </TouchableOpacity>
  );
};
