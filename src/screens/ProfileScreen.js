import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, Text, Modal, ScrollView, useWindowDimensions, Image, StyleSheet } from 'react-native';

import { icons, colors, boxes, texts } from '../Styles';
import DB from '../api/DB_API';
import ButtonLarge from '../components/ButtonLarge';
import InputField from '../components/InputField';
import AttributePreviewTile from '../components/AttributePreviewTile';
import AttributeSelect from '../components/AttributeSelect';
import InfoModal from '../components/InfoModal';
import ButtonIcon from '../components/ButtonIcon';
import Padding from '../components/Padding';

export default function ProfileScreen ({ route, navigation }) {

    const {currentUserId} = route.params;

    // State Hooks
    const [currentName, setCurrentName] = useState("");
    const [currentEditName, setCurrentEditName] = useState("");
    const [currentBio, setCurrentBio] = useState("");
    const [currentEditBio, setCurrentEditBio] = useState("");
    const [currentMail, setCurrentMail] = useState("");
    const [currentEditMail, setCurrentEditMail] = useState("");
    const [currentEnterPassword, setCurrentEnterPassword] = useState("");
    const [currentEditPassword, setCurrentEditPassword] = useState("•••••••••");
    const [currentConfirmPassword, setCurrentConfirmPassword] = useState("");
    const [currentImage, setCurrentImage] = useState("");
    const [imageLoading, setImageLoading] = useState(true);
    
    const [selectedSkillsList, setSelectedSkillsList] = useState([]);
    const [skillsListText, setSkillsListText] = useState("");
    const [selectedInterestsList, setSelectedInterestsList] = useState([]);
    const [interestsListText, setInterestsListText] = useState("");

    // State Hooks für Modals
    const [editEmailVisible, setEditEmailVisible] = useState(false);
    const [editPasswordVisible, setEditPasswordVisible] = useState(false);
    const [mailErrorVisible, setMailErrorVisible] = useState(false);
    const [pwErrorVisible, setPwErrorVisible] = useState(false);
    const [newPwErrorVisible, setNewPwErrorVisible] = useState(false);
    const [currentPwErrorVisible, setCurrentPwErrorVisible] = useState(false);
    const [editPwErrorVisible, setEditPwErrorVisible] = useState(false);
    const [nameErrorVisible, setNameErrorVisible] = useState(false);

    const [editErrorVisible, setEditErrorVisible] = useState(false);
    const [selectedSkillsListErrorVisible, setSelectedSkillsListErrorVisible] = useState(false);
    const [selectedInterestsListErrorVisible, setSelectedInterestsListErrorVisible] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View style= { [boxes.unPaddedRow, { alignItems: "center", } ] }>
                    <ButtonIcon
                        icon= { "logo" }
                        status= { "color" }
                        onPress= { () => navigation.navigate("Home") }
                    />
                    <Padding width= { 15 } />
                    <ButtonIcon
                        icon= { "back" }
                        status= { "active" }
                        onPress= { () => navigation.goBack() }
                    />
                </View>
            ),
            headerRight: () => (
                <View/>
            )
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
                    var errorText = "";
                    switch (error.code) {
                        case "auth/invalid-email": errorText = "Bitte eine gültige E-Mail-Adresse eingeben."; setPwErrorVisible(errorText); break;
                        case "auth/email-already-in-use": errorText = "Diese E-Mail-Adresse ist schon vergeben."; setPwErrorVisible(errorText); break;
                        case "auth/wrong-password": errorText = "Falsches Passwort eingegeben."; setPwErrorVisible(errorText); setCurrentEnterPassword(""); break;
                        default: errorText = error.code;
                    }
                    console.log(errorText)
                });
            } else {
                var errorText = "";
                if (currentEditMail === "") errorText = "Gebe eine E-Mail-Adresse ein."; setPwErrorVisible(errorText);
                if (currentEnterPassword === "") errorText = "Gebe dein Passwort ein."; setPwErrorVisible(errorText);
                console.log(errorText);
            }
        } else {
            setCurrentEditMail(currentMail);
            setCurrentEnterPassword("");
            setMailErrorVisible(false);
            setPwErrorVisible(false);
            setEditEmailVisible(false);
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
        if (enteredText === currentEditPassword) setCurrentPwErrorVisible(false);
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
                        case "auth/wrong-password": 
                            errorText = "Falsches Passwort eingegeben."; 
                            setPwErrorVisible(errorText); 
                            setCurrentEnterPassword(""); 
                            break;
                        default: errorText = error.code;
                    }
                    console.log(errorText);
                });            
            } else {
                var errorText = "";
                if (currentEnterPassword === "") errorText= "Bitte ein Passwort eingeben."; setPwErrorVisible(errorText);
                if (currentEditPassword.length < 6) { 
                    errorText= "Das neues Passwort ist zu kurz."; 
                    setNewPwErrorVisible(errorText)
                }
                else if (currentEditPassword !== currentConfirmPassword) errorText= "Das eingegebene Passwort stimmt nicht mit dem neuen überein."; setNewPwErrorVisible(errorText);
                console.log(errorText);
            }
        } else {
            setEditPasswordVisible(false);
            setCurrentEnterPassword("");
            setCurrentEditPassword("•••••••••");
            setCurrentConfirmPassword("");
            setPwErrorVisible(false);
            setNewPwErrorVisible(false);
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

    const Styles = StyleSheet.create({
        image: {
            width: 60,
            height: 60,
            borderRadius: 111,
            aspectRatio: 1,
            marginRight: 7,
        },
        emailConfirm: {
            paddingBottom: 12.5,
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
        },
        psConfirm: {
            paddingBottom: 12.5,
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
        }
    })

    return(
        <View style= { { height: useWindowDimensions().height-80, width: useWindowDimensions().width } } >

            {/* Error-Modals */}
            <InfoModal visible= { editErrorVisible }
                onPress= { () => { setEditErrorVisible(false); } }
                title="Fehler"
                copy="Ungültige Eingabe"
            />

            {/* Subheader */}
            <View style= { boxes.subHeader } >
                <View style={boxes.centeredRow}>
                    <View style={{height: 65, marginVertical: 10}}>
                        <Image 
                            style= { Styles.image }
                            source= { currentImage ? { uri: currentImage } : icons.profilePlaceholder }    
                        />
                    </View>
                    <ButtonLarge 
                        title= "Abmelden" 
                        onPress= { logOut }
                        icon= "exit"
                    />
                    <Padding height= {15} />
                </View>
            </View>

            <ScrollView contentContainerStyle= { boxes.mainContainer } >
                
                {/* E-Mail ändern */}
                <Modal 
                    transparent= { true }
                    visible= { editEmailVisible } 
                    animationType= 'slide' 
                    style= { { 
                        width: window.width,
                        height: window.height
                } } >
                    <View style= { Styles.emailConfirm } >
                        <View style= { { 
                            height: 50, 
                            backgroundColor: colors.darkBlue, 
                        } } />
                        <View style= { { padding: 15 } } >
                            <Text>Änderung der E-Mail bitte mit Passwort bestätigen.</Text>
                            <InputField
                                placeholderText= "Passwort zur Bestätigung"
                                value={currentEnterPassword}
                                onChangeText={changeEnterPasswordHandler}
                                secureTextEntry={true}
                            />
                            {pwErrorVisible &&
                                <Text style={[boxes.unPaddedRow, texts.errorLine]}>{ pwErrorVisible }</Text>
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
                                onPress={ () => { pressEditEmailHandler(false) } } />
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
                    <View style= { Styles.psConfirm } >
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
                            {newPwErrorVisible &&
                                <Text style= { [boxes.unPaddedRow, texts.errorLine] } >{ newPwErrorVisible }</Text>
                            }
                            <Text>Änderung des Passworts mit altem Passwort bestätigen.</Text>
                            <InputField
                                placeholderText= "Altes Passwort"
                                value= { currentEnterPassword } 
                                onChangeText= { changeEnterPasswordHandler }
                                secureTextEntry= { true }
                            />
                            {pwErrorVisible &&
                                <Text style= { [boxes.unPaddedRow, texts.errorLine] } >{ pwErrorVisible }</Text>
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

                <ScrollView 
                    contentContainerStyle= { [ { alignItems: 'center', width: useWindowDimensions().width } ] }
                >
                    <View style= { boxes.width }>
                        
                        {/* Input Felder */}
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
                        <Text style= { texts.copy, boxes.paddedRow } >Push-Mitteilungen für dein Handy kannst Du in der App aktivieren.</Text>
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
                                <View style= { { width: '200%', height: window.height -80 -60 -85 } } >
                                    <AttributeSelect
                                        attributeType = "skills"
                                        selectedAttributesList= { selectedSkillsList }
                                        changeAttribute = { (skills, currentCategory) => { changeSkillsHandler(skills, currentCategory) } }
                                    />
                                </View>
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
                                <View style= { { width: '200%', height: window.height -80 -60 -85 } } >
                                    <AttributeSelect
                                        attributeType = "interests"
                                        selectedAttributesList= { selectedInterestsList }
                                        changeAttribute = { (interests, currentCategory) => { changeInterestsHandler(interests, currentCategory) } }
                                    />
                                </View>
                                {selectedInterestsListErrorVisible &&
                                    <Text style={[boxes.unPaddedRow, texts.errorLine]}>
                                        Bitte mindestens ein Interesse angeben.
                                    </Text>
                                }
                            </View>
                        </View>
                    </View>
                </ScrollView>
                
            </ScrollView>
        </View>
    )
}