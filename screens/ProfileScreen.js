import React, { useState, useEffect } from 'react';
import { 
    View, 
    Modal, 
    TouchableOpacity, 
    TouchableWithoutFeedback, 
    Text, 
    TextInput, 
    Keyboard, 
    Alert, 
    Image } from 'react-native';
import Button from '../components/Button';
import * as ImageManipulator from "expo-image-manipulator";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker"
import DB from '../api/DB_API';
import { styles, buttons, texts, profileImage, icons } from '../Styles'

export default ProfileScreen =  ({navigation})  => {
    const [currentName, setCurrentName] = useState("");
    const [currentBio, setCurrentBio] = useState("");
    const [currentMail, setCurrentMail] = useState("");
    const [changesSaved, setChangesSaved] = useState(true);
    const [skillString, setSkillString] = useState("");
    const [currentImage, setCurrentImage] = useState(icons.profilePlaceholder);
 
    // Wird nur beim Laden der Seite einmalig ausgeführt
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData();
        });    
    }, []);

    const loadData = () => {
        DB.getUserInfo((data) => {
            // console.log(data);
            setCurrentName(data.username);
            setCurrentBio(data.bio);
            setCurrentMail(data.email);
            if (data.image) setCurrentImage({uri: data.image});
        });
        DB.userAttributesToString((skills, prefs) => {
            setSkillString(skills);
        });
    }
        
    // Benutzereingaben
    const changeNameHandler = (enteredText) => {
        setChangesSaved(false);
        setCurrentName(enteredText);
    };
    const changeBioHandler = (enteredText) => {
        setChangesSaved(false);
        setCurrentBio(enteredText);
    };
    const commitChangesHandler = () => {
        DB.changeUsername(currentName, currentBio);
        setChangesSaved(true);
    }

    // Profilbild
    const verifyPermissions = async (permission) => {
        const result = await Permissions.askAsync(permission);
        if (result.status !== "granted") {
            Alert.alert(
            "Berechtigung verweigert!",
            "Dieses Feature benötigt weitere Berechtigungen.",
            [{ text: "Ok" }]
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
        // console.log("------ URI: " + smallImage.uri);
        DB.changeProfileImage(smallImage.uri);
    };

    return ( 
        <View>
            {/* Header mit Profildaten */}
            <View style={styles.subHeaderProfile}>
                <Modal visible={false} animationType='slide'>
                    <View style={styles.error}>
                        <Text style= { texts.headlineCenter }>Gespeichert.</Text>
                        <Button 
                            buttonStyle= { buttons.buttonColumn }
                            titleStyle= { texts.buttonBlueCenter }
                            title= 'OK' 
                            onClick= {() => setAcknowledgementVisibility(false)}
                        />
                    </View>
                </Modal>
                
                {/* Linke Spalte: Profilbild */}
                <View style={styles.contentProfile}>
                    <TouchableOpacity onPress={selectImageHandler}>
                        <Image 
                            style={[profileImage.imageTile, profileImage.cameraPreview]} 
                            source={currentImage} 
                        />
                    </TouchableOpacity>
                </View>

                {/* // Rechte Spalte */}
                <View style={styles.rightContentProfile}>
                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                        <View style={[styles.inputField, {width: "95%"}]} >
                            <TextInput 
                                style={texts.inputTextProfile}
                                onChangeText={changeNameHandler}
                                value={currentName}
                            />
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                        <View style={{width: "95%", }} >
                            <Text style={texts.textProfile}>Kurzbeschreibung:</Text>
                            <View style={styles.inputField} >
                                <TextInput 
                                    style={texts.textBold}
                                    onChangeText={changeBioHandler}
                                    value={currentBio}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                        <View style={{width: "95%"}}>
                            <Text style={texts.textProfile}>E-Mail:</Text>
                            <Text style={texts.textBold}>{currentMail}</Text>
                        </View>
                    </TouchableWithoutFeedback> 
                </View>
            </View>
            {/* Buttons */}
            <View style= {styles.subHeader} >
                <View style={styles.paddedRow}>
                    <Button 
                        buttonStyle= { buttons.buttonRowGrey }
                        titleStyle= { texts.buttonGrey }
                        title= {changesSaved ? "Aktuell" : "Speichern" }
                        icon= {changesSaved ? "checkTrue" : "checkFalse"}
                        onClick= {changesSaved ? () => {} : commitChangesHandler}
                    />
                     <Button 
                        buttonStyle= { buttons.buttonRow }
                        titleStyle= { texts.buttonBlue }
                        title= "Abmelden"
                        onClick={() => {DB.signOut(() => {console.log("Signed Out")});}}
                        icon= {"exit"}
                    />
                </View>
            </View>  
            {/* Meine Fähigkeiten */}
            <View>
                <ListTile
                    title={"Meine Fähigkeiten"}
                    subtitle={skillString}
                    onClick={() => navigation.navigate('Fähigkeiten', {attributeType: "skills", filter: []})}
                />
            </View>
        </View>
    );
}