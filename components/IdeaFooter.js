import React, {useContext} from "react";
import { View, Text, StyleSheet } from "react-native";
import { texts } from '../Styles';
import { ThemeContext } from '../components/ThemeManager';

export default IdeaFooter = props => {

    const {themeColors} = useContext(ThemeContext);

    return (
        <View style={[styles.ideaFooter, { borderColor: themeColors.textCopy }]}>
            <Text style={[texts.ideaFooter, {color: themeColors.textCopy}]}>
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
        opacity: 0.5
    },
});