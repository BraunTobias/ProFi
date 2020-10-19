import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';

import { icons, colors, boxes, texts } from '../Styles';
import DB from '../api/DB_API';
import ButtonLarge from '../components/ButtonLarge';
import ProfileImage from '../components/ProfileImage';
import InputField from '../components/InputField';
import AttributePreviewTile from '../components/AttributePreviewTile';

export default ProfileScreen = ({navigation}) => {

    // State Hooks
    const [currentName, setCurrentName] = useState("");
    const [currentBio, setCurrentBio] = useState("");
    const [currentMail, setCurrentMail] = useState("");
    // const [changesSaved, setChangesSaved] = useState(true);
    const [skillString, setSkillString] = useState("");
    const [currentImage, setCurrentImage] = useState("");


    const getUserData = () => {
        DB.getUserInfo((data) => {
            setCurrentName(data.username);
            setCurrentBio(data.bio);
            setCurrentMail(data.email);
            if (data.image) setCurrentImage(data.image);
        });
        DB.userAttributesToString((skills, prefs) => {
            setSkillString(skills);
        });
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getUserData();
        });    
    }, []);

    const logOut = () => {
        DB.signOut(() => {console.log("Logout")});
    }

    return(
        <TouchableWithoutFeedback onPress= { () => Keyboard.dismiss() }>
        <View style={{flex: 1}}>
            <View style={boxes.subHeader}>
                <View style={boxes.paddedRow}>
                    <View style={{height: 100, marginTop: 5}}>
                        <ProfileImage
                            imageUrl={currentImage}
                        />
                    </View>
                    <View>
                        <ButtonSmall 
                            title="Aktualisieren" 
                            onPress={logOut}
                            icon="checkFalse"
                        />
                        <ButtonSmall 
                            title="Abmelden" 
                            onPress={logOut}
                            icon="exit"
                        />
                    </View>

                </View>
            </View>
            <View style={boxes.paddedRow}>
                <Text></Text>
            </View>
            <View style={boxes.paddedRow}>
                <InputField
                    title="Name"
                    value={currentName}
                    onChangeText={() => {}}
                />
            </View>
            <View style={boxes.paddedRow}>
                <InputField
                    title="Kurzbeschreibung"
                    value={currentBio}
                    onChangeText={() => {}}
                />
            </View>
            <View style={boxes.paddedRow}>
                <InputField
                    title="E-Mail"
                    value={currentMail}
                    onChangeText={() => {}}
                />
            </View>
            <View style={boxes.paddedRow}>
                <AttributePreviewTile
                    title="Meine Fähigkeiten"
                    subtitle={skillString}
                    index={0}
                    onPress={() => navigation.navigate('Attributes', {attributeType: "skills"})}
                />
            </View>
        </View>
        </TouchableWithoutFeedback>
    )
}