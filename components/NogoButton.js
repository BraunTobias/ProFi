import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { icons } from '../Styles';
import DB from "../api/DB_API";

export default NogoButton = props => {

  return (
      <TouchableOpacity
        style={[styles.itemContainer, {backgroundColor: props.backgroundColor}]}
        onPress={props.onClick}
      >
      <Image 
        style= { { width: 30, height: 30, tintColor: props.iconColor} }
        source= { icons.nogo }
        resizeMode= { "contain" }
      />
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
