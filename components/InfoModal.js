import React, {useContext} from 'react';
import {View, Text, Modal, Image, StyleSheet} from "react-native";

import { icons, texts } from '../Styles';
import { ThemeContext } from '../components/ThemeManager';

export default InfoModal = props => {

    const {themeColors} = useContext(ThemeContext);

    return(
        <Modal visible={props.visible} animationType={(Platform.OS === 'android') ? 'slide' : 'fade'} transparent={true}>
            <View style={{backgroundColor: (Platform.OS === 'android') ? "transparent" : "rgba(0,0,0,0.7)", flex: 1}}>
                <Modal visible={props.visible} animationType='slide' transparent={true}>
                    <View style={{flex: 1, justifyContent: "flex-end"}}>
                        <View style={{backgroundColor: themeColors.base, paddingHorizontal: 15, elevation: 500}}>
                            <Padding height={20}/>
                            <View style={styles.listTileHeader}>
                                <Image source={icons.info} style= {[styles.listTileIcon, { tintColor: themeColors.textHl }]} resizeMode= { "contain" }/>
                                <Text numberOfLines={1} style = {[texts.listTileHeader, { color: themeColors.textHl }]}>{props.title}</Text>
                            </View>
                            <Padding height={7}/>
                            <Text style={[texts.copy, { color: themeColors.textHl }]}>{props.copy}</Text>
                            <Padding height={20}/>
                            <Button
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

const styles = StyleSheet.create({
    listTileHeader: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: -2,
        marginBottom: 2,
    },
    listTileIcon: {
        width: 25, 
        height: 25, 
        marginEnd: 7,  
    },
});