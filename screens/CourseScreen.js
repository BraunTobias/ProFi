import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, Text, Modal, Keyboard, ActivityIndicator, Alert, Animated } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from '@react-native-community/async-storage';
import { compareAsc, format } from 'date-fns';

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

    const {currentUserId} = route.params;
    const {courseInfo} = route.params;

    // State Hooks
    const [currentIdeas, setCurrentIdeas] = useState([]);
    const [swipeListView, setSwipeListView] = useState();
    const [courseName, setCourseName] = useState(courseInfo.title);
    const [courseDate, setCourseDate] = useState(courseInfo.date.toDate());
    const [creator, setCreator] = useState("");
    const [members, setMembers] = useState([]);
    const [minMembers, setMinMembers] = useState(0);
    const [maxMembers, setMaxMembers] = useState(0);
    const [userIsMember, setUserIsMember] = useState(courseInfo.userIsMember);
    const [userIsCreator, setUserIsCreator] = useState(false);
    const [currentFav, setCurrentFav] = useState();
    const [currentNogo, setCurrentNogo] = useState();
    const [courseDataLoading, setCourseDataLoading] = useState(true);

    // States für Auswertungs-Ansicht
    const [evaluating, setEvaluating] = useState(false);
    const [evaluated, setEvaluated] = useState(courseInfo.evaluated);

    // State Hooks für Modals
    const [editCourseVisible, setEditCourseVisible] = useState(false);
    const [editCourseDateVisible, setEditCourseDateVisible] = useState(false);
    const [editCourseTimeVisible, setEditCourseTimeVisible] = useState(false);
    const [editCourseNameErrorVisible, setEditCourseNameErrorVisible] = useState(false);
    const [editCourseDateErrorVisible, setEditCourseDateErrorVisible] = useState(false);
    const [editCourseName, setEditCourseName] = useState(courseInfo.title);
    const [editCourseDate, setEditCourseDate] = useState(courseInfo.date.toDate());
    const [editCourseMinMembers, setEditCourseMinMembers] = useState(0);
    const [editCourseMaxMembers, setEditCourseMaxMembers] = useState(0);
    const [newIdeaVisible, setNewIdeaVisible] = useState(false);
    const [addSkillsVisible, setAddSkillsVisible] = useState(false);
    const [selectedSkillsList, setSelectedSkillsList] = useState([]);
    const [currentNewIdeaName, setCurrentNewIdeaName] = useState("");
    const [currentNewIdeaText, setCurrentNewIdeaText] = useState("");
    const [favInfoVisible, setFavInfoVisible] = useState(false);
    const [nogoInfoVisible, setNogoInfoVisible] = useState(false);
    const [joinInfoVisible, setJoinInfoVisible] = useState(false);
    const [favInfoReceived, setFavInfoReceived] = useState(false);
    const [nogoInfoReceived, setNogoInfoReceived] = useState(false);
    const [joinInfoReceived, setJoinInfoReceived] = useState(false);
    const [newIdeaNameErrorVisible, setNewIdeaNameErrorVisible] = useState(false);
    const [newIdeaTextErrorVisible, setNewIdeaTextErrorVisible] = useState(false);
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
    };
    
    // Für Info-Modal
    const storeInfoReceived = async (info) => {
        try {
          await AsyncStorage.setItem(info, currentUserId);
        } catch(e) {console.log(e);}
    }
    const getInfoReceived = async () => {
        try {
          const favInfo = await AsyncStorage.getItem("favInfoReceived");
          if(favInfo == currentUserId) setFavInfoReceived(true); 
          const nogoInfo = await AsyncStorage.getItem("nogoInfoReceived");
          if(nogoInfo == currentUserId) setNogoInfoReceived(true);
          const joinInfo = await AsyncStorage.getItem("joinInfoReceived");
          if(joinInfo == currentUserId) setJoinInfoReceived(true);
        } catch(e) {console.log(e);}
      }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: courseInfo.id,
        });
    }, [navigation]);

    const getCourseData = () => {
        DB.getCourseData(courseInfo.id, (data) => {
            setCreator(data.creatorName);
            setMinMembers(data.minMembers);
            setMaxMembers(data.maxMembers);
            setEditCourseMinMembers(data.minMembers);
            setEditCourseMaxMembers(data.maxMembers);
            setMembers(data.members);
            setEvaluated(data.evaluated);
            setCourseDataLoading(false);
            setUserIsCreator(data.creator == currentUserId);
        });    
    }

    // Wird nach dem Rendern ausgeführt
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getCourseData();
            DB.getIdeasList(courseInfo.id, "courses", (ideasList) => {
                setCurrentIdeas(ideasList);
                for (const idea in ideasList) {
                    if (ideasList[idea].favourites && ideasList[idea].favourites.indexOf(currentUserId) >= 0) {
                        setCurrentFav(ideasList[idea].id);
                    } else if (ideasList[idea].nogos && ideasList[idea].nogos.indexOf(currentUserId) >= 0) {
                        setCurrentNogo(ideasList[idea].id);
                    }
                }
            });
            getInfoReceived();
        });
    }, []);

    const addFavHandler = (ideaId, index) => {
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
    const addNogoHandler = (ideaId, index) => {
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
                DB.addIdea(courseInfo.id, currentNewIdeaName, currentNewIdeaText, selectedSkillsList, [], () => {
                    setNewIdeaVisible(false);
                    setCurrentNewIdeaName("");
                    setCurrentNewIdeaText("");    
                    setSelectedSkillsList([]);
                    DB.getIdeasList(courseInfo.id, "courses", (ideasList) => {
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
                DB.editCourse(courseInfo.id, editCourseName, editCourseDate, editCourseMinMembers, editCourseMaxMembers, () => {
                    setEditCourseVisible(false);
                    setEditCourseNameErrorVisible(false);
                    setEditCourseDateErrorVisible(false);
                    setCourseName(editCourseName);
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

    const setTeamsHandler = () => {

    }

    const selectIdeaHandler = (item) => {
        swipeListView.safeCloseOpenRow();
        navigation.navigate("Idea", {
            itemId: item.id, 
            itemTitle: item.title, 
            itemDescription: item.description, 
            evaluated: evaluated,
            skillsList: item.skills, 
            courseId: courseInfo.id, 
            currentUserId: currentUserId,
            myTeam: item.myTeam});
    }

    return(
        <View style={{flex:1}}>
            <InfoModal 
                visible={joinInfoVisible}
                onPress={() => {setJoinInfoVisible(false); storeInfoReceived("joinInfoReceived"); setJoinInfoReceived(true);}}
                title="Einem Kurs beitreten"
                copy="Wenn du diesem Kurs beitrittst, wirst du bei der Ideenverteilung berücksichtigt. Du kannst jederzeit wieder austreten und dir den Kurs weiter angucken. Aber achte darauf, dass du am oben angegebenen Datum dem Kurs beigetreten bist, um zugeteilt zu werden."
            />
            <InfoModal 
                visible={favInfoVisible}
                onPress={() => {setFavInfoVisible(false); storeInfoReceived("favInfoReceived"); setFavInfoReceived(true);}}
                title="Favoriten setzen"
                copy="Wenn du eine Idee als Favorit markierst, erhöht sich die Chance, dass du dieser zugeteilt wirst. Du kannst einen Favoriten pro Kurs setzen. Sobald du eine andere Idee favorisierst, wird dein alter Favorit entfernt."
            />
            <InfoModal 
                visible={nogoInfoVisible}
                onPress={() => {setNogoInfoVisible(false); storeInfoReceived("nogoInfoReceived"); setNogoInfoReceived(true);}}
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
                                    title= "Team-Einteilung"
                                    isButton= {true}
                                    showError={editCourseDateErrorVisible}
                                    icon={icons.date}
                                    placeholderText= "Datum auswählen …"
                                    value={format(editCourseDate, "dd.MM.yyyy")}
                                    onPress={() => {setEditCourseDateVisible(true); Keyboard.dismiss()}}
                                />
                                {editCourseDateErrorVisible &&
                                    <Text style={[boxes.unPaddedRow, texts.errorLine]}>
                                        Das Datum muss in der Zukunft liegen.
                                    </Text>
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
                                <View style={boxes.unPaddedRow}>
                                    <NumberInput
                                        title= {"Mitglieder min."}
                                        value= {editCourseMinMembers}
                                        onChange={changeEditCourseMinMembersHandler}
                                        />
                                    <NumberInput
                                        title= {"Mitglieder max."}
                                        value= {editCourseMaxMembers}
                                        onChange={changeEditCourseMaxMembersHandler}
                                    />
                                </View>
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


            <View style={ boxes.subHeader }>
                <View>
                    <View style={ boxes.paddedRow }>
                        <Text style={texts.subHeader}>{courseName}</Text>
                        <Text style={texts.subHeader}>{minMembers + "-" + maxMembers + " Personen"}</Text>
                    </View>
                    <View style={ boxes.paddedRow }>
                        <Text style={texts.subHeader}>{format(courseDate, "dd.MM.yyyy")}</Text>
                        <Text style={texts.subHeader}>{creator}</Text>
                    </View>
                    {!courseDataLoading && members.length > 0 &&
                        <ScrollRow
                            data= {members}
                            onPress={viewProfileHandler}
                        />
                    }
                </View>
                
                {courseDataLoading && 
                <View style={{height: 80, justifyContent: "center"}}>
                    <ActivityIndicator/>
                </View>
                }  
                { !evaluated &&
                <View style={ boxes.paddedRow }>
                    <ButtonSmall
                        title={userIsMember ? "Mitglied" : "Beitreten"}
                        icon={userIsMember ? icons.checkTrue : icons.checkFalse}
                        onPress={joinCourseHandler}
                    />
                    <ButtonSmall
                        title={"Neue Idee"}
                        icon={icons.plus}
                        onPress={() => {setNewIdeaVisible(true)}}
                    />
                </View>
                }
                { userIsCreator && courseDate - (new Date()) < 0 && !evaluated && 
                <View style={ boxes.paddedRow }>
                    <ButtonLarge
                        title={"Teams erstellen"}
                        onPress={setTeamsHandler}
                    />
                </View>
                }
                { userIsCreator && courseDate - (new Date()) >= 0 && !evaluated && 
                <View style={ boxes.paddedRow }>
                    <ButtonLarge
                        title={"Kurs bearbeiten"}
                        onPress={() => {setEditCourseVisible(true)}}
                    />
                </View>
                }
            </View>

            <SwipeListView
                style={{backgroundColor: colors.white}}
                ref = {ref => setSwipeListView(ref)}
                data={currentIdeas}
                disableLeftSwipe = {true}
                disableRightSwipe = {evaluated}
                keyExtractor={(item, index) => index.toString()}
                onSwipeValueChange={onSwipeValueChange}
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
                        />
                }
                renderHiddenItem={ ({item, index}) => 
                        <View style={[boxes.swipeRowTwo, {backgroundColor: item.id == currentNogo ? colors.lightGrey : colors.red}]}>
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
                        </View>
                }
                leftOpenValue={evaluated ? 0 : 120}
            />

        </View>
    )
}