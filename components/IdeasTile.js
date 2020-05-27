import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default IdeasTile = props => {
  return (
    <View
      style={styles.itemContainer}
    >
      <Text> {props.text} </Text>
    </View>
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
});
