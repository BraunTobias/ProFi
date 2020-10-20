import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard, Modal, Alert } from 'react-native';
import * as ImageManipulator from "expo-image-manipulator";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker"

import { icons, colors, boxes, texts } from '../Styles';
import DB from '../api/DB_API';
import ButtonLarge from '../components/ButtonLarge';
import ProfileImage from '../components/ProfileImage';
import InputField from '../components/InputField';
import AttributePreviewTile from '../components/AttributePreviewTile';
import { ScrollView } from 'react-native-gesture-handler';
import ModalContent from "../components/ModalContent";
import Padding from '../components/Padding';

export default ProfileScreen = ({navigation}) => {

    // State Hooks
    const [currentName, setCurrentName] = useState("");
    const [currentEditName, setCurrentEditName] = useState("");
    const [currentBio, setCurrentBio] = useState("");
    const [currentEditBio, setCurrentEditBio] = useState("");
    const [currentMail, setCurrentMail] = useState("");
    const [currentEditMail, setCurrentEditMail] = useState("");
    const [currentEnterPassword, setCurrentEnterPassword] = useState("");
    const [currentEditPassword, setCurrentEditPassword] = useState("");
    // const [changesSaved, setChangesSaved] = useState(true);
    const [skillString, setSkillString] = useState("");
    const [currentImage, setCurrentImage] = useState("");

    // State Hooks für Modals
    const [editImageVisible, setEditImageVisible] = useState(false);
    const [editNameVisible, setEditNameVisible] = useState(false);
    const [editBioVisible, setEditBioVisible] = useState(false);
    const [editEmailVisible, setEditEmailVisible] = useState(false);
    const [editPasswordVisible, setEditPasswordVisible] = useState(false);

    const getUserData = () => {
        DB.getUserInfo((data) => {
            setCurrentName(data.username);
            setCurrentEditName(data.username);
            setCurrentBio(data.bio);
            setCurrentEditBio(data.bio);
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

    // Handler für Modals
    const changeNameHandler = (enteredText) => {
        setCurrentEditName(enteredText);
    }
    const pressEditNameHandler = (committed) => {
        if (committed) {
            DB.changeUsername(currentEditName, currentBio);
            getUserData();
        }
        else {
            setCurrentEditName(currentName);
        }
        setEditNameVisible(false);
    }
    const changeBioHandler = (enteredText) => {
        setCurrentEditBio(enteredText);
    }
    const pressEditBioHandler = (committed) => {
        if (committed) {
            DB.changeUsername(currentName, currentEditBio);
            getUserData();
        }
        else {
            setCurrentEditBio(currentBio);
        }
        setEditBioVisible(false);
    }
    const changeEmailHandler = (enteredText) => {
        setCurrentEditMail(enteredText);
    }
    const changeEnterPasswordHandler = (enteredText) => {
        setCurrentEnterPassword(enteredText);
    }
    const pressEditEmailHandler = (committed) => {
        if (committed) {
            DB.changeEmail(currentMail, currentEditMail, currentEnterPassword, () => {
                setCurrentMail(currentEditMail);
                setEditEmailVisible(false);
                setCurrentEnterPassword("");
                setCurrentEditMail("");
            }, (error) => {console.log(error)});            
        } else {
            setEditEmailVisible(false);
            setCurrentEnterPassword("");
            setCurrentEditMail("");
        }
    }
    const changePasswordHandler = (enteredText) => {
        setCurrentEditPassword(enteredText);
    }
    const pressEditPasswordHandler = (committed) => {
        if (committed) {
            DB.changePassword(currentMail, currentEnterPassword, currentEditPassword, () => {
                setEditPasswordVisible(false);
                setCurrentEnterPassword("");
                setCurrentEditPassword("");
            }, (error) => {console.log(error)});            
        } else {
            setEditPasswordVisible(false);
            setCurrentEnterPassword("");
            setCurrentEditPassword("");
        }
    }

    // Profilbild
    const verifyPermissions = async (permission) => {
        const result = await Permissions.askAsync(permission);
        if (result.status !== "granted") {
            Alert.alert(
            "Berechtigung verweigert!",
            "Dieses Feature benötigt weitere Berechtigungen.",
            [{ text: "OK" }]
            );
            return false;
        } else {
            return true;
        }
    };
    const selectImageHandler = async () => {
        const hasPermission = await verifyPermissions(Permissions.CAMERA_ROLL);
        if (!hasPermission) return;
    
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.cancelled === true) return;
        setCurrentImage({ uri: pickerResult.uri });
        const smallImage = await ImageManipulator.manipulateAsync(
            pickerResult.uri,
            [{ resize: { height: 400 } }],
            { compress: 0.2, base64: true}
        );
        DB.changeProfileImage(smallImage.uri);
    };

    return(
        <TouchableWithoutFeedback onPress= { () => Keyboard.dismiss() }>
        <View style={{flex: 1}}>
            {/* Name ändern */}
            <Modal visible= { editNameVisible } animationType= 'slide'>
                <ModalContent
                    subheader= { () => {}}
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={texts.titleCentered}>{"Name ändern"}</Text>
                                <InputField
                                    placeholderText= "Name"
                                    value={currentEditName}
                                    onChangeText={changeNameHandler}
                                />
                            </View>
                        )
                    }}
                    onDismiss= {pressEditNameHandler}
                />
            </Modal>
            {/* Bio ändern */}
            <Modal visible= { editBioVisible } animationType= 'slide'>
                <ModalContent
                    subheader= { () => {}}
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={texts.titleCentered}>{"Kurzbeschreibung ändern"}</Text>
                                <InputField
                                    placeholderText= "Kurzbeschreibung"
                                    value={currentEditBio}
                                    onChangeText={changeBioHandler}
                                />
                            </View>
                        )
                    }}
                    onDismiss= {pressEditBioHandler}
                />
            </Modal>
            {/* E-Mail ändern */}
            <Modal visible= { editEmailVisible } animationType= 'slide'>
                <ModalContent
                    subheader= { () => {}}
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={texts.titleCentered}>{"E-Mail ändern"}</Text>
                                <InputField
                                    placeholderText= "Passwort zur Bestätigung"
                                    value={currentEnterPassword}
                                    onChangeText={changeEnterPasswordHandler}
                                    secureTextEntry={true}
                                />
                                <InputField
                                    placeholderText= "Neue E-Mail-Adresse"
                                    value={currentEditMail}
                                    onChangeText={changeEmailHandler}
                                />
                            </View>
                        )
                    }}
                    onDismiss= {pressEditEmailHandler}
                />
            </Modal>
            {/* Passwort ändern */}
            <Modal visible= { editPasswordVisible } animationType= 'slide'>
                <ModalContent
                    subheader= { () => {}}
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={texts.titleCentered}>{"Passwort ändern"}</Text>
                                <InputField
                                    placeholderText= "Altes Passwort"
                                    value={currentEnterPassword}
                                    onChangeText={changeEnterPasswordHandler}
                                    secureTextEntry={true}
                                />
                                <InputField
                                    placeholderText= "Neues Passwort"
                                    value={currentEditPassword}
                                    onChangeText={changePasswordHandler}
                                />
                            </View>
                        )
                    }}
                    onDismiss= {pressEditPasswordHandler}
                />
            </Modal>


            <ScrollView style={{flex: 1}}>
                    <View style={boxes.centeredRow}>
                        <View style={{height: 130, marginVertical: 10}}>
                            <ProfileImage
                                imageUrl={currentImage}
                                onPress={selectImageHandler}
                            />
                        </View>
                    </View>

                    <View style={boxes.paddedRow}>
                        <InputField
                            placeholderText="Name"
                            isButton= {true}
                            icon={icons.edit}
                            value={currentName}
                            onPress={() => {setEditNameVisible(true)}}
                        />
                    </View>
                    <View style={boxes.paddedRow}>
                        <InputField
                            placeholderText="Kurzbeschreibung"
                            isButton= {true}
                            icon={icons.edit}
                            value={currentBio}
                            onPress={() => {setEditBioVisible(true)}}
                        />
                    </View>
                    <View style={boxes.paddedRow}>
                        <InputField
                            placeholderText="E-Mail"
                            isButton= {true}
                            icon={icons.edit}
                            value={currentMail}
                            onPress={() => {setEditEmailVisible(true)}}
                        />
                    </View>
                    <View style={boxes.paddedRow}>
                        <InputField
                            placeholderText="Passwort ändern"
                            isButton= {true}
                            icon={icons.edit}
                            value="•••••••••"
                            onPress={() => {setEditPasswordVisible(true)}}
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
                    <Padding height={10}/>
                    <View style={boxes.paddedRow}>
                        <ButtonLarge 
                            title="Abmelden" 
                            onPress={logOut}
                            icon="exit"
                        />

                    </View>

            </ScrollView>
        </View>
        </TouchableWithoutFeedback>
    )
}