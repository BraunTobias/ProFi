import React from "react";
import { StyleSheet, TouchableOpacity, View, Image, Animated, PushNotificationIOS, Switch } from "react-native";

import { icons, colors, boxes, texts } from '../Styles';

export default PushNotificationSwitch = props => {
  
  return (
      <Switch
      onValueChange={props.onValueChange}
      value={props.value}
      trackColor={{ false: colors.lightBlue, true: colors.darkBlue }}
      thumbColor={Platform.OS === 'android' && pushEvaluateEnabled ? colors.lightBlue : colors.white}
      ios_backgroundColor={colors.lightBlue}
      />
  );
};
