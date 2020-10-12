import React from "react";
import { StyleSheet, TouchableOpacity, View, Image } from "react-native";

import { icons, colors, boxes, texts } from '../Styles';

export default SwipeButton = props => {
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
