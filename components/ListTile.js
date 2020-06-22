import React from "react";
import { StyleSheet, Text, TouchableOpacity, TouchableHighlight, View } from "react-native";
import {Ionicons} from '@expo/vector-icons';
import FavButton from './FavButton';
import NogoButton from './NogoButton';

export default ListTile = props => {

  const bgColor = props.backgroundColor ? props.backgroundColor : "white";
  const colorStyle = {
    backgroundColor: bgColor
  }

  return (
      <TouchableHighlight
      style= {{width: "100%"}}
        underlayColor="#aeb8c3"
        onPress={() => props.onClick(props.id, props.title, props.subtitle)}
      >
        <View style={[styles.itemContainer, colorStyle]}> 
          <View style={{flex: 9, justifyContent: "center"}}>
              <Text style = {styles.title}> {props.title} </Text>
              <Text numberOfLines={2} ellipsizeMode="tail" style = {styles.subtitle}> {props.subtitle} </Text>
          </View>
          <View style={{flex: 1, justifyContent: "center", alignItems: "center", paddingEnd: 10}}>
              <Ionicons name="ios-arrow-forward" size={60} color={"#dae1e5"}/>
              {/* <Ionicons name="chevron-forward-outline" size="50" color="white" />; */}
          </View>
        </View>
      </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    paddingLeft: 15,
    height: 100,
    width: "100%",
    // marginVertical: 2
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
