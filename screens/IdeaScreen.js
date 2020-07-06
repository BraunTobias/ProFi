import React, {useState, useLayoutEffect, useEffect} from 'react';
import {FlatList , View, Text, Modal, TextInput} from 'react-native';
import Button from '../components/Button';
import ListTile from '../components/ListTile';
import CommentTile from '../components/CommentTile';
import ProfileView from '../components/ProfileView';
import DB from '../api/DB_API';
import { styles, texts, buttons, lightGrey } from '../Styles';

export default IdeaScreen = ({route, navigation}) => {
    const {itemId} = route.params;
    const {courseId} = route.params;
    const {itemTitle} = route.params;
    const {itemSubtitle} = route.params;

    // States für Profil-Ansicht
    const [team, setTeam] = useState([]);
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
            // console.log(data);
            setCurrentSkills(data.skills);

            if (data.team && data.team.length > 0) {
                const teamUidList = data.team;
                var newTeamList = [];
                for (const member in teamUidList) {
                    const uid = teamUidList[member];
                    DB.getUserInfoById(uid, (name, url) => {
                        newTeamList.push({
                            "userId": uid,
                            "username": name,
                            "imageUrl": url
                        });
                        setTeam(newTeamList);
                    });
                }
            }

        });
    }, []);
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: itemTitle
        });
    }, [navigation]);

    const addCommentHandler = () => {
        // console.log("add");
        if (currentCommentText != "") {
            DB.addComment(courseId, itemId, currentCommentText, () => {
                setCommentVisibility(false);
                setCurrentCommentText("");
                DB.getCommentsList(courseId, itemId, (commentsList) => {
                    setCurrentComments(commentsList);
                    // console.log(commentsList);
                });
            });
        }
    }

    const setCommentHandler = (text) => {
        setCurrentCommentText(text);
    }

    const clickProfileHandler = (userId) => {
        setProfileVisibility(true);
        setViewedUserId(userId);
    }

    return(
        <View style={{flex: 1}}>

            {/* // Kommentar schreiben */}
            <Modal visible={commentVisibility} animationType='slide'>
            <ModalComponent
                    title= 'Kommentar hinzufügen'
                    subheader= { () => {} }
                    content= { () => {
                        return(
                            <View styles= {{backgroundColor: lightGrey }}>
                                <View style= { styles.contentFake } >
                                    <Text></Text>{/* Text-Absatz */}
                                    <Text style= { texts.headline } >Kommentar (max. 200 Zeichen)</Text>
                                </View>
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
                                <View style= { styles.paddedRow } >
                                    <Button 
                                        buttonStyle= { buttons.buttonRow }
                                        titleStyle= { texts.buttonBlueCenter }
                                        title= 'OK' 
                                        onClick= { () => { addCommentHandler() } }
                                    />
                                    <Button 
                                        buttonStyle= { buttons.buttonRow }
                                        titleStyle= { texts.buttonBlueCenter }
                                        title= 'Abbrechen'
                                        onClick= { () => { setCommentVisibility(false) } }
                                    />
                                </View>
                            </View>
                        )
                    }}
                />
            </Modal>

            {/* // User-Profil ansehen */}
            <Modal visible={profileVisibility} animationType='slide'>
                <View style={{flex: 1}}>
                    <View style= { styles.headerFake }>
                        <Text style= { texts.header }>Profil</Text>
                    </View>

                    <View style={{flex: 1}}>
                        <View style={{height: "85%"}}>
                            <ProfileView userId={viewedUserId}/>
                        </View>
                        <View style={{height: "15%", justifyContent:"center", alignItems: "center", backgroundColor: lightGrey}}>
                            <Button 
                                buttonStyle= { buttons.buttonRow }
                                titleStyle= { texts.buttonBlueCenter }
                                title='OK' 
                                onClick={() => {setProfileVisibility(false)}}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* // Idee & Kommentar-Liste */}
            <View style= { styles.subHeader}>
                <View style= {[styles.headerRow, {paddingBottom: 10}]}>
                    <Text style={texts.text}>{itemSubtitle}</Text>
                </View>
                {/* Membericons */}
                <View style= { styles.membersRow } >
                    <FlatList style={{paddingLeft: 5, paddingBottom: 15}}
                        data={team}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(itemData) => { 
                            return (
                                <ProfileImageTile
                                    onClick={() => {clickProfileHandler(itemData.item.userId)}} 
                                    imageUrl={itemData.item.imageUrl}
                                    isLast={itemData.index == team.length - 1 ? true : false}
                                />
                            );
                        }}
                    >
                    </FlatList>
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
            <FlatList
            data={currentComments}
            renderItem={(itemData) => { 
                return (
                    <CommentTile
                        id={itemData.item.id}
                        userId={itemData.item.user}
                        subtitle={itemData.item.text}
                        timestamp={itemData.item.time}
                        onClick={clickProfileHandler}
                        backgroundColor = {itemData.index % 2 === 0 ? "#ffffff" : "#f5f7f7"}
                    />
                );
            }}
            />
        </View>
  );

}