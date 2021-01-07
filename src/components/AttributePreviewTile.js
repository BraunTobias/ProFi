import React from "react";
import { Text, Image, View, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { colors, boxes, texts } from '../Styles';

export default function AttributePreviewTile (props) {

  return (
    // <View style={{width: "100%"}}>
    //     <View style={boxes.attributePreviewTile}>
    //         <View style={{height: 65}}>
    //             <Text numberOfLines={1} style = {texts.subHeaderLarge}>{props.title}</Text>
    //             <Text numberOfLines={2} ellipsizeMode="tail" style = {[texts.copy, {color: props.myTeam ? 'white' : colors.darkGrey}]}>{props.subtitle}</Text>
    //         </View>
    //         <Image style={boxes.listTileArrow} source={require("../assets/ui-icons/arrow-right.png")} resizeMode="contain"/>
    //     </View>
    // </View>
    <TouchableOpacity style={{width: "100%"}}
      onPress={() => props.onPress(props.id, props.title, props.subtitle)}
  >
      <View style={[styles.attributePreviewTile, {
        borderColor: colors.red, 
        borderWidth: props.showError ? 1 : 0,
        backgroundColor: colors.textInput, 
        shadowColor: colors.textHl,
      }]}>
          <View style={{width: "100%"}}>
              <Text numberOfLines={1} style = {[texts.subHeaderLarge, {color: colors.textHl}]}>{props.title}</Text>
              {props.subtitle == "" &&
                <ActivityIndicator style={{paddingTop: 10}} color={colors.textHl}/>
              }
              {props.subtitle != "" &&
                <Text numberOfLines={2} ellipsizeMode="tail" style = {[texts.copy, {color: props.showError ? colors.red : props.myTeam ? colors.white : colors.textCopy}]}>{props.subtitle}</Text>
              }
          </View>
          <Image style={[styles.listTileArrow, { tintColor: colors.contrast }]} source={require("../assets/ui-icons/arrow-right.png")} resizeMode="contain"/>
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
    borderRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
  },
  listTileArrow: {
    position: "absolute",
    right: 15,
    width: 15,
    zIndex: -1
  },
});