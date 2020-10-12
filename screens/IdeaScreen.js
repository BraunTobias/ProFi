import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, Text, Modal, Keyboard } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { compareAsc, format } from 'date-fns';

import { icons, colors, boxes, texts } from '../Styles';
import DB from '../api/DB_API';
import InputField from '../components/InputField';
import ButtonSmall from '../components/ButtonSmall';
import SwipeButton from '../components/SwipeButton';
import CommentTile from '../components/CommentTile';
import ModalContent from "../components/ModalContent";
import ProfileImage from "../components/ProfileImage";
import ButtonLarge from '../components/ButtonLarge';
import ScrollRow from '../components/ScrollRow';
import { FlatList } from 'react-native-gesture-handler';

export default IdeaScreen = ({route, navigation}) => {

    const {itemId} = route.params;
    const {itemTitle} = route.params;
    const {itemDescription} = route.params;
    const {skillsList} = route.params;
    const {courseId} = route.params;
    const currentUserId = DB.getCurrentUserId();

    // State Hooks
    const [currentSkills, setCurrentSkills] = useState([]);
    const [currentComments, setCurrentComments] = useState([]);
    const [swipeListView, setSwipeListView] = useState();


    // State Hooks für Modal
    const [newCommentVisible, setNewCommentVisible] = useState(false);
    const [currentNewCommentText, setCurrentNewCommentText] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: courseId,
        });
    }, [navigation]);

    useEffect(() => {
        DB.getCommentsList(courseId, itemId, (commentsList) => {
            setCurrentComments(commentsList);
        });
        DB.getIdeaData(courseId, itemId, (data) => {
            setCurrentSkills(data.skills);
            if (data.team && data.team.length > 0) {
                const teamUidList = data.team;
                var newTeamList = [];
                for (const member in teamUidList) {
                    const uid = teamUidList[member];
                    DB.getUserInfoById(uid, (name, url) => {
                        newTeamList.push({
                            "userId": uid,
                            "username": name,
                            "imageUrl": url
                        });
                        setTeam(newTeamList);
                    });
                }
            }

        });
    }, []);

    const likeHandler = (id) => {
        
    }
    const replyHandler = (id) => {

    }

    // Handler für Modal
    const changeNewCommentTextHandler = (enteredText) => {
        setCurrentNewCommentText(enteredText);
    }
    const pressNewCommentHandler = (committed) => {
        setNewCommentVisible(false);
    }

    return(
        <View style={{flex:1}}>

            {/* Idee erstellen */}
            <Modal visible= { newCommentVisible } animationType= 'slide'>
                <ModalContent
                    subheader= { () => {}}
                    content= { () => {
                        return(
                            <View style={boxes.mainContainer}>
                                <Text style={texts.titleCentered}>{"Kommentar schreiben"}</Text>
                                <InputField
                                    placeholderText= "max. 300 Zeichen"
                                    value={currentNewCommentText}
                                    onChangeText={changeNewCommentTextHandler}
                                    multiline={true}
                                />
                            </View> 
                        )
                    }}
                    onDismiss= {(committed) => {pressNewCommentHandler(committed)}}
                />
            </Modal>

            <View style={ boxes.subHeader }>
                <View style={ boxes.paddedRow }>
                    <Text style={texts.subHeader}>{itemTitle}</Text>
                </View>
                <View style={ boxes.paddedRow }>
                    <Text style={texts.copy}>{itemDescription}</Text>
                </View>
                <ListTile
                    title="Passende Fähigkeiten"
                    subtitle={currentSkills.join(", ")}
                    index={0}
                    onPress={() => navigation.navigate('IdeaAttributes', {attributeType: "skills", filter: currentSkills, title: "Passende Fähigkeiten"})}
                />
            </View>

            <SwipeListView
                style={{backgroundColor: "white"}}
                ref = {ref => setSwipeListView(ref)}
                data={currentComments}
                disableLeftSwipe = {true}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(itemData) => { 
                    return (
                        <CommentTile
                            id={itemData.item.id}
                            userId={itemData.item.user}
                            comment={itemData.item.text}
                            timestamp={itemData.item.time}
                            isLiked={false}
                            index = {itemData.index}
                        />
                    )
                }}
                renderHiddenItem={ (itemData) => {
                    return (
                        <View style={[boxes.swipeRowTwo, {backgroundColor: colors.lightBlue}]}>
                            <SwipeButton
                                backgroundColor={colors.darkBlue}
                                onPress={(ref) => {replyHandler(itemData.item.id)}}
                            />
                            <SwipeButton
                                backgroundColor={colors.lightBlue}
                                onPress={(ref) => {likeHandler(itemData.item.id)}}
                            />
                        </View>
                    )
                }}
                leftOpenValue={120}
            />

            <View style={[boxes.paddedRow, {backgroundColor: colors.white, paddingBottom: 10}]}>
                <ButtonLarge
                    title="Kommentar schreiben"
                    onPress={() => {setNewCommentVisible(true)}}
                />
            </View>

        </View>
    )
}