import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {Ionicons} from '@expo/vector-icons';

import DB from "../api/DB_API";

export default DeleteCourseButton = props => {
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={props.onClick}
    >
        <View style={{width: 75, flexDirection: "row", alignItems: "center", justifyContent: "center",}}>
          <Ionicons 
            name={"ios-close-circle"} 
            size={40} 
            color={"white"}/>
        </View>
    </TouchableOpacity>
);
};

const styles = StyleSheet.create({
  itemContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: "#640023"
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
