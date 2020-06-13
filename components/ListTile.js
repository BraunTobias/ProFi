import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {Ionicons} from '@expo/vector-icons';

export default ListTile = props => {
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => props.onClick(props.id, props.title, props.subtitle)}
    >
        <View style={{flex: 9, justifyContent: "center"}}>
            <Text style = {styles.title}> {props.title} </Text>
            <Text style = {styles.subtitle}> {props.subtitle} </Text>
        </View>
        <View style={{flex: 1, justifyContent: "center", alignItems: "center", paddingEnd: 10}}>
            <Ionicons name="ios-arrow-forward" size={60} color={"#dae1e5"}/>
            {/* <Ionicons name="chevron-forward-outline" size="50" color="white" />; */}
        </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    marginVertical: 2,
    paddingLeft: 15,
    height: 100,
    backgroundColor: "white",
    width: "100%"
  },
  title: {
    fontSize: 22,
    color: "#222f56",
    fontWeight: 'bold',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 16,
  },
});
