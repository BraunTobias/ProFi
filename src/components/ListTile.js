import React from "react";
import { Text, Image, View, StyleSheet } from "react-native";
import { icons, colors, boxes, texts } from '../Styles';
import ButtonIcon from "../components/ButtonIcon";

export default function ListTile (props) {

  const colorStyle = {
    backgroundColor: props.myTeam ? colors.primary : props.index % 2 === 0 ? colors.tile1 : colors.tile2,
    borderColor: colors.separator,
    borderBottomWidth: 1
  }

  const PrefIcon = () => {
    if (props.isMember) {
      return (
        <Image 
          style= { [Styles.listTileIcon, {width: 22, height: 22, marginTop: 1, tintColor: props.myTeam ? colors.textHighlight : colors.textHl}] }
          source= { icons.checkTrue }
          defaultSource= { icons.checkTrue }
          resizeMode= { "contain" }
        />
      )
    } else if (props.warning) {
      return (
        <Image 
          style= { [Styles.listTileIcon, {width: 22, height: 22, marginTop: 1, tintColor: props.myTeam ? colors.textHighlight : colors.red}] }
          source= { icons.warning }
          defaultSource= { icons.warning }
          resizeMode= { "contain" }
        />
      )
    } else if (props.isFavourite) {
      return (
        <Image 
          style= { [Styles.listTileIcon, {marginTop: -1, tintColor: props.inactive ? colors.textInactive : props.myTeam ? colors.textHighlight : colors.textHl}] }
          source= { icons.fav }
          defaultSource= { icons.fav }
          resizeMode= { "contain" }
        />
      )
    } else if (props.isNogo) {
      return (
        <Image 
          style= { [Styles.listTileIcon, {tintColor: props.inactive ? colors.textInactive : props.myTeam ? colors.textHighlight : colors.textHl}] }
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
    <View style= { [ Styles.listTile, colorStyle ] }> 
      <View style= { Styles.content } >
        <View style= { Styles.listTileHeader }>
          <PrefIcon/>
          <Text numberOfLines={1} style = { [ texts.listTileHeader, { 
            color: props.inactive ? colors.textInactive : 
            props.myTeam ? colors.textHighlight : 
            colors.textHl
          } ] } >{ props.title } </Text>
        </View>
        <View style= {{ 
          width: '100%'
        }} >
          <Text numberOfLines={2} ellipsizeMode="tail" style = { [texts.copy, { 
            color: 
              props.inactive ? colors.textInactive : 
              props.myTeam ? colors.textHighlight : 
              colors.textCopy
          } ] } >{ props.subtitle }</Text>
        </View>
      </View>
      <View>
        {props.delete &&
          <View style= { Styles.deletebox } >
            <ButtonIcon 
              icon= { "delete" }
              onPress= { () => { props.onExit() } }
              status= { "transparent" }
            />
          </View>
          }
          {!props.delete &&
          <View style= { Styles.deletebox } >
            <ButtonIcon 
              icon= { "delete" }
              onPress= { () => { props.onExit() } }
              status= { "transparent" }
            />
          </View>
          }
        </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  deletebox: {

    height: '100%',
    justifyContent: 'center',
    paddingRight: 15
  },
  content: {
    height: '100%',
    justifyContent: 'center',
    width: '80%'
  },
  listTile: {
    paddingLeft: 15,
    height: 90,
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row"
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