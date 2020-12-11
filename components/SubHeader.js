import React from "react";
import { View, StyleSheet } from "react-native";

import { colors } from '../Styles';

export default SubHeader = (props) => {
    return(
        <View style= { styles.subHeader }>
            {props.children}
        </View>
    );
};

const styles = StyleSheet.create({
    subHeader: {
        backgroundColor: colors.lightBlue,
        paddingVertical: 7,
    }
});