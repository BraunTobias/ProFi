import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, Text, Modal, FlatList, ScrollView, StyleSheet, ActivityIndicator, Alert, Image, useWindowDimensions, TouchableHighlight } from 'react-native';
import { compareAsc, format } from 'date-fns';
import Autolink from 'react-native-autolink';

import { icons, colors, boxes, texts, height } from '../Styles';
import DB from '../api/DB_API';
import InputField from '../components/InputField';
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
import ButtonSmall from '../components/ButtonSmall';
import ProfileImage from '../components/ProfileImage';
// import { ScrollView } from 'react-native-web';


export default function IdeaScreen ({route, navigation}) {

    let window = useWindowDimensions();

    const {ideaInfo} = route.params;
    const {courseInfo} = route.params;
    const {courseId} = route.params;
    const {courseType} = route.params;
    const {currentUserId} = route.params;
    const {evaluated} = route.params;
    const currentUserIsCreator = (ideaInfo.creator == currentUserId);

    // State Hooks
    const [currentUserName, setCurrentUserName] = useState("");
    const [currentUserImage, setCurrentUserImage] = useState("");
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
            headerTitle: courseInfo.title,
            headerRight: () => (
                <ButtonIcon
                    icon= { "profile" }
                    status= { "active" }
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
                        status= { "active" }
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
        DB.getUserInfoById(currentUserId, (userName, userImage) => {
            setCurrentUserName(userName);
            setCurrentUserImage(userImage);
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

    // Handler für Modal
    const changeNewCommentTextHandler = (enteredText) => {
        setCurrentNewCommentText(enteredText);
        if (enteredText !== "") setCurrentCommentErrorVisible(false);
    }
    const changeReplyTextHandler = (enteredText) => {
        setCurrentReplyText(enteredText);
        if (enteredText != "") setCurrentCommentErrorVisible(false);
    }
    const pressNewCommentHandler = (committed) => {
        if (committed) {
            if (currentNewCommentText !== "") {
                console.log('commit')
                DB.addComment(courseId, ideaInfo.id, courseType, currentNewCommentText, "", () => {
                    setNewCommentVisible(false);
                    setCurrentNewCommentText("");
                    DB.getCommentsList(courseId, ideaInfo.id, courseType, (commentsList) => {
                        setCurrentComments(commentsList);
                    });
                });
            } else {
                console.log('no comment-text')
                setCurrentCommentErrorVisible(true);
            }
        } else {
            console.log('no commit')
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
    const changeSkillsHandler = (skill) => {
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
    const ButtonMember = () => {
        if (courseType === "openCourses") return (
            <ButtonSmall
                title={userIsMember ? "Mitglied" : "Beitreten"}
                icon={userIsMember ? "checkTrue" : "checkFalse"}
                onPress={joinIdeaHandler}
            />
        );
        else return <View style= { { width: 150 } } />
    }

    const Styles = StyleSheet.create({
        
        commentTile: {
            paddingVertical: 10,
            paddingHorizontal: 15,
            minHeight: 200,
            flexDirection: "row",

        },
        repliedTile: {
            backgroundColor: colors.mediumGrey,
            minHeight: 100,
            paddingVertical: 10,
            paddingHorizontal: 15,
            flexDirection: "row"
        },
        replyImage: {
            width: 30,
            height: 30,
            tintColor: colors.mediumGrey,
            marginRight: 15,
            alignSelf: 'center'
        },
        infoArea: {
            width: 60,
            marginRight: 15
        },
        rightArea: {
            position: "absolute",
            right: 10,
            width: 250,
            height: 150,
            alignItems: 'flex-end',
        },
        buttons: {
            // position: "absolute",
            // right: 10,
            // top: 50,
            // width: 250,
            flexDirection: 'column',
            justifyContent: 'space-between'
        },
        likes: {
            width: "100%",
            marginTop: 5, 
            flexDirection: "row", 
            justifyContent: "center", 
            alignItems: "center"
        },
        likesImage: {
            height: 17,
            width: 17,
            resizeMode: "contain", 
            tintColor: colors.darkBlue, 
            marginRight: 5    
        },
        commentTileTime: {
            fontSize: 16,
            fontFamily: 'Inter',
            fontWeight: 400,
            color: colors.darkGrey,
            opacity: 0.5,
            paddingBottom: 15
        }
    });

    return(
        <View style= { {
            backgroundColor: colors.lightGrey, 
            height: window.height-80,
        } } >

            {/* Mitglieds-Profil */}
            { profileVisible && 
            <ProfileView
                userId= { viewedUserId }
                visible= { profileVisible }
                onDismiss= { () => { setProfileVisible(false) } }
                infoScreen= { true }
            />
            }
                
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
                                            changeAttribute = { (skills, currentCategory) => { changeSkillsHandler(skills, currentCategory) } }                                        />
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
                    {/* Idea Infos */}
                    <View style= { { paddingHorizontal: 15 } } >
                        <Text style={texts.subHeaderLarge}>{ ideaName }</Text>
                        { ideaText.length > 0 &&
                            <Text style={texts.copy}>{ideaText}</Text>
                        }
                        <Padding height= { 15 } />
                        <AttributePreviewTile
                            title={ideaInfo.interests.length > 0 ? "Gemeinsamkeiten" : "Passende Fähigkeiten"}
                            subtitle={currentSkills.length > 0 ? currentSkills.join(", ") : "\n"}
                            index={0}
                            onPress={() => navigation.navigate("IdeaAttributes", {filterList: currentSkills, secondaryFilterList: ideaInfo.interests, courseType: courseType, courseId: courseId, ideaId: ideaInfo.id, title: ideaInfo.interests.length > 0 ? "Gemeinsamkeiten" : "Passende Fähigkeiten"})}
                        />
                        {/* Memebers Icons */}
                        {members && members.length > 0 &&
                            <ScrollRow
                                data= { members }
                                onPress= { (id) => { viewProfileHandler(id) } }
                                // onEnter= { (num, id) => viewProfileInfoHandler(num, id) }
                            />
                        }
                    </View>
                    {/* Button-Leiste */}
                    <View style= { boxes.paddedRow } >
                        <ButtonMember/>
                        { currentUserIsCreator && !evaluated && 
                        <ButtonLarge
                            title="Idee bearbeiten"
                            icon={icons.edit}
                            onPress={() => setEditIdeaVisible(true)}
                        />
                        }
                        { currentUserIsCreator && !evaluated && courseType === "openCourses" && 
                        <ButtonLarge
                            title={"Team einteilen"}
                            icon={icons.fav}
                            onPress={setTeamHandler}
                        />
                        }
                        <ButtonSmall
                            title="Kommentar schreiben"
                            onPress={() => {setNewCommentVisible(true)}}
                        />
                    </View>
                    <Padding height= { 15 } />
                </View>
            </View>

            <ScrollView>
                {commentsLoading && 
                    <View style={{backgroundColor: "white", paddingVertical: 30}}>
                        <ActivityIndicator/>
                    </View>
                }
                
                {/* FlatList */}
                <FlatList 
                    data= { currentComments }
                    keyExtractor= { (item, index) => index.toString() }
                    renderItem= { (itemData) => { 
                        return (
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
                                onReply = { () => { setNewReplyVisible(true); setCurrentReplyComment(itemData.item) } }
                                onDelete = { () => { deleteCommentHandler(itemData.item.id) } }
                                onLike = { () => { likeCommentHandler(itemData.item.id) } }
                                currentUser = { currentUserId }
                            />
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
            </ScrollView>
            
            {/* Kommentar schreiben */}
            {newCommentVisible &&
            <View style= { [boxes.width, Styles.commentTile] } >
                <View style= { Styles.infoArea } >
                    <ProfileImage
                        userId= { currentUserId }
                        imageUrl= {currentUserImage}
                        onPress= { () => {} }
                    />
                </View>
                <View>
                    <Text style = { texts.commentTileHeader } >{ currentUserName }</Text>
                    <InputField
                        placeholderText= "max. 300 Zeichen"
                        value= { currentNewCommentText }
                        onChangeText= { changeNewCommentTextHandler }
                        multiline= { true }
                    />
                </View>
                <View style= { Styles.rightArea } >
                    <Text style= { Styles.commentTileTime } >{ new Date().toLocaleDateString('de-DE') }</Text>
                    
                    <ButtonLarge 
                        title="Kommentar senden"
                        onPress= { () => { pressNewCommentHandler(true) } }
                    />
                    <ButtonLarge
                        title={"Abbrechen"}
                        transparent={true}
                        onPress={ () => { 
                            setNewCommentVisible(false);
                            setCurrentCommentErrorVisible(false);
                        } }
                    />
                </View>
            </View>
            }

            {/* Auf Kommentar antworten */}
            {newReplyVisible &&
            <View style= { [boxes.width] } >
                
                <View style= { [Styles.repliedTile] } >
                    <View style= { Styles.infoArea } >
                        <ProfileImage
                            userId= { currentReplyComment.user }
                            imageUrl= { currentReplyComment.userUrl }
                            onPress= { () => { viewProfileHandler(currentReplyComment.user) } }
                        />
                        <View style= { Styles.likes } >
                            <Image
                                style= { Styles.likesImage }
                                height= { 17 }
                                width= { 17 }
                                source= { icons.like }
                            />
                            <Text style= { texts.copy } >{ currentReplyComment.likes.length }</Text>
                        </View>
                    </View>
                    <View>
                        <Text style = { texts.commentTileHeader } >{ currentReplyComment.name }</Text>
                        <Autolink 
                            linkStyle= { texts.link }
                            style = { texts.copy }
                            text= { currentReplyComment.text }
                        />
                    </View>
                    <View style= { Styles.rightArea } >            
                        <Text style = { Styles.commentTileTime } >{ currentReplyComment.time.toDate().toLocaleDateString('de-DE') }</Text>
                    </View>
                </View>
                
                <View style= { Styles.commentTile } >
                    <Image
                        style= { Styles.replyImage }
                        source= { icons.replyComment }
                        resizeMode= { "contain" }
                    />
                    <View style= { Styles.infoArea } >
                        <ProfileImage
                            userId= { currentUserId }
                            imageUrl= {currentUserImage}
                            onPress= { () => {} }
                        />
                    </View>
                    <View>
                        <Text style = { texts.commentTileHeader } >{ currentUserName }</Text>
                        <InputField
                            placeholderText= "max. 300 Zeichen"
                            value= { currentReplyText }
                            onChangeText= { changeReplyTextHandler }
                            multiline= { true }
                        />
                    </View>
                    <View style= { Styles.rightArea } >
                        <Text style= { Styles.commentTileTime } >{ new Date().toLocaleDateString('de-DE') }</Text>
                        
                        {/* <View style= { Styles.buttons } > */}
                            <ButtonLarge 
                                title="Kommentar senden"
                                onPress= { () => { pressReplyHandler(true) } }
                            />
                            <ButtonLarge
                                title={"Abbrechen"}
                                transparent={true}
                                onPress={ () => { 
                                    setNewReplyVisible(false);
                                    setCurrentCommentErrorVisible(false);
                                } }
                            />
                        {/* </View> */}
                    </View>
                </View>
            </View>
            }
        </View>
    )
}