import React from "react";
import { Text, Image, View } from "react-native";
import { icons, colors, boxes, texts } from '../Styles';

export default function ListTile (props) {

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
        source= { icons.checkTrue }
        resizeMode= { "contain" }
        />
    )
    } else {
      return(<View/>);
    }
  }

  return (
    <View style= { [ boxes.listTile, /*colorStyle*/ ] }> 
      <View>
        <View style= { boxes.listTileHeader }>
          <PrefIcon/>
          <Text 
            numberOfLines={1} 
            style = { [ texts.listTileHeader, { color: props.myTeam ? colors.white : colors.darkBlue } ] }
          >
            { props.title }
          </Text>
        </View>
        <Text 
          numberOfLines={2} 
          ellipsizeMode="tail" 
          style = { [texts.copy, { color: props.myTeam ? colors.white : colors.darkGrey } ] }
        >
          {props.subtitle}
        </Text>
      </View>

      <Image style={boxes.listTileArrow} source={require("../assets/icons/arrow-right.png")} resizeMode="contain"/>

    </View>
  );
};