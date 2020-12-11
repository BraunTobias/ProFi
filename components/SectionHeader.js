import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { colors, texts } from '../Styles';

export default SectionHeader = props => {

    return (
        <View style={styles.sectionHeader}>
                {props.children}
        </View>
    );
};

const styles = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderColor: colors.darkBlue,
    backgroundColor: colors.white
  },
});