import React, { useState, useContext, useEffect, Fragment } from 'react';
import {FlatList, Modal, StatusBar, SafeAreaView, StyleSheet } from "react-native";

import { boxes, colors, texts } from '../Styles';
import { View, Text, Image } from 'react-native';
import { icons } from '../Styles';
import DB from '../api/DB_API';
import ModalContent from './ModalContent';
import AttributeList from './AttributeList';
import ProfileImage from './ProfileImage';
import Padding from './Padding';
import Button from './Button';
import SubHeader from '../components/SubHeader';
import FlexRow from '../components/FlexRow';

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

                    <SubHeader>
                        <Padding height={5}/>
                        <View style={styles.profileViewImage}>
                            <ProfileImage
                                imageUrl={imageUrl}
                                onPress={() => {}}
                                />
                        </View>
                        <Padding height={10}/>
                        <FlexRow center>
                            <Text style={texts.listTileHeader}>{currentName}</Text>
                        </FlexRow>
                        <FlexRow center>
                            <Text style={texts.copy}>{currentBio}</Text>
                        </FlexRow>
                        <FlexRow center>
                            <Text style={texts.copy}>{currentEmail}</Text>
                        </FlexRow>
                        <Padding height={7}/>
                    </SubHeader>
                    <Padding height={5}/>
                    <FlexRow padding>
                        <Button
                            inactive={viewedList == interestsList}
                            title="Fähigkeiten"
                            icon={icons.info}
                            onPress={() => setViewedList(skillsList)}
                        />
                        <Padding width={10}/>
                        <Button
                            inactive={viewedList != interestsList}
                            title="Interessen"
                            icon={icons.info}
                            onPress={() => setViewedList(interestsList)}
                        />
                    </FlexRow>
                    <AttributeList style={{flexGrow: 1, backgroundColor: "red"}}
                        attList={viewedList}
                    />

                    <View style={boxes.modalButton}>
                        <Button
                            title={"OK"}
                            onPress={props.onDismiss}
                        />
                    </View>

                </SafeAreaView>            
            </Fragment>


        </Modal>
    )        
}
          
const styles = StyleSheet.create({
    profileViewImage: {
        width: "100%",
        height: 150,
        alignItems: "center",
        borderRadius: 111
    },
});
