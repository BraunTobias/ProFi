import React, { useState, useContext, useEffect, Fragment } from 'react';
import {FlatList, Modal, StatusBar, SafeAreaView } from "react-native";

import { boxes, colors, styles, texts } from '../Styles';
import { View, Text, Image } from 'react-native';
import { icons } from '../Styles';
import DB from '../api/DB_API';
import ModalContent from './ModalContent';
import AttributeList from './AttributeList';
import ProfileImage from './ProfileImage';
import Padding from './Padding';

export default ProfileView = props => {

    const [currentName, setCurrentName] = useState("");
    const [currentBio, setCurrentBio] = useState("");
    const [currentEmail, setCurrentEmail] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [skillsList, setSkillsList] = useState([]);
   
    useEffect(() => {
        DB.getUserInfoById(props.userId, (name, imageUrl, bio, email) => {
            setCurrentName(name);
            setCurrentBio(bio);
            setCurrentEmail(email);
            if (imageUrl) setImageUrl(imageUrl);
        });
        DB.getAttributesFromUser(props.userId, (filterList) => {
            DB.getAllAttributes("skills", filterList, "", "", (attributesList) => {
                setSkillsList(attributesList);
            }, () => {});
        });    
    }, []);

    return(
        <Modal visible={props.visible} animationType='slide'>
            <Fragment>
                <SafeAreaView style={{ flex: 0, backgroundColor: colors.lightBlue }} />
                <SafeAreaView style={{flex: 1, backgroundColor: colors.lightGrey}}>
                    <StatusBar barStyle="dark-content"/>

                    <View style={[boxes.subHeader]}>
                        <Padding height={5}/>
                        <View style={boxes.profileViewImage}>
                            <ProfileImage
                                imageUrl={imageUrl}
                                onPress={() => {}}
                                />
                        </View>
                        <Padding height={10}/>
                        <View style={boxes.centeredRow}>
                            <Text style={texts.listTileHeader}>{currentName}</Text>
                        </View>
                        <View style={boxes.centeredRow}>
                            <Text style={texts.copy}>{currentBio}</Text>
                        </View>
                        <View style={boxes.centeredRow}>
                            <Text style={texts.copy}>{currentEmail}</Text>
                        </View>
                        <Padding height={10}/>
                    </View>

                    <AttributeList style={{flexGrow: 1, backgroundColor: "red"}}
                        attList={skillsList}
                    />
                    <View style={boxes.modalButton}>
                        <ButtonLarge
                            title={"OK"}
                            onPress={props.onDismiss}
                        />
                    </View>

                </SafeAreaView>            
            </Fragment>


        </Modal>
    )        
}
          
