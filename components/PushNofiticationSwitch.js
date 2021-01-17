import React, { useContext } from "react";
import { Switch } from "react-native";

import { ThemeContext } from '../components/ThemeManager';

export default PushNotificationSwitch = props => {

  const {themeColors} = useContext(ThemeContext);
  
  return (
      <Switch
      onValueChange={props.onValueChange}
      value={props.value}
      trackColor={{ false: themeColors.secondary, true: themeColors.primary }}
      thumbColor={themeColors.textHighlight}
      ios_backgroundColor={themeColors.secondary}
      />
  );
};