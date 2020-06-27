import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {MaterialIcons} from '@expo/vector-icons';
import DB from "../api/DB_API";

export default NogoButton = props => {

  return (
      <TouchableOpacity
        style={[styles.itemContainer, {backgroundColor: props.backgroundColor}]}
        onPress={props.onClick}
      >
        <MaterialIcons name={'do-not-disturb-alt'} size={40} color={"white"} />
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 10,
    color: "white",
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
  },
});
