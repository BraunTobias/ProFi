import React, {useState, useEffect, useContext} from 'react';
import { View, Text, Modal, Keyboard, Alert, Animated, Switch } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { compareAsc, format } from 'date-fns';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

import { icons, colors, boxes, texts } from '../Styles';
import DB from '../api/DB_API';
import InputField from '../components/InputField';
import NumberInput from '../components/NumberInput';
import Button from '../components/Button';
import SwipeButton from '../components/SwipeButton';
import SwipeButtonRow from '../components/SwipeButtonRow';
import ListTile from "../components/ListTile";
import ModalContent from "../components/ModalContent";
import Padding from '../components/Padding';
import SubHeader from '../components/SubHeader';
import FlexRow from '../components/FlexRow';
import SectionHeader from '../components/SectionHeader';
import { ThemeContext } from '../components/ThemeManager';

export default HomeScreen = ({navigation}) => {

    const {themeColors} = useContext(ThemeContext);

    const currentUserId = DB.getCurrentUserId();
    const defaultTime = new Date();
    defaultTime.setHours(12);
    defaultTime.setMinutes(0);

    // State Hooks
    const [currentCourses, setCurrentCourses] = useState([]);
    const [swipeListView, setSwipeListView] = useState();
    const [refreshing, setRefreshing] = useState(false);

    // State Hooks für Modals
    const [findCourseVisible, setFindCourseVisible] = useState(false);
    const [currentFindCourseId, setCurrentFindCourseId] = useState("");
    const [newCourseVisible, setNewCourseVisible] = useState(false);
    const [newCourseDateVisible, setNewCourseDateVisible] = useState(false);
    const [newCourseTimeVisible, setNewCourseTimeVisible] = useState(false);
    const [currentNewCourseName, setCurrentNewCourseName] = useState("");
    const [currentNewCourseId, setCurrentNewCourseId] = useState("");
    const [currentNewCourseLink, setCurrentNewCourseLink] = useState("");
    const [currentNewCourseDate, setCurrentNewCourseDate] = useState(defaultTime);
    const [newCourseNameErrorVisible, setNewCourseNameErrorVisible] = useState(false);
    const [newCourseIdErrorVisible, setNewCourseIdErrorVisible] = useState(false);
    const [newCourseDateErrorVisible, setNewCourseDateErrorVisible] = useState(false);
    const [currentNewCourseMinMembers, setCurrentNewCourseMinMembers] = useState(2);
    const [currentNewCourseMaxMembers, setCurrentNewCourseMaxMembers] = useState(2);
    const [deleteInfoVisible, setDeleteInfoVisible] = useState(false);
    const [deleteInfoReceived, setDeleteInfoReceived] = useState(false);

    // Icon-Animation
    const rowSwipeAnimatedValues = {};
    Array(100).fill('').forEach((_, i) => {
        rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
    });
    const onSwipeValueChange = (swipeData) => {
        const { key, value } = swipeData;
        rowSwipeAnimatedValues[key].setValue(Math.abs(value));
    };
      
    const loadData = (onSuccess) => {
        DB.getCourseList((courseList) => {
            setCurrentCourses(courseList);
            onSuccess();
        });
    }

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
    const changeFindCourseIdHandler = (enteredText) => {
        setCurrentFindCourseId(enteredText.toUpperCase());
    }
    const pressFindCourseHandler = (committed) => {
        if (committed && currentFindCourseId != "") {
            DB.addCourseToList(currentFindCourseId, (addedCourse) => {
                setCurrentFindCourseId("");
                loadData(() => {setFindCourseVisible(false);});
            }, (error) => {
                Alert.alert(
                    "Ungültige Eingabe",
                    error,
                    [{ text: "OK", onPress: () => {}}],
                );              
            })
        } else {
            setFindCourseVisible(false);
        }
    }
    const pressNewCourseHandler = (committed) => {
        if (committed) {
            if (currentNewCourseName != "" && currentNewCourseId != "" && currentNewCourseDate - (new Date()) >= 0) {
                DB.addCourse(currentNewCourseName, currentNewCourseId, currentNewCourseLink, currentNewCourseDate, currentNewCourseMinMembers, currentNewCourseMaxMembers, () => {
                    setNewCourseVisible(false);
                    setCurrentNewCourseName("");
                    setCurrentNewCourseId("");    
                    setCurrentNewCourseMinMembers(2);
                    setCurrentNewCourseMaxMembers(2);
                    setCurrentNewCourseDate(new Date());
                    loadData(() => {});
                }, (error) => {
                    Alert.alert(
                        "Ungültige Eingabe",
                        error,
                        [{ text: "OK", onPress: () => {}}],
                    );              
                });
            }    
            if (currentNewCourseName == "") setNewCourseNameErrorVisible(true);
            if (currentNewCourseId == "") setNewCourseIdErrorVisible(true);
            if (currentNewCourseDate - (new Date()) < 0) setNewCourseDateErrorVisible(true);
        }  else {
            setNewCourseVisible(false);
            setNewCourseNameErrorVisible(false);
            setNewCourseIdErrorVisible(false);
            setNewCourseDateErrorVisible(false);
        }
    }
    const changeNewCourseNameHandler = (enteredText) => {
        setCurrentNewCourseName(enteredText);
        if (enteredText != "") setNewCourseNameErrorVisible(false);
    }
    const changeNewCourseIdHandler = (enteredText) => {
        setCurrentNewCourseId(enteredText.toUpperCase());
        if (enteredText != "") setNewCourseIdErrorVisible(false);
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
        var newDate = date;
        newDate.setSeconds(0);
        setNewCourseDateVisible(false);
        setNewCourseTimeVisible(false);
        setCurrentNewCourseDate(newDate);
        if (newDate - (new Date()) < 0) setNewCourseDateErrorVisible(true);
        else  setNewCourseDateErrorVisible(false);
    };
    const deleteCourseHandler = (id) => {
        if (!deleteInfoReceived) {
            setDeleteInfoVisible(true); 
        } else {
            swipeListView.safeCloseOpenRow();
            DB.removeCourseFromList(id, "courses", () => {
                loadData(() => {});
            });
        }
    };

    const refreshListHandler = () => {
        setRefreshing(true);
        loadData(() => {setRefreshing(false);});
    };

    const selectCourseHandler = (courseInfo) => {
        swipeListView.safeCloseOpenRow();
        navigation.navigate("Course", {courseInfo: courseInfo, currentUserId: currentUserId});
    };

    return(
        <View style={{flex:1}}>
            
            <InfoModal 
                visible={deleteInfoVisible}
                onPress={() => {setDeleteInfoVisible(false); DB.setInfoReceived("deleteCourse"); setDeleteInfoReceived(true);}}
                title="Kurs aus Liste entfernen"
                copy="Durch diese Aktion wird der Kurs aus deiner Liste entfernt. Möchtest du einen Kurs in der Liste behalten, aber kein Mitglied sein, tritt stattdessen auf der Kurs-Seite aus. Natürlich kannst du einen entfernten Kurs jederzeit über den Finden-Button wieder hinzufügen."
            />

            {/* Kurs finden */}
            <Modal visible= { findCourseVisible } animationType= 'slide' onRequestClose={() => setFindCourseVisible(false)}>
                <ModalContent
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={[texts.titleCentered, {color: themeColors.textCopy}]}>{"Kurs finden"}</Text>
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
            <Modal visible= { newCourseVisible } animationType= 'slide' onRequestClose={() => setNewCourseVisible(false)}>
                <ModalContent
                    content= { () => 
                            <ScrollView nestedScrollEnabled={true} alwaysBounceVertical={false} contentContainerStyle= {boxes.mainContainer}>
                                <Text style={[texts.titleCentered, {color: themeColors.textCopy}]}>{"Kurs erstellen"}</Text>
                                <InputField
                                    title= "Kursname"
                                    showError={newCourseNameErrorVisible}
                                    placeholderText= {newCourseNameErrorVisible ? "Bitte einen Namen eingeben." : "z.B. Mobile Systeme"}
                                    value={currentNewCourseName}
                                    onChangeText={changeNewCourseNameHandler}
                                />
                                <InputField
                                    title= "Kurs-Kürzel"
                                    showError={newCourseIdErrorVisible}
                                    placeholderText= {newCourseIdErrorVisible ? "Bitte ein Kürzel eingeben." : "z.B. MOSY"}
                                    value={currentNewCourseId}
                                    onChangeText={changeNewCourseIdHandler}
                                />
                                <InputField
                                    title= "Emil-Link"
                                    placeholderText= {"Hier Link einsetzen"}
                                    value={currentNewCourseLink}
                                    onChangeText={changeNewCourseLinkHandler}
                                />
                                <Padding height={5}/>
                                <Text style={[texts.copy, {width: "100%", color: themeColors.textCopy}]}>Aus dem Kürzel und dem Semester des Einteilungs-Datums wird die Kurs-ID erstellt.</Text>
                                <Padding height={15}/>
                                <InputField
                                    title= "Team-Einteilung"
                                    isButton= {true}
                                    showError={newCourseDateErrorVisible}
                                    icon={icons.date}
                                    placeholderText= "Datum auswählen …"
                                    value={format(currentNewCourseDate, "dd.MM.yyyy")}
                                    onPress={() => {setNewCourseDateVisible(true); Keyboard.dismiss()}}
                                />
                                
                                {newCourseDateErrorVisible &&
                                    <FlexRow>
                                        <Text style={texts.errorLine}>
                                            Das Datum muss in der Zukunft liegen.
                                        </Text>
                                    </FlexRow>
                                }
                                <DateTimePickerModal
                                    isVisible={newCourseDateVisible}
                                    date={currentNewCourseDate}
                                    mode="date"
                                    headerTextIOS="Datum auswählen"
                                    cancelTextIOS="Abbrechen"
                                    confirmTextIOS="OK"
                                    onConfirm={changeNewCourseDateHandler}
                                    onCancel={() => {setNewCourseDateVisible(false)}}
                                />
                                <InputField
                                    isButton={true}
                                    icon={icons.time}
                                    placeholderText= "Uhrzeit auswählen …"
                                    value={format(currentNewCourseDate, "HH:mm")}
                                    onPress={() => {setNewCourseTimeVisible(true); Keyboard.dismiss()}}
                                />
                                <DateTimePickerModal
                                    isVisible={newCourseTimeVisible}
                                    date={currentNewCourseDate}
                                    mode="time"
                                    locale="en_GB"
                                    is24Hour={true}
                                    headerTextIOS="Uhrzeit auswählen"
                                    cancelTextIOS="Abbrechen"
                                    confirmTextIOS="OK"
                                    onConfirm={changeNewCourseDateHandler}
                                    onCancel={() => {setNewCourseTimeVisible(false)}}
                                />
                                <Padding height={10}/>
                                <FlexRow>
                                    <NumberInput
                                        title= {"Mitglieder min."}
                                        value= {currentNewCourseMinMembers}
                                        onChange={changeNewCourseMinMembersHandler}
                                    />
                                    <Padding width={10}/>
                                    <NumberInput
                                        title= {"Mitglieder max."}
                                        value= {currentNewCourseMaxMembers}
                                        onChange={changeNewCourseMaxMembersHandler}
                                    />
                                </FlexRow>

                            </ScrollView> 
                    }
                    onDismiss= {(committed) => {pressNewCourseHandler(committed)}}
                />
            </Modal>


            <SubHeader>
                <FlexRow padding>
                    <Button
                        title={"Kurs finden"}
                        icon={icons.find}
                        onPress={() => {setFindCourseVisible(true)}}
                    />
                    <Padding width={10}/>
                    <Button
                        title={"Neuer Kurs"}
                        icon={icons.plus}
                        onPress={() => {setNewCourseVisible(true)}}
                    />
                </FlexRow>
            </SubHeader>

            <SwipeListView
                style={{backgroundColor: themeColors.base}}
                ref = {ref => setSwipeListView(ref)}
                sections={currentCourses}
                disableLeftSwipe = {true}
                keyExtractor={(item, index) => item.listKey}
                useSectionList
                onRefresh={refreshListHandler}
                refreshing={refreshing}
                onSwipeValueChange={onSwipeValueChange}
                renderSectionHeader={({ section }) => (
                    <SectionHeader text={section.key}/>
                )}
                renderItem={({ item, index, section }) => { 
                    return (
                        <ListTile
                            onPress={() => {selectCourseHandler(item)}} 
                            id={item.id}
                            title={item.title}
                            subtitle={item.date ? item.members.length + " Mitglieder, Gruppengröße " + item.minMembers + "-" + item.maxMembers + "\n" + format(item.date.toDate(), "dd.MM.yyyy") : "Gruppengröße " + item.minMembers + "-" + item.maxMembers + "\n" + "Kein Datum"}
                            index = {index}
                            isMember = {item.userIsMember}
                            myTeam= {item.evaluated && item.members.indexOf(currentUserId) >= 0}
                            inactive= {item.evaluated && item.members.indexOf(currentUserId) < 0}
                        />
                    )
                }}
                renderHiddenItem={ ({item}) => {
                    return (
                        <SwipeButtonRow>
                            <SwipeButton
                                rowWidth={80}
                                animation={rowSwipeAnimatedValues[item.listKey]}
                                backgroundColor={themeColors.red}
                                icon={icons.exit}
                                onPress={(ref) => {deleteCourseHandler(item.id, item.date)}}
                            />
                        </SwipeButtonRow>
                    )
                }}
                leftOpenValue={60}
            />

        </View>

    )
}