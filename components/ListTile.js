import React, { useRef } from "react";
import { StyleSheet, Text, Image, TouchableHighlight, View, Animated } from "react-native";
import { icons, colors, boxes, texts } from '../Styles';

export default ListTile = props => {

  const colorStyle = {
    backgroundColor: props.myTeam ? colors.darkBlue : props.index % 2 === 0 ? colors.white : colors.lightGrey,
    borderColor: props.myTeam ? colors.lightGrey : "auto",
    borderBottomWidth: props.myTeam ? 1 : 0
  }
  
  const PrefIcon = () => {
 if (props.isMember) {
      return (
        <Image 
        style= { [boxes.listTileIcon, {width: 22, height: 22, marginTop: 1, tintColor: props.myTeam ? colors.white : colors.darkBlue}] }
        source= { icons.checkTrue }
        defaultSource= { icons.checkTrue }
        resizeMode= { "contain" }
        />
    )
    } else if (props.warning) {
      return (
        <Image 
        style= { [boxes.listTileIcon, {width: 22, height: 22, marginTop: 1, tintColor: props.myTeam ? colors.white : colors.red}] }
        source= { icons.warning }
        defaultSource= { icons.warning }
        resizeMode= { "contain" }
        />
    )
    } else if (props.isFavourite) {
      return (
        <Image 
        style= { [boxes.listTileIcon, {marginTop: -1, tintColor: props.inactive ? colors.lightBlue : props.myTeam ? colors.white : colors.darkBlue}] }
        source= { icons.fav }
        defaultSource= { icons.fav }
        resizeMode= { "contain" }
        />
      )
    } else if (props.isNogo) {
      return (
        <Image 
        style= { [boxes.listTileIcon, {tintColor: props.inactive ? colors.lightBlue : props.myTeam ? colors.white : colors.darkBlue}] }
        source= { icons.nogo }
        defaultSource= { icons.nogo }
        resizeMode= { "contain" }
        />
      )
    } else {
      return(<View/>);
    }
  }

  return (
    <TouchableHighlight
    underlayColor={colors.darkBlue}
    onPress={() => props.onPress(props.id, props.title, props.subtitle)}
    >
        <View style={[boxes.listTile, colorStyle]}> 

            <View>
                <View style={boxes.listTileHeader}>
                    <PrefIcon/>
                    <Text numberOfLines={1} style = {[texts.listTileHeader, {color: props.inactive ? colors.lightBlue : props.myTeam ? colors.white : colors.darkBlue}]}>{props.title}</Text>
                </View>
                <Text numberOfLines={2} ellipsizeMode="tail" style = {[texts.copy, {color: props.inactive ? colors.lightBlue : props.myTeam ? colors.white : colors.darkGrey}]}>{props.subtitle}</Text>
            </View>

            <Image style={boxes.listTileArrow} source={require("../assets/ui-icons/arrow-right.png")} resizeMode="contain"/>

        </View>
    </TouchableHighlight>
  );
};