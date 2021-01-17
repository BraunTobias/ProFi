import React from 'react';
import { Platform, View, Text, Modal, Image } from "react-native";
import Padding from "./Padding";
import ButtonLarge from "./ButtonLarge";
import { boxes, icons, texts } from '../Styles';

// Komponent für Pop-Ups
export default function InfoModal (props) {
    return(
        <Modal visible= { props.visible } animationType= 'fade' transparent= { true } >
            <View style= { { backgroundColor: (Platform.OS === 'android') ? "transparent" : "rgba(0,0,0,0.6)", flex: 1 } } >
                <Modal visible= { props.visible } animationType='slide' transparent= { true } >
                    <View style= { { flex: 1, justifyContent: "center" } } >
                        <View style= { {
                            backgroundColor: "rgba(255,255,255,1)", 
                            paddingHorizontal: 15, 
                            elevation: 500,
                            width: '50%',
                            alignSelf: 'center',
                        } } >
                            <Padding height= { 20 } />
                            <View style={boxes.listTileHeader}>
                                <Image source= { icons.info } style= { boxes.listTileIcon } resizeMode= { "contain" } />
                                <Text numberOfLines= { 1 } style= { texts.listTileHeader } >{props.title}</Text>
                            </View>
                            <Padding height= { 7 } />
                            <Text style= { texts.copy } >{ props.copy }</Text>
                            <Padding height= { 20 } />
                            <View style= { boxes.paddedRow } >
                                <ButtonLarge
                                    title= { props.onDismiss ? "OK" : "Verstanden" }
                                    onPress= { props.onPress }
                                />
                                {props.onDismiss &&
                                <ButtonLarge
                                        title= "Abbrechen"
                                        onPress= { props.onDismiss }
                                />
                                }
                            </View>
                            <Padding height= { 15 } />
                        </View>
                    </View>
                </Modal>
            </View>
        </Modal>
    )
}