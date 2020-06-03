import React, { useState, useContext } from 'react';
import { 
    View, 
    Modal, 
    TouchableOpacity, 
    TouchableWithoutFeedback, 
    Text, 
    TextInput, 
    Keyboard, 
    Alert, 
    Image, 
    StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker"
import { LogInContext } from '../data/LogInContext';
import { FunctionsScreen } from '../screens/FunctionsScreen';

export default ProfileScreen =  ({navigation})  => {
    const [authentication, setAuthentication, user, setUser] = useContext(LogInContext);
    const [currentName, setCurrentName] = useState(user.username);
    const [currentMail, setCurrentMail] = useState(user.mail);
    const [currentPW, setCurrentPW] = useState(user.pw);
    const [acknowledgementVisibility, setAcknowledgementVisibility] = useState(false);
    const [currentFunctions, setCurrentFunctions] = useState(user.functions);
    const [currentInterests, setCurrentInterests] = useState(user.interests);
    const [functionsVisibility, setFunctionsVisibility] = useState(false);
    const [interestsVisibility, setInterestsVisibility] = useState(false);

    // Benutzereingaben
    const changeNameHandler = (enteredText) => {
        setCurrentName(enteredText);
    };
    const changeMailHandler = (enteredText) => {
        setCurrentMail(enteredText);
    };
    const changePWHandler = (enteredText) => {
        setCurrentPW(enteredText);
    };
    const changeFunctionsHandler = (updatedFunctions) => {
        setCurrentFunctions(updatedFunctions);
    }
    const changeInterestsHandler = (updatedInterests) => {
        setCurrentInterests(updatedInterests);
    }

    // Benutzerprofil aktualisieren
    const updateUserHandler = () => {
        setUser(user => ({
            id: user.id,
            username: currentName,
            mail: currentMail,
            image: selectedImage,
            functions: currentFunctions,
            interests: currentInterests
        }))
        setAcknowledgementVisibility(true);
        console.log("Updated User: " + currentName + " " + currentMail + " " + currentPW);
    };

    // Profilbild
    const [imagePickerVisibility, setImagePickerVisibility] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [selectedImage, setSelectedImage] = useState({ localUri: user.image });
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
        setSelectedImage({ localUri: pickerResult.uri });
    };
    const toggleCameraHandler = async () => {
        const hasPermission = await verifyPermissions(Permissions.CAMERA);
        if (!hasPermission) return;
    
        setIsCameraOn(!isCameraOn);
    };
    const flipCameraHandler = () => {
        if (isCameraOn) {
            setType(
                type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
            );
        }
    };


    const authHandler = (auth) => {
        if (auth) {
            return ( 
                <View style={{flex:1, justifyContent: 'flex-start', alignItems: 'center'}}>
                    <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                        <Modal visible={acknowledgementVisibility} animationType='slide'>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
                                <Text>Gespeichert.</Text>
                                <Button title='OK'onPress={() => setAcknowledgementVisibility(false)}/>
                            </View>
                        </Modal>
                        
                        <Modal visible={imagePickerVisibility} animationType='slide'>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
                                <Text>Foto aufnehmen</Text>
                                
                                <View style={styles.imageContainer}>
                                    <View style={styles.verticalContainer}>
                                        <Text>mit Kamera aufnehmen</Text>
                                        <TouchableWithoutFeedback 
                                            style={[styles.imageTile, styles.cameraPreview]}
                                            onPress={toggleCameraHandler} >
                                            {!isCameraOn ? (
                                                <Button
                                                type="clear"
                                                onPress={toggleCameraHandler}
                                                icon={
                                                    <Ionicons
                                                        name="ios-camera"
                                                        size={50}
                                                        color="rgb(0, 0, 0)"
                                                    />
                                                }
                                            />
                                            ) : (
                                            <TouchableOpacity onPress={flipCameraHandler}>
                                                <View style={{ borderRadius: 10, overflow: "hidden" }}>
                                                <Camera style={styles.cameraPreview} type={type} />
                                                </View>
                                            </TouchableOpacity>
                                            )}
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>

                                <Button title='OK'onPress={() => setImagePickerVisibility(false)}/>
                            </View>
                        </Modal>
                            
                        {/* <Modal visible={functionsVisibility} animationType='slide'>
                            < FunctionsScreen user={user} />
                        </Modal> */}

                        <TouchableWithoutFeedback>
                            <View>
                                <Text>Profilbild:</Text>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
                                    <Image
                                        source={{ uri: selectedImage.localUri}}
                                        style={[styles.imageTile, styles.cameraPreview]} />
                                    <Button
                                        type="clear"
                                        onPress={selectImageHandler}
                                        icon={
                                            <Ionicons
                                                name="ios-folder-open"
                                                size={50}
                                                color="rgb(0, 0, 0)"
                                            />
                                        }
                                    />
                                    <Button
                                        type="clear"
                                        onPress={() => setImagePickerVisibility(true)}
                                        icon={
                                            <Ionicons
                                                name="ios-camera"
                                                size={50}
                                                color="rgb(0, 0, 0)"
                                            />
                                        }
                                    />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        
                        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                            <View>
                                <Text>Benutzername:</Text>
                                <TextInput
                                    onChangeText={changeNameHandler}
                                    value={currentName}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                        
                        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                            <View>
                                <Text>E-Mail:</Text>
                                <TextInput
                                    onChangeText={changeMailHandler}
                                    value={currentMail}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                        
                        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                            <View>
                                <Text>Passwort:</Text>
                                <TextInput
                                    onChangeText={changePWHandler}
                                    value={currentPW}
                                    secureTextEntry={true} 
                                />
                            </View>
                        </TouchableWithoutFeedback>

                        <Button
                            title= " Übernehmen"
                            onPress={updateUserHandler}
                            icon={
                                <Ionicons
                                    name="md-checkmark"
                                    size={30}
                                    color="rgb(255, 255, 255)"
                                />
                            }
                        />
                        
                        <Button 
                            title= " Logout"
                            onPress={() => {
                                setUser(null)
                                console.log("setUser(null)")
                                setAuthentication(false)
                                console.log("setAuthentication(false)")
                            }}
                            icon={
                                <Ionicons
                                    name="md-log-out"
                                    size={30}
                                    color="rgb(255, 255, 255)"
                                />
                            }
                        />
                    </View>
                </View>
             )
        } else {
            return ( <AuthenticationNavigator /> )
        }
    }

    return(
        authHandler(authentication)
    );
}

const styles = StyleSheet.create({
    view: {
      position: 'absolute',
      backgroundColor: 'transparent'
    },
    touchable: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageContainer: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-evenly",
      },
    verticalContainer: {
        alignItems: "center",
    },
    cameraPreview: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    imageTile: {
        shadowColor: "black",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        borderRadius: 10,
        padding: 15,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 30,
      }
})