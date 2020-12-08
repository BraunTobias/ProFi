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
import ButtonSmall from './ButtonSmall';

export default ProfileView = props => {

    const [currentName, setCurrentName] = useState("");
    const [currentBio, setCurrentBio] = useState("");
    const [currentEmail, setCurrentEmail] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [skillsList, setSkillsList] = useState([]);
    const [interestsList, setInterestsList] = useState([]);
    const [viewedList, setViewedList] = useState([]);
   
    useEffect(() => {
        DB.getUserInfoById(props.userId, (name, imageUrl, bio, email) => {
            setCurrentName(name);
            setCurrentBio(bio);
            setCurrentEmail(email);
            if (imageUrl) setImageUrl(imageUrl);
        });
        DB.getAttributesFromUser(props.userId, (filterList) => {
            DB.getAllAttributes("skills", filterList, null, null, null, (attributesList) => {
                setSkillsList(attributesList);
                setViewedList(attributesList);
            });
            DB.getAllAttributes("interests", filterList, null, null, null, (attributesList) => {
                setInterestsList(attributesList);
            });
        });    
    }, []);

    return(
        <Modal visible={props.visible} animationType='slide' onRequestClose={props.onDismiss}>
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
                        <Padding height={7}/>
                    </View>
                    <Padding height={5}/>
                    <View style={[boxes.paddedRow, {backgroundColor: colors.white}]}>
                        <ButtonSmall
                            inactive={viewedList == interestsList}
                            title="Fähigkeiten"
                            icon={icons.info}
                            onPress={() => setViewedList(skillsList)}
                        />
                        <View style={boxes.buttonSpacing}/>
                        <ButtonSmall
                            inactive={viewedList != interestsList}
                            title="Interessen"
                            icon={icons.info}
                            onPress={() => setViewedList(interestsList)}
                        />
                    </View>
                    <AttributeList style={{flexGrow: 1, backgroundColor: "red"}}
                        attList={viewedList}
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
          
