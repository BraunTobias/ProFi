import React, {useState, useEffect, useLayoutEffect, useContext} from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard, Modal, Alert, Switch } from 'react-native';
import * as ImageManipulator from "expo-image-manipulator";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker"

import { icons, colors, boxes, texts } from '../Styles';
import DB from '../api/DB_API';
import Button from '../components/Button';
import ProfileImage from '../components/ProfileImage';
import InputField from '../components/InputField';
import AttributePreviewTile from '../components/AttributePreviewTile';
import { ScrollView } from 'react-native-gesture-handler';
import ModalContent from "../components/ModalContent";
import Padding from '../components/Padding';
import PushNofiticationSwitch from '../components/PushNofiticationSwitch';
import FlexRow from '../components/FlexRow';
import { ThemeContext } from '../components/ThemeManager';

export default ProfileScreen = ({navigation}) => {

    const {themeColors} = useContext(ThemeContext);

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
    const [deleteUserVisible, setDeleteUserVisible] = useState(false);
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
    const deleteUser = (committed) => {
        if (committed) {
            if (currentEnterPassword != "") {
                DB.deleteUser(currentMail, currentEnterPassword, () => {
                    console.log("success")
                }, (error) => {
                    console.log(error);
                    Alert.alert(
                        "Ungültige Eingabe",
                        "Passwort nicht korrekt",
                        [{ text: "OK" }],
                    );                  
                });
                console.log("delete");
            } else {
                setPwErrorVisible(true);
                return;    
            }
        } else {
            setCurrentEnterPassword("");
            setDeleteUserVisible(false);
        }
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
        <View style={{flex: 1, backgroundColor: themeColors.base}}>
            {/* Name ändern */}
            <Modal visible= { editNameVisible } animationType= 'slide' onRequestClose={() => setEditNameVisible(false)}>
                <ModalContent
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={[texts.titleCentered, {color: themeColors.textCopy}]}>{"Name ändern"}</Text>
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
            <Modal visible= { editBioVisible } animationType= 'slide' onRequestClose={() => setEditBioVisible(false)}>
                <ModalContent
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={[texts.titleCentered, {color: themeColors.textCopy}]}>{"Kurzbeschreibung ändern"}</Text>
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
            <Modal visible= { editEmailVisible } animationType= 'slide' onRequestClose={() => setEditEmailVisible(false)}>
                <ModalContent
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={[texts.titleCentered, {color: themeColors.textCopy}]}>{"E-Mail ändern"}</Text>
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
            <Modal visible= { editPasswordVisible } animationType= 'slide' onRequestClose={() => setEditPasswordVisible(false)}>
                <ModalContent
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={[texts.titleCentered, {color: themeColors.textCopy}]}>{"Passwort ändern"}</Text>
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
            <Modal visible= { manageNotificationsVisible } animationType= 'slide' onRequestClose={() => setManageNotificationsVisible(false)}>
                <ModalContent
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={[texts.titleCentered, {color: themeColors.textCopy}]}>{"Push-Mitteilungen erhalten für …"}</Text>
                                <Padding height={20}/>
                                <FlexRow>
                                    <Text style={[texts.copy, {fontFamily: 'Inter_600SemiBold', color: themeColors.textCopy}]}>Alle</Text>
                                    <PushNofiticationSwitch
                                        onValueChange={toggleAllPushNotficationSwitches}
                                        value={pushEvaluateEnabled && pushCommentEnabled && pushDeleteEnabled && pushAttChangeEnabled && pushCourseChangeEnabled}
                                    />
                                </FlexRow>
                                <Padding height={10}/>
                                <View style={{height: 1, width: "100%", backgroundColor: themeColors.textInactive}}></View>
                                <Padding height={10}/>
                                <FlexRow>
                                    <Text style={[texts.copy, {color: themeColors.textCopy}]}>Einteilung von Ideen (empfohlen)</Text>
                                    <PushNofiticationSwitch
                                        onValueChange={toggleEvaluateSwitch}
                                        value={pushEvaluateEnabled}
                                    />
                                </FlexRow>
                                <Padding height={7}/>
                                <FlexRow>
                                    <Text style={[texts.copy, {color: themeColors.textCopy}]}>Neue Kommentare</Text>
                                    <PushNofiticationSwitch
                                        onValueChange={toggleCommentSwitch}
                                        value={pushCommentEnabled}
                                    />
                                </FlexRow>
                                <Padding height={7}/>
                                <FlexRow>
                                    <Text style={[texts.copy, {color: themeColors.textCopy}]}>Änderung an meinen Kursen</Text>
                                    <PushNofiticationSwitch
                                        onValueChange={toggleCourseChangeSwitch}
                                        value={pushCourseChangeEnabled}
                                    />
                                </FlexRow>
                                <Padding height={7}/>
                                <FlexRow>
                                    <Text style={[texts.copy, {color: themeColors.textCopy}]}>Löschen von Ideen</Text>
                                    <PushNofiticationSwitch
                                        onValueChange={toggleDeleteSwitch}
                                        value={pushDeleteEnabled}
                                    />
                                </FlexRow>
                                <Padding height={7}/>
                                <FlexRow>
                                    <Text style={[texts.copy, {color: themeColors.textCopy}]}>Neu verfügbare Fähigkeiten</Text>
                                    <PushNofiticationSwitch
                                        onValueChange={toggleAttChangeSwitch}
                                        value={pushAttChangeEnabled}
                                    />
                                </FlexRow>
                            </View>
                        )
                    }}
                    onDismiss= {() => {setManageNotificationsVisible(false)}}
                />
            </Modal>
            {/* User löschen */}
            <Modal visible= { deleteUserVisible } animationType= 'slide' onRequestClose={() => setDeleteUserVisible(false)}>
                <ModalContent
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={[texts.titleCentered, {color: themeColors.textCopy}]}>{"User löschen"}</Text>
                                <InputField
                                    showError={pwErrorVisible}
                                    title= "Mit Passwort bestätigen"
                                    placeholderText= {pwErrorVisible ? "Bitte ein Passwort eingeben." : "Passwort"}
                                    value={currentEnterPassword}
                                    onChangeText={changeEnterPasswordHandler}
                                    secureTextEntry={true}
                                />
                            </View>
                        )
                    }}
                    onDismiss= {deleteUser}
                />
            </Modal>


            <ScrollView style={{flex: 1}}>
                    <FlexRow center>
                        <View style={{height: 130, marginVertical: 10}}>
                            <ProfileImage
                                imageUrl={currentImage}
                                onPress={selectImageHandler}
                                loading={imageLoading}
                            />
                        </View>
                    </FlexRow>

                    <FlexRow padding>
                        <InputField
                            placeholderText="Name"
                            isButton= {true}
                            icon={icons.edit}
                            value={currentName}
                            onPress={() => {setEditNameVisible(true)}}
                        />
                    </FlexRow>
                    <FlexRow padding>
                        <InputField
                            placeholderText="Kurzbeschreibung"
                            isButton= {true}
                            icon={icons.edit}
                            loaded={!imageLoading}
                            value={currentBio}
                            onPress={() => {setEditBioVisible(true)}}
                        />
                    </FlexRow>
                    <FlexRow padding>
                        <InputField
                            placeholderText="E-Mail"
                            isButton= {true}
                            icon={icons.security}
                            value={currentMail}
                            onPress={() => {setEditEmailVisible(true)}}
                        />
                    </FlexRow>
                    <FlexRow padding>
                        <InputField
                            placeholderText="Passwort ändern"
                            isButton= {true}
                            icon={icons.security}
                            value="•••••••••"
                            onPress={() => {setEditPasswordVisible(true)}}
                        />
                    </FlexRow>
                    <FlexRow padding>
                        <InputField
                            isButton= {true}
                            icon={icons.notification}
                            value="Push-Mitteilungen verwalten"
                            onPress={() => {setManageNotificationsVisible(true)}}
                        />
                    </FlexRow>
                    <FlexRow padding>
                        <AttributePreviewTile
                            title="Meine Fähigkeiten"
                            subtitle={skillString}
                            index={0}
                            onPress={() => navigation.navigate('Attributes', {attributeType: "skills"})}
                        />
                    </FlexRow>
                    <FlexRow padding>
                        <AttributePreviewTile
                            title="Meine Interessen"
                            subtitle={interestString}
                            index={0}
                            onPress={() => navigation.navigate('Attributes', {attributeType: "interests"})}
                        />
                    </FlexRow>
                    <Padding height={10}/>
                    <FlexRow padding>
                        <Button 
                            title="Abmelden" 
                            onPress={logOut}
                            icon={icons.exit}
                        />
                    </FlexRow>
                    <FlexRow padding>
                        <Button 
                            transparent
                            title="User löschen" 
                            onPress={() => {setDeleteUserVisible(true)}}
                        />
                    </FlexRow>
                    <Padding height={15}/>

            </ScrollView>
        </View>
        </TouchableWithoutFeedback>
    )
}