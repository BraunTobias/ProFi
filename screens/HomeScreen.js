import React, {useState, useEffect} from 'react';
import { View, Text, Modal, Keyboard } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { compareAsc, format } from 'date-fns';

import { icons, colors, boxes, texts } from '../Styles';
import DB from '../api/DB_API';
import InputField from '../components/InputField';
import NumberInput from '../components/NumberInput';
import ButtonSmall from '../components/ButtonSmall';
import SwipeButton from '../components/SwipeButton';
import ListTile from "../components/ListTile";
import ModalContent from "../components/ModalContent";

export default HomeScreen = ({navigation}) => {

    const currentUserId = DB.getCurrentUserId();

    // State Hooks
    const [currentCourses, setCurrentCourses] = useState([]);
    const [joinedCourses, setJoinedCourses] = useState([]);
    const [swipeListView, setSwipeListView] = useState();

    // State Hooks für Modals
    const [findCourseVisible, setFindCourseVisible] = useState(false);
    const [currentFindCourseId, setCurrentFindCourseId] = useState("");
    const [newCourseVisible, setNewCourseVisible] = useState(false);
    const [newCourseDateVisible, setNewCourseDateVisible] = useState(false);
    const [currentNewCourseName, setCurrentNewCourseName] = useState("");
    const [currentNewCourseId, setCurrentNewCourseId] = useState("");
    const [currentNewCourseDate, setCurrentNewCourseDate] = useState(new Date());
    const [currentNewCourseMinMembers, setCurrentNewCourseMinMembers] = useState(2);
    const [currentNewCourseMaxMembers, setCurrentNewCourseMaxMembers] = useState(2);

    // Wird nach dem Rendern ausgeführt
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            DB.getCourseList((courseList) => {
                setCurrentCourses(courseList);
                var joined = [];
                for (const section of courseList) {
                    for (const course of section.data) {
                        if (course.members.indexOf(currentUserId) >= 0) {
                            joined.push(course.id);
                        }
                    }
                }
                setJoinedCourses(joined);
            });
        });
    }, []);

    // Handler für Modals
    const pressFindCourseHandler = (committed) => {
        if (committed && currentFindCourseId != "") {
            DB.addCourseToList(currentFindCourseId, (addedCourse) => {
                setCurrentFindCourseId("");
                var courseList = currentCourses;
                courseList.push(addedCourse);
                setCurrentCourses(courseList);
                setFindCourseVisible(false);
            }, (error) => {
                console.log(error);
            })
        } else {
            setFindCourseVisible(false);
        }
    }
    const changeFindCourseIdHandler = (enteredText) => {
        setCurrentFindCourseId(enteredText.toUpperCase());
    }
    const pressNewCourseHandler = (committed) => {
        if (committed) {
            DB.addCourse(currentNewCourseName, currentNewCourseId, currentNewCourseDate, currentNewCourseMinMembers, currentNewCourseMaxMembers, () => {
                setNewCourseVisible(false);
                setCurrentNewCourseName("");
                setCurrentNewCourseId("");    
                setCurrentNewCourseMinMembers("");
                setCurrentNewCourseMaxMembers("");
                setCurrentNewCourseDate(new Date());
                DB.getCourseList((courseList) => {
                    setCurrentCourses(courseList);
                });
            }, (error) => {setCurrentWarning(error)});
        } else {
            setNewCourseVisible(false);
        }
    }
    const changeNewCourseNameHandler = (enteredText) => {
        setCurrentNewCourseName(enteredText);
    }
    const changeNewCourseIdHandler = (enteredText) => {
        setCurrentNewCourseId(enteredText.toUpperCase());
    }
    const changeNewCourseMinMembersHandler = (number) => {
        setCurrentNewCourseMinMembers(number);
        if (number > currentNewCourseMaxMembers) setCurrentNewCourseMaxMembers(number);
    }
    const changeNewCourseMaxMembersHandler = (number) => {
        setCurrentNewCourseMaxMembers(number);
        if (number < currentNewCourseMinMembers) setCurrentNewCourseMinMembers(number);
    }
    const changeNewCourseDateHandler = (date) => {
        setCurrentNewCourseDate(date);
        setNewCourseDateVisible(false);
    }

    const deleteCourseHandler = (id) => {
        swipeListView.safeCloseOpenRow();
        
        DB.removeCourseFromList(id, () => {
            DB.getCourseList((courseList) => {
                // console.log(courseList);
                setCurrentCourses(courseList);
                var joined = [];
                for (const course in courseList) {
                    if (courseList[course].members.indexOf(currentUserId) >= 0) {
                        joined.push(courseList[course].id);
                    }
                }
                setJoinedCourses(joined);
            });
        });
    };

    const selectCourseHandler = (id, title, date) => {
        swipeListView.safeCloseOpenRow();
        const isMember = joinedCourses.indexOf(id) >= 0
        navigation.navigate("Course", {itemId: id, itemTitle: title, isMember: isMember, itemDate: date});
    }

    return(
        <View style={{flex:1}}>
            
            {/* Kurs finden */}
            <Modal visible= { findCourseVisible } animationType= 'slide'>
                <ModalContent
                    subheader= { () => {}}
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={texts.titleCentered}>{"Kurs finden"}</Text>
                                <InputField
                                    placeholderText= "Kurs-ID eingeben"
                                    value={currentFindCourseId}
                                    onChangeText={changeFindCourseIdHandler}
                                />
                            </View>
                        )
                    }}
                    onDismiss= {pressFindCourseHandler}
                />
            </Modal>

            {/* Kurs erstellen */}
            <Modal visible= { newCourseVisible } animationType= 'slide'>
                <ModalContent
                    subheader= { () => {}}
                    content= { () => 
                            <View style={boxes.mainContainer}>
                                <Text style={texts.titleCentered}>{"Kurs erstellen"}</Text>
                                <InputField
                                    title= "Kursname"
                                    placeholderText= "Kursname"
                                    value={currentNewCourseName}
                                    onChangeText={changeNewCourseNameHandler}
                                />
                                <InputField
                                    title= "Kurs-ID"
                                    placeholderText= "KürzelSemesterJahr"
                                    value={currentNewCourseId}
                                    onChangeText={changeNewCourseIdHandler}
                                />
                                <InputField
                                    title= "End-Datum"
                                    isButton= {true}
                                    placeholderText= "Datum auswählen …"
                                    value={format(currentNewCourseDate, "dd.MM.yyyy")}
                                    onPress={() => {setNewCourseDateVisible(true); Keyboard.dismiss()}}
                                />
                                <DateTimePickerModal
                                    isVisible={newCourseDateVisible}
                                    mode="date"
                                    headerTextIOS="Datum auswählen"
                                    cancelTextIOS="Abbrechen"
                                    confirmTextIOS="OK"
                                    onConfirm={changeNewCourseDateHandler}
                                    onCancel={() => {setNewCourseDateVisible(false)}}
                                />
                                <View style={boxes.unPaddedRow}>
                                    <NumberInput
                                        title= {"Mitglieder min."}
                                        value= {currentNewCourseMinMembers}
                                        onChange={changeNewCourseMinMembersHandler}
                                        />
                                    <NumberInput
                                        title= {"Mitglieder max."}
                                        value= {currentNewCourseMaxMembers}
                                        onChange={changeNewCourseMaxMembersHandler}
                                    />
                                </View>
                            </View> 
                    }
                    onDismiss= {(committed) => {pressNewCourseHandler(committed)}}
                />
            </Modal>



            <View style={ boxes.subHeader }>
                <View style={ boxes.paddedRow }>
                    <ButtonSmall
                        title={"Kurs finden"}
                        icon={"find"}
                        onPress={() => {setFindCourseVisible(true)}}
                    />
                    <ButtonSmall
                        title={"Neuer Kurs"}
                        icon={"plus"}
                        onPress={() => {setNewCourseVisible(true)}}
                    />
                </View>
            </View>

            <SwipeListView
                style={{backgroundColor: colors.white}}
                ref = {ref => setSwipeListView(ref)}
                sections={currentCourses}
                disableLeftSwipe = {true}
                keyExtractor={(item, index) => index.toString()}
                useSectionList
                renderSectionHeader={({ section }) => (
                        <View style={boxes.separator}>
                            <Text style={texts.separatorText}>{section.key}</Text>
                        </View>
                )}
                renderItem={({ item, index, section }) => { 
                    return (
                        <ListTile
                            onPress={() => {selectCourseHandler(item.id, item.title, item.date)}} 
                            id={item.id}
                            title={item.title}
                            subtitle={item.members.length + " Mitglieder, Gruppengröße " + item.minMembers + "-" + item.maxMembers + "\n" + item.date}
                            index = {index}
                            isMember = {joinedCourses.indexOf(item.id) >= 0}
                        />
                    )
                }}
                renderHiddenItem={ (itemData) => {
                    return (
                        <View style={boxes.swipeRowOne}>
                            <SwipeButton
                                backgroundColor={colors.red}
                                icon={icons.delete}
                                onPress={(ref) => {deleteCourseHandler(itemData.item.id)}}
                            />
                        </View>
                    )
                }}
                leftOpenValue={60}
            />

        </View>

    )
}