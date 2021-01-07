import React from "react";
import { View, ScrollView, StyleSheet, useWindowDimensions } from "react-native";

import { boxes, colors } from '../Styles';
import ButtonLarge from '../components/ButtonLarge';

export default function ModalComponent (props) {

    const Styles = StyleSheet.create({
        buttonRow: {
            position: 'absolute',
            bottom: 0,
            height: 65,
            backgroundColor:colors.lightGrey
        },
        scrollView: {
            height: 200
            // height: useWindowDimensions().height -180 -60 -65
        }
    })

    return (
        <View style= { {
            flex: 1,
            marginTop: 80,
            height: '100%',
            width: '100%',
            backgroundColor: colors.lightGrey,
        } } >
            <View style={ [boxes.modal, { 
                height: '100%',
                backgroundColor: colors.lightGrey,
            } ] } >
                { props.subheader() }

                {/* Kontent */}
                <View style= { [boxes.width, { height: '100%' } ] } >
                    { props.content() }
                </View>

                {/* Button-Leiste */}
                <View style={ [boxes.paddedRow, boxes.width, Styles.buttonRow ] } >
                    
                    {!props.infoScreen &&
                        <ButtonLarge
                            title={"Bestätigen"}
                            onPress={ () => { props.onDismiss(true) } }
                        />
                    }
                    {/* Leere View zum ausgleich des space-between */}
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
        </View>
    );
};

