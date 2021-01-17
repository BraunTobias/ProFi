import React from "react";
import { View, StyleSheet } from "react-native";

export default function FlexRow (props) {
    return(
        <View style= { [styles.flexRow, {
            paddingHorizontal: props.padding ? 15 : 0,
            justifyContent: props.center ? "center" : "space-between"
        }] }>
            {props.children}
        </View>
    );
};

const styles = StyleSheet.create({
    flexRow: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
    },
});