import React from "react";
import { Text, Image, View } from "react-native";
import { colors, boxes, texts } from '../Styles';

export default function AttributePreviewTile (props) {

  return (
    <View style={{width: "100%"}}>
        <View style={boxes.attributePreviewTile}>
            <View style={{height: 65}}>
                <Text numberOfLines={1} style = {texts.subHeaderLarge}>{props.title}</Text>
                <Text numberOfLines={2} ellipsizeMode="tail" style = {[texts.copy, {color: props.myTeam ? 'white' : colors.darkGrey}]}>{props.subtitle}</Text>
            </View>
            <Image style={boxes.listTileArrow} source={require("../assets/ui-icons/arrow-right.png")} resizeMode="contain"/>
        </View>
    </View>
  );
};