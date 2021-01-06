import React, {useContext} from "react";
import { StyleSheet, Text, Image, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { icons, colors, boxes, texts } from '../Styles';
import { ThemeContext } from '../components/ThemeManager';

export default AttributePreviewTile = props => {

  const {themeColors} = useContext(ThemeContext);

  return (
    <TouchableOpacity style={{width: "100%"}}
        onPress={() => props.onPress(props.id, props.title, props.subtitle)}
    >
        <View style={[styles.attributePreviewTile, {
          borderColor: themeColors.red, 
          borderWidth: props.showError ? 1 : 0,
          backgroundColor: themeColors.textInput, 
          shadowColor: themeColors.textHl,
        }]}>
            <View style={{width: "100%"}}>
                <Text numberOfLines={1} style = {[texts.subHeaderLarge, {color: themeColors.textHl}]}>{props.title}</Text>
                {props.subtitle == "" &&
                  <ActivityIndicator style={{paddingTop: 10}} color={themeColors.textHl}/>
                }
                {props.subtitle != "" &&
                  <Text numberOfLines={2} ellipsizeMode="tail" style = {[texts.copy, {color: props.showError ? themeColors.red : props.myTeam ? white : themeColors.textCopy}]}>{props.subtitle}</Text>
                }
            </View>
            <Image style={[styles.listTileArrow, { tintColor: themeColors.contrast }]} source={require("../assets/ui-icons/arrow-right.png")} resizeMode="contain"/>
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