import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default SkillsTile = props => {
  return (
    // FlatList
    <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => props.onClick(props.id)}
        >
        <Text style = {styles.tileText}> {props.text} </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    marginVertical: 2,
    padding: 20,
    height: 100,
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "white",
  },
  tileText:{
      fontSize:18,
      fontWeight: 'bold',
      textAlign: 'right',
      color: 'grey'
  }
});
