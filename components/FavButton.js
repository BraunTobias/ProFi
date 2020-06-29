import React, {useState} from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {Ionicons} from '@expo/vector-icons';
import DB from "../api/DB_API";

export default FavButton = props => {
  
  return (
      <TouchableOpacity
        style={[styles.itemContainer, {backgroundColor: props.backgroundColor}]}
        onPress={props.onClick}
      >
        <Ionicons name="ios-star" size={40} color={props.iconColor}/>
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
