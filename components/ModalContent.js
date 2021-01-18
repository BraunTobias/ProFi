import React, {useContext} from "react";
import { View, TouchableWithoutFeedback, Keyboard, StatusBar, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import Button from '../components/Button';
import { ThemeContext } from '../components/ThemeManager';

export default ModalContent = props => {

    const {themeColors} = useContext(ThemeContext);

    return (
        <TouchableWithoutFeedback onPress= { () => Keyboard.dismiss() }>
            <View style={{flex: 1, backgroundColor: themeColors.tile2}}>
                <StatusBar barStyle={themeColors.mode == "light" ? "dark-content" : "light-content"}/>

                <View style={ styles.modal }>
                    <ScrollView 
                        bounces={false}
                        contentContainerStyle={styles.modalScrollView}
                    >
                        { props.content() }
                    </ScrollView>

                    <View style={[styles.modalButton, { backgroundColor: themeColors.separator }]}>
                        <Button
                            title={"Bestätigen"}
                            onPress={ () => {props.onDismiss(true)} }
                        />
                        <Button
                            title={"Abbrechen"}
                            transparent={true}
                            onPress={() => {props.onDismiss(false)} }
                        />
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    modal: {
        flex: 1, 
        justifyContent: "center",
    },
    modalScrollView: {
        flexGrow: 1,
    },
    modalButton: {
        width: "100%",
        paddingHorizontal: 15,
        paddingBottom: 13,
        paddingTop: 7,
    },
});