import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, Text, Modal, Keyboard, FlatList, TouchableHighlight, ActivityIndicator, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { compareAsc, format } from 'date-fns';

import { icons, colors, boxes, texts } from '../Styles';
import DB from '../api/DB_API';
import InfoModal from '../components/InfoModal';
import InputField from '../components/InputField';
import ButtonSmall from '../components/ButtonSmall';
//import SwipeButton from '../components/SwipeButton';
import ListTile from "../components/ListTile";
import ModalContent from "../components/ModalContent";
import ButtonIcon from '../components/ButtonIcon';
import ButtonLarge from '../components/ButtonLarge';
import ScrollRow from '../components/ScrollRow';
import AttributeSelect from '../components/AttributeSelect';
import AttributePreviewTile from '../components/AttributePreviewTile';
import NumberInput from '../components/NumberInput';
import TimeInput from '../components/TimeInput';
import DateModal from '../components/DateModal'
import ProfileView from '../components/ProfileView';
import ProfileBox from '../components/ProfileBox';
//import ProfileView from '../components/ProfileView';
import Padding from '../components/Padding';

export default function CourseScreen ({route, navigation}) {

    const window = useWindowDimensions();

    const {currentUserId} = route.params;
    const {courseInfo} = route.params;
    const courseType = courseInfo.courseType;

    // State Hooks
    const [currentIdeas, setCurrentIdeas] = useState([]);
    const [courseName, setCourseName] = useState(courseInfo.title);
    const [courseLink, setCourseLink] = useState(courseInfo.link);
    const [courseDate, setCourseDate] = useState(courseInfo.date ? courseInfo.date.toDate() : {});;
    const [creator, setCreator] = useState("");
    const [members, setMembers] = useState(courseInfo.members);
    const [minMembers, setMinMembers] = useState(courseInfo.minMembers);
    const [maxMembers, setMaxMembers] = useState(courseInfo.maxMembers);
    const [userIsMember, setUserIsMember] = useState(courseInfo.userIsMember);
    const [userIsCreator, setUserIsCreator] = useState(false);
    const [currentFav, setCurrentFav] = useState("");
    const [currentNogo, setCurrentNogo] = useState("");
    const [courseDataLoading, setCourseDataLoading] = useState(true);

    // State Hooks für Modals
    const [editCourseVisible, setEditCourseVisible] = useState(false);
    const [editCourseNameErrorVisible, setEditCourseNameErrorVisible] = useState(false);
    const [editCourseName, setEditCourseName] = useState(courseInfo.title);
    const [editCourseLink, setEditCourseLink] = useState(courseInfo.link);
    const [editCourseDate, setEditCourseDate] = useState(courseInfo.date ? courseInfo.date.toDate() : {});
    const [editCourseMinMembers, setEditCourseMinMembers] = useState(courseInfo.minMembers);
    const [editCourseMaxMembers, setEditCourseMaxMembers] = useState(courseInfo.maxMembers);
    const [editCourseHours, setEditCourseHours] = useState(courseInfo.date ? courseInfo.date.toDate().getHours() : {});
    const [editCourseMinutes, setEditCourseMinutes] = useState(courseInfo.date ? courseInfo.date.toDate().getMinutes() : {});
    const [newIdeaVisible, setNewIdeaVisible] = useState(false);
    const [selectedSkillsList, setSelectedSkillsList] = useState([]);
    const [skillsListText, setSkillsListText] = useState([]);
    const [currentNewIdeaName, setCurrentNewIdeaName] = useState("");
    const [currentNewIdeaText, setCurrentNewIdeaText] = useState("");

    const [errorMessage, setErrorMessage] = useState(false);
    const [infosReceived, setInfosReceived] = useState(false);
    
    const [newIdeaNameErrorVisible, setNewIdeaNameErrorVisible] = useState(false);
    const [newIdeaTextErrorVisible, setNewIdeaTextErrorVisible] = useState(false);
    const [selectedSkillsListErrorVisible, setSelectedSkillsListErrorVisible] = useState(false);

    // State Hooks für Profilansicht
    const [viewedUserId, setViewedUserId] = useState(currentUserId);
    const [profileVisible, setProfileVisible] = useState(false);
    // const [profileInfoVisible, setProfileInfoVisible] = useState(0);

    // States für Auswertungs-Ansicht
    const [evaluating, setEvaluating] = useState(courseInfo.evaluating);
    const [evaluated, setEvaluated] = useState(courseInfo.evaluated);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: courseInfo.title,
            headerLeft: () => (
                <View style= { [boxes.unPaddedRow, { alignItems: "center", } ] }>
                    <ButtonIcon
                        icon= { "logo" }
                        status= { "color" }
                        onPress= { () => { navigation.navigate("Home") } }
                    />
                    <Padding width= { 15 } />
                    <ButtonIcon
                        icon= { "back" }
                        status= { "active" }
                        onPress= { () => { 
                            navigation.navigate("Home");
                         } }
                    />
                </View>
            ),
            headerRight: () => (
                <ButtonIcon
                    icon= { "profile" }
                    status= { "active" }
                    onPress= { () => { navigation.navigate("Mein Profil", { currentUserId: currentUserId } ) } }
                />
            ),
            
        });
    }, [navigation]);

    const getCourseData = () => {
        DB.getCourseData(courseInfo.id, (data) => {
            setUserIsCreator(data.creator === currentUserId);
            setCreator(data.creatorName);
            setMembers(data.members);
            setEvaluated(data.evaluated);
            setEvaluating(data.evaluating);
        });    
    }

    // Wird nach dem Rendern ausgeführt
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (courseType === "courses") {
                getCourseData();
                let favsRecieved = false;
                let nogosRecieved = false;
                let joinRecieved = false;
                DB.getInfoReceived("favourites", (isReceived) => {
                    favsRecieved = isReceived;
                    DB.getInfoReceived("nogos", (isReceived) => {
                        nogosRecieved = isReceived;
                        DB.getInfoReceived("joinCourse", (isReceived) => {
                            joinRecieved = isReceived;
                            let infos = {
                                fav: favsRecieved,
                                nogo: nogosRecieved,
                                join: joinRecieved
                            };
                            setInfosReceived(infos);
                        });
                    });
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
        if (!infosReceived.fav) {
            let message = {
                title: "Favoriten setzen",
                copy: "Wenn du eine Idee als Favorit markierst, erhöht sich die Chance, dass du dieser zugeteilt wirst. Du kannst einen Favoriten pro Kurs setzen. Sobald du eine andere Idee favorisierst, wird dein alter Favorit entfernt.",
                onPress: () => { setErrorMessage(false); }
            }
            DB.setInfoReceived("favourites"); 
            setErrorMessage(message);
            let infos = infosReceived;
            infos.fav = true;
            setInfosReceived(infos);

        } else {
            if (currentFav === ideaId) {
                DB.deletePref("favourites", courseInfo.id, () => {
                    setCurrentFav("");
                }, () => {console.log("error")});
            } else {
                DB.addPref("favourites", courseInfo.id, ideaId, () => {
                    setCurrentFav(ideaId);
                    if (currentNogo === ideaId) setCurrentNogo("");
                }, () => {console.log("error")});
            }
        }
    }
    const addNogoHandler = (ideaId) => {
        if (!infosReceived.nogo) {
            let message = {
                title: "No-Go setzen",
                copy: "Wenn du eine Idee als No-Go markierst, wirst du dieser auf keinen Fall zugeteilt. Du kannst ein No-Go pro Kurs setzen. Sobald du eine andere Idee als No-Go markierst, wird dein altes No-Go entfernt.",
                onPress: () => { setErrorMessage(false); }
            }
            DB.setInfoReceived("nogos"); 
            setErrorMessage(message);
            let infos = infosReceived;
            infos.nogo = true;
            setInfosReceived(infos);
        } else {
            if (currentNogo === ideaId) {
                DB.deletePref("nogos", courseInfo.id, () => {
                    setCurrentNogo("");
                });
            } else {
                DB.addPref("nogos", courseInfo.id, ideaId, () => {
                    setCurrentNogo(ideaId);
                    if (currentFav === ideaId) {
                        setCurrentFav("");
                    }
                });
            }
        }
    }
    const joinCourseHandler = () => {
        if (!infosReceived.join) {
            let message = {
                title: "Einem Kurs beitreten",
                copy: "Wenn du diesem Kurs beitrittst, wirst du bei der Ideenverteilung berücksichtigt. Du kannst jederzeit wieder austreten und dir den Kurs weiter angucken. Aber achte darauf, dass du am oben angegebenen Datum dem Kurs beigetreten bist, um zugeteilt zu werden.",
                onPress: () => { setErrorMessage(false); }
            }
            DB.setInfoReceived("joinCourse"); 
            setErrorMessage(message);
            let infos = infosReceived;
            infos.join = true;
            setInfosReceived(infos);
        } else {
            if (!userIsMember) {
                DB.joinCourse(courseInfo.id, () => {
                    setUserIsMember(true);
                    getCourseData();
                }, () => {console.log("error")});
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
    const selectIdeaHandler = (ideaInfo) => {
        navigation.navigate("Idea", {
            ideaInfo: ideaInfo, 
            courseEvaluated: evaluated,
            courseType: courseType,
            courseId: courseInfo.id, 
            currentUserId: currentUserId,
            courseInfo: courseInfo,
        });
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
                }, () => {} );
            }
            if (currentNewIdeaName.length <= 1) setNewIdeaNameErrorVisible("Bitte einen Namen angeben.");
            if (currentNewIdeaText.length <= 1) setNewIdeaTextErrorVisible("Bitte einen Beschreibungstext angeben.");
            if (selectedSkillsList.length === 0) setSelectedSkillsListErrorVisible("Bitte mindestens eine Fähigkeit angeben.");
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

    const changeSkillsHandler = (skill, currentCategory) => {
        if (selectedSkillsList.indexOf(skill) < 0) {
            let list = selectedSkillsList;
            list.push(skill);
            setSkillsListText(list.join(", "));
            setSelectedSkillsList(list);
        } else {
            let list = selectedSkillsList.filter(item => item !== skill);
            setSkillsListText(list.join(", "));
            setSelectedSkillsList(list);
        }
        if (selectedSkillsList.length > 0) setSelectedSkillsListErrorVisible(false);
    }

    const pressEditCourseHandler = (committed) => {
        if (committed) {
            if (editCourseName.length > 1) {
                DB.editCourse(courseInfo.id, editCourseName, editCourseLink, editCourseDate, editCourseMinMembers, editCourseMaxMembers, () => {
                    setEditCourseVisible(false);
                    setEditCourseNameErrorVisible(false);
                    setCourseName(editCourseName);
                    setCourseDate(editCourseDate);
                    setMinMembers(editCourseMinMembers);
                    setMaxMembers(editCourseMaxMembers);
                    navigation.setOptions({ headerTitle: editCourseName });
                }, () => {
                    // setEditErrorVisible = true;
                    let message = {
                        title: "Fehler",
                        copy: "Kurs konnte nicht bearbeitet werden"
                    }
                    setErrorMessage(message);
                });
            }
            if (editCourseName.length === "") setEditCourseNameErrorVisible(true);
        } else {
            setEditCourseVisible(false);
            setEditCourseNameErrorVisible(false);
            setEditCourseName(courseName);
            setEditCourseDate(courseDate);
            setEditCourseMinMembers(minMembers);
            setEditCourseMaxMembers(maxMembers);
        }
    }
    const changeEditCourseNameHandler = (enteredText) => {
        setEditCourseName(enteredText);
        if (enteredText !== "") setEditCourseNameErrorVisible(false);
    }
    const changeEditCourseDateHandler = (date) => {
        setEditCourseDate(new Date(date.getFullYear(), date.getMonth(), date.getDate(), editCourseHours, editCourseMinutes));
    }
    const changeEditCourseMinMembersHandler = (number) => {
        setEditCourseMinMembers(number);
        if (number > editCourseMaxMembers) setEditCourseMaxMembers(number);
    }
    const changeEditCourseMaxMembersHandler = (number) => {
        setEditCourseMaxMembers(number);
        if (number < editCourseMinMembers) setEditCourseMinMembers(number);
    }
    const changeEditCourseHoursHandler = (number) => {
        var oldDate = editCourseDate;
        if (number > 23) number = 0;
        else if (number < 0) number = 23;
        setEditCourseHours(number);
        setEditCourseDate(new Date(oldDate.getFullYear(), oldDate.getMonth(), oldDate.getDate(), number, editCourseMinutes));
    }
    const changeEditCourseMinutesHandler = (number) => {
        var oldDate = editCourseDate;
        if (number > 59) number = 0;
        else if (number < 0) number = 59;
        setEditCourseMinutes(number);
        setEditCourseDate(new Date(oldDate.getFullYear(), oldDate.getMonth(), oldDate.getDate(), editCourseHours, number));
    }

    const ErrorInfoHandler = (props) => {
        if (props.visible) return <Text style= { [boxes.unPaddedRow, texts.errorLine] } >{ props.visible }</Text>
        else return <Padding height= { 18.5 } />
    }
    
    return(
        <View style= { { 
            backgroundColor: colors.lightGrey, 
            height: window.height-80,
        } } >

            {/* Info-Modal */}
            <InfoModal visible= { errorMessage }
                onPress= { errorMessage.onPress }
                title= { errorMessage.title }
                copy= { errorMessage.copy }
            />

            {/* Mitglieds-Profil */}
            { profileVisible && 
                <ProfileView
                    userId= { viewedUserId }
                    visible= { profileVisible }
                    onDismiss= { () => { setProfileVisible(false) } }
                    infoScreen= { true }
                />
            }
            
            {/* Kurs bearbeiten */}
            <Modal visible= { editCourseVisible }
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
                            <Text style= { [texts.titleCentered, { alignSelf: 'center' }] } >Kurs bearbeiten</Text>
                        </View>
                    ) } }
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <View style= { boxes.paddedRow }>
                                    <View style= { { width: '50%' } } >
                                        <InputField
                                            title="Kursname"
                                            placeholderText= "Kursname"
                                            value={editCourseName}
                                            onChangeText={changeEditCourseNameHandler}
                                        />
                                        <ErrorInfoHandler visible= { editCourseNameErrorVisible } />
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
                                        <Padding height= { 15 } />
                                        <Text style= { texts.subHeader } >Einteilungs-Uhrzeit in Stunden und Minuten</Text>
                                        <View style={boxes.unPaddedRow}>
                                            <TimeInput
                                                type= { 'hours' }
                                                title= { "" }
                                                value= { editCourseHours }
                                                onChange= { changeEditCourseHoursHandler }
                                                />
                                            <TimeInput
                                                type= { 'minutes' }
                                                title= { "" }
                                                value= { editCourseMinutes }
                                                onChange= { changeEditCourseMinutesHandler } 
                                            />
                                        </View>
                                    </View>
                                    <Padding width= { 15 } />
                                    <View>
                                        <Text style= { texts.subHeader } >End-Datum</Text>
                                        <DateModal
                                            currentDate= { editCourseDate }
                                            visible= { true }
                                            onPress= { (date) => { changeEditCourseDateHandler(date) } }
                                        />
                                    </View>
                                </View>
                            </View> 
                        )
                    }}
                    onDismiss= { pressEditCourseHandler }
                />
            </Modal>

            {/* Idee erstellen */}
            <Modal visible= { newIdeaVisible }
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
                            <Text style= { [texts.titleCentered, { alignSelf: 'center' }] } >Idee hinzufügen</Text>
                        </View>
                    ) } }
                    content= { () => {
                        return(
                            <View style=  { boxes.mainContainer } >
                                <View style= { [boxes.paddedRow, {  } ] }>
                                    <View style= { { width: '50%' } } >
                                        <InputField
                                            title= "Titel"
                                            placeholderText= "beschreibender Titel"
                                            value={currentNewIdeaName}
                                            onChangeText={changeNewIdeaNameHandler}
                                        />
                                        <ErrorInfoHandler visible= { newIdeaNameErrorVisible } />
                                        <InputField
                                            title= "Beschreibung"
                                            placeholderText= "beschreibender Text"
                                            value={currentNewIdeaText}
                                            onChangeText={changeNewIdeaTextHandler}
                                            multiline={true}
                                            numberOfLines={5}
                                        />
                                        <ErrorInfoHandler visible= { newIdeaTextErrorVisible } />
                                        
                                        {/* Fähigkeiten auflisten */}
                                        <AttributePreviewTile
                                            title= "Passende Fähigkeiten"
                                            subtitle= { skillsListText }
                                            index= { 0 }
                                        />
                                        <ErrorInfoHandler visible= { selectedSkillsListErrorVisible } />
                                    </View> 
                                    <Padding width= { 15 } />
                                    <View style= { { width: '100%', height: window.height -80 -60 -85 } } >
                                        {/* Fähigkeiten auswählen */}
                                        <AttributeSelect
                                            attributeType = "skills"
                                            selectedAttributesList= { selectedSkillsList }
                                            changeAttribute = { (skills, currentCategory) => { changeSkillsHandler(skills, currentCategory) } }
                                        />
                                    </View>
                                </View>
                            </View>
                        )
                    }}
                    onDismiss= { pressNewIdeaHandler }
                />
            </Modal>

            {/* Header */}
            <View style= { boxes.subHeader } >
                { (courseType === "courses") &&
                <View>
                    { courseDataLoading && 
                    <View style={{justifyContent: "center"}}>
                        <ActivityIndicator/>
                    </View>
                    }  
                    { !courseDataLoading && 
                    <View style= { [boxes.width] } >
                        <View style={ boxes.paddedRow }>
                            <Text style={texts.subHeader}>{courseInfo.id}</Text>
                            <Text style={texts.subHeader}>{minMembers + "-" + maxMembers + " Personen"}</Text>
                        </View>
                        <View style={ boxes.paddedRow }>
                            <Text style={texts.subHeader}>{format(courseDate, "dd.MM.yyyy")}</Text>
                            <Text style={texts.subHeader}>{creator}</Text>
                        </View>
                        <ScrollRow
                            data= { members }
                            onPress= { (id) => { viewProfileHandler(id) } }
                            //onEnter= { (num, id, target) => viewProfileInfoHandler(num, id, target) }
                            // onLeave= { () => setProfileInfoVisible(0) }
                        />
                    </View>
                    }
                    {/* Button-Leiste */}
                    { !evaluated && !evaluating &&
                    <View style= { [boxes.paddedRow, boxes.width] } >
                        <ButtonSmall
                            title={userIsMember ? "Mitglied" : "Beitreten"}
                            icon={userIsMember ? "checkTrue" : "checkFalse"}
                            onPress={joinCourseHandler}
                        />
                        { userIsCreator &&
                        <ButtonSmall
                            title={"Kurs bearbeiten"}
                            icon={"edit"}
                            onPress={() => {setEditCourseVisible(true)}}
                        />
                        }
                        <ButtonSmall
                            title={"Neue Idee"}
                            icon={"plus"}
                            onPress={() => {setNewIdeaVisible(true)}}
                        />
                    </View>
                    }
                </View>
                }
                { (courseType === "openCourses") &&
                    <View style= { [boxes.width] } >
                        <View style= { [boxes.paddedRow] } >
                        <ButtonSmall
                            title={"Neue Idee"}
                            icon={"plus"}
                            onPress={() => {setNewIdeaVisible(true)}}
                        />
                        </View>
                    </View>
                }
                <Padding height= { 15 } />
            </View>

            {/* Ideas List */}
            <FlatList 
                style= { boxes.width }
                data= { currentIdeas }
                keyExtractor= { (item, index) => index.toString() }
                renderItem= { (itemData) => { 
                    return (
                        <TouchableHighlight
                            underlayColor={colors.darkBlue}
                            onPress={ () => { selectIdeaHandler(itemData.item) } }
                        >
                            <View
                                style= { {
                                    flexDirection: "row", 
                                    alignItems: "center",
                                    backgroundColor: itemData.index % 2 === 0 ? colors.white : colors.lightGrey,
                                } }
                            >
                                <View style= { {
                                    flexDirection: "row", 
                                } } >
                                    { (courseType === "courses") &&
                                    <View style= { { flexDirection: "row", marginHorizontal: 15 } } >
                                        <ButtonIcon 
                                            icon= { "fav" }
                                            onPress= { (ref) => { 
                                                addFavHandler(itemData.item.id) } }
                                            status= { currentFav === itemData.item.id ? "active" : "transparent" }
                                        />
                                        <Padding width= { 5 } />
                                        <ButtonIcon 
                                            icon= { "nogo" }
                                            onPress= { (ref) => { 
                                                addNogoHandler(itemData.item.id) } }
                                            status= { currentNogo === itemData.item.id ? "neg" : "transparent" }
                                        />
                                    </View>
                                    }
                                </View>
                                <ListTile
                                    id= { itemData.item.id }
                                    title= { itemData.item.title }
                                    subtitle={itemData.item.description}
                                    skills={itemData.item.skills}
                                    // isFavourite={itemData.item.id === currentFav}
                                    // isNogo={itemData.item.id === currentNogo}
                                    index = { itemData.index }
                                    myTeam={itemData.item.myTeam}
                                    isMember={itemData.item.userIsMember}
                                    inactive = {(evaluated && (!itemData.item.team || itemData.item.team.length == 0)) ||
                                        (itemData.item.team && itemData.item.team.indexOf(currentUserId) < 0)
                                    }
                                    warning = {itemData.item.warning && itemData.item.warning != ""}
                                />
                                
                            </View>
                        </TouchableHighlight>
                    )
                }}
            />
        </View>
    )
}