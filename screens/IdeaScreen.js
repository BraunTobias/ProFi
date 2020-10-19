import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, Text, Modal, Keyboard } from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { compareAsc, format } from 'date-fns';

import { icons, colors, boxes, texts } from '../Styles';
import DB from '../api/DB_API';
import InputField from '../components/InputField';
import SwipeButton from '../components/SwipeButton';
import CommentTile from '../components/CommentTile';
import ModalContent from "../components/ModalContent";
import ButtonLarge from '../components/ButtonLarge';
import ScrollRow from '../components/ScrollRow';
import AttributePreviewTile from '../components/AttributePreviewTile';
import ProfileView from '../components/ProfileView';

export default IdeaScreen = ({route, navigation}) => {

    const {itemId} = route.params;
    const {itemTitle} = route.params;
    const {itemDescription} = route.params;
    const {skillsList} = route.params;
    const {courseId} = route.params;
    const currentUserId = DB.getCurrentUserId();

    // State Hooks
    const [currentSkills, setCurrentSkills] = useState([]);
    const [currentComments, setCurrentComments] = useState([]);
    const [swipeListView, setSwipeListView] = useState();

    // State Hooks für Modal
    const [newCommentVisible, setNewCommentVisible] = useState(false);
    const [currentNewCommentText, setCurrentNewCommentText] = useState("");

    // State Hooks für Profilansicht
    const [viewedUserId, setViewedUserId] = useState(currentUserId);
    const [profileVisible, setProfileVisible] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: courseId,
        });
    }, [navigation]);

    useEffect(() => {
        DB.getCommentsList(courseId, itemId, (commentsList) => {
            setCurrentComments(commentsList);
        });
        DB.getIdeaData(courseId, itemId, (data) => {
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
                        // setTeam(newTeamList);
                    });
                }
            }

        });
    }, []);

    const likeCommentHandler = (commentId) => {
        DB.likeComment(courseId, itemId, commentId, () => {
            DB.getCommentsList(courseId, itemId, (commentsList) => {
                setCurrentComments(commentsList);
                swipeListView.safeCloseOpenRow();
            });
        });
    }
    const deleteCommentHandler = (commentId) => {
        DB.deleteComment(courseId, itemId, commentId);
        DB.getCommentsList(courseId, itemId, (commentsList) => {
            setCurrentComments(commentsList);
            swipeListView.safeCloseOpenRow();
        });
    }

    const viewProfileHandler = (id) => {
        setViewedUserId(id);
        setProfileVisible(true);
    }

    // Handler für Modal
    const changeNewCommentTextHandler = (enteredText) => {
        setCurrentNewCommentText(enteredText);
    }
    const pressNewCommentHandler = (committed) => {
        if (currentNewCommentText != "") {
            DB.addComment(courseId, itemId, currentNewCommentText, () => {
                setNewCommentVisible(false);
                setCurrentNewCommentText("");
                DB.getCommentsList(courseId, itemId, (commentsList) => {
                    setCurrentComments(commentsList);
                });
            });
        } 
    }

    return(
        <View style={{flex:1}}>

            {profileVisible &&
                <ProfileView
                    userId={viewedUserId}
                    visible={profileVisible}
                    onDismiss={() => {setProfileVisible(false)}}
                />
            }

            {/* Idee erstellen */}
            <Modal visible= { newCommentVisible } animationType= 'slide'>
                <ModalContent
                    subheader= { () => {}}
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={texts.titleCentered}>{"Kommentar schreiben"}</Text>
                                <InputField
                                    placeholderText= "max. 300 Zeichen"
                                    value={currentNewCommentText}
                                    onChangeText={changeNewCommentTextHandler}
                                    multiline={true}
                                />
                            </View> 
                        )
                    }}
                    onDismiss= {(committed) => {pressNewCommentHandler(committed)}}
                />
            </Modal>

            <View style={ boxes.subHeader }>
                <View style={ boxes.paddedRow }>
                    <Text style={texts.commentTileHeader}>{itemTitle}</Text>
                </View>
                <View style={ boxes.paddedRow }>
                    <Text style={texts.copy}>{itemDescription}</Text>
                </View>
                <View style={ boxes.paddedRow }>
                    <AttributePreviewTile
                        title="Passende Fähigkeiten"
                        subtitle={currentSkills.join(", ")}
                        index={0}
                        onPress={() => navigation.navigate('IdeaAttributes', {attributeType: "skills", filter: currentSkills, title: "Passende Fähigkeiten"})}
                    />
                </View>

            </View>

            <SwipeListView
                style={{backgroundColor: "white"}}
                ref = {ref => setSwipeListView(ref)}
                data={currentComments}
                disableLeftSwipe = {true}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(itemData) => 
                    <CommentTile
                        id={itemData.item.id}
                        userId={itemData.item.user}
                        comment={itemData.item.text}
                        timestamp={itemData.item.time}
                        likes={itemData.item.likes.length}
                        index = {itemData.index}
                        onPress = {() => {viewProfileHandler(itemData.item.user)}}
                    />
                }
                renderHiddenItem={ (itemData) => 
                    <View style={[boxes.swipeRowOne, {backgroundColor: itemData.item.user == currentUserId ? colors.red : itemData.item.likes.indexOf(currentUserId) < 0 ? colors.darkBlue : colors.lightBlue}]}>
                        <SwipeButton
                            icon={itemData.item.user == currentUserId ? icons.delete : icons.like}
                            backgroundColor={itemData.item.user == currentUserId ? colors.red : itemData.item.likes.indexOf(currentUserId) < 0 ? colors.darkBlue : colors.lightBlue}
                            onPress={() => {itemData.item.user == currentUserId ? deleteCommentHandler(itemData.item.id) : likeCommentHandler(itemData.item.id)}}
                        />
                    </View>
                }
                leftOpenValue={60}
            />

            <View style={[boxes.paddedRow, {backgroundColor: colors.white, paddingBottom: 10}]}>
                <ButtonLarge
                    title="Kommentar schreiben"
                    onPress={() => {setNewCommentVisible(true)}}
                />
            </View>

        </View>
    )
}