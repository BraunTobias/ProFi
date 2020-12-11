import React from "react";
import { StyleSheet, TouchableOpacity, View, Image, Animated } from "react-native";

import { icons, colors, boxes, texts } from '../Styles';

export default SwipeButton = props => {
  
  return (
    <TouchableOpacity
      style={[styles.swipeButton, {backgroundColor: props.backgroundColor}]}
      onPress={props.onPress}
    >
        <Animated.Image 
            style= {[styles.swipeIcon, {
                  opacity: props.deactivated ? 0.3 : 1,
                  transform: [{
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

const styles = StyleSheet.create({
  swipeButton: {
    flex: 1,
    height: "100%",
    width: 60,
    maxWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  swipeIcon: {
      width: 40,
      tintColor: colors.white
  },
});