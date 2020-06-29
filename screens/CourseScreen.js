import React, {useState, useEffect, useLayoutEffect} from 'react';
import {View, SafeAreaView, Text, FlatList, Modal, TouchableWithoutFeedback, TextInput, Keyboard } from "react-native";
import ListTile from '../components/ListTile';
import {Button} from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import {Ionicons} from '@expo/vector-icons';
import AttributeSelect from '../components/AttributeSelect';
import DB from '../api/DB_API';
import ProfileImageTile from '../components/ProfileImageTile';
import { styles, buttons, texts, white, lightGrey, grey, black, iconsize, iconsizeAdd } from '../Styles';

export default CourseScreen = ({route, navigation}) => {
    const {itemId} = route.params;
    const {itemTitle} = route.params;
    const {isMember} = route.params;
    console.log(isMember);
    const currentUserId = DB.getCurrentUserId();
    const [swipeListView, setSwipeListView] = useState();

    // States für Profil-Ansicht
    const [viewedUserId, setViewedUserId] = useState(false);
    const [profileVisibility, setProfileVisibility] = useState(false);
    
    // States für Idea-Eingabe
    const [addIdeaVisibility, setAddIdeaVisibility] = useState(false);
    const [skillsVisibility, setSkillsVisibility] = useState(false);
    const [prefsVisibility, setPrefsVisibility] = useState(false);
    const [currentIdeaName, setCurrentIdeaName] = useState("");
    const [currentIdeaDescription, setCurrentIdeaDescription] = useState("");
    const [selectedSkillsList, setSelectedSkillsList] = useState([]);
    const [selectedPrefsList, setSelectedPrefsList] = useState([]);
    
    // Später noch getrennte Warnungsfelder anlegen
    const [ideaError, setIdeaError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [currentWarning, setCurrentWarning] = useState("");
    
    // States für Kursinfo
    const [currentIdeas, setCurrentIdeas] = useState([]);
    const [members, setMembers] = useState([]);
    const [minMembers, setMinMembers] = useState(0);
    const [maxMembers, setMaxMembers] = useState(0);
    const [date, setDate] = useState("");
    const [userIsMember, setUserIsMember] = useState(isMember);
    
    const [currentFav, setCurrentFav] = useState();
    const [currentNogo, setCurrentNogo] = useState();

    // Wird nur beim Laden der Seite einmalig ausgeführt
    useEffect(() => {
        DB.getIdeasList(itemId, (ideasList) => {
            setCurrentIdeas(ideasList);
            console.log(ideasList);
            for (const idea in ideasList) {
                if (ideasList[idea].favourites != null && ideasList[idea].favourites.indexOf(currentUserId) >= 0) {
                    setCurrentFav(ideasList[idea].id);
                } else if (ideasList[idea].nogos != null && ideasList[idea].nogos.indexOf(currentUserId) >= 0) {
                    setCurrentNogo(ideasList[idea].id);
                }
            }
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
                    icon={<Ionicons name='ios-add'size={iconsizeAdd} color={white}/>}
                    onPress={() => {setAddIdeaVisibility(true)}}
                />)
        });
    }, [navigation]);

    const clickIdeaHandler = (id, title, subtitle, skills) => {
        swipeListView.safeCloseOpenRow();
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
    };
    
    const setIdeaNameHandler = (enteredText) => {
        setCurrentIdeaName(enteredText);
        setCurrentWarning("");
    };

    const setIdeaDesriptionHandler = (enteredText) => {
        setCurrentIdeaDescription(enteredText);
        setCurrentWarning("");
    };

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
    };
    const addSelectedPrefHandler = (pref) => {
        var oldList = selectedPrefsList;
        if (oldList.indexOf(skill) < 0) {
            oldList.push(skill);
        } else {
            var newList = oldList.filter(item => item !== skill);
            setSelectedPrefsList(newList);
        }
        if (selectedPrefsList.length > 0) {
            setCurrentWarning("");
        }
    };
    const addFavHandler = (ideaId) => {
        swipeListView.safeCloseOpenRow();
        if (currentFav == ideaId) {
            DB.deletePref("favourites", itemId, () => {
                setCurrentFav("");
            });
        } else {
            DB.addPref("favourites", itemId, ideaId, () => {
                setCurrentFav(ideaId);
                if (currentNogo == ideaId) {
                    setCurrentNogo("");
                }
            });
        }
    }
    const addNogoHandler = (ideaId) => {
        swipeListView.safeCloseOpenRow();
        if (currentNogo == ideaId) {
            DB.deletePref("nogos", itemId, () => {
                setCurrentNogo("");
            });
        } else {
            DB.addPref("nogos", itemId, ideaId, () => {
                setCurrentNogo(ideaId);
                if (currentFav == ideaId) {
                    setCurrentFav("");
                }
            });
        }
    }
    const joinCourseHandler = () => {
        if (!userIsMember) {
            DB.joinCourse(itemId, () => {
                console.log("Joined");
                setUserIsMember(true);
            }, () => {console.log("error")})
        } else {
            DB.exitCourse(itemId, () => {
                console.log("Ausgetreten");
                setUserIsMember(false);
            })
        }
    }

    return(
        <View style={{flex: 1}}>
            <Modal visible={addIdeaVisibility} animationType='slide'>
                <SafeAreaView style= { styles.modal } >
                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                        <View>
                            <View style= { styles.headerFake } >
                                <Text style= { texts.headerText } >Idee hinzufügen</Text>
                            </View>
                            <View style= { styles.contentFake } >
                                
                                <View style= { styles.loginInput } >
                                    <Text style= { texts.headline } >Idee-Name</Text>
                                    <TextInput 
                                        textAlign= {'left'}
                                        style= { texts.inputText }
                                        placeholder= { "Idee" } 
                                        onChangeText= { setIdeaNameHandler }
                                        value= { currentIdeaName }
                                    />
                                    <Text>
                                        { ideaError }
                                    </Text>
                                </View>
                                
                                <View style= { styles.loginInput } >
                                    <Text style= { texts.headline } >Kurzbeschreibung</Text>
                                    <TextInput 
                                        textAlign= {'left'}
                                        style= { texts.inputText }
                                        placeholder= { "Eine kurze Beschreibung der Idee" } 
                                        onChangeText= { setIdeaDesriptionHandler }
                                        value= { currentIdeaDescription }
                                    />
                                    <Text>
                                        { descriptionError }
                                    </Text>
                                </View>
                                
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
                                    subtitle={selectedPrefsList.join(", ")}
                                    onClick={() => setPrefsVisibility(true)} 
                                />

                                <View style= { styles.row } >
                                    <Button 
                                        buttonStyle= { buttons.buttonRow }
                                        titleStyle= { texts.buttonBlue }
                                        title= 'OK' 
                                        onPress= { () => { addIdeaHandler(true) } }
                                    />
                                    <Button 
                                        buttonStyle= { buttons.buttonRow }
                                        titleStyle= { texts.buttonBlue }
                                        title= 'Abbrechen'
                                        onPress= { () => { addIdeaHandler(false) } }
                                    />
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </SafeAreaView>

                <Modal visible={skillsVisibility} animationType='slide'>
                    <View style={{height: "85%"}}>
                        <View style={{backgroundColor: "#222f56", height: 110, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: 30, top: 20, fontWeight: "bold", color: "white"}}>Fähigkeiten auswählen</Text>
                        </View>
                        <AttributeSelect 
                            attributeType={"skills"} 
                            selectedAttributesList={selectedSkillsList} 
                            addSelectedAttribute={addSelectedSkillHandler} 
                        >
                        </AttributeSelect>
                    </View>
                    <Button title='OK' onPress={() => {setSkillsVisibility(false)}}/>
                </Modal>
                <Modal visible={prefsVisibility} animationType='slide'>
                    <View style={{height: "85%"}}>
                        <View style={{backgroundColor: "#222f56", height: 110, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: 30, top: 20, fontWeight: "bold", color: "white"}}>Präferenzen auswählen</Text>
                        </View>
                        <AttributeSelect 
                            attributeType={"prefs"} 
                            selectedAttributesList={selectedPrefsList} 
                            addSelectedAttribute={addSelectedPrefHandler} 
                        >
                        </AttributeSelect>
                    </View>
                    <Button title='OK' onPress={() => {setPrefsVisibility(false)}}/>
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

            <View style= { styles.subHeader } >
                <View style= { styles.courseHeaderRow } >
                    <Text style= { texts.headline }>{date}</Text>
                    <Text style= { texts.headline }>{minMembers}–{maxMembers} Personen</Text>
                </View>

                <View style= { styles.membersRow } >
                </View>

                <View style= { styles.row } >
                    <Button 
                        buttonStyle= { buttons.buttonRowGrey }
                        titleStyle= { texts.buttonGrey }
                        title= {userIsMember ? 'Mitglied  ' : "Beitreten" }
                        icon= {<Ionicons name={userIsMember ? 'ios-checkbox' : 'ios-checkbox-outline'} size={iconsize} color={black}/>}
                        iconRight= {true}
                        onPress= {joinCourseHandler}
                    />
                    <Button 
                        buttonStyle= { buttons.buttonRow }
                        titleStyle= { texts.buttonBlue }
                        title= 'Neue Idee  '
                        icon= {<Ionicons name={'ios-add'} size={iconsize} color={white} />}
                        iconRight= {true}
                        onPress= { () => { setAddIdeaVisibility(true) } }
                    />
                </View>
            </View>
            
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

            <SwipeListView
                style={{flexGrow: 1}}
                ref = {ref => setSwipeListView(ref)}
                data={currentIdeas}
                disableLeftSwipe = {true}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(itemData) => { 
                    return (
                        <ListTile
                            onClick={clickIdeaHandler} 
                            id={itemData.item.id}
                            title={itemData.item.title}
                            subtitle={itemData.item.description}
                            skills={itemData.item.skills}
                            isFavourite={itemData.item.id == currentFav}
                            isNogo={itemData.item.id == currentNogo}
                            backgroundColor = {itemData.index % 2 === 0 ? white : lightGrey}
                        />
                    );
                }}
                renderHiddenItem={ (itemData) => {
                    return (
                        <View style={{width: "90%", backgroundColor: "#640023"}}>
                            <View style={{height: "100%", width: 120, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                                <FavButton 
                                    ideaId={itemData.item.id} 
                                    courseId={itemId} 
                                    backgroundColor={itemData.item.id == currentFav ? "#aeb8c3" : "#222f56"}
                                    iconColor={itemData.item.id == currentFav ? "#f2f3f4" : "white"}
                                    onClick={() => {addFavHandler(itemData.item.id)}}
                                />
                                <NogoButton 
                                    ideaId={itemData.item.id} 
                                    courseId={itemId} 
                                    backgroundColor={itemData.item.id == currentNogo ? "#aeb8c3" : "#640023"}
                                    iconColor={itemData.item.id == currentNogo ? "#f2f3f4" : "white"}
                                    onClick={() => {addNogoHandler(itemData.item.id)}}
                                />
                            </View>
                        </View>
                    )
                }}
                leftOpenValue={120}
            />

        </View>
  );

}