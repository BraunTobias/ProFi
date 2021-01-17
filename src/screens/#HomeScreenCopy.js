import React, { useState } from 'react';
import { View, Text, Modal, BackHandler, ScrollView } from 'react-native';
import DB from '../api/DB_API';
import ButtonLarge from '../components/ButtonLarge';
import InputField from '../components/InputField';
import { boxes, texts, buttons } from '../Styles';


//export default function LoginScreen ({navigation}) {
export default function LoginScreen ({navigation}) {
    const [currentMail, setCurrentMail] = useState("");
    const [currentPW, setCurrentPW] = useState("");
    const [errorVisibility, setErrorVisibility] = useState(false);

    // Benutzereingaben
    const changeMailHandler = (enteredText) => {
        //console.log(currentMail)
        setCurrentMail(enteredText);
    };
    const changePWHandler = (enteredText) => {
        //console.log(currentPW)
        setCurrentPW(enteredText);
    };
    
    // Authentifizierung
    const checkAuth = () => {
        //console.log(currentMail + " " + currentPW)
        DB.logIn(currentMail, currentPW, (error) => { setErrorVisibility(true) });
    }

    return(
        <View>
            <View style= { boxes.mainContainer }>
                <ButtonLarge 
                    title= "Profile"
                    onPress= { () => navigation.navigate("Profile") }
                />
                <ButtonLarge 
                    title= "Course"
                    onPress= { () => navigation.navigate("Course") }
                />
                <ButtonLarge 
                    title= "Idea"
                    onPress= { () => navigation.navigate("Idea") }
                />
                <ButtonLarge 
                    title= "IdeaAttributes"
                    onPress= { () => navigation.navigate("IdeaAttributes") }
                />
                <ButtonLarge 
                    title= "Logout"
                    onPress= { () => DB.signOut( () => { console.log("Logout") } ) }
                />
            </View>
        </View>
    );
}