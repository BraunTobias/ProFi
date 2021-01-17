import React from "react";
import { Text, View, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { colors, texts } from '../Styles';

// Komponent zum Auflisten von Fähigkeiten oder Interessen
export default function AttributePreviewTile(props) {

  // Inhalt des Komponenten
  const Content = () => {
    return (
      <View style={[styles.attributePreviewTile, {
      borderColor: colors.red,
      borderWidth: props.showError ? 1 : 0,
      backgroundColor: colors.textInput,
      shadowColor: colors.textHl,
    }]}>
      <Text numberOfLines={1} style={[texts.subHeaderLarge, { color: colors.textHl }]}>{props.title}</Text>
      {/* Ladeanimation wenn kein Inhalt angezeigt wird */}
      {props.subtitle === "" &&
        <ActivityIndicator style={{ paddingTop: 10 }} color={colors.textHl} />
      }
      {/* Inhalt anzeigen */}
      {props.subtitle !== "" &&
        <Text numberOfLines={2} ellipsizeMode="tail" style={[texts.copy, { color: props.showError ? colors.red : props.myTeam ? colors.white : colors.textCopy }]}>{props.subtitle}</Text>
      }
    </View>
    )
  }

  // Komponent als Link zur Atrribut-Seite
  if (props.onPress) {
    return (
      <TouchableOpacity style={{ width: "100%" }}
        onPress={() => props.onPress(props.id, props.title, props.subtitle)}
      >
        <Content/>
      </TouchableOpacity>
    );
  // Komponent nur als Vorschau
  } else {
    return (
      <View>
        <Content/>
      </View>
    );
  }


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
    justifyContent: "flex-start",
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