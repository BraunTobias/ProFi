import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, Text, Modal, Alert } from 'react-native';

import { icons, colors, boxes, texts } from '../Styles';
import DB from '../api/DB_API';
import ButtonLarge from '../components/ButtonLarge';
import ProfileImage from '../components/ProfileImage';
import InputField from '../components/InputField';
import AttributePreviewTile from '../components/AttributePreviewTile';
import AttributeSelect from '../components/AttributeSelect';
import ModalContent from "../components/ModalContent";
import InfoModal from '../components/InfoModal';
import Padding from '../components/Padding';

export default function ProfileScreen ({route, navigation}) {

    const {currentUserId} = route.params;

    // State Hooks
    const [currentName, setCurrentName] = useState("");
    const [currentEditName, setCurrentEditName] = useState("");
    const [currentBio, setCurrentBio] = useState("");
    const [currentEditBio, setCurrentEditBio] = useState("");
    const [currentMail, setCurrentMail] = useState("");
    const [currentEditMail, setCurrentEditMail] = useState("");
    const [currentEnterPassword, setCurrentEnterPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [currentEditPassword, setCurrentEditPassword] = useState("•••••••••");
    const [currentConfirmPassword, setCurrentConfirmPassword] = useState("");
    const [currentImage, setCurrentImage] = useState("");
    const [imageLoading, setImageLoading] = useState(true);
    const [pushEvaluateEnabled, setPushEvaluateEnabled] = useState(false);
    const [pushCommentEnabled, setPushCommentEnabled] = useState(false);
    const [pushDeleteEnabled, setPushDeleteEnabled] = useState(false);
    const [pushAttChangeEnabled, setPushAttChangeEnabled] = useState(false);
    const [pushCourseChangeEnabled, setPushCourseChangeEnabled] = useState(false);
    
    const [selectedSkillsList, setSelectedSkillsList] = useState([]);
    const [skillsListText, setSkillsListText] = useState("");
    const [selectedInterestsList, setSelectedInterestsList] = useState([]);
    const [interestsListText, setInterestsListText] = useState("");

    // State Hooks für Modals
    const [editEmailVisible, setEditEmailVisible] = useState(false);
    const [editPasswordVisible, setEditPasswordVisible] = useState(false);
    const [mailErrorVisible, setMailErrorVisible] = useState(false);
    const [pwErrorVisible, setPwErrorVisible] = useState(false);
    const [confirmPwErrorVisible, setConfirmPwErrorVisible] = useState(false);
    const [editPwErrorVisible, setEditPwErrorVisible] = useState(false);
    const [nameErrorVisible, setNameErrorVisible] = useState(false);

    const [editErrorVisible, setEditErrorVisible] = useState(false);
    const [selectedSkillsListErrorVisible, setSelectedSkillsListErrorVisible] = useState(false);
    const [selectedInterestsListErrorVisible, setSelectedInterestsListErrorVisible] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View/>
            ),
        });
    }, [navigation]);

    const getUserData = () => {
        DB.getUserInfo((data) => {
            setCurrentName(data.username);
            setCurrentEditName(data.username);
            setCurrentBio(data.bio);
            setCurrentEditBio(data.bio);
            setCurrentMail(data.email);
            setCurrentEditMail(data.email);
            if (data.image) setCurrentImage(data.image);
            setImageLoading(false);

        });
        DB.getAttributesFromUser(currentUserId, (skills, interests) => {
            setSelectedSkillsList(skills);
            setSkillsListText(skills.join(", "));

            setSelectedInterestsList(interests);
            setInterestsListText(interests.join(", "));
        });
    }

    useEffect(() => {
        // const unsubscribe = navigation.addListener('focus', () => {
            getUserData();
        // });
    }, []);

    const logOut = () => {
        DB.signOut(() => {});
    }

    // Handler für Modals
    const changeNameHandler = (enteredText) => {
        setCurrentEditName(enteredText);
        if (enteredText !== "") setNameErrorVisible(false);
    }
    const pressEditNameHandler = () => {
        if (currentEditName !== "") {
            DB.changeUsername(currentEditName, currentBio);
            getUserData();
        } else {
            setNameErrorVisible(true);
            return;
        }
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
    }
    const changeEmailHandler = (enteredText) => {
        setCurrentEditMail(enteredText);
        if (enteredText !== "") setMailErrorVisible(false);
        
    }
    const pressEditEmailHandler = (committed) => {
        if (committed) {
            if (currentEditMail !== "" && currentEnterPassword !== "") {
                DB.changeEmail(currentMail, currentEditMail, currentEnterPassword, () => {
                    setCurrentMail(currentEditMail);
                    setEditEmailVisible(false);
                    setCurrentEnterPassword("");
                }, (error) => {
                    var errorText = error.message;
                    switch (error.code) {
                        case "auth/invalid-email": errorText = "Bitte eine gültige E-Mail-Adresse eingeben."; break;
                        case "auth/email-already-in-use": errorText = "Diese E-Mail-Adresse ist schon vergeben."; break;
                        case "auth/wrong-password": errorText = "Falsches Passwort eingegeben."; setCurrentEnterPassword(""); break;
                        default: errorText = "";
                    }
                    Alert.alert(
                        "Ungültige Eingabe",
                        errorText,
                        [{ text: "OK" }],
                    );                  
                });            
            } else {
                if (currentEditMail === "") setMailErrorVisible(true);
                if (currentEnterPassword === "") setPwErrorVisible(true);
            }
        } else {
            setEditEmailVisible(false);
            setCurrentEnterPassword("");
            setCurrentEditMail("");
            setMailErrorVisible(false);
            setPwErrorVisible(false);
        }
    }
    const changeEnterPasswordHandler = (enteredText) => {
        setCurrentEnterPassword(enteredText);
        if (enteredText !== "") setPwErrorVisible(false);
    }
    const changePasswordHandler = (enteredText) => {
        setCurrentEditPassword(enteredText);
        if (enteredText.length >= 6) setEditPwErrorVisible(false);
    }
    const changeConfirmPasswordHandler = (enteredText) => {
        setCurrentConfirmPassword(enteredText);
        if (enteredText === currentEditPassword) setConfirmPwErrorVisible(false);
    }
    const pressEditPasswordHandler = (committed) => {
        if (committed) {
            if (currentEnterPassword !== "" && currentEditPassword.length >= 6 && currentEditPassword === currentConfirmPassword) {
                DB.changePassword(currentMail, currentEnterPassword, currentEditPassword, () => {
                    setEditPasswordVisible(false);
                    setCurrentEnterPassword("");
                    setCurrentEditPassword("•••••••••");
                    setCurrentConfirmPassword("");
                }, (error) => {
                    let errorText = error.message;
                    switch (error.code) {
                        case "auth/wrong-password": errorText = "Falsches Passwort eingegeben."; setCurrentEnterPassword(""); break;
                        default: errorText = "";
                    }
                    setEditErrorVisible(true)          
                });            
            }
            if (currentEnterPassword === "") setPwErrorVisible(true);
            if (currentEditPassword.length < 6) setEditPwErrorVisible(true);
            else if (currentEditPassword !== currentConfirmPassword) setConfirmPwErrorVisible(true);
        } else {
            setEditPasswordVisible(false);
            setCurrentEnterPassword("");
            setCurrentEditPassword("•••••••••");
            setCurrentConfirmPassword("");
            setPwErrorVisible(false);
            setEditPwErrorVisible(false);
            setConfirmPwErrorVisible(false);
        }
    }
    const ErrorInfoHandler = ( props ) => {
        if (props.visible) return (
            <Text style= { [boxes.unPaddedRow, texts.errorLine] } >
                { props.message }
            </Text>
        );
        else return (
            <Padding height= { 18.5 } />
        );
    }

    const changeSkillsHandler = (skill, currentCategory) => {
        if (selectedSkillsList.indexOf(skill) < 0) {
            let list = selectedSkillsList;
            list.push(skill);
            setSkillsListText(list.join(", "));
            setSelectedSkillsList(list);
        } else {
            let list = selectedSkillsList.filter(item => item !== skill);
            setSkillsListText(list.join(", "));
            setSelectedSkillsList(list);
        }
        if (selectedSkillsList.length > 0) setSelectedSkillsListErrorVisible(false);
        DB.toggleAttributeState("skills", currentCategory, skill, () => {} );
    }
    const changeInterestsHandler = (interest, currentCategory) => {
        if (selectedInterestsList.indexOf(interest) < 0) {
            let list = selectedInterestsList;
            list.push(interest);
            setInterestsListText(list.join(", "));
            setSelectedInterestsList(list);
        } else {
            let list = selectedInterestsList.filter(item => item !== interest);
            setInterestsListText(list.join(", "));
            setSelectedInterestsList(list);
            
        }
        if (selectedInterestsList.length > 0) setSelectedInterestsListErrorVisible(false);
        DB.toggleAttributeState("interests", currentCategory, interest, () => {} );
    }

    return(
        <View style= { { 
            backgroundColor: colors.lightGrey, 
            height: window.height-80,
        } } >

            {/* Error-Modals */}
            <InfoModal visible= { editErrorVisible }
                onPress= { () => { setEditErrorVisible(false); } }
                title="Fehler"
                copy="Ungültige Eingabe"
            />

            {/* Header */}
            <View style= { boxes.subHeader } >
                <View style={boxes.centeredRow}>
                    <View style={{height: 65, marginVertical: 10}}>
                        <ProfileImage
                            imageUrl={currentImage}
                            loading={imageLoading}
                            onPress={()=>{}}
                        />
                    </View>
                </View>
            </View>

            <View style= { boxes.width }>
                
                {/* E-Mail ändern */}
                <Modal 
                    transparent= { true }
                    visible= { editEmailVisible } 
                    animationType= 'slide' 
                    style= { { 
                        width: window.width,
                        height: window.height,
                        
                } } >
                    <View style= { { 
                        height: 215, 
                        width: 400, 
                        backgroundColor: colors.lightGrey,
                        alignSelf: 'center',
                        marginTop: '30%',

                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 7,
                        },
                        shadowOpacity: 0.5,
                        shadowRadius: 10,
                        elevation: 10,
                    } } >
                        <View style= { { 
                            height: 50, 
                            backgroundColor: colors.darkBlue, 
                        } } />
                        <View style= { { padding: 15, } } >
                            <Text>Änderung der E-Mail bitte mit Passwort bestätigen.</Text>
                            <InputField
                                placeholderText= "Passwort zur Bestätigung"
                                value={currentEnterPassword}
                                onChangeText={changeEnterPasswordHandler}
                                secureTextEntry={true}
                            />
                            {pwErrorVisible &&
                                <Text style={[boxes.unPaddedRow, texts.errorLine]}>
                                    Bitte ein Passwort eingeben.
                                </Text>
                            }
                        </View>
                        <View style={boxes.paddedRow}>
                            <ButtonLarge
                                title={"Bestätigen"}
                                onPress={ () => { pressEditEmailHandler(true) } }
                            />
                            <ButtonLarge
                                title={"Abbrechen"}
                                transparent={true}
                                onPress={ () => { 
                                    setCurrentEditMail(currentMail);
                                    setCurrentEnterPassword("");
                                    setMailErrorVisible(false);
                                    setPwErrorVisible(false);
                                    setEditEmailVisible(false);
                            } } />
                        </View>
                    </View>
                </Modal>

                {/* Passwort ändern */}
                <Modal 
                    transparent= { true }
                    visible= { editPasswordVisible } 
                    animationType= 'slide' 
                    style= { { 
                        width: window.width,
                        height: window.height,
                        
                } } >
                    <View style= { { 
                        height: 290, 
                        width: 400, 
                        backgroundColor: colors.lightGrey,
                        alignSelf: 'center',
                        marginTop: '30%',

                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 7,
                        },
                        shadowOpacity: 0.5,
                        shadowRadius: 10,
                        elevation: 10,
                    } } >
                        <View style= { { 
                            height: 50, 
                            backgroundColor: colors.darkBlue, 
                        } } />
                        <View style= { { padding: 15, } } >
                            <Text>Neues Passwort bestätigen.</Text>
                            <InputField
                                placeholderText= "Neues Passwort"
                                value= { currentConfirmPassword } 
                                onChangeText= { changeConfirmPasswordHandler }
                                secureTextEntry= { true }
                            />
                            {pwErrorVisible &&
                                <Text style={[boxes.unPaddedRow, texts.errorLine]}>
                                    Bitte ein Passwort eingeben.
                                </Text>
                            }
                            <Text>Änderung des Passworts mit altem Passwort bestätigen.</Text>
                            <InputField
                                placeholderText= "Altes Passwort"
                                value= { currentEnterPassword } 
                                onChangeText= { changeEnterPasswordHandler }
                                secureTextEntry= { true }
                            />
                            {pwErrorVisible &&
                                <Text style={[boxes.unPaddedRow, texts.errorLine]}>
                                    Bitte ein Passwort eingeben.
                                </Text>
                            }
                        </View>
                        <View style={boxes.paddedRow}>
                            <ButtonLarge
                                title={"Bestätigen"}
                                onPress={ () => { pressEditPasswordHandler(true) } }
                            />
                            <ButtonLarge
                                title={"Abbrechen"}
                                transparent={true}
                                onPress={ () => { 
                                    setCurrentEditPassword("•••••••••");
                                    setCurrentEnterPassword("");
                                    setPwErrorVisible(false);
                                    setEditPasswordVisible(false);
                            } } />
                        </View>
                    </View>
                </Modal>


                <View style={boxes.mainContainer}>
                    <View style= { boxes.paddedRow }>
                        <View style= { { width: '50%' } } >
                            <Padding height= { 15 } />
                            <InputField
                                title= "Name ändern"
                                placeholderText= "Name"
                                value= { currentEditName }
                                onChangeText= { changeNameHandler }
                                needConfirmation= { pressEditNameHandler }
                            />
                            <ErrorInfoHandler 
                                visible= { nameErrorVisible }
                                message= 'Gebe einen Benutzernamen an'
                            />
                            <InputField
                                title= "Kurzbeschreibung ändern"
                                placeholderText= "Kurzbeschreibung"
                                value= { currentEditBio }
                                onChangeText= { changeBioHandler }
                                needConfirmation= { pressEditBioHandler }
                            />
                        </View>
                        <Padding width= { 15 } />
                        <View style= { { width: '50%' } } >
                            <Padding height= { 15 } />
                            <InputField
                                title= "E-Mail ändern"
                                placeholderText= "E-Mail"
                                value= { currentEditMail } 
                                onChangeText= { changeEmailHandler }
                                needConfirmation= { () => setEditEmailVisible(true) }
                            />
                            <Padding height= { 18.5 } />
                            {/* <InputField
                                title= "Passwort ändern"
                                placeholderText="Passwort ändern"
                                isButton= {true}
                                icon={icons.edit}
                                value="•••••••••"
                                onPress={() => {setEditPasswordVisible(true)}}
                            /> */}
                            <InputField
                                title= "Passwort ändern"
                                placeholderText= "Passwort"
                                value= { currentEditPassword } 
                                onChangeText= { changePasswordHandler }
                                needConfirmation= { () => setEditPasswordVisible(true) }
                                secureTextEntry= { true }
                            />
                        </View>
                    </View>
                    <Padding height= { 18.5 } />
                    <Text style={texts.copy}>Push-Mitteilungen für dein Handy kannst Du in der App aktivieren.</Text>
                    <Padding height= { 18.5 } />

                    {/* Attribute auswählen */}
                    <View style= { boxes.paddedRow }>
                        <View style= { { width: '50%' } } >
                            
                            {/* Fähigkeiten auflisten */}
                            <AttributePreviewTile
                                title= "Meine Fähigkeiten"
                                subtitle= { skillsListText }
                                index= { 0 }
                            />
                            <Padding height= { 18.5 } />
                            
                            {/* Fähigkeiten auswählen */}
                            <AttributeSelect
                                attributeType = "skills"
                                selectedAttributesList= { selectedSkillsList }
                                changeAttribute = { (skills, currentCategory) => { changeSkillsHandler(skills, currentCategory) } }
                            />
                            {selectedSkillsListErrorVisible &&
                                <Text style={[boxes.unPaddedRow, texts.errorLine]}>
                                    Bitte mindestens eine Fähigkeit angeben.
                                </Text>
                            }
                        </View>
                        <Padding width= { 15 } />
                        <View style= { { width: '50%' } } >
                            
                            {/* Interessen auflisten */}
                            <AttributePreviewTile
                                title= "Meine Interessen"
                                subtitle= { interestsListText }
                                index= { 0 }
                            />
                            <Padding height= { 18.5 } />
                            
                            {/* Interessen auswählen */}
                            <AttributeSelect
                                attributeType = "interests"
                                selectedAttributesList= { selectedInterestsList }
                                changeAttribute = { (interests, currentCategory) => { changeInterestsHandler(interests, currentCategory) } }
                            />
                            {selectedInterestsListErrorVisible &&
                                <Text style={[boxes.unPaddedRow, texts.errorLine]}>
                                    Bitte mindestens ein Interesse angeben.
                                </Text>
                            }
                        </View>
                    </View>
                    <Padding height= { 18.5 } />
                    <ButtonLarge 
                        title= "Abmelden" 
                        onPress= { logOut }
                        icon= "exit"
                    />
                </View>
            </View>
        </View>
    )
}