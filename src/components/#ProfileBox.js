import React, { useState, useEffect } from 'react';
import { View, Text } from "react-native";

import DB from '../api/DB_API';
import ProfileImage from './ProfileImage';
import Padding from './Padding';
import { boxes, texts, colors } from '../Styles';

export default function ProfileView (props) {

    const [currentName, setCurrentName] = useState("");
    const [currentBio, setCurrentBio] = useState("");
    const [currentEmail, setCurrentEmail] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    // const [skillsList, setSkillsList] = useState([]);
   
    useEffect(() => {
        DB.getUserInfoById(props.userId, (name, imageUrl, bio, email) => {
            setCurrentName(name);
            setCurrentBio(bio);
            setCurrentEmail(email);
            if (imageUrl) setImageUrl(imageUrl);
        });
        // DB.getAttributesFromUser(props.userId, (list) => {
        //     setSkillsList(list);
        // })
    }, []);

    return(
        <View style= { { width: 150, height: 150, flex: 1, backgroundColor: colors.lightBlue } }>
            <View style={boxes.subHeader}>
                <View onMouseLeave= { () => props.onLeave() } style= { [ boxes.centeredRow, { 
                    marginLeft: 35,
                    width: 70,
                    height: 150,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.darkBlue
                 } ] } >
                    <ProfileImage
                        imageUrl={imageUrl}
                        onPress={() => {}}
                    />
                </View>
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
        </View>
    )        
}
          
