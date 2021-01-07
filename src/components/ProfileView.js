import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Image, StyleSheet, ScrollView, useWindowDimensions } from "react-native";

import DB from '../api/DB_API';
import AttributeList from './AttributeList';
import Padding from './Padding';
import { boxes, texts, icons } from '../Styles';
import ModalContent from "../components/ModalContent";

export default function ProfileView (props) {

    const window = useWindowDimensions();

    const [currentName, setCurrentName] = useState("");
    const [currentBio, setCurrentBio] = useState("");
    const [currentEmail, setCurrentEmail] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [skillsList, setSkillsList] = useState([]);
    const [interestsList, setInterestsList] = useState([]);

    const Styles = StyleSheet.create({
        image: {
            width: 60,
            height: 60,
            borderRadius: 111,
            aspectRatio: 1,
            marginRight: 7,
        },
        imageContainer: {
            width: '100%',
            height: 75,
            alignItems: "center",
        },
        listLeft: {
            width: window.width /8*3 -15,
            paddingHorizontal: 15
        },
        listRight: {
            width: window.width /8*3 -15,
        }  
    })
    
    useEffect(() => {
        DB.getUserInfoById(props.userId, (name, imageUrl, bio, email) => {
            setCurrentName(name);
            setCurrentBio(bio);
            setCurrentEmail(email);
            if (imageUrl) setImageUrl(imageUrl);
        });
        DB.getAttributesFromUser(props.userId, (skillList, interestList) => {
            DB.getAllAttributes("skills", skillList, null, null, null, (attributesList) => {
                setSkillsList(attributesList);
            });
            DB.getAllAttributes("interests", interestList, null, null, null, (attributesList) => {
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
                        <View style= { Styles.imageContainer } >
                            <Image 
                                style= { Styles.image }
                                source= { imageUrl ? { uri: imageUrl } : icons.profilePlaceholder }    
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
                        <View style= { [boxes.mainContainer, boxes.width, { height: window.height -345 } ] } >
                            <ScrollView>
                                <View style= { boxes.paddedRow }>
                                    <View style= { Styles.listLeft } >
                                        <Text style= { texts.subHeader }>Fähigkeiten</Text>
                                        <AttributeList attList = {skillsList} />
                                    </View>
                                    <View style= { Styles.listRight } >
                                        <Text style= { texts.subHeader }>Interessen</Text>
                                        <AttributeList attList = {interestsList} />
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    )
                }}
                onDismiss= { () => props.onDismiss() }
                infoScreen= { props.infoScreen }
            />
        </Modal>
    )     
}



