import React, { useState, useContext, useEffect } from 'react';
import { styles, texts, profileImage } from '../Styles'
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
    const [currentBio, setCurrentBio] = useState("");
    const [currentEmail, setCurrentEmail] = useState("");
    const [selectedImage, setSelectedImage] = useState({});


    // Wird nur beim Laden der Seite einmalig ausgeführt
    useEffect(() => {
        DB.getUserInfoById(props.userId, (name, imageUrl, bio, email) => {
            setCurrentName(name);
            setCurrentBio(bio);
            setCurrentEmail(email);
            setSelectedImage({localUri: imageUrl});
        });
    }, []);

    return ( 
        <View>
            {/* // "Header" mit Profildaten */}
            <View style={{padding: 20, flexDirection: "row", justifyContent: 'flex-start', alignItems: 'center', backgroundColor: "#aeb8c3"}}>
                
                {/* Linke Spalte: Profilbild */}
                <View style={styles.contentProfile}>
                    <Image 
                        style={[profileImage.imageTile, profileImage.cameraPreview]} 
                        source={{ uri: selectedImage.localUri}} 
                    />
                </View>

                {/* // Rechte Spalte */}
                <View style={{flex:2, flexDirection: "column", justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{width: "90%"}} >
                        {/* <Text style= { texts.inputTextProfile }>Benutzername:</Text> */}
                        <Text style= { texts.inputTextProfile }>{currentName}</Text>
                    </View>
                    <View style={{width: "90%"}} >
                        <Text style={texts.textProfile}>Kurzbeschreibung:</Text>
                        <Text style={texts.textBold}>{currentBio}</Text>
                    </View>

                    
                    <View style={{width: "90%"}}>
                        <Text style={texts.textProfile}>E-Mail:</Text>
                        <Text style={texts.textBold}>{currentEmail}</Text>
                    </View>
                    
                </View>
            </View>
            <View>
                <ListTile
                    title={"Fähigkeiten von " + currentName}
                    subtitle={"Skills"}
                    onClick={() => {}} 
                />
            </View>
        </View>
     );
}

const stylesFile = StyleSheet.create({
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