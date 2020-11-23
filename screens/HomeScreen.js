import React, {useState, useEffect} from 'react';
import { View, Text, Modal, Keyboard, Alert, Animated, Switch } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { compareAsc, format } from 'date-fns';
import AsyncStorage from '@react-native-community/async-storage';

import { icons, colors, boxes, texts } from '../Styles';
import DB from '../api/DB_API';
import InputField from '../components/InputField';
import NumberInput from '../components/NumberInput';
import ButtonSmall from '../components/ButtonSmall';
import SwipeButton from '../components/SwipeButton';
import ListTile from "../components/ListTile";
import ModalContent from "../components/ModalContent";
import Padding from '../components/Padding';

export default HomeScreen = ({navigation}) => {

    const currentUserId = DB.getCurrentUserId();
    const defaultTime = new Date();
    defaultTime.setHours(12);
    defaultTime.setMinutes(0);

    // State Hooks
    const [currentCourses, setCurrentCourses] = useState([]);
    const [swipeListView, setSwipeListView] = useState();

    // State Hooks für Modals
    const [findCourseVisible, setFindCourseVisible] = useState(false);
    const [currentFindCourseId, setCurrentFindCourseId] = useState("");
    const [newCourseVisible, setNewCourseVisible] = useState(false);
    const [newCourseDateVisible, setNewCourseDateVisible] = useState(false);
    const [newCourseTimeVisible, setNewCourseTimeVisible] = useState(false);
    const [currentNewCourseName, setCurrentNewCourseName] = useState("");
    const [currentNewCourseId, setCurrentNewCourseId] = useState("");
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
          const deleteInfo = await AsyncStorage.getItem("deleteInfoReceived");
          if (deleteInfo == currentUserId) setDeleteInfoReceived(true);
        } catch(e) {console.log(e);}
    }
      
    const loadData = () => {
        DB.getCourseList((courseList) => {
            setCurrentCourses(courseList);
            getInfoReceived();
        });
    }

    // Wird nach dem Rendern ausgeführt
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData();
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
                loadData();
                setFindCourseVisible(false);
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
                DB.addCourse(currentNewCourseName, currentNewCourseId, currentNewCourseDate, currentNewCourseMinMembers, currentNewCourseMaxMembers, () => {
                    setNewCourseVisible(false);
                    setCurrentNewCourseName("");
                    setCurrentNewCourseId("");    
                    setCurrentNewCourseMinMembers(2);
                    setCurrentNewCourseMaxMembers(2);
                    setCurrentNewCourseDate(new Date());
                    loadData();
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
        setNewCourseTimeVisible(false);
        if (date - (new Date()) < 0) setNewCourseDateErrorVisible(true);
        else  setNewCourseDateErrorVisible(false);
    }
    const deleteCourseHandler = (id, date) => {
        if (!deleteInfoReceived) {
            setDeleteInfoVisible(true); 
        } else {
            swipeListView.safeCloseOpenRow();
            DB.removeCourseFromList(id, "courses", () => {
                loadData();
            });
        }
    };

    const selectCourseHandler = (id, title, date, userIsMember) => {
        swipeListView.safeCloseOpenRow();
        if (date) {
            navigation.navigate("Course", {itemId: id, itemTitle: title, isMember: userIsMember, itemDate: date, currentUserId: currentUserId});
        } else {
            navigation.navigate("Open course", {itemId: id, itemTitle: title, currentUserId: currentUserId});
        }
    }

    return(
        <View style={{flex:1}}>
            
            <InfoModal 
                visible={deleteInfoVisible}
                onPress={() => {setDeleteInfoVisible(false); storeInfoReceived("deleteInfoReceived"); setDeleteInfoReceived(true);}}
                title="Kurs aus Liste löschen"
                copy="Durch diese Aktion wird der Kurs aus deiner Liste entfernt. Möchtest du einen Kurs in der Liste behalten, aber kein Mitglied sein, tritt stattdessen auf der Kurs-Seite aus. Natürlich kannst du einen entfernten Kurs jederzeit über den Finden-Button wieder hinzufügen."
            />

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
                                    title= "Team-Einteilung"
                                    isButton= {true}
                                    showError={newCourseDateErrorVisible}
                                    icon={icons.date}
                                    placeholderText= "Datum auswählen …"
                                    value={format(currentNewCourseDate, "dd.MM.yyyy")}
                                    onPress={() => {setNewCourseDateVisible(true); Keyboard.dismiss()}}
                                />
                                {newCourseDateErrorVisible &&
                                    <Text style={[boxes.unPaddedRow, texts.errorLine]}>
                                        Das Datum muss in der Zukunft liegen.
                                    </Text>
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
                                    value={format(currentNewCourseDate, "hh:mm")}
                                    onPress={() => {setNewCourseTimeVisible(true); Keyboard.dismiss()}}
                                />
                                <DateTimePickerModal
                                    isVisible={newCourseTimeVisible}
                                    date={currentNewCourseDate}
                                    mode="time"
                                    headerTextIOS="Uhrzeit auswählen"
                                    cancelTextIOS="Abbrechen"
                                    confirmTextIOS="OK"
                                    onConfirm={changeNewCourseDateHandler}
                                    onCancel={() => {setNewCourseTimeVisible(false)}}
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
                        icon={icons.find}
                        onPress={() => {setFindCourseVisible(true)}}
                    />
                    <ButtonSmall
                        title={"Neuer Kurs"}
                        icon={icons.plus}
                        onPress={() => {setNewCourseVisible(true)}}
                    />
                </View>
            </View>

            <SwipeListView
                style={{backgroundColor: colors.white}}
                ref = {ref => setSwipeListView(ref)}
                sections={currentCourses}
                disableLeftSwipe = {true}
                keyExtractor={(item, index) => item.listKey}
                useSectionList
                onSwipeValueChange={onSwipeValueChange}
                renderSectionHeader={({ section }) => (
                        <View style={boxes.separator}>
                            <Text style={texts.separatorText}>{section.key}</Text>
                        </View>
                )}
                renderItem={({ item, index, section }) => { 
                    return (
                        <ListTile
                            onPress={() => {selectCourseHandler(item.id, item.title, item.date, item.userIsMember)}} 
                            id={item.id}
                            title={item.title}
                            subtitle={item.date ? item.members.length + " Mitglieder, Gruppengröße " + item.minMembers + "-" + item.maxMembers + "\n" + format(item.date.toDate(), "dd.MM.yyyy") : "Gruppengröße " + item.minMembers + "-" + item.maxMembers + "\n" + "Kein Datum"}
                            index = {index}
                            isMember = {item.userIsMember}
                        />
                    )
                }}
                renderHiddenItem={ ({item}) => {
                    return (
                        <Animated.View style={boxes.swipeRowOne}>
                            <SwipeButton
                                rowWidth={60}
                                animation={rowSwipeAnimatedValues[item.listKey]}
                                backgroundColor={colors.red}
                                icon={icons.delete}
                                onPress={(ref) => {deleteCourseHandler(item.id, item.date)}}
                            />
                        </Animated.View>
                    )
                }}
                leftOpenValue={60}
            />

        </View>

    )
}