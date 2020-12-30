import React, { useState, useEffect } from 'react';
import { View, Text, Modal } from "react-native";

import DB from '../api/DB_API';
import AttributeList from './AttributeList';
import ProfileImage from './ProfileImage';
import Padding from './Padding';
import { boxes, texts } from '../Styles';
import ModalContent from "../components/ModalContent";

export default function ProfileView (props) {

    const [currentName, setCurrentName] = useState("");
    const [currentBio, setCurrentBio] = useState("");
    const [currentEmail, setCurrentEmail] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [skillsList, setSkillsList] = useState([]);
    const [interestsList, setInterestsList] = useState([]);
    
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
            });
            DB.getAllAttributes("interests", filterList, null, null, null, (attributesList) => {
                setInterestsList(attributesList);
            });
        });    
    }, []);

    return(
        <Modal visible={props.visible}
            animationType='slide'
            transparent= {true}
            style= { { 
                width: window.width,
                height: window.height,
        } } >
            <ModalContent
                subheader= { () => { return (
                    <View style= { [boxes.subHeader, {
                        height: 200,
                        width: window.width,
                        justifyContent: 'center',
                        alignContent: 'center',
                    } ] } >
                        <Padding height={5}/>
                        <View style= { boxes.profileViewImage } >
                            <ProfileImage
                                imageUrl= { imageUrl }
                                onPress= { () => {} }
                                />
                        </View>
                        <Padding height= { 0 } />
                        <View style= { boxes.centeredRow } >
                            <Text style= { texts.listTileHeader } >{ currentName }</Text>
                        </View>
                        <View style= { boxes.centeredRow } >
                            <Text style= { texts.copy } >{ currentBio }</Text>
                        </View>
                        <View style= { boxes.centeredRow } >
                            <Text style= { texts.copy } >{ currentEmail }</Text>
                        </View>
                        <Padding height= { 10 } />
                    </View>
                ) } }
                content= { () => {
                    return(
                        <View style={boxes.mainContainer}>
                            <View style={boxes.width}>
                                <AttributeList style={{flexGrow: 1, backgroundColor: "red"}}
                                    attList = {skillsList}
                                />
                                <AttributeList style={{flexGrow: 1, backgroundColor: "red"}}
                                    attList = {interestsList}
                                />
                            </View>
                        </View>
                    )
                }}
                onDismiss= { () => props.onDismiss() }
                infoScreen= { props.infoScreen }
            />
        </Modal>
    )     
}
          
