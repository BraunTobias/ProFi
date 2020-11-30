import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, Text, Modal, Keyboard, ActivityIndicator, Animated } from 'react-native';
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
import AttributeSelect from '../components/AttributeSelect';
import Padding from '../components/Padding';

export default IdeaScreen = ({route, navigation}) => {

    const {itemId} = route.params;
    const {itemTitle} = route.params;
    const {itemDescription} = route.params;
    const {courseId} = route.params;
    const {currentUserId} = route.params;
    const {myTeam} = route.params;
    const {evaluated} = route.params;

    // State Hooks
    const [currentSkills, setCurrentSkills] = useState([]);
    const [currentInterests, setCurrentInterests] = useState([]);
    const [currentComments, setCurrentComments] = useState([]);
    const [swipeListView, setSwipeListView] = useState();
    const [currentUserIsCreator, setCurrentUserIsCreator] = useState(false);
    const [ideaText, setIdeaText] = useState(itemDescription);
    const [ideaName, setIdeaName] = useState(itemTitle);
    const [ideaCreator, setIdeaCreator] = useState("");
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [members, setMembers] = useState([]);

    // State Hooks für Modal
    const [editIdeaVisible, setEditIdeaVisible] = useState(false);
    const [addSkillsVisible, setAddSkillsVisible] = useState(false);
    const [editIdeaName, setEditIdeaName] = useState(itemTitle);
    const [editIdeaText, setEditIdeaText] = useState(itemDescription);
    const [selectedSkillsList, setSelectedSkillsList] = useState([]);
    const [newCommentVisible, setNewCommentVisible] = useState(false);
    const [newReplyVisible, setNewReplyVisible] = useState(false);
    const [currentNewCommentText, setCurrentNewCommentText] = useState("");
    const [currentReplyText, setCurrentReplyText] = useState("");
    const [currentReplyComment, setCurrentReplyComment] = useState({});
    const [currentCommentErrorVisible, setCurrentCommentErrorVisible] = useState(false);
    const [editIdeaNameErrorVisible, setEditIdeaNameErrorVisible] = useState(false);
    const [editIdeaTextErrorVisible, setEditIdeaTextErrorVisible] = useState(false);
    const [selectedSkillsListErrorVisible, setSelectedSkillsListErrorVisible] = useState(false);

    // State Hooks für Profilansicht
    const [viewedUserId, setViewedUserId] = useState(currentUserId);
    const [profileVisible, setProfileVisible] = useState(false);

    // Icon-Animation
    const rowSwipeAnimatedValues = {};
    Array(100)
    .fill('')
    .forEach((_, i) => {
        rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
    });
    const onSwipeValueChange = (swipeData) => {
        const { key, value } = swipeData;
        rowSwipeAnimatedValues[key].setValue(Math.abs(value));
        console.log("change");
    };
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: courseId,
        });
    }, [navigation]);

    useEffect(() => {
        DB.getCommentsList(courseId, itemId, "courses", (commentsList) => {
            setCurrentComments(commentsList);
            setCommentsLoading(false);
        });
        DB.getIdeaData(courseId, itemId, (data) => {
            if (data.skills) setCurrentSkills(data.skills);
            if (data.interests) setCurrentInterests(data.interests);
            setSelectedSkillsList(data.skills);
            DB.getUserInfoById(data.creator, (userName) => {
                setIdeaCreator(userName);
            });
            if (evaluated) {
                setMembers(data.team);
            }
            if (data.creator == currentUserId) setCurrentUserIsCreator(true);
            setMembers(data.team);
            // if (data.team && data.team.length > 0) {
            //     const teamUidList = data.team;
            //     var newTeamList = [];
            //     for (const member in teamUidList) {
            //         const uid = teamUidList[member];
            //         DB.getUserInfoById(uid, (name, url) => {
            //             newTeamList.push({
            //                 "userId": uid,
            //                 "username": name,
            //                 "imageUrl": url
            //             });
            //             // setTeam(newTeamList);
            //         });
            //     }
            // }
        });
    }, []);

    const likeCommentHandler = (commentId) => {
        DB.likeComment(courseId, itemId, commentId, "courses", () => {
            DB.getCommentsList(courseId, itemId, "courses", (commentsList) => {
                setCurrentComments(commentsList);
                swipeListView.safeCloseOpenRow();
            });
        });
    }
    const deleteCommentHandler = (commentId, replyTo) => {
        DB.deleteComment(courseId, itemId, commentId, "courses", replyTo, () => {
            DB.getCommentsList(courseId, itemId, "courses", (commentsList) => {
                setCurrentComments(commentsList);
                swipeListView.safeCloseOpenRow();
            });
        });
    }

    const viewProfileHandler = (id) => {
        setViewedUserId(id);
        setProfileVisible(true);
    }

    // Handler für Modal
    const changeNewCommentTextHandler = (enteredText) => {
        setCurrentNewCommentText(enteredText);
        if (enteredText != "") setCurrentCommentErrorVisible(false);
    }
    const changeReplyTextHandler = (enteredText) => {
        setCurrentReplyText(enteredText);
        if (enteredText != "") setCurrentCommentErrorVisible(false);
    }
    const pressNewCommentHandler = (committed) => {
        if (committed) {
            if (currentNewCommentText != "") {
                DB.addComment(courseId, itemId, "courses", currentNewCommentText, "", () => {
                    setNewCommentVisible(false);
                    setCurrentNewCommentText("");
                    DB.getCommentsList(courseId, itemId, "courses", (commentsList) => {
                        setCurrentComments(commentsList);
                    });
                });
            } else {
                setCurrentCommentErrorVisible(true);
            }
        } else {
            setNewCommentVisible(false);
            setCurrentCommentErrorVisible(false);
        }
    }
    const pressReplyHandler = (committed) => {
        if (committed) {
            if (currentReplyText != "") {
                DB.addComment(courseId, itemId, "courses", currentReplyText, currentReplyComment.id, () => {
                    setNewReplyVisible(false);
                    setCurrentNewCommentText("");
                    setCurrentReplyText("");
                    DB.getCommentsList(courseId, itemId, "courses", (commentsList) => {
                        setCurrentComments(commentsList);
                    });
                });
            } else {
                setCurrentCommentErrorVisible(true);
            }
        } else {
            setNewReplyVisible(false);
            setCurrentCommentErrorVisible(false);
        }
        swipeListView.safeCloseOpenRow();
    }

    const changeEditIdeaNameHandler = (enteredText) => {
        setEditIdeaName(enteredText);
        if (editIdeaName.length > 1) setEditIdeaNameErrorVisible(false);
    }
    const changeEditIdeaTextHandler = (enteredText) => {
        setEditIdeaText(enteredText);
        if (editIdeaText.length > 1) setEditIdeaTextErrorVisible(false);
    }
    const addSkillHandler = (skill) => {
        var oldList = selectedSkillsList;
        if (oldList.indexOf(skill) < 0) {
            oldList.push(skill);
        } else {
            var newList = oldList.filter(item => item !== skill);
            setSelectedSkillsList(newList);
        }
        if (selectedSkillsList.length > 0) setSelectedSkillsListErrorVisible(false);
    }
    const pressEditIdeaHandler = (committed) => {
        if (committed) {
            if (editIdeaName.length > 1 && editIdeaText.length > 1 && selectedSkillsList.length > 0) {
                DB.editIdea(courseId, itemId, "courses", editIdeaName, editIdeaText, selectedSkillsList, [], () => {
                    setEditIdeaVisible(false);
                    setEditIdeaTextErrorVisible(false);
                    setEditIdeaNameErrorVisible(false);
                    setSelectedSkillsListErrorVisible(false);
                    setCurrentSkills(selectedSkillsList);
                    setSelectedSkillsList(selectedSkillsList);
                    setIdeaName(editIdeaName);
                    setIdeaText(editIdeaText);
                }, () => {
                    Alert.alert(
                        "Fehler",
                        "Idee konnte nicht bearbeitet werden",
                        [{ text: "OK", onPress: () => {}}],
                    );              
                });
            }
            if (editIdeaName.length <= 1) setEditIdeaNameErrorVisible(true);
            if (editIdeaText.length <= 1) setEditIdeaTextErrorVisible(true);
            if (selectedSkillsList.length == 0) setSelectedSkillsListErrorVisible(true);
        } else {
            setEditIdeaVisible(false);
            setEditIdeaName(ideaName);
            setEditIdeaText(ideaText);
            setSelectedSkillsList(currentSkills);
            setEditIdeaNameErrorVisible(false);
            setEditIdeaTextErrorVisible(false);
            setSelectedSkillsListErrorVisible(false);
        }
    }

    const swipeButtons = (item) => {
        if (item.replyTo) {
            return(
                <View style={[boxes.swipeRowOne, {backgroundColor: item.user == currentUserId ? colors.red : item.likes.indexOf(currentUserId) < 0 ? colors.darkBlue : colors.lightBlue}]}>
                    <SwipeButton
                        animation={new Animated.Value(60)}
                        rowWidth={60}
                        icon={item.user == currentUserId ? icons.delete : icons.like}
                        backgroundColor={item.user == currentUserId ? colors.red : item.likes.indexOf(currentUserId) < 0 ? colors.darkBlue : colors.lightBlue}
                        onPress={() => {item.user == currentUserId ? deleteCommentHandler(item.id, item.replyTo) : likeCommentHandler(item.id)}}
                    />
                </View>
            );
        } else {
            return(
                <View style={[boxes.swipeRowTwo, {backgroundColor: colors.mediumBlue}]}>
                    <SwipeButton
                        animation={new Animated.Value(120)}
                        rowWidth={120}
                        icon={item.user == currentUserId ? icons.delete : icons.like}
                        backgroundColor={item.user == currentUserId ? colors.red : item.likes.indexOf(currentUserId) < 0 ? colors.darkBlue : colors.lightBlue}
                        onPress={() => {item.user == currentUserId ? deleteCommentHandler(item.id, item.replyTo) : likeCommentHandler(item.id)}}
                    />
                    <SwipeButton
                        animation={new Animated.Value(120)}
                        rowWidth={120}
                        icon={icons.reply}
                        backgroundColor={colors.mediumBlue}
                        onPress={() => {setNewReplyVisible(true); setCurrentReplyComment(item)}}
                    />
                </View>
            );
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

            {/* Kommentar schreiben */}
            <Modal visible= { newCommentVisible } animationType= 'slide' onRequestClose={() => setNewCommentVisible(false)}>
                <ModalContent
                    subheader= { () => {}}
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={texts.titleCentered}>{"Kommentar schreiben"}</Text>
                                <InputField
                                    showError={currentCommentErrorVisible}
                                    placeholderText= {currentCommentErrorVisible ? "Bitte einen Kommentar eingeben." : "max. 300 Zeichen"}
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
            {/* Auf Kommentar antworten */}
            <Modal visible= { newReplyVisible } animationType= 'slide' onRequestClose={() => setNewReplyVisible(false)}>
                <ModalContent
                    subheader= { () => {}}
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={texts.titleCentered}>{"Antwort schreiben"}</Text>
                                <View style={{marginLeft: 20}}>
                                    <CommentTile
                                        userId={currentReplyComment.user}
                                        userName={currentReplyComment.name}
                                        userUrl={currentReplyComment.url}
                                        comment={currentReplyComment.text}
                                        timestamp={currentReplyComment.time}
                                        likes={currentReplyComment.likes.length}
                                    />
                                </View>
                                <InputField
                                    showError={currentCommentErrorVisible}
                                    placeholderText= {currentCommentErrorVisible ? "Bitte eine Antwort eingeben." : "max. 300 Zeichen"}
                                    value={currentReplyText}
                                    onChangeText={changeReplyTextHandler}
                                    multiline={true}
                                />
                            </View> 
                        )
                    }}
                    onDismiss= {pressReplyHandler}
                />
            </Modal>
                
            {/* // Idee bearbeiten */}
            <Modal visible= { editIdeaVisible } animationType= 'slide' onRequestClose={() => setEditIdeaVisible(false)}>
                <ModalContent
                    subheader= { () => {}}
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={texts.titleCentered}>{"Idee bearbeiten"}</Text>
                                <InputField
                                    showError={editIdeaNameErrorVisible}
                                    placeholderText= {editIdeaNameErrorVisible ? "Bitte einen Namen angeben." : "Titel"}
                                    value={editIdeaName}
                                    onChangeText={changeEditIdeaNameHandler}
                                />
                                <InputField
                                    showError={editIdeaTextErrorVisible}
                                    placeholderText= {editIdeaTextErrorVisible ? "Bitte einen Beschreibungstext angeben." : "Beschreibung"}
                                    value={editIdeaText}
                                    onChangeText={changeEditIdeaTextHandler}
                                    multiline={true}
                                />
                                <AttributePreviewTile
                                    showError={selectedSkillsListErrorVisible}
                                    title={"Passende Fähigkeiten"}
                                    subtitle={selectedSkillsListErrorVisible ? "Bitte mindestens eine Fähigkeit angeben." : selectedSkillsList.join(", ")}
                                    index={0}
                                    onPress={() => {setAddSkillsVisible(true)}}
                                />
                            </View> 
                        )
                    }}
                    onDismiss= {pressEditIdeaHandler}
                />
                {/* // Idee bearbeiten: Fähigkeiten auswählen */}
                <Modal visible={addSkillsVisible} animationType='slide' onRequestClose={() => setAddSkillsVisible(false)}>
                    {/* <Text style={texts.titleCentered}>{"Fähigkeiten hinzufügen"}</Text> */}
                    <AttributeSelect
                        attributeType = "skills"
                        selectedAttributesList={selectedSkillsList}
                        addAttribute = {addSkillHandler}
                        onDismiss = {() => {setAddSkillsVisible(false)}}
                    />
                </Modal>
            </Modal>

            <View style={ boxes.subHeader }>
                <View style={ boxes.paddedRow }>
                    <Text style={texts.subHeaderLarge}>{ideaName}</Text>
                </View>
                <View style={ boxes.paddedRow }>
                    <Text style={texts.copy}>{ideaText}</Text>
                </View>
                <View style={ boxes.paddedRow }>
                    { currentInterests.length == 0 &&
                        <AttributePreviewTile
                        title="Passende Fähigkeiten"
                        subtitle={currentSkills.join(", ")}
                        index={0}
                        onPress={() => navigation.navigate('IdeaAttributes', {attributeType: "skills", filterList: currentSkills, title: "Passende Fähigkeiten"})}
                        />
                    }
                    { currentInterests.length > 0 &&
                        <AttributePreviewTile
                        title="Gemeinsame Interessen"
                        subtitle={currentSkills.join(", ")}
                        index={0}
                        onPress={() => navigation.navigate('IdeaAttributes', {attributeType: "Interests", filterList: currentInterests, title: "Gemeinsame Interessen"})}
                        />
                    }
                </View>

            </View>

            {commentsLoading && 
                <View style={{backgroundColor: colors.white, paddingVertical: 30}}>
                    <ActivityIndicator/>
                </View>
            }

            <SwipeListView
                onSwipeValueChange={onSwipeValueChange}
                style={{backgroundColor: colors.white}}
                ref = {ref => setSwipeListView(ref)}
                data={currentComments}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => 
                    <SwipeRow leftOpenValue={item.replyTo ? 60 : 120} disableLeftSwipe = {true}>
                        {swipeButtons(item)}
                        <CommentTile
                            id={item.id}
                            userId={item.user}
                            userName={item.name}
                            userUrl={item.url}
                            comment={item.text}
                            timestamp={item.time}
                            likes={item.likes.length}
                            isReply={item.replyTo && item.replyTo.length > 0}
                            index = {index}
                            onPress = {() => {viewProfileHandler(item.user)}}
                        />
                    </SwipeRow>
                }
                ListHeaderComponent={
                    <View style={{backgroundColor: evaluated ? colors.darkBlue : colors.white}}>
                    { currentUserIsCreator && !evaluated &&
                    <View>
                        <Padding height={5}/>
                        <View style={ boxes.paddedRow }>
                            <ButtonLarge
                                title="Idee bearbeiten"
                                onPress={() => setEditIdeaVisible(true)}
                            />
                        </View>
                    </View>
                    }
                    {evaluated && members.length > 0 &&
                        <ScrollRow
                            data= {members}
                            onPress={(id) => {viewProfileHandler(id)}}
                        />
                    }
                    </View>
                }
                ListFooterComponent={
                    !commentsLoading && !currentUserIsCreator &&
                    <View style={boxes.ideaFooter}>
                        <Text style={texts.ideaFooter}>{"Idee von " + ideaCreator}</Text>
                    </View>
                }
            />

            <View style={[boxes.paddedRow, {backgroundColor: colors.white, paddingVertical: 5}]}>
                <ButtonLarge
                    title="Kommentar schreiben"
                    onPress={() => {setNewCommentVisible(true)}}
                />
            </View>

        </View>
    )
}