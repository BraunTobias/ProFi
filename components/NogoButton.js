import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {Ionicons} from '@expo/vector-icons';
import DB from "../api/DB_API";

export default NogoButton = props => {

  const addNogoHandler = () => {
      DB.addPref("nogos", props.courseId, props.ideaId, () => {
        console.log("Added as nogo");
      });
  }

  return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={addNogoHandler}
      >
        <Text style = {styles.title}>Nogo</Text>
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "red",
    // width: "50%",
    height: "100%",
    flexDirection: "column",
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
