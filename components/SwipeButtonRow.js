import React from "react";
import { StyleSheet, TouchableOpacity, View, Image, Animated } from "react-native";

import { icons, colors, boxes, texts } from '../Styles';
import SwipeButton from '../components/SwipeButton';

export default SwipeButtonRow = props => {
  
  return (
    <View style={[styles.swipeRow, {
      backgroundColor: props.color ? props.color : colors.red
    }]}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  swipeRow: {
    height: "100%", 
    width: "80%",
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
    flexDirection: "row"
  },
});