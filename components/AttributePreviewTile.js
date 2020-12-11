import React from "react";
import { StyleSheet, Text, Image, TouchableOpacity, View } from "react-native";
import { icons, colors, boxes, texts } from '../Styles';

export default AttributePreviewTile = props => {

  return (
    <TouchableOpacity style={{width: "100%"}}
        onPress={() => props.onPress(props.id, props.title, props.subtitle)}
    >
        <View style={[styles.attributePreviewTile, {borderColor: colors.red, borderWidth: props.showError ? 1 : 0}]}>
            <View>
                <Text numberOfLines={1} style = {texts.subHeaderLarge}>{props.title}</Text>
                <Text numberOfLines={2} ellipsizeMode="tail" style = {[texts.copy, {color: props.showError ? colors.red : props.myTeam ? white : colors.darkGrey}]}>{props.subtitle}</Text>
            </View>
            <Image style={styles.listTileArrow} source={require("../assets/ui-icons/arrow-right.png")} resizeMode="contain"/>
        </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  attributePreviewTile: {
    height: 90,
    width: "100%",
    paddingLeft: 15,
    paddingRight: 35,
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 5,
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: colors.white, 
    borderColor: colors.red,
    borderRadius: 7,
    shadowColor: colors.darkBlue,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
  },
  listTileArrow: {
    position: "absolute",
    right: 15,
    width: 15,
    tintColor: colors.lightBlue,
    zIndex: -1
  },
});