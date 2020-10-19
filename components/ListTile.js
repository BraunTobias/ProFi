import React from "react";
import { StyleSheet, Text, Image, TouchableHighlight, View } from "react-native";
import { icons, colors, boxes, texts } from '../Styles';

export default ListTile = props => {

  const colorStyle = {
    backgroundColor: props.myTeam ? colors.darkBlue : props.index % 2 === 0 ? colors.white : colors.lightGrey
  }
  const PrefIcon = () => {
    if (props.isFavourite) {
      return (
        <Image 
        style= { boxes.listTileIcon }
        source= { icons.fav }
        resizeMode= { "contain" }
        />
      )
    } else if (props.isNogo) {
      return (
        <Image 
        style= { boxes.listTileIcon }
        source= { icons.nogo }
        resizeMode= { "contain" }
        />
      )
    } else if (props.isMember) {
      return (
        <Image 
        style= { boxes.listTileIcon }
        source= { icons.fav }
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
                    <Text numberOfLines={1} style = {[texts.listTileHeader, {color: props.myTeam ? colors.white : colors.darkBlue}]}>{props.title}</Text>
                </View>
                <Text numberOfLines={2} ellipsizeMode="tail" style = {[texts.copy, {color: props.myTeam ? white : colors.darkGrey}]}>{props.subtitle}</Text>
            </View>

            <Image style={boxes.listTileArrow} source={require("../assets/ui-icons/arrow-right.png")} resizeMode="contain"/>

        </View>
    </TouchableHighlight>
  );
};