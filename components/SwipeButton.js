import React from "react";
import { StyleSheet, TouchableOpacity, View, Image, Animated } from "react-native";

import { icons, colors, boxes, texts } from '../Styles';

export default SwipeButton = props => {
  
  return (
    <TouchableOpacity
      style={[boxes.swipeButton, {backgroundColor: props.backgroundColor}]}
      onPress={props.onPress}
    >
        <Animated.Image 
            style= {[boxes.swipeIcon, {transform: [{
                  scale: props.animation ? props.animation.interpolate({
                      inputRange: [0,props.rowWidth], outputRange: [0.3,1]})
                      : 1
                  }]}
            ]}
            source= { props.icon }
            resizeMode= { "contain" }
        />
    </TouchableOpacity>
  );
};
