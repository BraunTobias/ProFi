import React, {useState, useLayoutEffect, useEffect}from "react";
import {FlatList, Modal, View, TextInput, Text, TouchableWithoutFeedback, Keyboard} from "react-native";
import ListTile from "../components/ListTile";
import {Button} from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import {Ionicons} from '@expo/vector-icons';
import DB from '../api/DB_API';
import InputTile from "../components/InputTile";
import NogoButton from "../components/NogoButton";


export default HomeScreen = ({navigation}) => {

    const [currentCourses, setCurrentCourses] = useState([]);
    const [addCourseVisibility, setAddCourseVisibility] = useState(false);
    const [currentCourseName, setCurrentCourseName] = useState("");
    const [currentMinMembers, setCurrentMinMembers] = useState("");
    const [currentMaxMembers, setCurrentMaxMembers] = useState("");
    // Später noch getrennte Warnungsfelder anlegen
    const [currentWarning, setCurrentWarning] = useState("");
  
    // Wird nur beim Laden der Seite einmalig ausgeführt
    useEffect(() => {
        DB.getCourseList((courseList) => {
            console.log(courseList);
            setCurrentCourses(courseList);
        });
    }, []);
    
    //Button fürs Hinzufügen der Fähigkeiten
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight : () => (
                <Button 
                    type ='clear'
                    icon={<Ionicons name='ios-add' size={32} color="rgb(0,122,255)"/>}
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
                    console.log("add");
                    DB.addCourse(currentCourseName, "00.00.0000", currentMinMembers, currentMaxMembers, () => {
                        setAddCourseVisibility(false);
                        setCurrentCourseName("");
                        setCurrentMinMembers("");
                        setCurrentMaxMembers("");
                        DB.getCourseList((courseList) => {
                            console.log(courseList);
                            setCurrentCourses(courseList);
                        });
                    });
                } else {
                    setCurrentWarning("Minimum muss kleiner sein als Maximum");
                }
            } else {
                setCurrentWarning("Eingabe nicht vollständig");
            }
        } else {
            setAddCourseVisibility(false);
        }
    }

    const setCourseNameHandler = (enteredText) => {
        setCurrentCourseName(enteredText);
    }

    const setMinMaxMembersHandler = (enteredNumber, isMin) => {
        if (enteredNumber) {
            if (parseInt(enteredNumber)) {
                enteredNumber = parseInt(enteredNumber);
                console.log(parseInt(enteredNumber));
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
            if (isMin) setCurrentMinMembers("");
            else setCurrentMaxMembers("");
            setCurrentWarning("Bitte Zahl eingeben");
        }
    }
    


    return (
        <View>
            <Modal visible={addCourseVisibility} animationType='slide'>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={{flex:1, padding: 100}}>
                        {/* <InputTile id="test" placeholderText="Kursname"/>
                        <InputTile placeholderText="minimale Mitglieder" keyboardType="numeric"/>
                        <InputTile placeholderText="maximale Mitglieder" keyboardType="numeric"/> */}
                        <TextInput 
                            placeholder={"Kursname"} 
                            onChangeText={setCourseNameHandler}
                            value={currentCourseName}/>
                        <TextInput 
                            placeholder={"Minimale Mitgliederzahl"} 
                            onChangeText={(text) => {setMinMaxMembersHandler(text, true)}} 
                            keyboardType='numeric'
                            value={currentMinMembers}/>
                        <TextInput 
                            placeholder={"Maximale Mitgliederzahl"} 
                            onChangeText={(text) => {setMinMaxMembersHandler(text, false)}} 
                            keyboardType='numeric'
                            value={currentMaxMembers}/>
                        <Text>
                            {currentWarning}
                        </Text>
                        <Button title='OK' onPress={() => {addCourseHandler(true)}}/>
                        <Button title='Abbrechen'onPress={() => {addCourseHandler(false)}}/>
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
                        />
                    )
                }}
                renderHiddenItem={ (itemData) => {
                    return (
                        <View style={{height: "100%", width: 150, flexDirection: "row", alignItems: "center", justifyContent: "center",}}>
                            <FavButton/>
                            <NogoButton/>
                        </View>
                    )
                }}
                leftOpenValue={150}
                rightOpenValue={-75}
            />

        </View>
  );
};


