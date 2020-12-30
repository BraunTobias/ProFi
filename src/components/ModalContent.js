import React from "react";
import { View, ScrollView } from "react-native";
//import { ScrollView } from "react-native-gesture-handler";

import { boxes, colors } from '../Styles';
import ButtonLarge from '../components/ButtonLarge';

export default function ModalComponent (props) {
    return (
        // <TouchableWithoutFeedback onPress= { () => Keyboard.dismiss() }>
            <View style= { {
                flex: 1,
                marginTop: 80,
                height: '100%',
                width: '100%',
                backgroundColor: colors.lightGrey,
            } } >
                <View style={ [
                    boxes.modal, 
                    { 
                        height: '100%',
                        backgroundColor: colors.lightGrey,
                } ] } >
                    { props.subheader() }

                    <ScrollView 
                        style= { {  } }
                        bounces={false}
                        contentContainerStyle={boxes.modalScrollView}
                    >
                        <View style= { boxes.width } >
                            { props.content() }
                            {/* <Padding height= { 15 } /> */}
                            <View style={boxes.paddedRow}>
                                
                                {!props.infoScreen &&
                                    <ButtonLarge
                                        title={"Bestätigen"}
                                        onPress={ () => { props.onDismiss(true) } }
                                    />
                                }
                                {props.infoScreen &&
                                    <View/>
                                }
                                <ButtonLarge
                                    title={"Abbrechen"}
                                    transparent={true}
                                    onPress={ () => { props.onDismiss(false) } }
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        // </TouchableWithoutFeedback>
    );
};