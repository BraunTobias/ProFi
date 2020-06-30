import React, {useState, useLayoutEffect, useEffect} from 'react';
import {FlatList , View, Text, Modal, TouchableWithoutFeedback, TextInput, Keyboard} from 'react-native';
import Button from '../components/Button';
import ListTile from '../components/ListTile';
import CommentTile from '../components/CommentTile';
import ProfileView from '../components/ProfileView';
import DB from '../api/DB_API';
import { set } from 'react-native-reanimated';
import { styles, texts, buttons, white } from '../Styles';

export default IdeaScreen = ({route, navigation}) => {
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
        <View>
            {/* // Kommentar schreiben */}
            <Modal visible={commentVisibility} animationType='slide'>
                <View style= { styles.modal } >
                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                        <View>
                            <View style= { styles.headerFake } >
                                <Text style= { texts.headerText } >Kommentar hinzufügen</Text>
                            </View>
                            <View style= { styles.contentFake } >
                                <View style= { styles.loginInput } >
                                    <Text style= { texts.headline } >Kommentar (max. 200 Zeichen)</Text>
                                    <View style= { styles.commentField } >
                                        <TextInput 
                                            textAlign= { 'left' }
                                            textAlignVertical= { 'top' }
                                            style= { texts.inputText }
                                            placeholder= { "Schreibe einen Kommentar" } 
                                            onChangeText= { setCommentHandler }
                                            value= { currentCommentText }
                                            multiline
                                            numberOfLines= { 10 }
                                            maxLength= { 200 }
                                        />
                                    </View>
                                </View>
                                <View style= { styles.row } >
                                    <Button 
                                        buttonStyle= { buttons.buttonRow }
                                        titleStyle= { texts.buttonBlueCenter }
                                        title= 'OK' 
                                        onClick= { () => { addCommentHandler(true) } }
                                    />
                                    <Button 
                                        buttonStyle= { buttons.buttonRow }
                                        titleStyle= { texts.buttonBlueCenter }
                                        title= 'Abbrechen'
                                        onClick= { () => { addCommentHandler(false) } }
                                    />
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Modal>

            {/* // User-Profil ansehen */}
            <Modal visible={profileVisibility} animationType='slide'>
                    <View>
                        <View style={{backgroundColor: "#222f56", height: 110, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: 30, top: 20, fontWeight: "bold", color: "white"}}>Profil ansehen</Text>
                        </View>
                        <ProfileView userId={viewedUserId}></ProfileView>
                    </View>
                    <View style={{alignItems: "center"}}>
                        <Button 
                            buttonStyle= { buttons.buttonRow }
                            titleStyle= { texts.buttonBlueCenter }
                            title='OK' 
                            onClick={() => {setProfileVisibility(false)}}
                        />
                    </View>
            </Modal>

            <View>
                <View style= { styles.subHeaderIdea}>
                    <View style= { { height: 100 } } >
                        <Text>{itemSubtitle}</Text>
                    </View>
                    <ListTile
                        title={"Passende Fähigkeiten"}
                        subtitle={currentSkills.join(", ")}
                        onClick={() => navigation.navigate('IdeaSkills', {attributeType: "skills", filter: currentSkills})} 
                    />
                </View>

                <View style={ styles.commentRow }>
                    <Text style={texts.headline}>Kommentare:</Text>
                    <Button 
                        buttonStyle= { buttons.buttonRow }
                        titleStyle= { texts.buttonBlue }
                        title= 'Kommentar'
                        icon= "plus"
                        onClick= { () => { setCommentVisibility(true) } }
                    />
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
                        backgroundColor = {itemData.index % 2 === 0 ? "#ffffff" : "#f5f7f7"}
                    />
                );
            }}
            />
        </View>
  );

}