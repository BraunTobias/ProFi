import React from "react";
import { StyleSheet, Text, Image, TouchableOpacity, TouchableHighlight, View } from "react-native";
import {Ionicons} from '@expo/vector-icons';
import {MaterialIcons} from '@expo/vector-icons';
import FavButton from './FavButton';
import NogoButton from './NogoButton';
import { styles, buttons, texts, white, lightGrey, grey, black, iconsize, iconsizeAdd, darkGrey, icons, darkBlue } from '../Styles';

export default ListTile = props => {

  const bgColor = props.backgroundColor ? props.backgroundColor : lightGrey;
  const colorStyle = {
    backgroundColor: bgColor
  }
  var iconName = "";

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
            <Text numberOfLines={2} ellipsizeMode="tail" style = {[stylesFile.subtitle, {color: props.myTeam ? white : black}]}>{props.subtitle}</Text>
        </View>
        <View style={{flex: 1, justifyContent: "center", alignItems: "center", paddingEnd: 15}}>
            <Image style={stylesFile.arrow} source={require("../assets/icons/arrow-right.png")} resizeMode="contain"/>
            {/* <Ionicons name="ios-arrow-forward" size={60} color={"#dae1e5"}/> */}
            {/* <Ionicons name="chevron-forward-outline" size="50" color="white" />; */}
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
