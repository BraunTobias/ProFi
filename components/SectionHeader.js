import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { colors, texts } from '../Styles';
import { ThemeContext } from '../components/ThemeManager';

export default SectionHeader = props => {

    const {themeColors} = useContext(ThemeContext);

    return (
        <View style={[styles.sectionHeader, {
          borderColor: themeColors.textHl,
          backgroundColor: themeColors.base
        }]}>
            <Text style={[texts.separatorText, {color: themeColors.textHl}]}>
              {props.text}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderBottomWidth: 1,
  },
});