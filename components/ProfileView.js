import React, { useState, useContext, useEffect } from 'react';
import {FlatList } from "react-native";
import { styles, texts, profileImage, lightGrey } from '../Styles'
import { View, Text, Image } from 'react-native';
import { icons } from '../Styles';
import DB from '../api/DB_API';


export default ProfileView = props => {
    const [currentName, setCurrentName] = useState("");
    const [currentBio, setCurrentBio] = useState("");
    const [currentEmail, setCurrentEmail] = useState("");
    const [currentImage, setCurrentImage] = useState(icons.profilePlaceholder);
    const [skillsList, setSkillsList] = useState([]);

    // Wird nur beim Laden der Seite einmalig ausgeführt
    useEffect(() => {
        DB.getUserInfoById(props.userId, (name, imageUrl, bio, email) => {
            setCurrentName(name);
            setCurrentBio(bio);
            setCurrentEmail(email);
            if (imageUrl) setCurrentImage({uri: imageUrl});
        });
        DB.getAttributesFromUser(props.userId, (list) => {
            // console.log("LIST: " + list);
            if (list.length > 0) {
                DB.getAllAttributes("skills", list, (attributesList) => {
                    setSkillsList(attributesList);
                    // console.log(attributesList);
                }, () => {});
            }
        })
    }, []);

    return ( 
        <View style={{height: "100%", backgroundColor: lightGrey, flex: 1}}>
            {/* // "Header" mit Profildaten */}
            <View style={styles.subHeaderProfile}>
                
                {/* Linke Spalte: Profilbild */}
                <View style={styles.contentProfile}>
                    <Image 
                        style={[profileImage.imageTile, profileImage.cameraPreview]} 
                        source={currentImage} 
                        />
                        {/* source={{ uri: selectedImage.localUri}}  */}
                </View>

                {/* // Rechte Spalte */}
                <View style={{flex:2, flexDirection: "column", justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{width: "90%"}} >
                        <Text style= { texts.inputTextProfile }>{currentName}</Text>
                    </View>
                    <View style={{width: "90%"}} >
                        <Text style={texts.textProfile}>Kurzbeschreibung:</Text>
                        <Text style={texts.textBold}>{currentBio}</Text>
                    </View>

                    
                    <View style={{width: "90%"}}>
                        <Text style={texts.textProfile}>E-Mail:</Text>
                        <Text style={texts.textBold}>{currentEmail}</Text>
                    </View>
                    
                </View>
            </View>
            {/* <View style={{paddingBottom: 10, backgroundColor: lightGrey}}> */}
                <FlatList style={{height: "100%"}}
                    data={skillsList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(itemData) => { 
                        return (
                            <View style={styles.contentAttribute}>
                                <Text style={[texts.textBoldAttribute, ]}>{itemData.item[0]}</Text> 
                                <Text style={[texts.textAttribute, {backgroundColor: "white"}]}>{itemData.item[1]}</Text>
                            </View>
                        );
                    }}
                />

            {/* </View> */}
        </View>
     );
}