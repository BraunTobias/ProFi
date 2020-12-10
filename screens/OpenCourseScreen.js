import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, Text, Modal, Keyboard, ActivityIndicator, Alert, Animated, FlatList } from 'react-native';

import { icons, colors, boxes, texts } from '../Styles';
import DB from '../api/DB_API';
import InputField from '../components/InputField';
import ButtonSmall from '../components/ButtonSmall';
import ListTile from "../components/ListTile";
import ModalContent from "../components/ModalContent";
import ButtonLarge from '../components/ButtonLarge';
import AttributeSelect from '../components/AttributeSelect';
import AttributePreviewTile from '../components/AttributePreviewTile';

export default OpenCourseScreen = ({route, navigation}) => {

    const {currentUserId} = route.params;
    const {courseInfo} = route.params;

    // State Hooks
    const [currentIdeas, setCurrentIdeas] = useState([]);
    const [courseName, setCourseName] = useState(courseInfo.title);
    const [minMembers, setMinMembers] = useState(0);
    const [maxMembers, setMaxMembers] = useState(0);
    const [courseDataLoading, setCourseDataLoading] = useState(true);

    // State Hooks für Modals
    const [editCourseVisible, setEditCourseVisible] = useState(false);
    const [editCourseNameErrorVisible, setEditCourseNameErrorVisible] = useState(false);
    const [editCourseName, setEditCourseName] = useState(courseInfo.title);
    const [editCourseMinMembers, setEditCourseMinMembers] = useState(0);
    const [editCourseMaxMembers, setEditCourseMaxMembers] = useState(0);
    const [newIdeaVisible, setNewIdeaVisible] = useState(false);
    const [addSkillsVisible, setAddSkillsVisible] = useState(false);
    const [selectedSkillsList, setSelectedSkillsList] = useState([]);
    const [currentNewIdeaName, setCurrentNewIdeaName] = useState("");
    const [currentNewIdeaText, setCurrentNewIdeaText] = useState("");
    const [newIdeaNameErrorVisible, setNewIdeaNameErrorVisible] = useState(false);
    const [newIdeaTextErrorVisible, setNewIdeaTextErrorVisible] = useState(false);
    const [selectedSkillsListErrorVisible, setSelectedSkillsListErrorVisible] = useState(false);

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
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: courseInfo.title,
        });
    }, [navigation]);

    // Wird nach dem Rendern ausgeführt
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            DB.getIdeasList(courseInfo.id, "openCourses", (ideasList) => {
                setCurrentIdeas(ideasList);
            });
        });
    }, []);

    // Handler für Modals
    const pressNewIdeaHandler = (committed) => {
        if (committed) {
            if (currentNewIdeaName.length > 1 && currentNewIdeaText.length > 1 && selectedSkillsList.length > 0) {
                DB.addOpenIdea(courseInfo.id, currentNewIdeaName, currentNewIdeaText, selectedSkillsList, [], () => {
                    setNewIdeaVisible(false);
                    setCurrentNewIdeaName("");
                    setCurrentNewIdeaText("");    
                    setSelectedSkillsList([]);
                    DB.getIdeasList(courseInfo.id, "openCourses", (ideasList) => {
                        setCurrentIdeas(ideasList);
                    });
                }, (error) => {console.log(error)});
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
        var oldList = selectedSkillsList;
        if (oldList.indexOf(skill) < 0) {
            oldList.push(skill);
        } else {
            var newList = oldList.filter(item => item !== skill);
            setSelectedSkillsList(newList);
        }
        if (selectedSkillsList.length > 0) setSelectedSkillsListErrorVisible(false);
    }

    const pressEditCourseHandler = (committed) => {
        if (committed) {
            if (editCourseName.length > 1) {
                DB.editCourse(courseInfo.id, editCourseName, editCourseDate, editCourseMinMembers, editCourseMaxMembers, () => {
                    setEditCourseVisible(false);
                    setEditCourseNameErrorVisible(false);
                    setCourseName(editCourseName);
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
        } else {
            setEditCourseVisible(false);
            setEditCourseNameErrorVisible(false);
            setEditCourseName(courseName);
            setEditCourseMinMembers(minMembers);
            setEditCourseMaxMembers(maxMembers);
        }
    }
    const changeEditCourseNameHandler = (enteredText) => {
        setEditCourseName(enteredText);
        if (enteredText != "") setEditCourseNameErrorVisible(false);
    }
    const changeEditCourseMinMembersHandler = (number) => {
        setEditCourseMinMembers(number);
        if (number > editCourseMaxMembers) setEditCourseMaxMembers(number);
    }
    const changeEditCourseMaxMembersHandler = (number) => {
        setEditCourseMaxMembers(number);
        if (number < editCourseMinMembers) setEditCourseMinMembers(number);
    }

    const selectIdeaHandler = (item) => {
        navigation.navigate("Open Idea", {
            itemId: item.id, 
            itemTitle: item.title, 
            itemDescription: item.description, 
            skillsList: item.skills, 
            courseId: courseInfo.id, 
            courseTitle: courseInfo.title, 
            currentUserId: currentUserId, 
            isMember: item.userIsMember,
            myTeam: item.myTeam
        });
    }

    return(
        <View style={{flex:1}}> 

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
                                <View style={boxes.unPaddedRow}>
                                    <NumberInput
                                        title= {"Mitglieder min."}
                                        value= {editCourseMinMembers}
                                        onChange={changeEditCourseMinMembersHandler}
                                    />
                                    <View style={boxes.buttonSpacing}/>
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
                <View style={ boxes.paddedRow }>
                    <ButtonSmall
                        title={"Neue Idee"}
                        icon={icons.plus}
                        onPress={() => {setNewIdeaVisible(true)}}
                    />
                </View>
            </View>

            <FlatList
                style={{backgroundColor: colors.white}}
                data={currentIdeas}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => 
                    <ListTile
                        onPress={() => {selectIdeaHandler(item)}} 
                        id={item.id}
                        title={item.title}
                        subtitle={item.description}
                        skills={item.skills}
                        isMember = {item.userIsMember}
                        index = {index}
                        myTeam = {item.myTeam}
                    />
                }
            />

        </View>
    )
}