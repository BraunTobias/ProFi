import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, Text, Modal, Keyboard, ActivityIndicator, Alert, Animated } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { compareAsc, format } from 'date-fns';
import Autolink from 'react-native-autolink';

import { icons, colors, boxes, texts } from '../Styles';
import DB from '../api/DB_API';
import InputField from '../components/InputField';
import SwipeButton from '../components/SwipeButton';
import SwipeButtonRow from '../components/SwipeButtonRow';
import ListTile from "../components/ListTile";
import ModalContent from "../components/ModalContent";
import Button from '../components/Button';
import ScrollRow from '../components/ScrollRow';
import AttributeSelect from '../components/AttributeSelect';
import ProfileView from '../components/ProfileView';
import AttributePreviewTile from '../components/AttributePreviewTile';
import Padding from '../components/Padding';
import SubHeader from '../components/SubHeader';
import FlexRow from '../components/FlexRow';

export default CourseScreen = ({route, navigation}) => {

    const {currentUserId} = route.params;
    const {courseInfo} = route.params;
    const courseType = courseInfo.courseType;

    // State Hooks
    const [currentIdeas, setCurrentIdeas] = useState([]);
    const [swipeListView, setSwipeListView] = useState();
    const [courseName, setCourseName] = useState(courseInfo.title);
    const [courseLink, setCourseLink] = useState(courseInfo.link);
    const [courseDate, setCourseDate] = useState(courseInfo.date ? courseInfo.date.toDate() : {});
    const [creator, setCreator] = useState("");
    const [members, setMembers] = useState(courseInfo.members);
    const [minMembers, setMinMembers] = useState(courseInfo.minMembers);
    const [maxMembers, setMaxMembers] = useState(courseInfo.maxMembers);
    const [userIsMember, setUserIsMember] = useState(courseInfo.userIsMember);
    const [userIsCreator, setUserIsCreator] = useState(false);
    const [currentFav, setCurrentFav] = useState("");
    const [currentNogo, setCurrentNogo] = useState("");
    const [courseDataLoading, setCourseDataLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // States für Auswertungs-Ansicht
    const [evaluating, setEvaluating] = useState(courseInfo.evaluating);
    const [evaluated, setEvaluated] = useState(courseInfo.evaluated);

    // State Hooks für Modals
    const [editCourseVisible, setEditCourseVisible] = useState(false);
    const [editCourseDateVisible, setEditCourseDateVisible] = useState(false);
    const [editCourseTimeVisible, setEditCourseTimeVisible] = useState(false);
    const [editCourseNameErrorVisible, setEditCourseNameErrorVisible] = useState(false);
    const [editCourseDateErrorVisible, setEditCourseDateErrorVisible] = useState(false);
    const [editCourseName, setEditCourseName] = useState(courseInfo.title);
    const [editCourseLink, setEditCourseLink] = useState(courseInfo.link);
    const [editCourseDate, setEditCourseDate] = useState(courseInfo.date ? courseInfo.date.toDate() : {});
    const [editCourseMinMembers, setEditCourseMinMembers] = useState(courseInfo.minMembers);
    const [editCourseMaxMembers, setEditCourseMaxMembers] = useState(courseInfo.maxMembers);
    const [newIdeaVisible, setNewIdeaVisible] = useState(false);
    const [addSkillsVisible, setAddSkillsVisible] = useState(false);
    const [selectedSkillsList, setSelectedSkillsList] = useState([]);
    const [currentNewIdeaName, setCurrentNewIdeaName] = useState("");
    const [currentNewIdeaText, setCurrentNewIdeaText] = useState("");
    const [favInfoVisible, setFavInfoVisible] = useState(false);
    const [nogoInfoVisible, setNogoInfoVisible] = useState(false);
    const [joinInfoVisible, setJoinInfoVisible] = useState(false);
    const [favInfoReceived, setFavInfoReceived] = useState(true);
    const [nogoInfoReceived, setNogoInfoReceived] = useState(true);
    const [joinInfoReceived, setJoinInfoReceived] = useState(true);
    const [newIdeaNameErrorVisible, setNewIdeaNameErrorVisible] = useState(false);
    const [newIdeaTextErrorVisible, setNewIdeaTextErrorVisible] = useState(false);
    const [selectedSkillsListErrorVisible, setSelectedSkillsListErrorVisible] = useState(false);

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
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: courseInfo.id,
        });
    }, [navigation]);

    const getCourseData = () => {
        DB.getCourseData(courseInfo.id, (data) => {
            setUserIsCreator(data.creator == currentUserId);
            setCreator(data.creatorName);
            setMembers(data.members);
            setEvaluated(data.evaluated);
            setEvaluating(data.evaluating);
        });    
    }

    // Wird nach dem Rendern ausgeführt
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (courseType == "courses") {
                getCourseData();
                DB.getInfoReceived("favourites", (isReceived) => {
                    setFavInfoReceived(isReceived);
                });
                DB.getInfoReceived("nogos", (isReceived) => {
                    setNogoInfoReceived(isReceived);
                });
                DB.getInfoReceived("joinCourse", (isReceived) => {
                    setJoinInfoReceived(isReceived);
                });        
            }

            DB.getIdeasList(courseInfo.id, courseType, (ideasList, myFavourite, myNogo) => {
                setCurrentIdeas(ideasList);
                setCurrentFav(myFavourite);
                setCurrentNogo(myNogo);
                setCourseDataLoading(false);
            });
        });
    }, []);

    const addFavHandler = (ideaId) => {
        if (!favInfoReceived) {
            setFavInfoVisible(true); 
        } else {
            swipeListView.safeCloseOpenRow();
            if (currentFav == ideaId) {
                DB.deletePref("favourites", courseInfo.id, () => {
                    setCurrentFav("");
                });
            } else {
                DB.addPref("favourites", courseInfo.id, ideaId, () => {
                    setCurrentFav(ideaId);
                    if (currentNogo == ideaId) setCurrentNogo("");
                });
            }
        }
    }
    const addNogoHandler = (ideaId) => {
        if (!nogoInfoReceived) {
            setNogoInfoVisible(true); 
        } else {
            swipeListView.safeCloseOpenRow();
            if (currentNogo == ideaId) {
                DB.deletePref("nogos", courseInfo.id, () => {
                    setCurrentNogo("");
                });
            } else {
                DB.addPref("nogos", courseInfo.id, ideaId, () => {
                    setCurrentNogo(ideaId);
                    if (currentFav == ideaId) {
                        setCurrentFav("");
                    }
                });
            }
        }
    }
    const joinCourseHandler = () => {
        if (!joinInfoReceived) {
            setJoinInfoVisible(true); 
        } else {
            if (!userIsMember) {
                DB.joinCourse(courseInfo.id, () => {
                    setUserIsMember(true);
                    getCourseData();
                }, (e) => {console.log(e)})
            } else {
                DB.exitCourse(courseInfo.id, () => {
                    setUserIsMember(false);
                    getCourseData();
                })
            }
        }
    }

    const viewProfileHandler = (id) => {
        setViewedUserId(id);
        setProfileVisible(true);
    }

    // Handler für Modals
    const pressNewIdeaHandler = (committed) => {
        if (committed) {
            if (currentNewIdeaName.length > 1 && currentNewIdeaText.length > 1 && selectedSkillsList.length > 0) {
                DB.addIdea(courseInfo.id, courseType, currentNewIdeaName, currentNewIdeaText, selectedSkillsList, [], () => {
                    setNewIdeaVisible(false);
                    setCurrentNewIdeaName("");
                    setCurrentNewIdeaText("");    
                    setSelectedSkillsList([]);
                    DB.getIdeasList(courseInfo.id, courseType, (ideasList) => {
                        setCurrentIdeas(ideasList);
                    });
                }, (error) => {setCurrentWarning(error)});
            }
            if (currentNewIdeaName.length <= 1) setNewIdeaNameErrorVisible(true);
            if (currentNewIdeaText.length <= 1) setNewIdeaTextErrorVisible(true);
            if (selectedSkillsList.length == 0) setSelectedSkillsListErrorVisible(true);
        } else {
            setNewIdeaVisible(false);
            setCurrentNewIdeaName("");
            setCurrentNewIdeaText("");    
            setNewIdeaNameErrorVisible(false);    
            setNewIdeaTextErrorVisible(false);
            setSelectedSkillsListErrorVisible(false);
            setSelectedSkillsList([]);
        }
    }
    const changeNewIdeaNameHandler = (enteredText) => {
        setCurrentNewIdeaName(enteredText);
        if (enteredText.length > 1) setNewIdeaNameErrorVisible(false);
    }
    const changeNewIdeaTextHandler = (enteredText) => {
        setCurrentNewIdeaText(enteredText);
        if (enteredText.length > 1) setNewIdeaTextErrorVisible(false);
    }

    const addSkillHandler = (skill) => {
        if (selectedSkillsList.indexOf(skill) < 0) {
            selectedSkillsList.push(skill);
        } else {
            setSelectedSkillsList(selectedSkillsList.filter(item => item !== skill));
        }
        if (selectedSkillsList.length > 0) setSelectedSkillsListErrorVisible(false);
    }

    const pressEditCourseHandler = (committed) => {
        if (committed) {
            if (editCourseName.length > 1 && editCourseDate - (new Date()) >= 0) {
                DB.editCourse(courseInfo.id, editCourseName, editCourseLink, editCourseDate, editCourseMinMembers, editCourseMaxMembers, () => {
                    setEditCourseVisible(false);
                    setEditCourseNameErrorVisible(false);
                    setEditCourseDateErrorVisible(false);
                    setCourseName(editCourseName);
                    setCourseLink(editCourseLink);
                    setCourseDate(editCourseDate);
                    setMinMembers(editCourseMinMembers);
                    setMaxMembers(editCourseMaxMembers);
                }, () => {
                    Alert.alert(
                        "Fehler",
                        "Kurs konnte nicht bearbeitet werden",
                        [{ text: "OK", onPress: () => {}}],
                    );              
                });
            }
            if (editCourseName.length == "") setEditCourseNameErrorVisible(true);
            if (editCourseDate - (new Date()) < 0) setEditCourseDateErrorVisible(true);
        } else {
            setEditCourseVisible(false);
            setEditCourseNameErrorVisible(false);
            setEditCourseDateErrorVisible(false);
            setEditCourseName(courseName);
            setEditCourseDate(courseDate);
            setEditCourseMinMembers(minMembers);
            setEditCourseMaxMembers(maxMembers);
        }
    }
    const changeEditCourseNameHandler = (enteredText) => {
        setEditCourseName(enteredText);
        if (enteredText != "") setEditCourseNameErrorVisible(false);
    }
    const changeEditCourseLinkHandler = (enteredText) => {
        setEditCourseLink(enteredText);
    }
    const changeEditCourseDateHandler = (date) => {
        setEditCourseDate(date);
        setEditCourseDateVisible(false);
        setEditCourseTimeVisible(false);
        if (date - (new Date()) < 0) setEditCourseDateErrorVisible(true);
        else setEditCourseDateErrorVisible(false);
    }
    const changeEditCourseMinMembersHandler = (number) => {
        setEditCourseMinMembers(number);
        if (number > editCourseMaxMembers) setEditCourseMaxMembers(number);
    }
    const changeEditCourseMaxMembersHandler = (number) => {
        setEditCourseMaxMembers(number);
        if (number < editCourseMinMembers) setEditCourseMinMembers(number);
    }

    const refreshListHandler = () => {
        setRefreshing(true);
        if (courseType == "courses") {
            getCourseData();
        }
        DB.getIdeasList(courseInfo.id, courseType, (ideasList, myFavourite, myNogo) => {
            setCurrentIdeas(ideasList);
            setCurrentFav(myFavourite);
            setCurrentNogo(myNogo);
            setRefreshing(false);
        });    
    };

    const selectIdeaHandler = (ideaInfo) => {
        swipeListView.safeCloseOpenRow();
        navigation.navigate("Idea", {
            ideaInfo: ideaInfo, 
            evaluated: evaluated,
            courseType: courseType,
            courseId: courseInfo.id, 
            currentUserId: currentUserId,
        });
    }

    return(
        <View style={{flex:1}}>
            <InfoModal 
                visible={joinInfoVisible}
                onPress={() => {setJoinInfoVisible(false); DB.setInfoReceived("joinCourse"); setJoinInfoReceived(true);}}
                title="Einem Kurs beitreten"
                copy="Wenn du diesem Kurs beitrittst, wirst du bei der Ideenverteilung berücksichtigt. Du kannst jederzeit wieder austreten und dir den Kurs weiter angucken. Aber achte darauf, dass du am oben angegebenen Datum dem Kurs beigetreten bist, um zugeteilt zu werden."
            />
            <InfoModal 
                visible={favInfoVisible}
                onPress={() => {setFavInfoVisible(false); DB.setInfoReceived("favourites"); setFavInfoReceived(true);}}
                title="Favoriten setzen"
                copy="Wenn du eine Idee als Favorit markierst, erhöht sich die Chance, dass du dieser zugeteilt wirst. Du kannst einen Favoriten pro Kurs setzen. Sobald du eine andere Idee favorisierst, wird dein alter Favorit entfernt."
            />
            <InfoModal 
                visible={nogoInfoVisible}
                onPress={() => {setNogoInfoVisible(false); DB.setInfoReceived("nogos"); setNogoInfoReceived(true);}}
                title="No-Go setzen"
                copy="Wenn du eine Idee als No-Go markierst, wirst du dieser auf keinen Fall zugeteilt. Du kannst ein No-Go pro Kurs setzen. Sobald du eine andere Idee als No-Go markierst, wird dein altes No-Go entfernt."
            />

            {profileVisible &&
                <ProfileView
                    userId={viewedUserId}
                    visible={profileVisible}
                    onDismiss={() => {setProfileVisible(false)}}
                />
            }
            {/* Kurs bearbeiten */}
            <Modal visible= { editCourseVisible } animationType= 'slide' onRequestClose={() => setEditCourseVisible(false)}>
                <ModalContent
                    subheader= { () => {}}
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={texts.titleCentered}>{"Kurs bearbeiten"}</Text>
                                <InputField
                                    title="Kursname"
                                    showError={editCourseNameErrorVisible}
                                    placeholderText= {editCourseNameErrorVisible ? "Bitte einen Kursnamen angeben." : "Kursname"}
                                    value={editCourseName}
                                    onChangeText={changeEditCourseNameHandler}
                                />
                                <InputField
                                    title="Emil-Link"
                                    placeholderText= {"Hier Link einsetzen"}
                                    value={editCourseLink}
                                    onChangeText={changeEditCourseLinkHandler}
                                />
                                <InputField
                                    title= "Team-Einteilung"
                                    isButton= {true}
                                    showError={editCourseDateErrorVisible}
                                    icon={icons.date}
                                    placeholderText= "Datum auswählen …"
                                    value={format(editCourseDate, "dd.MM.yyyy")}
                                    onPress={() => {setEditCourseDateVisible(true); Keyboard.dismiss()}}
                                />
                                {editCourseDateErrorVisible &&
                                    <FlexRow>
                                        Das Datum muss in der Zukunft liegen.
                                    </FlexRow>
                                }
                                <DateTimePickerModal
                                    isVisible={editCourseDateVisible}
                                    mode="date"
                                    date = {editCourseDate}
                                    headerTextIOS="Datum auswählen"
                                    cancelTextIOS="Abbrechen"
                                    confirmTextIOS="OK"
                                    onConfirm={changeEditCourseDateHandler}
                                    onCancel={() => {setEditCourseDateVisible(false)}}
                                />
                                <InputField
                                    isButton={true}
                                    icon={icons.time}
                                    placeholderText= "Uhrzeit auswählen …"
                                    value={format(editCourseDate, "hh:mm")}
                                    onPress={() => {setEditCourseTimeVisible(true); Keyboard.dismiss()}}
                                />
                                <DateTimePickerModal
                                    isVisible={editCourseTimeVisible}
                                    date={editCourseDate}
                                    mode="time"
                                    headerTextIOS="Uhrzeit auswählen"
                                    cancelTextIOS="Abbrechen"
                                    confirmTextIOS="OK"
                                    onConfirm={changeEditCourseDateHandler}
                                    onCancel={() => {setEditCourseTimeVisible(false)}}
                                />
                                <FlexRow>
                                    <NumberInput
                                        title= {"Mitglieder min."}
                                        value= {editCourseMinMembers}
                                        onChange={changeEditCourseMinMembersHandler}
                                    />
                                    <Padding width={10}/>
                                    <NumberInput
                                        title= {"Mitglieder max."}
                                        value= {editCourseMaxMembers}
                                        onChange={changeEditCourseMaxMembersHandler}
                                    />
                                </FlexRow>
                            </View> 
                        )
                    }}
                    onDismiss= {pressEditCourseHandler}
                />
            </Modal>


            {/* Idee erstellen */}
            <Modal visible= { newIdeaVisible } animationType= 'slide' onRequestClose={() => setNewIdeaVisible(false)}>
                <ModalContent
                    subheader= { () => {}}
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={texts.titleCentered}>{"Idee hinzufügen"}</Text>
                                <InputField
                                    showError={newIdeaNameErrorVisible}
                                    placeholderText= {newIdeaNameErrorVisible ? "Bitte einen Namen angeben." : "Titel"}
                                    value={currentNewIdeaName}
                                    onChangeText={changeNewIdeaNameHandler}
                                />
                                <InputField
                                    showError={newIdeaTextErrorVisible}
                                    placeholderText= {newIdeaTextErrorVisible ? "Bitte einen Beschreibungstext angeben." : "Beschreibung"}
                                    value={currentNewIdeaText}
                                    onChangeText={changeNewIdeaTextHandler}
                                    multiline={true}
                                />
                                <AttributePreviewTile
                                    showError={selectedSkillsListErrorVisible}
                                    title="Passende Fähigkeiten"
                                    subtitle={selectedSkillsListErrorVisible ? "Bitte mindestens eine Fähigkeit angeben." : selectedSkillsList.length > 0 ? selectedSkillsList.join(", ") : ""}
                                    index={0}
                                    onPress={() => {setAddSkillsVisible(true)}}
                                />
                            </View> 
                        )
                    }}
                    onDismiss= {pressNewIdeaHandler}
                />

                {/* // Idee hinzufügen: Fähigkeiten auswählen */}
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

                    
            <SubHeader>
                { (courseType == "courses") &&
                <View>
                    <View>
                        <FlexRow padding>
                            <Text style={texts.subHeader}>{courseName}</Text>
                            <Text style={texts.subHeader}>{minMembers == maxMembers ? maxMembers + " Personen" : minMembers + "-" + maxMembers + " Personen"}</Text>
                        </FlexRow>
                        <FlexRow padding>
                            <Text style={texts.subHeader}>{format(courseDate, "dd.MM.yyyy")}</Text>
                            <Text style={texts.subHeader}>{creator}</Text>
                        </FlexRow>
                        { typeof courseLink !== 'undefined' && courseLink != "" &&
                                <FlexRow padding>
                                    <Autolink 
                                        linkStyle={texts.link}
                                        style={texts.subHeader}
                                        text={courseLink}
                                    />
                                </FlexRow>
                        }
                        <Padding height={5}/>
                        { members.length > 0 &&
                            <ScrollRow
                                data= {members}
                                onPress={viewProfileHandler}
                            />
                        }
                    </View>
                    { !evaluated && !evaluating &&
                    <FlexRow padding>
                        <Button
                            title={userIsMember ? "Mitglied" : "Beitreten"}
                            icon={userIsMember ? icons.checkTrue : icons.checkFalse}
                            onPress={joinCourseHandler}
                        />
                        <Padding width={10}/>
                        <Button
                            title={"Neue Idee"}
                            icon={icons.plus}
                            onPress={() => {setNewIdeaVisible(true)}}
                        />
                    </FlexRow>
                    }
                    { userIsCreator && !evaluated && !evaluating &&
                    <FlexRow padding>
                        <Button
                            title={"Kurs bearbeiten"}
                            onPress={() => {setEditCourseVisible(true)}}
                        />
                    </FlexRow>
                    }
                </View>
                }
                { (courseType == "openCourses") &&
                    <FlexRow padding>
                        <Button
                            title={"Neue Idee"}
                            icon={icons.plus}
                            onPress={() => {setNewIdeaVisible(true)}}
                        />
                    </FlexRow>
                }
            </SubHeader>

            <SwipeListView
                style={{backgroundColor: colors.white}}
                ref = {ref => setSwipeListView(ref)}
                data={currentIdeas}
                disableLeftSwipe = {true}
                disableRightSwipe = {evaluated || evaluating || courseType == "openCourses"}
                keyExtractor={(item, index) => index.toString()}
                onSwipeValueChange={onSwipeValueChange}
                onRefresh={refreshListHandler}
                refreshing={refreshing}
                renderItem={({item, index}) => 
                        <ListTile
                            onPress={() => {selectIdeaHandler(item)}} 
                            id={item.id}
                            title={item.title}
                            subtitle={item.description}
                            skills={item.skills}
                            isFavourite={item.id == currentFav}
                            isNogo={item.id == currentNogo}
                            index = {index}
                            myTeam={item.myTeam}
                            isMember={item.userIsMember}
                            inactive = {evaluated && (!item.team || item.team.length == 0)}
                            // warning = {item.warning}
                            warning = {evaluated && item.team && item.team.length > 0 && (item.team.length < minMembers || item.team.length > maxMembers)}
                        />
                }
                renderHiddenItem={ ({item, index}) => 
                    <SwipeButtonRow>
                        <SwipeButton
                            rowWidth={120}
                            icon={icons.fav}
                            animation={rowSwipeAnimatedValues[index]}
                            backgroundColor={colors.darkBlue}
                            onPress={(ref) => {addFavHandler(item.id)}}
                            deactivated={item.id == currentFav}
                        />
                        <SwipeButton
                            rowWidth={120}
                            icon={icons.nogo}
                            animation={rowSwipeAnimatedValues[index]}
                            backgroundColor={colors.red}
                            onPress={(ref) => {addNogoHandler(item.id)}}
                            deactivated={item.id == currentNogo}
                        />
                    </SwipeButtonRow>
                }
                leftOpenValue={evaluated ? 0 : 120}
                ListFooterComponent={
                    <View>
                        {courseDataLoading && 
                            <View style={{backgroundColor: colors.white, paddingVertical: 30}}>
                                <ActivityIndicator/>
                            </View>
                        }
                    </View>
                }
            />

        </View>
    )
}