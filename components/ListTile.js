import React, { useContext } from "react";
import { StyleSheet, Text, Image, TouchableHighlight, View, Animated } from "react-native";
import { icons, texts } from '../Styles';
import { ThemeContext } from '../components/ThemeManager';

export default ListTile = props => {
  
  const {themeColors} = useContext(ThemeContext);

  const colorStyle = {
    backgroundColor: props.myTeam ? themeColors.primary : props.index % 2 === 0 ? themeColors.tile1 : themeColors.tile2,
    borderColor: themeColors.separator,
    borderBottomWidth: 1
  }
  
 const PrefIcon = () => {
    if (props.isMember) {
      return (
        <Image 
          style= { [styles.listTileIcon, {width: 22, height: 22, marginTop: 1, tintColor: props.myTeam ? themeColors.textHighlight : themeColors.textHl}] }
          source= { icons.checkTrue }
          defaultSource= { icons.checkTrue }
          resizeMode= { "contain" }
        />
      )
    } else if (props.warning) {
      return (
        <Image 
          style= { [styles.listTileIcon, {width: 22, height: 22, marginTop: 1, tintColor: props.myTeam ? themeColors.textHighlight : themeColors.red}] }
          source= { icons.warning }
          defaultSource= { icons.warning }
          resizeMode= { "contain" }
        />
      )
    } else if (props.isFavourite) {
      return (
        <Image 
          style= { [styles.listTileIcon, {marginTop: -1, tintColor: props.inactive ? themeColors.textInactive : props.myTeam ? themeColors.textHighlight : themeColors.textHl}] }
          source= { icons.fav }
          defaultSource= { icons.fav }
          resizeMode= { "contain" }
        />
      )
    } else if (props.isNogo) {
      return (
        <Image 
          style= { [styles.listTileIcon, {tintColor: props.inactive ? themeColors.textInactive : props.myTeam ? themeColors.textHighlight : themeColors.textHl}] }
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
    underlayColor={themeColors.primary}
    onPress={() => props.onPress(props.id, props.title, props.subtitle)}
    >
        <View style={[styles.listTile, colorStyle]}> 

            <View>
                <View style={styles.listTileHeader}>
                    <PrefIcon/>
                    <Text numberOfLines={1} style = {[texts.listTileHeader, {color: props.inactive ? themeColors.textInactive : props.myTeam ? themeColors.textHighlight : themeColors.textHl}]}>{props.title}</Text>
                </View>
                <Text numberOfLines={2} ellipsizeMode="tail" style = {[texts.copy, {color: props.inactive ? themeColors.textInactive : props.myTeam ? themeColors.textHighlight : themeColors.textCopy}]}>{props.subtitle}</Text>
            </View>

            <Image style={[styles.listTileArrow, {tintColor: props.inactive ? themeColors.textInactive : themeColors.contrast}]} source={require("../assets/ui-icons/arrow-right.png")} resizeMode="contain"/>

        </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  listTile: {
    paddingLeft: 15,
    paddingRight: 35,
    height: 90,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  listTileHeader: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      marginTop: -2,
      marginBottom: 2,
  },
  listTileArrow: {
      position: "absolute",
      right: 15,
      width: 15,
      zIndex: -1
  },
  listTileIcon: {
      width: 25, 
      height: 25, 
      marginEnd: 7,  
  },
});