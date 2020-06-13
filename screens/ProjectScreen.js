import React, {useState, useLayoutEffect, useEffect} from 'react';
import {FlatList , View, Text, Button, Modal, TouchableWithoutFeedback, TextInput, Keyboard} from 'react-native';
import ListTile from '../components/ListTile';
import CommentTile from '../components/CommentTile';
import ProfileView from '../components/ProfileView';
import DB from '../api/DB_API';
import { set } from 'react-native-reanimated';

export default ProjectScreen = ({route, navigation}) => {
    const {itemId} = route.params;
    const {courseId} = route.params;
    const {itemTitle} = route.params;
    const {itemSubtitle} = route.params;

    // States für Profil-Ansicht
    const [viewedUserId, setViewedUserId] = useState(false);
    const [profileVisibility, setProfileVisibility] = useState(false);

    // States für Kommentar-Eingabe
    const [commentVisibility, setCommentVisibility] = useState(false);
    const [currentCommentText, setCurrentCommentText] = useState("");
    
    // States für Ideen-Info
    const [currentSkills, setCurrentSkills] = useState([]);
    const [currentPrefs, setCurrentPrefs] = useState([]);
    
    const [currentComments, setCurrentComments] = useState([]);

    useEffect(() => {
        DB.getCommentsList(courseId, itemId, (commentsList) => {
            setCurrentComments(commentsList);
        });
        DB.getIdeaData(courseId, itemId, (data) => {
                console.log(data);
                setCurrentSkills(data.skills);
                // setCurrentPrefs(data.prefs);
            });
    }, []);
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: itemTitle
        });
    }, [navigation]);

    const addCommentHandler = (isAdd) => {
        if (isAdd) {
            if (currentCommentText.length > 5) {
                console.log("add");
                DB.addComment(courseId, itemId, currentCommentText, () => {
                    setCommentVisibility(false);
                    setCurrentCommentText("");
                    DB.getCommentsList(courseId, itemId, (commentsList) => {
                        setCurrentComments(commentsList);
                        console.log(commentsList);
                    });
                });
            }
        } else {
            setCommentVisibility(false);
        }
    }

    const setCommentHandler = (text) => {
        setCurrentCommentText(text);
    }

    const commentClickHandler = (userId) => {
        setProfileVisibility(true);
        setViewedUserId(userId);
    }

    return(
        <View style={{flexDirection: "column", height: "100%"}}>
            {/* // Kommentar schreiben */}
            <Modal visible={commentVisibility} animationType='slide'>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={{flex:1, padding: 100}}>
                        {/* <InputTile id="test" placeholderText="Kursname"/>
                        <InputTile placeholderText="minimale Mitglieder" keyboardType="numeric"/>
                        <InputTile placeholderText="maximale Mitglieder" keyboardType="numeric"/> */}
                        <TextInput 
                            placeholder={"Kommentar"} 
                            onChangeText={setCommentHandler}
                            value={currentCommentText}
                        />
                        <Button title='OK' onPress={() => {addCommentHandler(true)}}/>
                        <Button title='Abbrechen'onPress={() => {addCommentHandler(false)}}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            </Modal>

            {/* // User-Profil ansehen */}
            <Modal visible={profileVisibility} animationType='slide'>
                    <View style={{height: "85%"}}>
                        <View style={{backgroundColor: "#222f56", height: 110, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: 30, top: 20, fontWeight: "bold", color: "white"}}>Profil ansehen</Text>
                        </View>
                        <ProfileView userId={viewedUserId}></ProfileView>
                    </View>
                    <Button title='OK' onPress={() => {setProfileVisibility(false)}}/>
            </Modal>

            <View>
                <Text>{itemSubtitle}</Text>
                <ListTile
                    title={"Benötigte Fähigkeiten"}
                    subtitle={currentSkills.join(", ")}
                    onClick={() => {}} 
                />
                <ListTile
                    title={"Benötigte Präferenzen"}
                    subtitle={currentSkills.join(", ")}
                    onClick={() => {}} 
                />
                <View style={{flexDirection: "row"}}>
                    <Text style={{flex: 1, paddingStart: 15}}>Kommentare:</Text>
                    <Button title='Kommentar schreiben' onPress={() => {setCommentVisibility(true)}}/>
                </View>
            </View>
            <FlatList
            data={currentComments}
            renderItem={(itemData) => { 
                return (
                    <CommentTile
                        id={itemData.item.id}
                        userId={itemData.item.user}
                        subtitle={itemData.item.text}
                        timestamp={itemData.item.time}
                        onClick={commentClickHandler}
                    />
                );
            }}
            />
        </View>
  );

}