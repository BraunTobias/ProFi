import React from 'react';
import {View, Text, Modal, Image} from "react-native";

import { boxes, colors, icons, texts } from '../Styles';

export default InfoModal = props => {
    return(
        <Modal visible={props.visible} animationType={(Platform.OS === 'android') ? 'slide' : 'fade'} transparent={true}>
            <View style={{backgroundColor: (Platform.OS === 'android') ? "transparent" : "rgba(0,0,0,0.6)", flex: 1}}>
                <Modal visible={props.visible} animationType='slide' transparent={true}>
                    <View style={{flex: 1, justifyContent: "flex-end"}}>
                        <View style={{backgroundColor: "rgba(255,255,255,1)", paddingHorizontal: 15, elevation: 500}}>
                            <Padding height={20}/>
                            <View style={boxes.listTileHeader}>
                                <Image source={icons.info} style= { boxes.listTileIcon } resizeMode= { "contain" }/>
                                <Text numberOfLines={1} style = {texts.listTileHeader}>{props.title}</Text>
                            </View>
                            <Padding height={7}/>
                            <Text style={texts.copy}>{props.copy}</Text>
                            <Padding height={20}/>
                            <ButtonLarge
                                    title="Verstanden"
                                    onPress={props.onPress}
                            />
                            <Padding height={30}/>
                        </View>
                    </View>
                </Modal>
            </View>
        </Modal>
    )
}