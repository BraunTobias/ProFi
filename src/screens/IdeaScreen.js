import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, Text, Modal, FlatList, TouchableHighlight, Keyboard, ActivityIndicator, Alert, Image } from 'react-native';
// import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { compareAsc, format } from 'date-fns';

import { icons, colors, boxes, texts } from '../Styles';
import DB from '../api/DB_API';
import InputField from '../components/InputField';
// import SwipeButton from '../components/SwipeButton';
import CommentTile from '../components/CommentTile';
import ModalContent from "../components/ModalContent";
import Button from '../components/Button';
import ButtonLarge from '../components/ButtonLarge';
import ButtonIcon from '../components/ButtonIcon';
import ScrollRow from '../components/ScrollRow';
import AttributePreviewTile from '../components/AttributePreviewTile';
import ProfileView from '../components/ProfileView';
import ProfileBox from '../components/ProfileBox';
import AttributeSelect from '../components/AttributeSelect';
import Padding from '../components/Padding';
import FlexRow from '../components/FlexRow';
import IdeaFooter from '../components/IdeaFooter';

export default function IdeaScreen ({route, navigation}) {

    const {ideaInfo} = route.params;
    const {courseInfo} = route.params;
    const {courseId} = route.params;
    const {courseType} = route.params;
    const {currentUserId} = route.params;
    const {evaluated} = route.params;
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
    const [skillsListText, setSkillsListText] = useState(ideaInfo.skills);
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
    const [profileInfoVisible, setProfileInfoVisible] = useState(0);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: courseId,
            headerRight: () => (
                <ButtonIcon
                    icon= { "profile" }
                    status= { "aktive" }
                    onPress= { () => { navigation.navigate("Mein Profil", { currentUserId: currentUserId } ) } }
                />
            ),
            headerLeft: () => (
                <View style= { [boxes.unPaddedRow, { alignItems: "center", } ] }>
                    <ButtonIcon
                        icon= { "logo" }
                        status= { "color" }
                        onPress= { () => { navigation.navigate("Home") } }
                    />
                    <Padding width= { 15 } />
                    <ButtonIcon
                        icon= { "reply" }
                        status= { "aktive" }
                        onPress= { () => { 
                            navigation.navigate("Course", { courseInfo: courseInfo, currentUserId: currentUserId } );
                         } }
                    />
                </View>
            ),
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
            });
        });
    }
    const deleteCommentHandler = (commentId, replyTo) => {
        DB.deleteComment(courseId, ideaInfo.id, commentId, courseType, replyTo, () => {
            DB.getCommentsList(courseId, ideaInfo.id, courseType, (commentsList) => {
                setCurrentComments(commentsList);
            });
        });
    }

    const viewProfileHandler = (id) => {
        setViewedUserId(id);
        setProfileVisible(true);
    }
    const viewProfileInfoHandler = (num, id) => {
        setViewedUserId(id);
        setProfileInfoVisible(num);
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
        if (selectedSkillsList.indexOf(skill) < 0) {
            var list = selectedSkillsList;
            list.push(skill);
            setSkillsListText(list.join(", "));
            setSelectedSkillsList(list);
        } else {
            var list = selectedSkillsList.filter(item => item !== skill);
            setSkillsListText(list.join(", "));
            setSelectedSkillsList(list);
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
                        evaluated(true);
                    });
            }}],
        );              
    }

    const swipeButtons = (item) => {
        if (item.replyTo) {
            // Comment-autor: delete-button
            return(
                <View style={ [boxes.paddedRow, { backgroundColor: colors.mediumBlue } ] } >
                    <ButtonIcon 
                        icon= { item.user == currentUserId ? 'delete' : 'like' }
                        onPress= { (ref) => { item.user == currentUserId ? deleteCommentHandler(item.id) : likeCommentHandler(item.id) } }
                        status= { item.user == currentUserId ? 'neg' : 
                            item.likes.indexOf(currentUserId) < 0 ? "active" : "inactive"
                        }
                    />
                </View>
            );
        } 
        // Comment-reader: Fav- & Reply-button
        else {
            return(
                <View style= { [boxes.paddedRow, { backgroundColor: colors.mediumBlue } ] } >
                    <ButtonIcon 
                        icon= { item.user == currentUserId ? 'delete' : 'like' }
                        onPress= { (ref) => { item.user == currentUserId ? deleteCommentHandler(item.id) : likeCommentHandler(item.id) } }
                        status= { item.user == currentUserId ? 'neg' : 
                            item.likes.indexOf(currentUserId) < 0 ? "active" : "inactive"
                        }
                    />
                    <ButtonIcon 
                        icon= { 'reply' }
                        onPress= { (ref) => { setNewReplyVisible(true); setCurrentReplyComment(item) } }
                        status= { "active" }
                    />
                </View>
            );
        }
    }

    return(
        <View style= { {
            backgroundColor: colors.lightGrey, 
            height: window.height-80,
        } } >

            { profileVisible &&
            <ProfileView
                userId={viewedUserId}
                visible={profileVisible}
                onDismiss={() => {setProfileVisible(false)}}
            />
            }

            {/* Kommentar schreiben */}
            <Modal visible= { newCommentVisible }
                transparent= {true}
                animationType= 'slide'
                style= { { 
                width: window.width,
                height: window.height,
            } } >
                <ModalContent
                    subheader= { () => { return(
                        <View style= { [boxes.subHeader, {
                            height: 70,
                            width: window.width,
                            justifyContent: 'center',
                            alignContent: 'center',
                        } ] } >
                            <Text style= { [texts.titleCentered, { alignSelf: 'center' }] } >Kommentar schreiben</Text>
                        </View>
                    ) } }
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <InputField
                                    placeholderText= "max. 300 Zeichen"
                                    value={currentNewCommentText}
                                    onChangeText={changeNewCommentTextHandler}
                                    multiline={true}
                                />
                                {currentCommentErrorVisible &&
                                    <Text style={[boxes.unPaddedRow, texts.errorLine]}>
                                        Bitte einen Kommentar eingeben.
                                    </Text>
                                }
                            </View> 
                        )
                    }}
                    onDismiss= {(committed) => {pressNewCommentHandler(committed)}}
                />
            </Modal>
            
            {/* Auf Kommentar antworten */}
            <Modal visible= { newReplyVisible } 
                transparent= {true}
                animationType= 'slide'
                style= { { 
                    width: window.width,
                    height: window.height,
            } } >
                <ModalContent
                    subheader= { () => { return(
                        <View style= { [boxes.subHeader, {
                            height: 70,
                            width: window.width,
                            justifyContent: 'center',
                            alignContent: 'center',
                        } ] } >
                            <Text style= { [texts.titleCentered, { alignSelf: 'center' }] } >Antwort schreiben</Text>
                        </View>
                    ) } }
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <View style= { { width: '50%' } } >
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
                                        placeholderText= "max. 300 Zeichen"
                                        value={currentReplyText}
                                        onChangeText={changeReplyTextHandler}
                                        multiline={true}
                                    />
                                    {currentCommentErrorVisible &&
                                        <Text style={[boxes.unPaddedRow, texts.errorLine]}>
                                            Bitte eine Antwort eingeben.
                                        </Text>
                                    }
                                </View> 
                            </View> 
                        )
                    }}
                    onDismiss= {pressReplyHandler}
                />
            </Modal>
                
            {/* Idee bearbeiten */}
            <Modal visible= { editIdeaVisible } 
                transparent= {true}
                animationType= 'slide'
                style= { { 
                width: window.width,
                height: window.height,
            } } >
                <ModalContent
                    subheader= { () => { return(
                        <View style= { [boxes.subHeader, {
                            height: 70,
                            width: window.width,
                            justifyContent: 'center',
                            alignContent: 'center',
                        } ] } >
                            <Text style= { [texts.titleCentered, { alignSelf: 'center' }] } >Idee bearbeiten</Text>
                        </View>
                    ) } }
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <View style= { boxes.paddedRow }>
                                    <View style= { { width: '50%' } } >
                                        <InputField
                                            placeholderText= "Titel"
                                            value={editIdeaName}
                                            onChangeText={changeEditIdeaNameHandler}
                                        />
                                        {editIdeaNameErrorVisible &&
                                            <Text style={[boxes.unPaddedRow, texts.errorLine]}>
                                                Bitte einen Namen angeben.
                                            </Text>
                                        }
                                        <InputField
                                            placeholderText= "Beschreibung"
                                            value={editIdeaText}
                                            onChangeText={changeEditIdeaTextHandler}
                                            multiline={true}
                                        />
                                        {editIdeaTextErrorVisible &&
                                            <Text style={[boxes.unPaddedRow, texts.errorLine]}>
                                                Bitte einen Beschreibungstext angeben.
                                            </Text>
                                        }
                                        {/* Fähigkeiten auflisten */}
                                        <AttributePreviewTile
                                            title= "Passende Fähigkeiten"
                                            subtitle= { skillsListText }
                                            index= { 0 }
                                        />
                                        {selectedSkillsListErrorVisible &&
                                            <Text style={[boxes.unPaddedRow, texts.errorLine]}>
                                                Bitte mindestens eine Fähigkeit angeben.
                                            </Text>
                                        }
                                    </View> 
                                    <Padding width= { 15 } />
                                    <View>
                                        {/* Fähigkeiten auswählen */}
                                        <AttributeSelect
                                            attributeType = "skills"
                                            selectedAttributesList= { selectedSkillsList }
                                            addAttribute = { (skills) => { addSkillHandler(skills) } }
                                        />
                                    </View>
                                </View>
                            </View> 
                        )
                    }}
                    onDismiss= {pressEditIdeaHandler}
                />
            </Modal>

            {/* Header */}
            <View style= { boxes.subHeader } >
                <View style= { [boxes.width] } >
                    <FlexRow padding>
                        <Text style={texts.subHeaderLarge}>{ideaName}</Text>
                    </FlexRow>
                    { ideaText.length > 0 &&
                        <FlexRow padding>
                            <Text style={texts.copy}>{ideaText}</Text>
                        </FlexRow>
                    }
                    <FlexRow padding>
                        <AttributePreviewTile
                            title={ideaInfo.interests.length > 0 ? "Gemeinsamkeiten" : "Passende Fähigkeiten"}
                            subtitle={currentSkills.length > 0 ? currentSkills.join(", ") : "\n"}
                            index={0}
                            onPress={() => navigation.navigate("IdeaAttributes", {filterList: currentSkills, secondaryFilterList: ideaInfo.interests, courseType: courseType, courseId: courseId, ideaId: ideaInfo.id, title: ideaInfo.interests.length > 0 ? "Gemeinsamkeiten" : "Passende Fähigkeiten"})}
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
                </View>
            </View>

            {commentsLoading && 
                <View style={{backgroundColor: "white", paddingVertical: 30}}>
                    <ActivityIndicator/>
                </View>
            }

            {/* ListHeaderComponent */}
            <View style= { [ {backgroundColor: evaluated ? colors.darkBlue : colors.white} ] } >
                <View style= {boxes.width}>
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
                    {(courseType == "openCourses" || (evaluated && members.length > 0)) &&
                        <ScrollRow
                            // data= {members}
                            // onPress={(id) => {viewProfileHandler(id)}}

                            data= { members }
                            onPress= { (id) => { viewProfileHandler(id) } }
                            onEnter= { (num, id) => viewProfileInfoHandler(num, id) }
                            // onLeave= { () => setProfileInfoVisible(0) }
                        />
                    }
                </View>
            </View>
            {/* FlatList */}
            <FlatList 
                data= { currentComments }
                keyExtractor= { (item, index) => index.toString() }
                renderItem= { (itemData) => { 
                    return (
                        <TouchableHighlight
                            underlayColor={colors.darkBlue}
                            style={{width:"100%"}}
                        >
                            <View style= { { 
                                flexDirection: "row",
                            //     justifyContent: "space-between",
                            //     alignItems: "center",
                                width: '75%',
                            } } >
                                {itemData.item.replyTo && itemData.item.replyTo.length > 0 && 
                                    <Image
                                        style={ boxes.commentReplyTile }
                                        source={icons.reply}
                                        resizeMode={"contain"}
                                    />
                                }
                                <View style= { { paddingRight: '17.5%', paddingLeft: itemData.item.replyTo ? 15 : '17.5%' } } >
                                    <CommentTile
                                        id={itemData.item.id}
                                        userId={itemData.item.user}
                                        userName={itemData.item.name}
                                        userUrl={itemData.item.url}
                                        comment={itemData.item.text}
                                        timestamp={itemData.item.time}
                                        likes={itemData.item.likes.length}
                                        isReply={itemData.item.replyTo && itemData.item.replyTo.length > 0}
                                        index = {itemData.index}
                                        onPress = {() => {viewProfileHandler(itemData.item.user)}}
                                    />
                                    {swipeButtons(itemData.item)}
                                </View>
                            </View>
                        </TouchableHighlight>
                    )
                }}
            />

            {/* ListFooterComponent */}
            <View>
                {!commentsLoading && !currentUserIsCreator &&
                    <IdeaFooter ideaCreatorId={ideaCreatorId} ideaCreator={ideaCreator}/>
                }
                {commentsLoading && 
                    <View style={{backgroundColor: colors.white, paddingVertical: 30}}>
                        <ActivityIndicator/>
                    </View>
                }
            </View>

            <View style={[boxes.paddedRow, {backgroundColor: colors.white, paddingVertical: 5}]}>
                <ButtonLarge
                    title="Kommentar schreiben"
                    onPress={() => {setNewCommentVisible(true)}}
                />
            </View>

        </View>
    )
}