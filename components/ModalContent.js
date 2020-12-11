import React from "react";
import { View, Text, TouchableWithoutFeedback, Keyboard, StatusBar, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { icons, colors, boxes, texts } from '../Styles';
import Button from '../components/Button';

export default ModalComponent = props => {
    return (
        <TouchableWithoutFeedback onPress= { () => Keyboard.dismiss() }>
            <View style={{flex: 1}}>
                <StatusBar barStyle="dark-content"/>

                <View style={ styles.modal }>

                    { props.subheader() }

                    <ScrollView 
                        bounces={false}
                        contentContainerStyle={styles.modalScrollView}
                    >
                        { props.content() }
                    </ScrollView>

                    <View style={styles.modalButton}>
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
        backgroundColor: colors.lightGrey
    },
});