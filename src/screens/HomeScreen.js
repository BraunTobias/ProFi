import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, Modal, Alert, useWindowDimensions } from 'react-native';
import DB from '../api/DB_API';

import InputField from '../components/InputField';
import NumberInput from '../components/NumberInput';
import TimeInput from '../components/TimeInput';
import ButtonSmall from '../components/ButtonSmall';
import ButtonIcon from '../components/ButtonIcon';
import InfoModal from "../components/InfoModal";
import ModalContent from "../components/ModalContent";
import DateModal from '../components/DateModal'
import SectionList from '../components/SectionList'
import { colors, boxes, texts } from '../Styles';
import Padding from '../components/Padding';


//export default function LoginScreen ({navigation}) {
export default function HomeScreen ({navigation}) {
    
    const window = useWindowDimensions();

    const currentUserID = DB.getCurrentUserId();

    // State Hooks
    const [currentCourses, setCurrentCourses] = useState({});
    const [currentFindCourseId, setCurrentFindCourseId] = useState("");
    const [currentNewCourseName, setCurrentNewCourseName] = useState("");
    const [currentNewCourseAcronym, setCurrentNewCourseAcronym] = useState("");
    const [currentNewCourseLink, setCurrentNewCourseLink] = useState("");
    const [currentNewCourseDate, setCurrentNewCourseDate] = useState( new Date( new Date().getTime() + 24 * 60 *60 *1000 ) );
    const [currentNewCourseMinMembers, setCurrentNewCourseMinMembers] = useState(2);
    const [currentNewCourseMaxMembers, setCurrentNewCourseMaxMembers] = useState(2);
    const [currentNewCourseHours, setCurrentNewCourseHours] = useState(12);
    const [currentNewCourseMinutes, setCurrentNewCourseMinutes] = useState(0);

    // State Hooks für Modals
    const [findCourseVisible, setFindCourseVisible] = useState(false);
    const [newCourseVisible, setNewCourseVisible] = useState(false);
    const [newCourseNameErrorVisible, setNewCourseNameErrorVisible] = useState(false);
    const [newCourseAcronymErrorVisible, setNewCourseAcronymErrorVisible] = useState(false);
    const [deleteInfoVisible, setDeleteInfoVisible] = useState(false);
    const [deleteInfoReceived, setDeleteInfoReceived] = useState(false);
    const [findErrorVisible, setFindErrorVisible] = useState(false);
    
    const loadData = (onSuccess) => {
        DB.getCourseList((courseList) => {
            setCurrentCourses(courseList);
            onSuccess();
        });
    }  

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <ButtonIcon
                    icon= { "logo" }
                    status= { "color" }
                    onPress= { () => { navigation.navigate("Home") } }
                />
            ),
            headerRight: () => (
                <ButtonIcon
                    icon= { "profile" }
                    status= { "active" }
                    onPress= { () => { navigation.navigate("Mein Profil", { currentUserId: currentUserID } ) } }
                />
            ),
            
        });
    }, [navigation]);

    // Wird nach dem Rendern ausgeführt
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData(() => {
                DB.getInfoReceived("deleteCourse", (isReceived) => {
                    setDeleteInfoReceived(isReceived);
                });        
            });
        });
    }, []);
    
    // Handler für Modals
    const pressFindCourseHandler = (committed) => {
        if (committed && currentFindCourseId !== "") {
            DB.addCourseToList(currentFindCourseId, (addedCourse) => {
                setCurrentFindCourseId("");
                let sem = addedCourse.semester;
                
                // wenn Kurs kein Semester hat ist es ein offener Kurs (Projekt B)
                if (!sem) sem = 'Freie Projekte'

                let courseList = currentCourses;
                let semList = currentCourses[sem];
                

                semList.push(addedCourse);
                courseList[sem] = semList
                setCurrentCourses(courseList);
                setFindCourseVisible(false);
                // loadData(() => { 
                //     setFindCourseVisible(false); 
                // } );
            }, (error) => {
                setFindErrorVisible(error);           
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
            if (currentNewCourseName !== "" && currentNewCourseAcronym !== "" && currentNewCourseDate - (new Date()) >= 0) {
                DB.addCourse(currentNewCourseName, currentNewCourseAcronym, currentNewCourseLink, currentNewCourseDate, currentNewCourseMinMembers, currentNewCourseMaxMembers, () => {
                    setNewCourseVisible(false);
                    setCurrentNewCourseName("");
                    setCurrentNewCourseAcronym("");    
                    setCurrentNewCourseMinMembers(2);
                    setCurrentNewCourseMaxMembers(2);
                    setCurrentNewCourseDate( new Date( new Date().getTime() + 24 * 60 *60 *1000 ) );
                    loadData(() => {});
                }, (error) => {
                    Alert.alert(
                        "Ungültige Eingabe",
                        error,
                        [{ text: "OK", onPress: () => {}}],
                    );              
                });
            }    
            if (currentNewCourseName === "") setNewCourseNameErrorVisible(true);
            if (currentNewCourseAcronym === "") setNewCourseAcronymErrorVisible(true);
        }  else {
            setNewCourseVisible(false);
            setNewCourseNameErrorVisible(false);
            setNewCourseAcronymErrorVisible(false);
        }
    }
    const changeNewCourseNameHandler = (enteredText) => {
        setCurrentNewCourseName(enteredText);
        if (currentNewCourseName === "") setNewCourseNameErrorVisible(true);
        else setNewCourseNameErrorVisible(false);
    }
    const changeNewCourseAcronymHandler = (enteredText) => {
        setCurrentNewCourseAcronym(enteredText.toUpperCase());
        if (enteredText === "") {
            setNewCourseAcronymErrorVisible(true);
        } else  {
            setCurrentNewCourseAcronym(enteredText.toUpperCase());
            setNewCourseAcronymErrorVisible(false);
        }
    }
    const changeNewCourseLinkHandler = (enteredText) => {
        setCurrentNewCourseLink(enteredText);
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
        let dateCreated = new Date(date.getFullYear(), date.getMonth(), date.getDate(), currentNewCourseHours, currentNewCourseMinutes);
        setCurrentNewCourseDate(dateCreated);
        // console.log(dateCreated);
    }
    const changeNewCourseHoursHandler = (number) => {
        var oldDate = currentNewCourseDate;
        if (number > 23) number = 0;
        else if (number < 0) number = 23;
        setCurrentNewCourseHours(number);
        let dateCreated = new Date(oldDate.getFullYear(), oldDate.getMonth(), oldDate.getDate(), number, currentNewCourseMinutes);
        setCurrentNewCourseDate(dateCreated);
        // console.log(dateCreated);
    }
    const changeNewCourseMinutesHandler = (number) => {
        var oldDate = currentNewCourseDate;
        if (number > 59) number = 0;
        else if (number < 0) number = 59;
        setCurrentNewCourseMinutes(number);
        let dateCreated = new Date(oldDate.getFullYear(), oldDate.getMonth(), oldDate.getDate(), currentNewCourseHours, number);
        setCurrentNewCourseDate(dateCreated);
        // console.log(dateCreated);
    }

    const deleteCourseHandler = (id, courseType) => {
        
        if (!deleteInfoReceived) {
            setDeleteInfoVisible(true); 
        } else {
            DB.removeCourseFromList(id, courseType, () => {
                loadData(() => {});
            });
        }
    }

    const selectCourseHandler = (courseInfo) => {
        navigation.navigate("Course", { courseInfo: courseInfo, currentUserId: currentUserID } );
    }

    const ErrorInfoHandler = ( props ) => {
        if (props.visible) return (
            <Text style= { [boxes.unPaddedRow, texts.errorLine] } >
                { props.message }
            </Text>
        );
        else return (
            <Padding height= { 18.5 } />
        );
    }

    return(
        <View style= { { 
            backgroundColor: colors.lightGrey, 
            height: window.height-80,
        } } >

            {/* Info-Einblendung */}
            <InfoModal visible= { deleteInfoVisible }
                onPress= { () => {
                    setDeleteInfoVisible(false); 
                    DB.setInfoReceived("deleteCourse"); 
                    setDeleteInfoReceived(true); } }
                title="Kurs aus Liste löschen"
                copy="Durch diese Aktion wird der Kurs aus deiner Liste entfernt. Möchtest du einen Kurs in der Liste behalten, aber kein Mitglied sein, tritt stattdessen auf der Kurs-Seite aus. Natürlich kannst du einen entfernten Kurs jederzeit über den Finden-Button wieder hinzufügen."
            />
            <InfoModal visible= { findErrorVisible }
                onPress= { () => { setFindErrorVisible(false); } }
                title="Ungültige Eingabe"
                copy={findErrorVisible}
            />

            {/* Kurs erstellen */}
            <Modal 
                transparent= {true}
                visible= { newCourseVisible } 
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
                            <Text style= { [texts.titleCentered, { alignSelf: 'center' }] } >Kurs erstellen</Text>
                        </View>
                    ) } }
                    content= { () => 
                        <View style= { boxes.mainContainer } >
                            <View style= { boxes.paddedRow }>
                                <View style= { { width: '50%' } } >
                                    <InputField
                                        title= "Kursname"
                                        placeholderText= "Bitte einen Namen eingeben."
                                        value={currentNewCourseName}
                                        onChangeText={changeNewCourseNameHandler}
                                    />
                                    <ErrorInfoHandler 
                                        visible= { newCourseNameErrorVisible }
                                        message= 'Gebe einen Kursnamen an'
                                    />
                                    <InputField
                                        title= "Kürzel"
                                        placeholderText= "Bitte ein Kürzel eingeben."
                                        value={currentNewCourseAcronym}
                                        onChangeText={changeNewCourseAcronymHandler}
                                    />
                                    <ErrorInfoHandler  
                                        visible= { newCourseAcronymErrorVisible }
                                        message= 'Gebe ein Kürzel für den Kurs ein.'
                                    />
                                    <InputField
                                        title= "Emil-Link"
                                        placeholderText= {"Optional einen Link eingeben."}
                                        value={currentNewCourseLink}
                                        onChangeText={changeNewCourseLinkHandler}
                                    />
                                    <Padding height= { 18.5 } />
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
                                    <Padding height= { 18.5 } />
                                    <Text style= { texts.subHeader } >Einteilungs-Uhrzeit in Stunden und Minuten</Text>
                                    <View style={boxes.unPaddedRow}>
                                        
                                        <TimeInput
                                            type={'hours'}
                                            title= {""}
                                            value= {currentNewCourseHours}
                                            onChange={changeNewCourseHoursHandler}
                                            />
                                        <TimeInput
                                            type={'minutes'}
                                            title= {""}
                                            value= {currentNewCourseMinutes}
                                            onChange={changeNewCourseMinutesHandler}
                                        />
                                    </View>
                                </View>
                                <Padding width= { 15 } />
                                <View>
                                    <Text style= { texts.subHeader } >End-Datum</Text>
                                    <DateModal
                                        visible= { true }
                                        onPress= { (date) => { changeNewCourseDateHandler(date) } }
                                    />
                                </View>
                            </View>
                            <Padding height= { 18.5 } />
                            <Text style={[boxes.unPaddedRow, texts.errorLine]}>
                                Eine Kurs-ID wird aus dem Kürzel und dem Semester und Jahr des End-Datums erzeugt.
                            </Text>
                        </View> 
                    }
                    onDismiss= { (commit) => { pressNewCourseHandler(commit) } }
                    // onDismiss= { () => { console.log('currentNewCourseId = ' + currentNewCourseId)}}
                />
            </Modal>

            {/* Find & Create Buttons */}
            <View style= { boxes.subHeader } >
                <View style= { [boxes.paddedRow, boxes.width, { paddingBottom: 15 } ] } >
                    <View>
                        { findCourseVisible &&
                            <View style= { [boxes.unPaddedRow, { width: 200 } ] }>
                                <InputField
                                    isCloseable= { true }
                                    closeButton= { () => setFindCourseVisible(false) }
                                    placeholderText= "Kurs-ID eingeben"
                                    value= { currentFindCourseId }
                                    onChangeText= { changeFindCourseIdHandler }
                                />
                                <Padding width= { 15 } />
                                <ButtonSmall
                                    title= { "Kurs finden"}
                                    icon= { "find" }
                                    onPress= { () => {
                                        pressFindCourseHandler(true)
                                        // setFindCourseVisible(true)
                                } } />
                            </View>
                        }
                        { !findCourseVisible &&
                            <ButtonSmall
                                title= { "Kurs finden"}
                                icon= { "find" }
                                onPress= { () => { setFindCourseVisible(true) } }
                            />
                        }
                    </View>
                    <ButtonSmall
                        title= { "Neuer Kurs" }
                        icon= { "plus" }
                        onPress= { () => {setNewCourseVisible(true) } }
                    />
                </View>
            </View>

            {/* Course-List */}
            <SectionList 
                data = { Object.keys(currentCourses) }
                onPress= { (item) => { selectCourseHandler(item) } }
                onDelete= { (id, courseType) => deleteCourseHandler(id, courseType) }
                currentCourses = { currentCourses }
            />
        </View>
    );
}