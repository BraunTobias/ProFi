import React from "react";
import { View, Text, TouchableWithoutFeedback, Keyboard } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { styles, texts } from "../Styles"

export default ModalComponent = props => {
    return (
        <TouchableWithoutFeedback onPress= { () => Keyboard.dismiss() }>
            <View >
                <View style= { styles.headerFake }>
                    <Text style= { texts.header }>{ props.title }</Text>
                </View>
                { props.subheader() }
                <ScrollView style= { styles.scrollView }>
                    { props.content() }
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
    );
};