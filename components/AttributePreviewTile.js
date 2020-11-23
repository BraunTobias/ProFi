import React from "react";
import { StyleSheet, Text, Image, TouchableOpacity, View } from "react-native";
import { icons, colors, boxes, texts } from '../Styles';

export default AttributePreviewTile = props => {

  return (
    <TouchableOpacity style={{width: "100%"}}
        onPress={() => props.onPress(props.id, props.title, props.subtitle)}
    >
        <View style={[boxes.attributePreviewTile, {borderColor: colors.red, borderWidth: props.showError ? 1 : 0}]}>
            <View>
                <Text numberOfLines={1} style = {texts.subHeaderLarge}>{props.title}</Text>
                <Text numberOfLines={2} ellipsizeMode="tail" style = {[texts.copy, {color: props.showError ? colors.red : props.myTeam ? white : colors.darkGrey}]}>{props.subtitle}</Text>
            </View>
            <Image style={boxes.listTileArrow} source={require("../assets/ui-icons/arrow-right.png")} resizeMode="contain"/>
        </View>
    </TouchableOpacity>
  );
};