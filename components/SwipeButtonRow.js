import React, {useContext} from "react";
import { StyleSheet, TouchableOpacity, View, Image, Animated } from "react-native";

import { icons, colors, boxes, texts } from '../Styles';
import SwipeButton from '../components/SwipeButton';
import { ThemeContext } from '../components/ThemeManager';

export default SwipeButtonRow = props => {
  
  const {themeColors} = useContext(ThemeContext);
  
  return (
    <View style={[styles.swipeRow, {
      backgroundColor: props.color ? props.color : themeColors.red,
      borderBottomColor: themeColors.separator,
    }]}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  swipeRow: {
    height: "100%", 
    width: "80%",
    borderBottomWidth: 1,
    flexDirection: "row"
  },
});