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
import DB from '../api/DB_API';


export default ProfileView = props => {
    // const [authentication, setAuthentication, user, setUser] = useContext(LogInContext);
    const [currentName, setCurrentName] = useState("");
    const [currentMail, setCurrentMail] = useState("");
    const [currentPW, setCurrentPW] = useState("");
    const [acknowledgementVisibility, setAcknowledgementVisibility] = useState(false);
    // const [currentFunctions, setCurrentFunctions] = useState(user.functions);
    // const [currentInterests, setCurrentInterests] = useState(user.interests);
    const [functionsVisibility, setFunctionsVisibility] = useState(false);
    const [interestsVisibility, setInterestsVisibility] = useState(false);
    const [selectedImage, setSelectedImage] = useState({});


    // Wird nur beim Laden der Seite einmalig ausgeführt
    useEffect(() => {
        DB.getUserInfoById(props.userId, (name, imageUrl) => {
            setCurrentName(name);
            setSelectedImage({localUri: imageUrl});
        });
    }, []);

    return ( 
        <View>
            {/* // "Header" mit Profildaten */}
            <View style={{padding: 20, flexDirection: "row", justifyContent: 'flex-start', alignItems: 'center', backgroundColor: "#aeb8c3"}}>
                    
                <View style={{flex:1, flexDirection: "column", justifyContent: 'center', alignItems: 'center'}}>
                    <Image 
                        style={[styles.imageTile, styles.cameraPreview]} 
                        source={{ uri: selectedImage.localUri}} 
                    />
                </View>
                {/* // Rechte Spalte */}
                <View style={{flex:2, flexDirection: "column", justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{width: "90%"}} >
                            <Text>Benutzername:</Text>
                            <Text>{currentName}</Text>
                        </View>
                            
                </View>
                
            </View>
            <View>
                    <ListTile
                            title={"Fähigkeiten von " + currentName}
                            subtitle={"Skills"}
                            onClick={() => {}} 
                    />
                    <ListTile
                            title={"Präferenzen von " + currentName}
                            subtitle={"Prefs"}
                            onClick={() => {}} 
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