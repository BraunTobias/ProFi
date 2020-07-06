import React, {useState, useLayoutEffect, useEffect} from 'react';
import { FlatList , View, Text, Modal } from 'react-native';
import Button from '../components/Button';
import ListTile from '../components/ListTile';
import CommentTile from '../components/CommentTile';
import ProfileView from '../components/ProfileView';
import DB from '../api/DB_API';
import { styles, texts, buttons, lightGrey } from '../Styles';
import { ScrollView } from 'react-native-gesture-handler';

export default EvaluationScreen = ({route, navigation}) => {
    const {itemId} = route.params;
    const {courseId} = route.params;
    const {itemTitle} = route.params;
    const {itemSubtitle} = route.params;
    const [members, setMembers] = useState([]);

    // States für Profil-Ansicht
    const [viewedUserId, setViewedUserId] = useState(false);
    const [profileVisibility, setProfileVisibility] = useState(false);

    // States für Kommentar-Eingabe
    const [commentVisibility, setCommentVisibility] = useState(false);
    const [currentCommentText, setCurrentCommentText] = useState("");
    
    // States für Ideen-Info
    const [currentSkills, setCurrentSkills] = useState([]);
    const [currentComments, setCurrentComments] = useState([]);

// !!! Benötigt neuen Datenbank-Eintrag und -Abruf 
// für Team-Mitglieder
    useEffect(() => {
        DB.getCommentsList(courseId, itemId, (commentsList) => {
            setCurrentComments(commentsList);
        });
        DB.getIdeaData(courseId, itemId, (data) => {
            console.log(data);
            setCurrentSkills(data.skills);
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
            headerTitle: itemTitle
        });
    }, [navigation]);

    const commentClickHandler = (userId) => {
        setProfileVisibility(true);
        setViewedUserId(userId);
    }
    const clickProfileHandler = (userId) => {
        setProfileVisibility(true);
        setViewedUserId(userId);
        console.log("User ID: " + viewedUserId);
    };


    return(
        <View>
            {/* // User-Profil ansehen */}
            <Modal visible={profileVisibility} animationType='slide'>
                <View style={{flex: 1}}>
                    <View style= { styles.headerFake }>
                        <Text style= { texts.header }>Profil</Text>
                    </View>

                    <View style={{flex: 1}}>
                        <View style={{height: "85%"}}>
                            <ProfileView userId={viewedUserId}/>
                        </View>
                        <View style={{height: "15%", justifyContent:"center", alignItems: "center", backgroundColor: lightGrey}}>
                            <Button 
                                buttonStyle= { buttons.buttonRow }
                                titleStyle= { texts.buttonBlueCenter }
                                title='OK' 
                                onClick={() => {setProfileVisibility(false)}}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* // Idee & Kommentar-Liste */}
            {/* <ScrollView style={{height: "100%"}}> */}
            <View>
                <View style= { styles.subHeaderIdea}>
                    <View style= { { height: 100 } } >
                        <Text>{itemSubtitle}</Text>
                    </View>
                    {/* Membericons */}
                    <View style= { styles.membersRow } >
                        <FlatList style={{paddingLeft: 5}}
                            data={members}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
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
                    <ListTile
                        title={"Passende Fähigkeiten"}
                        subtitle={currentSkills.join(", ")}
                        onClick={() => navigation.navigate('IdeaSkills', {attributeType: "skills", filter: currentSkills})} 
                    />
                </View>
                <View style={ styles.commentRow }>
                    <Text style={texts.headline}>Kommentare:</Text>
                    {/* <Button 
                        buttonStyle= { buttons.buttonRow }
                        titleStyle= { texts.buttonBlue }
                        title= 'Kommentar'
                        icon= "plus"
                        onClick= { () => { setCommentVisibility(true) } }
                    /> */}
                </View>
            </View>
            <FlatList
                data={currentComments}
                renderItem={(itemData) => { 
                    return (
                        <CommentTile
                            id={itemData.item.id}
                            userId={itemData.item.user}
                            subtitle={itemData.item.text}
                            timestamp={itemData.item.time}
                            onClick={commentClickHandler}
                            backgroundColor = {itemData.index % 2 === 0 ? "#ffffff" : "#f5f7f7"}
                        />
                    );
                }}
            />
            {/* </ScrollView> */}
        </View>
  );

}