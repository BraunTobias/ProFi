import React, {useState, useEffect, useLayoutEffect, useContext} from 'react';
import { View, Text, Modal, Keyboard, ActivityIndicator, Animated, Alert, Image } from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { compareAsc, format } from 'date-fns';

import { icons, colors, boxes, texts } from '../Styles';
import DB from '../api/DB_API';
import InputField from '../components/InputField';
import SwipeButton from '../components/SwipeButton';
import SwipeButtonRow from '../components/SwipeButtonRow';
import CommentTile from '../components/CommentTile';
import ModalContent from "../components/ModalContent";
import Button from '../components/Button';
import ScrollRow from '../components/ScrollRow';
import AttributePreviewTile from '../components/AttributePreviewTile';
import ProfileView from '../components/ProfileView';
import AttributeSelect from '../components/AttributeSelect';
import Padding from '../components/Padding';
import SubHeader from '../components/SubHeader';
import IdeaFooter from '../components/IdeaFooter';
import FlexRow from '../components/FlexRow';
import { ThemeContext } from '../components/ThemeManager';

export default IdeaScreen = ({route, navigation}) => {

    const {themeColors} = useContext(ThemeContext);

    const {ideaInfo} = route.params;
    const {courseId} = route.params;
    const {courseType} = route.params;
    const {currentUserId} = route.params;
    const {courseEvaluated} = route.params;
    const currentUserIsCreator = (ideaInfo.creator == currentUserId);

    // State Hooks
    const [currentSkills, setCurrentSkills] = useState(ideaInfo.skills);
    const [currentComments, setCurrentComments] = useState([]);
    const [swipeListView, setSwipeListView] = useState();
    const [ideaText, setIdeaText] = useState(ideaInfo.description);
    const [ideaName, setIdeaName] = useState(ideaInfo.title);
    const [ideaCreator, setIdeaCreator] = useState("");
    const [ideaCreatorId, setIdeaCreatorId] = useState(ideaInfo.creator);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [members, setMembers] = useState(ideaInfo.team);
    const [refreshing, setRefreshing] = useState(false);
    const [userIsMember, setUserIsMember] = useState(ideaInfo.userIsMember);

    // State Hooks für Modal
    const [editIdeaVisible, setEditIdeaVisible] = useState(false);
    const [addSkillsVisible, setAddSkillsVisible] = useState(false);
    const [editIdeaName, setEditIdeaName] = useState(ideaInfo.title);
    const [editIdeaText, setEditIdeaText] = useState(ideaInfo.description);
    const [selectedSkillsList, setSelectedSkillsList] = useState(ideaInfo.skills);
    const [newCommentVisible, setNewCommentVisible] = useState(false);
    const [newReplyVisible, setNewReplyVisible] = useState(false);
    const [currentNewCommentText, setCurrentNewCommentText] = useState("");
    const [currentReplyText, setCurrentReplyText] = useState("");
    const [currentReplyComment, setCurrentReplyComment] = useState({});
    const [currentCommentErrorVisible, setCurrentCommentErrorVisible] = useState(false);
    const [editIdeaNameErrorVisible, setEditIdeaNameErrorVisible] = useState(false);
    const [editIdeaTextErrorVisible, setEditIdeaTextErrorVisible] = useState(false);
    const [selectedSkillsListErrorVisible, setSelectedSkillsListErrorVisible] = useState(false);
    const [evaluated, setEvaluated] = useState(courseEvaluated);

    // State Hooks für Profilansicht
    const [viewedUserId, setViewedUserId] = useState(currentUserId);
    const [profileVisible, setProfileVisible] = useState(false);

    // Icon-Animation
    const rowSwipeAnimatedValues = {};
    Array(100).fill('').forEach((_, i) => {
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
        DB.getCommentsList(courseId, ideaInfo.id, courseType, (commentsList) => {
            setCurrentComments(commentsList);
            setCommentsLoading(false);
        });
        DB.getUserInfoById(ideaInfo.creator, (userName) => {
            setIdeaCreator(userName);
        });
        if (ideaInfo.team && ideaInfo.team.length > 0) {
            setEvaluated(true);
            DB.getTeamData(courseId, ideaInfo.id, courseType, (teamList) => {
                setMembers(teamList);
            });
        } else if (ideaInfo.members && ideaInfo.members.length > 0) {
            DB.getIdeaMembersData(courseId, ideaInfo.id, (membersList) => {
                setMembers(membersList);
            });
        }
    }, []);

    const likeCommentHandler = (commentId) => {
        DB.likeComment(courseId, ideaInfo.id, commentId, courseType, () => {
            DB.getCommentsList(courseId, ideaInfo.id, courseType, (commentsList) => {
                setCurrentComments(commentsList);
                swipeListView.safeCloseOpenRow();
            });
        });
    }
    const deleteCommentHandler = (commentId, replyTo) => {
        DB.deleteComment(courseId, ideaInfo.id, commentId, courseType, replyTo, () => {
            DB.getCommentsList(courseId, ideaInfo.id, courseType, (commentsList) => {
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
                DB.addComment(courseId, ideaInfo.id, courseType, currentNewCommentText, "", () => {
                    setNewCommentVisible(false);
                    setCurrentNewCommentText("");
                    DB.getCommentsList(courseId, ideaInfo.id, courseType, (commentsList) => {
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
                DB.addComment(courseId, ideaInfo.id, courseType, currentReplyText, currentReplyComment.id, () => {
                    setNewReplyVisible(false);
                    setCurrentNewCommentText("");
                    setCurrentReplyText("");
                    DB.getCommentsList(courseId, ideaInfo.id, courseType, (commentsList) => {
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
                DB.editIdea(courseId, ideaInfo.id, courseType, editIdeaName, editIdeaText, selectedSkillsList, [], () => {
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
    const refreshListHandler = () => {
        setRefreshing(true);

        DB.getCommentsList(courseId, ideaInfo.id, courseType, (commentsList) => {
            setCurrentComments(commentsList);
            setCommentsLoading(false);
            setRefreshing(false);
        });
    };
    const joinIdeaHandler = () => {
        if (!userIsMember) {
            DB.joinOpenIdea(courseId, ideaInfo.id, (membersList) => {
                setUserIsMember(true);
                setMembers(membersList);
            }, (e) => {console.log(e)});
        } else {
            DB.exitOpenIdea(courseId, ideaInfo.id, () => {
                var membersList = members.filter(( item ) => { return item.userId != currentUserId });
                setUserIsMember(false);
                setMembers(membersList);
            });
        }
    }
    const setTeamHandler = () => {
        Alert.alert(
            "Team einteilen",
            "Möchtest du dieses Team wirklich final festlegen? Frag am besten vorher noch einmal nach, ob alle einverstanden sind.",
            [   {text: "Abbrechen", onPress: () => console.log("Cancel Pressed"), style: "cancel"},
                { text: "OK", onPress: () => {
                    DB.setOpenCourseTeam(courseId, ideaInfo.id, () => {
                        setEvaluated(true);
                    });
            }}],
        );              
    }

    const swipeButtons = (item) => {
        if (item.replyTo) {
            return(
                <SwipeButtonRow color={item.user == currentUserId ? themeColors.red : themeColors.primary}> 
                    <SwipeButton
                        animation={new Animated.Value(60)}
                        rowWidth={60}
                        icon={item.user == currentUserId ? icons.delete : icons.like}
                        backgroundColor={item.user == currentUserId ? themeColors.red : themeColors.primary}
                        onPress={() => {item.user == currentUserId ? deleteCommentHandler(item.id, item.replyTo) : likeCommentHandler(item.id)}}
                        deactivated={item.likes.indexOf(currentUserId) >= 0}
                    />
                </SwipeButtonRow>
            );
        } else {
            return(
                <SwipeButtonRow color={themeColors.textInactive}> 
                    <SwipeButton
                        animation={new Animated.Value(120)}
                        rowWidth={120}
                        icon={item.user == currentUserId ? icons.delete : icons.like}
                        backgroundColor={item.user == currentUserId ? themeColors.red : item.likes.indexOf(currentUserId) < 0 ? themeColors.primary : themeColors.secondary}
                        onPress={() => {item.user == currentUserId ? deleteCommentHandler(item.id, item.replyTo) : likeCommentHandler(item.id)}}
                    />
                    <SwipeButton
                        animation={new Animated.Value(120)}
                        rowWidth={120}
                        icon={icons.reply}
                        backgroundColor={themeColors.textInactive}
                        onPress={() => {setNewReplyVisible(true); setCurrentReplyComment(item)}}
                    />
                </SwipeButtonRow>
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
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={[texts.titleCentered, {color: themeColors.textCopy}]}>{"Kommentar schreiben"}</Text>
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
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={[texts.titleCentered, {color: themeColors.textCopy}]}>{"Antwort schreiben"}</Text>
                                <View style={{marginLeft: 20}}>
                                    <CommentTile
                                        userId={currentReplyComment.user}
                                        userName={currentReplyComment.name}
                                        userUrl={currentReplyComment.url}
                                        comment={currentReplyComment.text}
                                        timestamp={currentReplyComment.time}
                                        likes={currentReplyComment.likes.length}
                                        replyPreview={true}
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
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={[texts.titleCentered, {color: themeColors.textCopy}]}>{"Idee bearbeiten"}</Text>
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
                    <AttributeSelect
                        attributeType = "skills"
                        selectedAttributesList={selectedSkillsList}
                        addAttribute = {addSkillHandler}
                        onDismiss = {() => {setAddSkillsVisible(false)}}
                    />
                </Modal>
            </Modal>

            <SubHeader>
                <FlexRow padding>
                    <Text style={[texts.subHeaderLarge, {color: themeColors.textHl}]}>{ideaName}</Text>
                </FlexRow>
                { ideaText.length > 0 &&
                    <FlexRow padding>
                        <Text style={[texts.copy, {color: themeColors.textCopy}]}>{ideaText}</Text>
                    </FlexRow>
                }
                { ideaInfo.warning && ideaInfo.warning != "" &&
                    <View>
                        <Padding height={5}/>
                        <FlexRow padding left>
                            <Image source={icons.warning} style= {{ tintColor: themeColors.red, width: 25, height: 25, marginEnd: 7}} resizeMode= { "contain" }/>
                            <Text style={[texts.copy, {color: themeColors.red}]}>{
                                ideaInfo.warning == "underMin" ? "Minimale Gruppengröße nicht erreicht" : "Maximale Gruppengröße überschritten"
                            }</Text>
                        </FlexRow>
                    </View>
                }
                <FlexRow padding>
                    <AttributePreviewTile
                        title={ideaCreatorId == "ProFi-Algorithmus" ? "Gemeinsamkeiten" : "Passende Fähigkeiten"}
                        subtitle={currentSkills.length > 0 ? currentSkills.join(", ") : "\n"}
                        index={0}
                        onPress={() => navigation.navigate("IdeaAttributes", {filterList: currentSkills, secondaryFilterList: ideaInfo.interests, courseType: courseType, courseId: courseId, ideaId: ideaInfo.id, title: ideaCreatorId == "ProFi-Algorithmus" ? "Gemeinsamkeiten" : "Passende Fähigkeiten"})}
                    />
                </FlexRow>
                { (courseType == "openCourses" && !evaluated) &&
                <FlexRow padding>
                    <Button
                        title={"Beitreten"}
                        icon={userIsMember ? icons.checkTrue : icons.checkFalse}
                        onPress={joinIdeaHandler}
                    />
                </FlexRow>
                }
            </SubHeader>

            <SwipeListView
                onSwipeValueChange={onSwipeValueChange}
                onRefresh={refreshListHandler}
                refreshing={refreshing}
                style={{backgroundColor: themeColors.base}}
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
                    <View style={{backgroundColor: evaluated ? themeColors.primary : themeColors.base}}>
                    { currentUserIsCreator && !evaluated && 
                    <View>
                        <Padding height={5}/>
                        { courseType == "courses" &&
                        <FlexRow padding>
                            <Button
                                title="Idee bearbeiten"
                                onPress={() => setEditIdeaVisible(true)}
                            />
                        </FlexRow>
                        }
                        {(courseType == "openCourses" && !evaluated) &&
                        <FlexRow padding>
                                <Button
                                    title="Bearbeiten"
                                    icon={icons.edit}
                                    onPress={() => setEditIdeaVisible(true)}
                                />
                                <Padding width={10}/>
                                <Button
                                    title={"Team einteilen"}
                                    icon={icons.fav}
                                    onPress={setTeamHandler}
                                />
                        </FlexRow>
                        }
                    </View>
                    }
                    {/* BEI OFFENEN IDEEN MUSS ES NICHT EVALUATED SEIN */}
                    {(courseType == "openCourses" || (evaluated && members && members.length > 0)) &&
                        <ScrollRow
                            data= {members}
                            onPress={(id) => {viewProfileHandler(id)}}
                        />
                    }
                    </View>
                }
                ListFooterComponent={
                    <View>
                        {!commentsLoading && !currentUserIsCreator &&
                            <IdeaFooter ideaCreatorId={ideaCreatorId} ideaCreator={ideaCreator}/>
                        }
                        {commentsLoading && 
                            <View style={{backgroundColor: themeColors.base, paddingVertical: 30}}>
                                <ActivityIndicator color={themeColors.textHl}/>
                            </View>
                        }
                    </View>
                }
            />
            <View style={{backgroundColor: themeColors.base}}>
                <Padding height={5}/>
                <FlexRow padding>
                    <Button
                        title="Kommentar schreiben"
                        onPress={() => {setNewCommentVisible(true)}}
                    />
                </FlexRow>
                <Padding height={5}/>
            </View>
        </View>
    )
}