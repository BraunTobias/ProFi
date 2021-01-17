import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, View, Image, Animated } from "react-native";

import { ThemeContext } from '../components/ThemeManager';

export default SwipeButton = props => {

  const {themeColors} = useContext(ThemeContext);
  
  return (
    <TouchableOpacity
      style={[styles.swipeButton, {backgroundColor: props.backgroundColor}]}
      onPress={props.onPress}
    >
        <Animated.Image 
            style= {{
                  tintColor: themeColors.textHighlight,
                  width: 40,
                  opacity: props.deactivated ? 0.3 : 1,
                  transform: [{
                  scale: props.animation ? props.animation.interpolate({
                      inputRange: [0,props.rowWidth], outputRange: [0.3,1]})
                      : 1
                  }]}
            }
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
  }
});