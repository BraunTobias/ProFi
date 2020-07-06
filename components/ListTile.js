import React from "react";
import { StyleSheet, Text, Image, TouchableHighlight, View } from "react-native";
import {Ionicons} from '@expo/vector-icons';
import { white, lightGrey, darkGrey, icons, darkBlue } from '../Styles';

export default ListTile = props => {

  const bgColor = props.backgroundColor ? props.backgroundColor : lightGrey;
  const colorStyle = {
    backgroundColor: bgColor
  }
  const PrefIcon = () => {
    if (props.isFavourite) {
      return (
          <Image 
            style= { { width: 24, height: 24, tintColor: darkBlue, marginEnd: 5,} }
            source= { icons.fav }
            resizeMode= { "contain" }
          />
      )
    } else if (props.isNogo) {
      return (
          <Image 
          style= { { width: 21, height: 21, tintColor: darkBlue, marginEnd: 8, marginTop: 2.5} }
          source= { icons.nogo }
          resizeMode= { "contain" }
          />
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
      <View style={[stylesFile.itemContainer, colorStyle]}> 
        <View style={{flex: 9, justifyContent: "center"}}>
            <View style={{flexDirection: "row"}}>
              <PrefIcon/>
              <Text style = {[stylesFile.title, {color: props.myTeam ? white : darkBlue}]}>{props.title}</Text>
            </View>
            <Text numberOfLines={2} ellipsizeMode="tail" style = {[stylesFile.subtitle, {color: props.myTeam ? white : darkGrey}]}>{props.subtitle}</Text>
        </View>
        <View style={{flex: 1, justifyContent: "center", alignItems: "center", paddingEnd: 15}}>
            <Image style={stylesFile.arrow} source={require("../assets/icons/arrow-right.png")} resizeMode="contain"/>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const stylesFile = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    paddingLeft: 15,
    height: 100,
    width: "100%",
  },
  title: {
    fontSize: 22,
    color: "#222f56",
    fontFamily: 'Inter_700Bold',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  arrow: {
    height: "60%",
    tintColor: "#bec9d3"
  }
});
