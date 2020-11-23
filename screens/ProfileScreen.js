import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard, Modal, Alert, Switch } from 'react-native';
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
import PushNofiticationSwitch from '../components/PushNofiticationSwitch';

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
    const [currentConfirmPassword, setCurrentConfirmPassword] = useState("");
    const [skillString, setSkillString] = useState("");
    const [interestString, setInterestString] = useState("");
    const [currentImage, setCurrentImage] = useState("");
    const [imageLoading, setImageLoading] = useState(true);
    const [pushEvaluateEnabled, setPushEvaluateEnabled] = useState(false);
    const [pushCommentEnabled, setPushCommentEnabled] = useState(false);
    const [pushDeleteEnabled, setPushDeleteEnabled] = useState(false);
    const [pushAttChangeEnabled, setPushAttChangeEnabled] = useState(false);
    const [pushCourseChangeEnabled, setPushCourseChangeEnabled] = useState(false);

    // State Hooks für Modals
    const [editNameVisible, setEditNameVisible] = useState(false);
    const [editBioVisible, setEditBioVisible] = useState(false);
    const [editEmailVisible, setEditEmailVisible] = useState(false);
    const [editPasswordVisible, setEditPasswordVisible] = useState(false);
    const [manageNotificationsVisible, setManageNotificationsVisible] = useState(false);
    const [mailErrorVisible, setMailErrorVisible] = useState(false);
    const [pwErrorVisible, setPwErrorVisible] = useState(false);
    const [confirmPwErrorVisible, setConfirmPwErrorVisible] = useState(false);
    const [editPwErrorVisible, setEditPwErrorVisible] = useState(false);
    const [nameErrorVisible, setNameErrorVisible] = useState(false);

    const getUserData = () => {
        DB.getUserInfo((data) => {
            setCurrentName(data.username);
            setCurrentEditName(data.username);
            setCurrentBio(data.bio);
            setCurrentEditBio(data.bio);
            setCurrentMail(data.email);
            setPushEvaluateEnabled(data.pushNotificationsAllowed.evaluate);
            setPushCommentEnabled(data.pushNotificationsAllowed.comment);
            setPushDeleteEnabled(data.pushNotificationsAllowed.delete);
            setPushAttChangeEnabled(data.pushNotificationsAllowed.attChange);
            setPushCourseChangeEnabled(data.pushNotificationsAllowed.courseChange);
            if (data.image) setCurrentImage(data.image);
            setImageLoading(false);
        });
        DB.userAttributesToString((skills, interests) => {
            setSkillString(skills);
            setInterestString(interests);
        });
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getUserData();
        });    
    }, []);

    const logOut = () => {
        DB.signOut(() => {});
    }

    // Handler für Modals
    const changeNameHandler = (enteredText) => {
        setCurrentEditName(enteredText);
        if (enteredText != "") setNameErrorVisible(false);
    }
    const pressEditNameHandler = (committed) => {
        if (committed) {
            if (currentEditName != "") {
                DB.changeUsername(currentEditName, currentBio);
                getUserData();
            } else {
                setNameErrorVisible(true);
                return;
            }
        }
        else {
            setCurrentEditName(currentName);
            setNameErrorVisible(false);
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
        if (enteredText != "") setMailErrorVisible(false);
    }
    const changeEnterPasswordHandler = (enteredText) => {
        setCurrentEnterPassword(enteredText);
        if (enteredText != "") setPwErrorVisible(false);
    }
    const pressEditEmailHandler = (committed) => {
        if (committed) {
            if (currentEditMail != "" && currentEnterPassword != "") {
                DB.changeEmail(currentMail, currentEditMail, currentEnterPassword, () => {
                    setCurrentMail(currentEditMail);
                    setEditEmailVisible(false);
                    setCurrentEnterPassword("");
                    setCurrentEditMail("");
                }, (error) => {
                    var errorText = error.message;
                    switch (error.code) {
                        case "auth/invalid-email": errorText = "Bitte eine gültige E-Mail-Adresse eingeben."; break;
                        case "auth/email-already-in-use": errorText = "Diese E-Mail-Adresse ist schon vergeben."; break;
                        case "auth/wrong-password": errorText = "Falsches Passwort eingegeben."; setCurrentEnterPassword(""); break;
                    }
                    Alert.alert(
                        "Ungültige Eingabe",
                        errorText,
                        [{ text: "OK" }],
                    );                  
                });            
            } else {
                if (currentEditMail == "") setMailErrorVisible(true);
                if (currentEnterPassword == "") setPwErrorVisible(true);
            }
        } else {
            setEditEmailVisible(false);
            setCurrentEnterPassword("");
            setCurrentEditMail("");
            setMailErrorVisible(false);
            setPwErrorVisible(false);
        }
    }
    const changePasswordHandler = (enteredText) => {
        setCurrentEditPassword(enteredText);
        if (enteredText.length >= 6) setEditPwErrorVisible(false);
    }
    const changeConfirmPasswordHandler = (enteredText) => {
        setCurrentConfirmPassword(enteredText);
        if (enteredText == currentEditPassword) setConfirmPwErrorVisible(false);
    }
    const pressEditPasswordHandler = (committed) => {
        if (committed) {
            if (currentEnterPassword != "" && currentEditPassword.length <= 6 && currentEditPassword == currentConfirmPassword) {
                DB.changePassword(currentMail, currentEnterPassword, currentEditPassword, () => {
                    setEditPasswordVisible(false);
                    setCurrentEnterPassword("");
                    setCurrentEditPassword("");
                    setCurrentConfirmPassword("");
                }, (error) => {
                    var errorText = error.message;
                    switch (error.code) {
                        case "auth/wrong-password": errorText = "Falsches Passwort eingegeben."; setCurrentEnterPassword(""); break;
                    }
                    Alert.alert(
                        "Ungültige Eingabe",
                        errorText,
                        [{ text: "OK" }],
                    );                  
                });            
            }
            if (currentEnterPassword == "") setPwErrorVisible(true);
            if (currentEditPassword.length < 6) setEditPwErrorVisible(true);
            else if (currentEditPassword != currentConfirmPassword) setConfirmPwErrorVisible(true);
        } else {
            setEditPasswordVisible(false);
            setCurrentEnterPassword("");
            setCurrentEditPassword("");
            setCurrentConfirmPassword("");
            setPwErrorVisible(false);
            setEditPwErrorVisible(false);
            setConfirmPwErrorVisible(false);
        }
    }

    const toggleAllPushNotficationSwitches = () => {
        if (pushEvaluateEnabled && pushCommentEnabled && pushDeleteEnabled && pushAttChangeEnabled && pushCourseChangeEnabled) {
            setPushEvaluateEnabled(false);
            setPushCommentEnabled(false);
            setPushDeleteEnabled(false);
            setPushAttChangeEnabled(false);
            setPushCourseChangeEnabled(false);
            DB.togglePushNotifications(["evaluate", "comment", "delete", "attChange", "courseChange"], false);
        } else {
            setPushEvaluateEnabled(true);
            setPushCommentEnabled(true);
            setPushDeleteEnabled(true);
            setPushAttChangeEnabled(true);
            setPushCourseChangeEnabled(true);
            DB.togglePushNotifications(["evaluate", "comment", "delete", "attChange", "courseChange"], true);
        }
    }

    const toggleEvaluateSwitch = () => {
        DB.togglePushNotifications(["evaluate"], !pushEvaluateEnabled);
        setPushEvaluateEnabled(!pushEvaluateEnabled);
    }
    const toggleCommentSwitch = () => {
        DB.togglePushNotifications(["comment"], !pushCommentEnabled);
        setPushCommentEnabled(!pushCommentEnabled);
    }
    const toggleDeleteSwitch = () => {
        DB.togglePushNotifications(["delete"], !pushDeleteEnabled);
        setPushDeleteEnabled(!pushDeleteEnabled);
    }
    const toggleAttChangeSwitch = () => {
        DB.togglePushNotifications(["attChange"], !pushAttChangeEnabled);
        setPushAttChangeEnabled(!pushAttChangeEnabled);
    }
    const toggleCourseChangeSwitch = () => {
        DB.togglePushNotifications(["courseChange"], !pushCourseChangeEnabled);
        setPushCourseChangeEnabled(!pushCourseChangeEnabled);
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
        setImageLoading(true);
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });
        if (pickerResult.cancelled) {
            setImageLoading(false); 
            return;
        }
        const smallImage = await ImageManipulator.manipulateAsync(
            pickerResult.uri,
            [{ resize: { height: 400 } }],
            { compress: 0.2, base64: true }
        );
        DB.changeProfileImage(smallImage.uri);
        setCurrentImage(smallImage.uri);
        setImageLoading(false);
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
                                    showError={nameErrorVisible}
                                    placeholderText= {nameErrorVisible ? "Bitte einen Namen eingeben." : "Name"}
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
                                    showError={pwErrorVisible}
                                    placeholderText= {pwErrorVisible ? "Bitte ein Passwort eingeben." : "Passwort zur Bestätigung"}
                                    value={currentEnterPassword}
                                    onChangeText={changeEnterPasswordHandler}
                                    secureTextEntry={true}
                                />
                                <InputField
                                    showError={mailErrorVisible}
                                    placeholderText= {mailErrorVisible ? "Bitte eine E-Mail-Adresse eingeben." : "Neue E-Mail-Adresse"}
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
                                    showError={pwErrorVisible}
                                    title= "Altes Passwort"
                                    placeholderText= {pwErrorVisible ? "Bitte ein Passwort eingeben." : "Altes Passwort"}
                                    value={currentEnterPassword}
                                    onChangeText={changeEnterPasswordHandler}
                                    secureTextEntry={true}
                                />
                                <InputField
                                    showError={editPwErrorVisible}
                                    title= "Neues Passwort"
                                    placeholderText= {editPwErrorVisible ? "Bitte ein Passwort mit mindestens 6 Zeichen eingeben." : "Neues Passwort"}
                                    value={currentEditPassword}
                                    onChangeText={changePasswordHandler}
                                    secureTextEntry={true}
                                />
                                <InputField
                                    showError={confirmPwErrorVisible}
                                    placeholderText= {confirmPwErrorVisible ? "Passwörter stimmen nicht überein." : "Neues Passwort bestätigen"}
                                    value={currentConfirmPassword}
                                    onChangeText={changeConfirmPasswordHandler}
                                    secureTextEntry={true}
                                />
                            </View>
                        )
                    }}
                    onDismiss= {pressEditPasswordHandler}
                />
            </Modal>
            {/* Push-Mitteilungen verwalten */}
            <Modal visible= { manageNotificationsVisible } animationType= 'slide'>
                <ModalContent
                    subheader= { () => {}}
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={texts.titleCentered}>{"Push-Mitteilungen erhalten für …"}</Text>
                                <Padding height={20}/>
                                <View style={[boxes.unPaddedRow, {alignItems: "center"}]}>
                                    <Text style={[texts.copy, {fontFamily: 'Inter_600SemiBold'}]}>Alle</Text>
                                    <PushNofiticationSwitch
                                        onValueChange={toggleAllPushNotficationSwitches}
                                        value={pushEvaluateEnabled && pushCommentEnabled && pushDeleteEnabled && pushAttChangeEnabled && pushCourseChangeEnabled}
                                    />
                                </View>
                                <Padding height={10}/>
                                <View style={boxes.line}></View>
                                <Padding height={10}/>
                                <View style={[boxes.unPaddedRow, {alignItems: "center"}]}>
                                    <Text style={texts.copy}>Einteilung von Ideen (empfohlen)</Text>
                                    <PushNofiticationSwitch
                                        onValueChange={toggleEvaluateSwitch}
                                        value={pushEvaluateEnabled}
                                    />
                                </View>
                                <Padding height={7}/>
                                <View style={[boxes.unPaddedRow, {alignItems: "center"}]}>
                                    <Text style={texts.copy}>Neue Kommentare</Text>
                                    <PushNofiticationSwitch
                                        onValueChange={toggleCommentSwitch}
                                        value={pushCommentEnabled}
                                    />
                                </View>
                                <Padding height={7}/>
                                <View style={[boxes.unPaddedRow, {alignItems: "center"}]}>
                                    <Text style={texts.copy}>Änderung an meinen Kursen</Text>
                                    <PushNofiticationSwitch
                                        onValueChange={toggleCourseChangeSwitch}
                                        value={pushCourseChangeEnabled}
                                    />
                                </View>
                                <Padding height={7}/>
                                <View style={[boxes.unPaddedRow, {alignItems: "center"}]}>
                                    <Text style={texts.copy}>Löschen von Ideen</Text>
                                    <PushNofiticationSwitch
                                        onValueChange={toggleDeleteSwitch}
                                        value={pushDeleteEnabled}
                                    />
                                </View>
                                <Padding height={7}/>
                                <View style={[boxes.unPaddedRow, {alignItems: "center"}]}>
                                    <Text style={texts.copy}>Neu verfügbare Fähigkeiten</Text>
                                    <PushNofiticationSwitch
                                        onValueChange={toggleAttChangeSwitch}
                                        value={pushAttChangeEnabled}
                                    />
                                </View>
                            </View>
                        )
                    }}
                    onDismiss= {() => {setManageNotificationsVisible(false)}}
                />
            </Modal>


            <ScrollView style={{flex: 1}}>
                    <View style={boxes.centeredRow}>
                        <View style={{height: 130, marginVertical: 10}}>
                            <ProfileImage
                                imageUrl={currentImage}
                                onPress={selectImageHandler}
                                loading={imageLoading}
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
                        <InputField
                            isButton= {true}
                            icon={icons.edit}
                            value="Push-Mitteilungen verwalten"
                            onPress={() => {setManageNotificationsVisible(true)}}
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
                    <View style={boxes.paddedRow}>
                        <AttributePreviewTile
                            title="Meine Interessen"
                            subtitle={interestString}
                            index={0}
                            onPress={() => navigation.navigate('Attributes', {attributeType: "interests"})}
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
                    <Padding height={15}/>

            </ScrollView>
        </View>
        </TouchableWithoutFeedback>
    )
}