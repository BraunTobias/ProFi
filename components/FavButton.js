import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {Ionicons} from '@expo/vector-icons';
import DB from "../api/DB_API";

export default FavButton = props => {

    const addFavHandler = () => {
        DB.addPref("favourites", props.courseId, props.ideaId, () => {
          console.log("Added as favourite");
        });
    }
  
  return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={addFavHandler}
      >
        <Text style = {styles.title}>Fav</Text>
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "blue",
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
