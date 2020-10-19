import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, Text, Modal, Keyboard } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

import { icons, colors, boxes, texts } from '../Styles';
import DB from '../api/DB_API';
import InputField from '../components/InputField';
import ButtonSmall from '../components/ButtonSmall';
import SwipeButton from '../components/SwipeButton';
import ListTile from "../components/ListTile";
import ModalContent from "../components/ModalContent";
import ButtonLarge from '../components/ButtonLarge';
import ScrollRow from '../components/ScrollRow';
import AttributeSelect from '../components/AttributeSelect';
import ProfileView from '../components/ProfileView';
import AttributePreviewTile from '../components/AttributePreviewTile';

export default CourseScreen = ({route, navigation}) => {

    const {itemId} = route.params;
    const {itemTitle} = route.params;
    const {itemDate} = route.params;
    const {isMember} = route.params;
    const currentUserId = DB.getCurrentUserId();

    // State Hooks
    const [currentIdeas, setCurrentIdeas] = useState([]);
    const [swipeListView, setSwipeListView] = useState();
    const [founderId, setFounderId] = useState("");
    const [founder, setFounder] = useState("");
    const [members, setMembers] = useState([]);
    const [minMembers, setMinMembers] = useState(0);
    const [maxMembers, setMaxMembers] = useState(0);
    const [userIsMember, setUserIsMember] = useState(isMember);
    const [currentFav, setCurrentFav] = useState();
    const [currentNogo, setCurrentNogo] = useState();

    // States für Auswertungs-Ansicht
    const [evaluating, setEvaluating] = useState(false);
    const [evaluated, setEvaluated] = useState(false);

    // State Hooks für Modals
    const [newIdeaVisible, setNewIdeaVisible] = useState(false);
    const [addSkillsVisible, setAddSkillsVisible] = useState(false);
    const [selectedSkillsList, setSelectedSkillsList] = useState([]);
    const [currentNewIdeaName, setCurrentNewIdeaName] = useState("");
    const [currentNewIdeaText, setCurrentNewIdeaText] = useState("");

    // State Hooks für Profilansicht
    const [viewedUserId, setViewedUserId] = useState(currentUserId);
    const [profileVisible, setProfileVisible] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: itemId,
        });
    }, [navigation]);

    const getCourseData = () => {
        DB.getCourseData(itemId, (data) => {
            setFounderId(data.founder);
            setMinMembers(data.minMembers);
            setMaxMembers(data.maxMembers);
            if (data.members && data.members.length > 0) {
                const memberUidList = data.members;
                var newMembersList = [];
                for (const member in memberUidList) {
                    const uid = memberUidList[member];
                    DB.getUserInfoById(uid, (name, url) => {
                        newMembersList.push({
                            "userId": uid,
                            "username": name,
                            "imageUrl": url
                        });
                        setMembers(newMembersList);
                    });
                }
            } else {
                setMembers([]);
            }
            DB.getUserInfoById (data.founder, (userName, userImage, bio, email) => {
                setFounder(userName);
            });
        });    
    }

    // Wird nach dem Rendern ausgeführt
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getCourseData();
            DB.getIdeasList(itemId, (ideasList) => {
                setCurrentIdeas(ideasList);
                for (const idea in ideasList) {
                    if (ideasList[idea].favourites != null && ideasList[idea].favourites.indexOf(currentUserId) >= 0) {
                        setCurrentFav(ideasList[idea].id);
                    } else if (ideasList[idea].nogos != null && ideasList[idea].nogos.indexOf(currentUserId) >= 0) {
                        setCurrentNogo(ideasList[idea].id);
                    }
                }
            });
        });
    }, []);

    const addFavHandler = (ideaId) => {
        swipeListView.safeCloseOpenRow();
        if (currentFav == ideaId) {
            DB.deletePref("favourites", itemId, () => {
                setCurrentFav("");
            });
        } else {
            DB.addPref("favourites", itemId, ideaId, () => {
                setCurrentFav(ideaId);
                if (currentNogo == ideaId) {
                    setCurrentNogo("");
                }
            });
        }
    }
    const addNogoHandler = (ideaId) => {
        swipeListView.safeCloseOpenRow();
        if (currentNogo == ideaId) {
            DB.deletePref("nogos", itemId, () => {
                setCurrentNogo("");
            });
        } else {
            DB.addPref("nogos", itemId, ideaId, () => {
                setCurrentNogo(ideaId);
                if (currentFav == ideaId) {
                    setCurrentFav("");
                }
            });
        }
    }
    const joinCourseHandler = () => {
        if (!userIsMember) {
            DB.joinCourse(itemId, () => {
                setUserIsMember(true);
                getCourseData();
            }, () => {console.log("error")})
        } else {
            DB.exitCourse(itemId, () => {
                setUserIsMember(false);
                getCourseData();
            })
        }
    }

    const viewProfileHandler = (id) => {
        setViewedUserId(id);
        setProfileVisible(true);
    }

    // Handler für Modals
    const pressNewIdeaHandler = () => {
        DB.addIdea(itemId, currentNewIdeaName, currentNewIdeaText, selectedSkillsList, [], () => {
            setNewIdeaVisible(false);
            setCurrentNewIdeaName("");
            setCurrentNewIdeaText("");    
            setSelectedSkillsList("");
            DB.getIdeasList(itemId, (ideasList) => {
                setCurrentIdeas(ideasList);
            });
    }, (error) => {setCurrentWarning(error)});
    }
    const changeNewIdeaNameHandler = (enteredText) => {
        setCurrentNewIdeaName(enteredText);
    }
    const changeNewIdeaTextHandler = (enteredText) => {
        setCurrentNewIdeaText(enteredText);
    }

    const addSkillHandler = (skill) => {
        var oldList = selectedSkillsList;
        if (oldList.indexOf(skill) < 0) {
            oldList.push(skill);
        } else {
            var newList = oldList.filter(item => item !== skill);
            setSelectedSkillsList(newList);
        }
    }

    const selectIdeaHandler = (id, title, description, skills) => {
        swipeListView.safeCloseOpenRow();
        navigation.navigate("Idea", {itemId: id, itemTitle: title, itemDescription: description, skillsList: skills, courseId: itemId});
    }

    const buttonRow = () => {
        if (!evaluated) {
            return(
                <View style={ boxes.paddedRow }>
                    <ButtonSmall
                        title={userIsMember ? "Mitglied" : "Beitreten"}
                        icon={userIsMember ? "checkTrue" : "checkFalse"}
                        onPress={joinCourseHandler}
                    />
                    <ButtonSmall
                        title={"Neue Idee"}
                        icon={"plus"}
                        onPress={() => {setNewIdeaVisible(true)}}
                    />
                </View>
        )} else { return null }
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
            <Modal visible= { newIdeaVisible } animationType= 'slide'>
                <ModalContent
                    subheader= { () => {}}
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={texts.titleCentered}>{"Idee hinzufügen"}</Text>
                                <InputField
                                    placeholderText= "Titel"
                                    value={currentNewIdeaName}
                                    onChangeText={changeNewIdeaNameHandler}
                                />
                                <InputField
                                    placeholderText= "Beschreibung"
                                    value={currentNewIdeaText}
                                    onChangeText={changeNewIdeaTextHandler}
                                    multiline={true}
                                />
                                <AttributePreviewTile
                                    title="Passende Fähigkeiten"
                                    subtitle={selectedSkillsList.join(", ")}
                                    index={0}
                                    onPress={() => {setAddSkillsVisible(true)}}
                                />
                            </View> 
                        )
                    }}
                    onDismiss= {(committed) => {pressNewIdeaHandler(committed)}}
                />

                {/* // Idee hinzufügen: Fähigkeiten auswählen */}
                <Modal visible={addSkillsVisible} animationType='slide'>
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
                    <Text style={texts.subHeader}>{itemTitle}</Text>
                    <Text style={texts.subHeader}>{minMembers + "-" + maxMembers + " Personen"}</Text>
                </View>
                <View style={ boxes.paddedRow }>
                    <Text style={texts.subHeader}>{itemDate}</Text>
                    <Text style={texts.subHeader}>{founder}</Text>
                </View>
                <ScrollRow
                    data= {members}
                    onPress={(id) => {viewProfileHandler(id)}}
                />

                {buttonRow()}
            </View>

            <SwipeListView
                style={{backgroundColor: "white"}}
                ref = {ref => setSwipeListView(ref)}
                data={currentIdeas}
                disableLeftSwipe = {true}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(itemData) => 
                        <ListTile
                            onPress={() => {selectIdeaHandler(itemData.item.id, itemData.item.title, itemData.item.description, itemData.item.skills)}} 
                            id={itemData.item.id}
                            title={itemData.item.title}
                            subtitle={itemData.item.description}
                            skills={itemData.item.skills}
                            isFavourite={itemData.item.id == currentFav}
                            isNogo={itemData.item.id == currentNogo}
                            index = {itemData.index}
                        />
                }
                renderHiddenItem={ (itemData) => 
                        <View style={boxes.swipeRowTwo}>
                            <SwipeButton
                                icon={icons.fav}
                                backgroundColor={colors.darkBlue}
                                onPress={(ref) => {addFavHandler(itemData.item.id)}}
                            />
                            <SwipeButton
                                icon={icons.nogo}
                                backgroundColor={colors.red}
                                onPress={(ref) => {addNogoHandler(itemData.item.id)}}
                            />
                        </View>
                }
                leftOpenValue={120}
            />

        </View>
    )
}