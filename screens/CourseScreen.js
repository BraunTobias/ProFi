import React, {useState, useEffect, useLayoutEffect} from 'react';
import {View, Text, FlatList, Modal, TouchableWithoutFeedback, TextInput, Keyboard } from "react-native";
import ListTile from '../components/ListTile';
import {Button} from 'react-native-elements';
import {Ionicons} from '@expo/vector-icons';
import SkillSelect from '../components/SkillSelect';
import DB from '../api/DB_API';

export default CourseScreen = ({route, navigation}) => {
    const {itemId} = route.params;
    const {itemTitle} = route.params;
    // const {itemDate} = route.params;
    // const {members} = route.params;
    // const {minMembers} = route.params;
    // const {maxMembers} = route.params;

    // States für Idea-Eingabe
    const [addIdeaVisibility, setAddIdeaVisibility] = useState(false);
    const [skillsVisibility, setSkillsVisibility] = useState(false);
    const [currentIdeaName, setCurrentIdeaName] = useState("");
    const [currentIdeaDescription, setCurrentIdeaDescription] = useState("");
    const [selectedSkillsList, setSelectedSkillsList] = useState([]);

    // Später noch getrennte Warnungsfelder anlegen
    const [currentWarning, setCurrentWarning] = useState("");

    // States für Kursinfo
    const [currentIdeas, setCurrentIdeas] = useState([]);
    const [members, setMembers] = useState(["Keine"]);
    const [minMembers, setMinMembers] = useState(0);
    const [maxMembers, setMaxMembers] = useState(0);
    const [date, setDate] = useState("11.11.1111");

    // Wird nur beim Laden der Seite einmalig ausgeführt
    useEffect(() => {
        DB.getIdeasList(itemId, (ideasList) => {
            setCurrentIdeas(ideasList);
            console.log(ideasList);
        });
        DB.getCourseData(itemId, (data) => {
            console.log(data);
            if (data.members && data.members.length > 0) {
                setMembers(data.members);
            }
            setDate(data.date);
            setMinMembers(data.minMembers);
            setMaxMembers(data.maxMembers);
        });
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: itemTitle,
            headerRight : () => (
                <Button 
                    type ='clear' 
                    icon={<Ionicons name='ios-add'size={32} color="rgb(0,122,255)"/>}
                    onPress={() => {setAddIdeaVisibility(true)}}
                />)
        });
    }, [navigation]);


    const clickHandler = (id, title, subtitle, skills) => {
        navigation.navigate("Project", {itemId: id, itemTitle: title, itemSubtitle: subtitle, skillsList: skills, courseId: itemId});
    };

    const addIdeaHandler = (isAdd) => {
        if (isAdd) {
            if (currentIdeaName != "" && currentIdeaDescription != "" && selectedSkillsList.length > 1) {
                    console.log("add");
                    DB.addIdea(itemId, currentIdeaName, currentIdeaDescription, selectedSkillsList, [], () => {
                        setAddIdeaVisibility(false);
                        setCurrentIdeaName("");
                        setCurrentIdeaDescription("");
                        setSelectedSkillsList([]);
                        DB.getIdeasList(itemId, (ideasList) => {
                            setCurrentIdeas(ideasList);
                            console.log(ideasList);
                        });
                    });
            } else {
                setCurrentWarning("Eingabe nicht vollständig");
            }
        } else {
            setAddIdeaVisibility(false);
        }
    }
    
    const setIdeaNameHandler = (enteredText) => {
        setCurrentIdeaName(enteredText);
        setCurrentWarning("");
    }
    const setIdeaDesriptionHandler = (enteredText) => {
        setCurrentIdeaDescription(enteredText);
        setCurrentWarning("");
    }

    const addSelectedSkillHandler = (skill) => {
        console.log(skill);
        var oldList = selectedSkillsList;
        if (oldList.indexOf(skill) < 0) {
            oldList.push(skill);
        } else {
            var newList = oldList.filter(item => item !== skill);
            setSelectedSkillsList(newList);
        }
        if (selectedSkillsList.length > 0) {
            setCurrentWarning("");
        }
    }

    return(
        <View>
            <Modal visible={addIdeaVisibility} animationType='slide'>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                        <View>
                            <TextInput 
                                placeholder={"Idee"} 
                                onChangeText={setIdeaNameHandler}
                                value={currentIdeaName}/>
                            <TextInput 
                                placeholder={"Kurze Beschreibung"} 
                                onChangeText={setIdeaDesriptionHandler}
                                value={currentIdeaDescription}/>
                            <Text>
                                {currentWarning}
                            </Text>
                            <ListTile
                                title={"Fähigkeiten auswählen"}
                                subtitle={selectedSkillsList.join(", ")}
                                onClick={() => setSkillsVisibility(true)} 
                            />
                            <ListTile
                                title={"Präferenzen auswählen"}
                                subtitle={selectedSkillsList.join(", ")}
                                onClick={() => setSkillsVisibility(true)} 
                            />
                            <Button title='OK' onPress={() => {addIdeaHandler(true)}}/>
                            <Button title='Abbrechen'onPress={() => {addIdeaHandler(false)}}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

                <Modal visible={skillsVisibility} animationType='slide'>
                    <View style={{height: "85%"}}>
                        <View style={{backgroundColor: "#222f56", height: 110, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: 30, top: 20, fontWeight: "bold", color: "white"}}>Fähigkeiten auswählen</Text>
                        </View>
                        <SkillSelect selectedSkillsList={selectedSkillsList} addSelectedSkill={addSelectedSkillHandler} forIdea={true}></SkillSelect>
                    </View>
                    <Button title='OK' onPress={() => {setSkillsVisibility(false)}}/>
                </Modal>

            </Modal>

            <Text>Datum: {date + "\n"}Mitglieder: {members + "\n"}Gruppengröße: {minMembers}–{maxMembers} Personen</Text>
            <FlatList
            data={currentIdeas}
            renderItem={(itemData) => { 
                return (
                    <ListTile
                        onClick={clickHandler} 
                        id={itemData.item.id}
                        title={itemData.item.title}
                        subtitle={itemData.item.description}
                        skills={itemData.item.skills}
                    />
                );
            }}
            />
        </View>
  );

}