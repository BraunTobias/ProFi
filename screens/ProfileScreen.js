import React, { useState, useContext, useEffect } from 'react';
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
import * as ImageManipulator from "expo-image-manipulator";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker"
import { LogInContext } from '../data/LogInContext';
import { FunctionsScreen } from './#FunctionsScreen';
import DB from '../api/DB_API';


export default ProfileScreen =  ({navigation})  => {
    // const [authentication, setAuthentication, user, setUser] = useContext(LogInContext);
    const [currentName, setCurrentName] = useState("");
    const [currentMail, setCurrentMail] = useState("");
    const [currentPW, setCurrentPW] = useState("");
    const [acknowledgementVisibility, setAcknowledgementVisibility] = useState(false);
    // const [currentFunctions, setCurrentFunctions] = useState(user.functions);
    // const [currentInterests, setCurrentInterests] = useState(user.interests);
    const [functionsVisibility, setFunctionsVisibility] = useState(false);
    const [interestsVisibility, setInterestsVisibility] = useState(false);


    // Wird nur beim Laden der Seite einmalig ausgeführt
    useEffect(() => {
        DB.getUserInfo((data) => {
            // setCurrentIdeas(ideasList);
            console.log(data);
            setCurrentName(data.username);
            setCurrentMail(data.email);
            setCurrentPW(data.password);
            setSelectedImage({localUri: data.image});
        });
    }, []);

        
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
    // const changeFunctionsHandler = (updatedFunctions) => {
    //     setCurrentFunctions(updatedFunctions);
    // }
    // const changeInterestsHandler = (updatedInterests) => {
    //     setCurrentInterests(updatedInterests);
    // }
    const commitChangesHandler = () => {
        DB.changeUsername(currentName);
        DB.changeEmail(currentMail, (error, oldMail) => {
            console.log(error + ", alte Adresse wird beibehalten: " + oldMail)
            setCurrentMail(oldMail);
        });
        DB.changePassword(currentPW, (error, oldPW) => {
            console.log(error + ", altes Passwort wird beibehalten: " + oldPW)
            setCurrentPW(oldPW);
        });
        DB.logIn(currentMail, currentPW, () => {});
    }
    // Profilbild
    // const [imagePickerVisibility, setImagePickerVisibility] = useState(false);
    const [selectedImage, setSelectedImage] = useState({});
    // const [isCameraOn, setIsCameraOn] = useState(false);
    // const [type, setType] = useState(Camera.Constants.Type.back);
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
        const smallImage = await ImageManipulator.manipulateAsync(
            pickerResult.uri,
            [{ resize: { height: 400 } }],
            { compress: 0.2 }
        );
        DB.changeProfileImage(smallImage.uri);
    };
    // const toggleCameraHandler = async () => {
    //     const hasPermission = await verifyPermissions(Permissions.CAMERA);
    //     if (!hasPermission) return;
    
    //     setIsCameraOn(!isCameraOn);
    // };
    // const flipCameraHandler = () => {
    //     if (isCameraOn) {
    //         setType(
    //             type === Camera.Constants.Type.back
    //                 ? Camera.Constants.Type.front
    //                 : Camera.Constants.Type.back
    //         );
    //     }
    // };

    const authHandler = (auth) => {
        if (auth) {
            
        } else {
            return ( <AuthenticationNavigator /> )
        }
    }

    return ( 
        <View>
            {/* // "Header" mit Profildaten */}
            <View style={{padding: 20, flexDirection: "row", justifyContent: 'flexStart', alignItems: 'center', backgroundColor: "#aeb8c3"}}>
                    <Modal visible={false} animationType='slide'>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
                            <Text>Gespeichert.</Text>
                            <Button title='OK'onPress={() => setAcknowledgementVisibility(false)}/>
                        </View>
                    </Modal>
                    
                    {/* <Modal visible={imagePickerVisibility} animationType='slide'>
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
                    </Modal> */}
                        
                    {/* <Modal visible={functionsVisibility} animationType='slide'>
                        < FunctionsScreen user={user} />
                    </Modal> */}
                <View style={{flex:1, flexDirection: "column", justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity onPress={selectImageHandler}>
                        <Image 
                            style={[styles.imageTile, styles.cameraPreview]} 
                            source={{ uri: selectedImage.localUri}} 
                        />
                    </TouchableOpacity>
                    <Button 
                            title= " Logout"
                            onPress={() => {
                                DB.signOut(() => {console.log("Signed Out")});
                                    }}
                            icon={
                                <Ionicons
                                    name="md-log-out"
                                    size={30}
                                    color="white"
                                />
                            }
                    />
                    {/* <Button
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
                        */}
                </View>
                {/* // Rechte Spalte */}
                <View style={{flex:2, flexDirection: "column", justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                        <View style={{width: "90%"}} >
                            <Text>Benutzername:</Text>
                            <TextInput 
                                style={styles.textInputField}
                                onChangeText={changeNameHandler}
                                value={currentName}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                    
                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                        <View style={{width: "90%"}}>
                            <Text>E-Mail:</Text>
                            <TextInput
                                style={styles.textInputField}
                                onChangeText={changeMailHandler}
                                value={currentMail}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                    
                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                        <View style={{width: "90%"}}>
                            <Text>Passwort:</Text>
                            <TextInput
                                style={styles.textInputField}
                                onChangeText={changePWHandler}
                                value={currentPW}
                                secureTextEntry={true} 
                            />
                        </View>
                    </TouchableWithoutFeedback>
                    <Button                     
                        title= " Übernehmen"
                        onPress={commitChangesHandler}
                        icon={
                            <Ionicons
                                name="md-checkmark"
                                size={30}
                                color="white"
                            />
                        }
                    />
                </View>
            </View>
            <View>
                <ListTile
                        title={"Meine Fähigkeiten"}
                        subtitle={"Skills"}
                        onClick={() => navigation.navigate('Fähigkeiten')} 
                />
                <ListTile
                        title={"Meine Fähigkeiten"}
                        subtitle={"Prefs"}
                        onClick={() => navigation.navigate('Fähigkeiten')} 
                />
            </View>
        </View>
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
        borderRadius: 100,
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
      },
    textInputField: {
        left: 0,
        width: "100%",
        backgroundColor: "white",
        marginBottom: 10
    }
})