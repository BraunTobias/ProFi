import React from "react";
import { View, Text, TouchableWithoutFeedback, Keyboard, StatusBar } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { icons, colors, boxes, texts } from '../Styles';
import ButtonLarge from '../components/ButtonLarge';

export default ModalComponent = props => {
    return (
        <TouchableWithoutFeedback onPress= { () => Keyboard.dismiss() }>
            <View style={{flex: 1}}>
                <StatusBar barStyle="dark-content"/>

                <View style={ boxes.modal }>

                    { props.subheader() }

                    <ScrollView 
                        bounces={false}
                        contentContainerStyle={boxes.modalScrollView}
                    >
                        { props.content() }
                    </ScrollView>

                    <View style={boxes.modalButton}>
                        <ButtonLarge
                            title={"Bestätigen"}
                            onPress={ () => {props.onDismiss(true)} }
                        />
                        <ButtonLarge
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