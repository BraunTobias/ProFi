import React, {useState, useLayoutEffect, useEffect}from "react";
import {FlatList, Modal, View, TextInput, Text, TouchableWithoutFeedback, Keyboard} from "react-native";
import ListTile from "../components/ListTile";
import {Button} from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import {Ionicons} from '@expo/vector-icons';
import DB from '../api/DB_API';
import InputTile from "../components/InputTile";
import JoinCourseButton from "../components/JoinCourseButton";
import { styles, buttons, texts, white, lightGrey, iconsizeAdd } from "../Styles"

export default HomeScreen = ({navigation}) => {
    const currentUserId = DB.getCurrentUserId();

    const [currentCourses, setCurrentCourses] = useState([]);
    const [joinedCourses, setJoinedCourses] = useState([]);

    const [addCourseVisibility, setAddCourseVisibility] = useState(false);
    const [currentCourseName, setCurrentCourseName] = useState("");
    const [currentMinMembers, setCurrentMinMembers] = useState("");
    const [currentMaxMembers, setCurrentMaxMembers] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    // Später noch getrennte Warnungsfelder anlegen
    const [currentWarning, setCurrentWarning] = useState("");
    const [nameError, setNameError] = useState("");
    const [minMembersError, setMinMemebersError] = useState("");
    const [maxMembersError, setMaxMembersError] = useState("");
    const [dateError, setDateError] = useState("");
  
    // Wird nur beim Laden der Seite einmalig ausgeführt
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
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

    }, []);
    
    // Button fürs Hinzufügen neuer Kurse
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight : () => (
                <Button 
                    type ='clear'
                    icon={<Ionicons name='ios-add' size={iconsizeAdd} color={white}/>}
                    onPress={() => {setAddCourseVisibility(true)}}
                />)
        });
    }, [navigation]);
    
    const clickHandler = (id, title, date, members, minMembers, maxMembers) => {
        // DB.signOut(() => {console.log("SIGNED OUT");});
        navigation.navigate("Course", {itemId: id, itemTitle: title, itemDate: date, members: members, minMembers: minMembers, maxMembers: maxMembers});
    };

    const addCourseHandler = (isAdd) => {
        if (isAdd) {
            if (currentCourseName != "" && currentMinMembers != "" && currentMaxMembers != "") {
                if (parseInt(currentMinMembers) <= parseInt(currentMaxMembers)) {
                    if (currentDate !== "") {
                        console.log("add");
                        DB.addCourse(currentCourseName, currentDate, currentMinMembers, currentMaxMembers, () => {
                            setAddCourseVisibility(false);
                            setCurrentCourseName("");
                            setCurrentMinMembers("");
                            setCurrentMaxMembers("");
                            setCurrentDate("");
                            DB.getCourseList((courseList) => {
                                console.log(courseList);
                                setCurrentCourses(courseList);
                            });
                        });
                    } else {
                        console.log("add");
                        DB.addCourse(currentCourseName, "00.00.0000", currentMinMembers, currentMaxMembers, () => {
                            setAddCourseVisibility(false);
                            setCurrentCourseName("");
                            setCurrentMinMembers("");
                            setCurrentDate("");
                            DB.getCourseList((courseList) => {
                                console.log(courseList);
                                setCurrentCourses(courseList);
                            });
                        });
                    }
                } else {
                    setMaxMembersError("Maximum muss größer sein als das Minimum");
                }
            } else {
                setCurrentWarning("Eingabe nicht vollständig");
            }
        } else {
            setAddCourseVisibility(false);
        }
    };

    const setCourseNameHandler = (enteredText) => {
        if (enteredText) {
            if (true) {
                // CHECK name-scheme
                setCurrentCourseName(enteredText);
            } else {
                setNameError("Bitte ans Namens-Schema halten")
            }
        } else {
            setCurrentCourseName("")
            setNameError("Bitte einen Kursnamen eingeben")
        }
    };

    const setMinMaxMembersHandler = (enteredNumber, isMin) => {
        if (enteredNumber) {
            if (parseInt(enteredNumber)) {
                enteredNumber = parseInt(enteredNumber);
                //console.log(parseInt(enteredNumber));
                setCurrentWarning("");
                if (enteredNumber < 1) {
                    if (isMin) setCurrentMinMembers("1");
                    else setCurrentMaxMembers("1");
                } else if (enteredNumber > 20) {
                    if (isMin) setCurrentMinMembers("20");
                    else setCurrentMaxMembers("20");
                } else {
                    if (isMin) setCurrentMinMembers(String(enteredNumber));
                    else setCurrentMaxMembers(String(enteredNumber));
                }
            } else {
                // setCurrentWarning("Das ist keine Zahl");
                if (isMin) setCurrentMinMembers("");
                else setCurrentMaxMembers("");
            }
        } else {
            if (isMin) {
                setCurrentMinMembers("");
                setMinMemebersError("Bitte Zahl eingeben");
            } else {
                setCurrentMaxMembers("");
                setMaxMembersError("Bitte Zahl eingeben");
            }
        }
    }
  
    const setDateHandler = (enteredDate) => {
        if (enteredDate) {
            setCurrentDate(enteredDate)
            // parse enteredDate
        } else {
            setDateError("Bitte Datum eingeben");
        }
    }

    const joinCourseHandler = (courseId) => {
        if (joinedCourses.indexOf(courseId) < 0) {
            DB.joinCourse(courseId, () => {
                const joinedList = joinedCourses;
                joinedList.push(courseId);    
                console.log(joinedList);
                setJoinedCourses(joinedList);
            }, () => {})
        } else {
            DB.exitCourse(courseId, () => {
                const newJoinedList = joinedCourses.filter(course => course !== courseId);
                setJoinedCourses(newJoinedList);
                console.log("Ausgetreten" + newJoinedList);
            })
        }
    }

    return (
        <View>
            <Modal visible= { addCourseVisibility } animationType= 'slide'>
                <View style= { styles.modal } >
                    <TouchableWithoutFeedback onPress= { () => Keyboard.dismiss() } >
                        <View>
                            <View style= { styles.headerFake } >
                                <Text style= { texts.headerText } >Kurs erstellen</Text>
                            </View>
                            <View style= { styles.contentFake } >
                                <View>
                                    <View style= { styles.loginInput } >
                                        <Text style= { texts.headline } >Kursname</Text>
                                        <TextInput 
                                            textAlign= {'left'}
                                            style= { texts.inputText }
                                            placeholder= { "KürzelSemesterJahr" } 
                                            onChangeText= { setCourseNameHandler }
                                            value= { currentCourseName }
                                        />
                                        <Text>
                                            { nameError }
                                        </Text>
                                    </View>
                                    
                                    <View style= { styles.loginInput } >
                                        <Text style= { texts.headline } >Minimale Mitgliederzahl</Text>
                                        <TextInput 
                                            textAlign= { 'left' }
                                            style= { texts.inputText }
                                            placeholder= '2'
                                            onChangeText= { (text) => { setMinMaxMembersHandler(text, true) } } 
                                            keyboardType= 'numeric'
                                            value= { currentMinMembers }
                                        />
                                        <Text>
                                            { minMembersError }
                                        </Text>
                                    </View>

                                    <View style= { styles.loginInput } >
                                        <Text style= { texts.headline } >Maximale Mitgliederzahl</Text>
                                        <TextInput 
                                            textAlign= { 'left' }
                                            style= { texts.inputText }
                                            placeholder= 'n'
                                            onChangeText= { (text) => { setMinMaxMembersHandler(text, false) } } 
                                            keyboardType= 'numeric'
                                            value= { currentMaxMembers }
                                        />
                                        <Text>
                                            { maxMembersError }
                                        </Text>
                                    </View>

                                    <View style= { styles.loginInput } >
                                        <Text style= { texts.headline } >Enddatum (optional)</Text>
                                        <TextInput 
                                            textAlign= { 'left' }
                                            style= { texts.inputText }
                                            placeholder= 'TT.MM.JJJJ'
                                            onChangeText= { (text) => { setDateHandler(text) } } 
                                            keyboardType= 'numeric'
                                            value= { currentDate }
                                        />
                                        <Text>
                                            { dateError }
                                        </Text>
                                    </View>

                                    <Text>
                                    { currentWarning }
                                </Text>
                                </View>
                                <View style= { styles.row } >
                                    <Button 
                                        buttonStyle= { buttons.buttonRow }
                                        titleStyle= { texts.buttonBlue }
                                        title= 'OK' 
                                        onPress= { () => { addCourseHandler(true) } }
                                    />
                                    <Button 
                                        buttonStyle= { buttons.buttonRow }
                                        titleStyle= { texts.buttonBlue }
                                        title= 'Abbrechen'
                                        onPress= { () => { addCourseHandler(false) } }
                                    />
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Modal>

            {/* <FlatList
                data = {currentCourses}
                renderItem={(itemData) => { 
                    return (
                        <ListTile
                            onClick={clickHandler} 
                            id={itemData.item.id}
                            title={itemData.item.title}
                            subtitle={"Gruppengröße: " + itemData.item.minMembers + " – " + itemData.item.maxMembers + " Personen\n "+ itemData.item.date}
                        />
                    )
                }}
            /> */}
            <SwipeListView
                data={currentCourses}
                renderItem={(itemData) => { 
                    return (
                        <ListTile
                            onClick={clickHandler} 
                            id={itemData.item.id}
                            title={itemData.item.title}
                            subtitle={"Gruppengröße: " + itemData.item.minMembers + " – " + itemData.item.maxMembers + " Personen\n "+ itemData.item.date}
                            backgroundColor = {itemData.index % 2 === 0 ? white : lightGrey}
                            isMember = {joinedCourses.indexOf(itemData.item.id) >= 0}
                        />
                    )
                }}
                renderHiddenItem={ (itemData) => {
                    return (
                        <View style={{height: "100%", width: 75, flexDirection: "row", alignItems: "center", justifyContent: "center",}}>
                            <JoinCourseButton
                                backgroundColor={"#222f56"}
                                onClick={() => {joinCourseHandler(itemData.item.id)}}
                                isActive={joinedCourses.indexOf(itemData.item.id) >= 0}
                            />
                        </View>
                    )
                }}
                leftOpenValue={75}
            />

        </View>
  );
};


