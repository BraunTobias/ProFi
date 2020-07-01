import React, {useState, useEffect, useLayoutEffect} from 'react';
import {View, SafeAreaView, Text, FlatList, Modal, TouchableWithoutFeedback, TextInput, Keyboard } from "react-native";
import ListTile from '../components/ListTile';
import Button from '../components/Button';
import ButtonSimple from '../components/ButtonSimple';
import { SwipeListView } from 'react-native-swipe-list-view';
import {Ionicons} from '@expo/vector-icons';
import AttributeSelect from '../components/AttributeSelect';
import DB from '../api/DB_API';
import ProfileImageTile from '../components/ProfileImageTile';
import { styles, buttons, texts, white, lightGrey, grey, black, iconsize, iconsizeAdd, darkGrey, icons } from '../Styles';

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
    const [errorVisibility, setErrorVisibility] = useState(false);
    const [addIdeaVisibility, setAddIdeaVisibility] = useState(false);
    const [skillsVisibility, setSkillsVisibility] = useState(false);
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

    const addIdeaHandler = () => {
        if (currentIdeaName != "" && currentIdeaDescription != "" && selectedSkillsList.length > 1) {
            console.log ('OK')
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
            console.log ('Error')
            setCurrentWarning("Eingabe nicht vollständig");
            setErrorVisibility(true);
        }
    };
    
    const setIdeaNameHandler = (enteredText) => {
        if (enteredText) {
            setCurrentIdeaName(enteredText);
            setIdeaError("")
        } else {
            setCurrentIdeaName("")
            setIdeaError("Bitte einen Ideenamen eingeben")
        }
    };

    const setIdeaDesriptionHandler = (enteredText) => {
        if (enteredText) {
            setCurrentIdeaDescription(enteredText);
            setDescriptionError("")
        } else {
            setCurrentIdeaDescription("")
            setDescriptionError("Bitte eine Kurzbeschreibung eingeben")
        }
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
            {/* // Error Popup */}
            <Modal visible={errorVisibility} transparent = {true}>
                <View style={styles.errorView}>
                    <View style={styles.errorContainer}>
                        <Text style= { texts.headlineCenter } >
                            {currentWarning}
                        </Text>
                        <ButtonSimple
                            title='OK'
                            onClick={() => setErrorVisibility(false)}
                        />
                    </View>
                </View>
            </Modal>
            
            {/* // Idee hinzufügen */}
            <Modal visible={addIdeaVisibility} animationType='slide'>
                <ModalComponent
                    title= 'Idee hinzufügen'
                    subheader= { () => {}}
                    content= { () => {
                        return(
                            <View style= { { backgroundColor: lightGrey }}>
                                <View style= { styles.content }>
                                <Text></Text>{/* // Text-Absatz */}
                                    <InputTile 
                                        title= "Idee-Name"
                                        placeholderText= "Idee"
                                        value= { currentIdeaName }
                                        onChangeText= { setIdeaNameHandler }
                                    />
                                    <Text>
                                        { ideaError }
                                    </Text>
                                    <InputTile 
                                        title= "Kurzbeschreibung"
                                        placeholderText= "Eine kurze Beschreibung der Idee"
                                        value= { currentIdeaDescription }
                                        onChangeText= { setIdeaDesriptionHandler }
                                    />
                                    <Text>
                                        { descriptionError }
                                    </Text>
                                </View>
                                
                                <View>
                                    <ListTile
                                        title= { "Fähigkeiten auswählen" }
                                        subtitle= { selectedSkillsList.join(", ") }
                                        onClick= { () => setSkillsVisibility(true) } 
                                    />
                                </View>

                                <View style= { styles.paddedRow } >
                                    <Button 
                                        buttonStyle= { buttons.buttonRow }
                                        titleStyle= { texts.buttonBlueCenter }
                                        title= 'OK' 
                                        onClick= { () => { addIdeaHandler() } }
                                    />
                                    <Button 
                                        buttonStyle= { buttons.buttonRow }
                                        titleStyle= { texts.buttonBlueCenter }
                                        title= 'Abbrechen'
                                        onClick= { () => { 
                                            console.log ('Error');
                                            setAddIdeaVisibility(false); } }
                                    />
                                </View>
                            </View>
                        )
                    }}
                />
                {/* // Idee hinzufügen: Fähigkeiten auswählen */}
                <Modal visible={skillsVisibility} animationType='slide'>
                            <View style= { styles.headerFake }>
                                <Text style= { texts.header }>Fähigkeiten auswählen</Text>
                            </View>
                    <View style={{height: "100%"}}>
                        <View style={{height: "80%"}}>
                            <AttributeSelect 
                                
                                attributeType={"skills"} 
                                selectedAttributesList={selectedSkillsList} 
                                addSelectedAttribute={addSelectedSkillHandler} 
                            >
                            </AttributeSelect>
                        </View>
                        <View style={{height: "30%", justifyContent:"flex-start", alignItems: "center", backgroundColor: "red"}}>
                            <Button 
                                buttonStyle= { buttons.buttonRow }
                                titleStyle= { texts.buttonBlueCenter }
                                title='OK' 
                                onClick={() => {setSkillsVisibility(false)}}
                            />
                        </View>
                    </View>
                </Modal>
            </Modal>
            

            {/* // User-Profil ansehen */}
            <Modal visible={profileVisibility} animationType='slide'>
                <ModalComponent
                    title= 'Profil'
                    subheader= { () => {
                        return( <ProfileView userId={viewedUserId}/> )
                    }}
                    content= { () => {
                        return(
                            <View styles= {{ backgroundColor: lightGrey }}>
                                <View style= { styles.center }>
                                    <ButtonSimple 
                                        title= 'OK' 
                                        onClick= { () => { setProfileVisibility(false) } }
                                    />
                                </View>
                            </View>
                        )
                    }}
                />
            </Modal>

            {/* Kursansicht */}
            <View style= { styles.subHeader } >
                <View style= { styles.courseHeaderRow } >
                    <Text style= { texts.headlineCenter }>{date}</Text>
                    <Text style= { texts.headlineCenter }>{itemId}</Text>
                </View>
                <View style= { styles.courseHeaderRow } >
                    <Text style= { texts.headlineCenter }>{minMembers}–{maxMembers} Personen</Text>
                </View>

                {/* Membericons */}
                <View style= { styles.membersRow } >
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
                </View>

                <View style= { styles.paddedRow } >
                    <Button 
                        buttonStyle= { buttons.buttonRowGrey }
                        titleStyle= { texts.buttonGrey }
                        title= {userIsMember ? "Mitglied" : "Beitreten" }
                        icon= {userIsMember ? "checkTrue" : "checkFalse"}
                        onClick= {joinCourseHandler}
                    />
                    <Button 
                        buttonStyle= { buttons.buttonRow }
                        titleStyle= { texts.buttonBlue }
                        title= "Neue Idee"
                        icon= "plus"
                        onClick= { () => { setAddIdeaVisibility(true) } }
                    />
                </View>
            </View>
            
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
                                    backgroundColor={itemData.item.id == currentFav ? lightGrey : "#222f56"}
                                    iconColor={itemData.item.id == currentFav ? darkGrey : "white"}
                                    onClick={() => {addFavHandler(itemData.item.id)}}
                                />
                                <NogoButton 
                                    ideaId={itemData.item.id} 
                                    courseId={itemId} 
                                    backgroundColor={itemData.item.id == currentNogo ? lightGrey : "#640023"}
                                    iconColor={itemData.item.id == currentNogo ? darkGrey : "white"}
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