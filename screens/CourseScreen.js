import React, {useState, useEffect, useLayoutEffect} from 'react';
import {View, Text, FlatList, Modal, TouchableWithoutFeedback, TextInput, Keyboard } from "react-native";
import ListTile from '../components/ListTile';
import {Button} from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import {Ionicons} from '@expo/vector-icons';
import SkillSelect from '../components/SkillSelect';
import DB from '../api/DB_API';
import ProfileImageTile from '../components/ProfileImageTile';

export default CourseScreen = ({route, navigation}) => {
    const {itemId} = route.params;
    const {itemTitle} = route.params;

    // States für Profil-Ansicht
    const [viewedUserId, setViewedUserId] = useState(false);
    const [profileVisibility, setProfileVisibility] = useState(false);

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
    const [members, setMembers] = useState([]);
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

            setDate(data.date);
            setMinMembers(data.minMembers);
            setMaxMembers(data.maxMembers);

            if (data.members && data.members.length > 0) {
                const memberUidList = data.members;
                var newMembersList = [];
                for (const member in memberUidList) {
                    const uid = memberUidList[member];
                    DB.getUserInfoById(uid, (name, url) => {
                        newMembersList.push({
                            "userId": uid,
                            "username": name,
                            "imageUrl": url
                        });
                        setMembers(newMembersList);
                    });
                }
            }
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


    const clickIdeaHandler = (id, title, subtitle, skills) => {
        navigation.navigate("Project", {itemId: id, itemTitle: title, itemSubtitle: subtitle, skillsList: skills, courseId: itemId});
    };

    const clickProfileHandler = (userId) => {
        setProfileVisibility(true);
        setViewedUserId(userId);
        console.log("User ID: " + viewedUserId);
    };

    const addIdeaHandler = (isAdd) => {
        if (isAdd) {
            if (currentIdeaName != "" && currentIdeaDescription != "" && selectedSkillsList.length > 1) {
                    DB.addIdea(itemId, currentIdeaName, currentIdeaDescription, selectedSkillsList, [], () => {
                        setAddIdeaVisibility(false);
                        setCurrentIdeaName("");
                        setCurrentIdeaDescription("");
                        setSelectedSkillsList([]);
                        DB.getIdeasList(itemId, (ideasList) => {
                            setCurrentIdeas(ideasList);
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

            {/* // User-Profil ansehen */}
            <Modal visible={profileVisibility} animationType='slide'>
                    <View style={{height: "85%"}}>
                        <View style={{backgroundColor: "#222f56", height: 110, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: 30, top: 20, fontWeight: "bold", color: "white"}}>Profil ansehen</Text>
                        </View>
                        <ProfileView userId={viewedUserId}></ProfileView>
                    </View>
                    <Button title='OK' onPress={() => {setProfileVisibility(false)}}/>
            </Modal>

            <Text>Datum: {date + "\n"}Gruppengröße: {minMembers}–{maxMembers} Personen</Text>
            <FlatList
                data={members}
                horizontal={true}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(itemData) => { 
                    return (
                        <ProfileImageTile
                            onClick={() => {clickProfileHandler(itemData.item.userId)}} 
                            imageUrl={itemData.item.imageUrl}
                        />
                    );
                }}
            >

            </FlatList>

            
            {/* <FlatList
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
            /> */}

            <SwipeListView
                data={currentIdeas}
                renderItem={(itemData) => { 
                    return (
                        <ListTile
                            onClick={clickIdeaHandler} 
                            id={itemData.item.id}
                            title={itemData.item.title}
                            subtitle={itemData.item.description}
                            skills={itemData.item.skills}
                            backgroundColor = {itemData.index % 2 === 0 ? "#ffffff" : "#f5f7f7"}
                        />
                    );
                }}
                renderHiddenItem={ (itemData) => {
                    return (
                        <View style={{height: "100%", width: 150, flexDirection: "row", alignItems: "center", justifyContent: "center",}}>
                            <FavButton ideaId={itemData.item.id} courseId={itemId}/>
                            <NogoButton ideaId={itemData.item.id} courseId={itemId}/>
                        </View>
                    )
                }}
                leftOpenValue={150}
                rightOpenValue={-75}
            />

        </View>
  );

}