import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { colors, texts } from '../Styles';

export default function IdeaFooter (props) {

    return (
        <View style={styles.ideaFooter}>
            <Text style={[texts.ideaFooter]}>
                {props.ideaCreatorId == "ProFi-Algorithmus" ? "Automatisch erstellte Idee" : "Idee von " + props.ideaCreator}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    ideaFooter: {
        width: "100%",
        justifyContent: "center",
        flexDirection: "row",
        paddingTop: 10,
        paddingBottom: 15,
        borderTopWidth: 1,
        borderColor: colors.darkGrey,
        opacity: 0.5
    },
});