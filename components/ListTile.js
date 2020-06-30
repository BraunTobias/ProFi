import React from "react";
import { StyleSheet, Text, Image, TouchableOpacity, TouchableHighlight, View } from "react-native";
import {Ionicons} from '@expo/vector-icons';
import {MaterialIcons} from '@expo/vector-icons';
import FavButton from './FavButton';
import NogoButton from './NogoButton';

export default ListTile = props => {

  const bgColor = props.backgroundColor ? props.backgroundColor : "white";
  const colorStyle = {
    backgroundColor: bgColor
  }
  var iconName = "";

  const PrefIcon = () => {
    if (props.isFavourite) {
      return (
        <Ionicons name={"ios-star"} size={25} color={"#222f56"} style={{paddingEnd: 5}}/>
      )
    } else if (props.isNogo) {
      return (
        <MaterialIcons name={"do-not-disturb-alt"} size={25} color={"#222f56"} style={{paddingEnd: 5}}/>
      )
    } else if (props.isMember) {
      return (
        <Ionicons name={"ios-checkmark-circle"} size={25} color={"#222f56"} style={{paddingEnd: 5}}/>
      )
    } else {
      return(<View/>);
    }
  }

  return (
      <TouchableHighlight
        style= {{width: "100%"}}
        underlayColor="#aeb8c3"
        onPress={() => props.onClick(props.id, props.title, props.subtitle)}
      >
        <View style={[styles.itemContainer, colorStyle]}> 
          <View style={{flex: 9, justifyContent: "center"}}>
              <View style={{flexDirection: "row"}}>
                <PrefIcon/>
                <Text style = {styles.title}>{props.title}</Text>
              </View>
              <Text numberOfLines={2} ellipsizeMode="tail" style = {styles.subtitle}>{props.subtitle}</Text>
          </View>
          <View style={{flex: 1, justifyContent: "center", alignItems: "center", paddingEnd: 15}}>
              <Image style={styles.arrow} source={require("../assets/icons/arrow-right.png")} resizeMode="contain"/>
              {/* <Ionicons name="ios-arrow-forward" size={60} color={"#dae1e5"}/> */}
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
  arrow: {
    height: "60%",
    tintColor: "#bec9d3"
  }
});
