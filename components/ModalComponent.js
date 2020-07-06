import React from "react";
import { View, Text, TouchableWithoutFeedback, Keyboard } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { styles, texts, lightGrey } from "../Styles"

export default ModalComponent = props => {
    return (
        <TouchableWithoutFeedback onPress= { () => Keyboard.dismiss() }>
            <View style={{backgroundColor: lightGrey}}>
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