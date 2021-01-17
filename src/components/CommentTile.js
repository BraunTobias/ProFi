import React  from "react";
import { Text, View, Image, StyleSheet, TouchableHighlight } from "react-native";
import Autolink from 'react-native-autolink';

import { icons, colors, boxes, texts } from '../Styles';
import ProfileImage from "./ProfileImage";
import ButtonIcon from '../components/ButtonIcon';

// Komponent für Kommentar-Einträge
export default function CommentTile (props) {

    const currentUser = props.currentUser;
    const userId = props.userId;
    const date = props.timestamp.toDate().toLocaleDateString('de-DE');

    const colorStyle = {
        backgroundColor: props.index % 2 === 0 ? colors.white : colors.lightGrey
    }

    // Buttons
    const LikeButton = () => {
        if (props.userId === currentUser) return (
            <Image
                style= { Styles.likesImage }
                height= { 17 }
                width= { 17 }
                source= { icons.like }
            />
        );
        else return (
            <TouchableHighlight onPress= { () => props.onLike() }>
                <Image
                    style= { Styles.likesImage }
                    height= { 17 }
                    width= { 17 }
                    source= { icons.like }
                />
            </TouchableHighlight>
        );
    }
    const ReplyButton = () => {
        if (!props.isReply) return (
            <ButtonIcon 
                icon= { 'reply' }
                onPress= { () => props.onReply() }
                status= { "active" }
            />
        )
        else return <View />
    }
    const DeleteButton = () => {
        if (props.userId === currentUser) return (
            <ButtonIcon 
                icon= { 'delete' }
                onPress= { () => props.onDelete() }
                status= { "transparent" }
            />
        )
        else return <View />
    }
    
    return (
        <View style= { [boxes.width, Styles.commentTile, colorStyle] } >
            {props.isReply && 
                <Image
                    style= { Styles.replyImage }
                    source= { icons.replyComment }
                    resizeMode= { "contain" }
                />
            }
            {/* Linker Bereich mit User-Icon und Like-Funktion */}
            <View style= { Styles.infoArea } >
                <ProfileImage
                    userId= { userId }
                    imageUrl= { props.userUrl }
                    onPress= { () => { props.onPress() } }
                />
                <View style= { Styles.likes } >
                    <LikeButton />
                    <Text style= { texts.copy } >{ props.likes }</Text>
                </View>
            </View>
            {/* Mittlerer Bereich mit dem Kommentar-Text */}
            <View>
                <Text style = { texts.commentTileHeader } >{ props.userName }</Text>
                <Autolink 
                    linkStyle= { texts.link }
                    style = { texts.copy }
                    text= { props.comment }
                />
            </View>
            {/* Rechter Bereich mit Erstelldatum, Antwort- und Löschen-Button */}
            <View style= { Styles.rightArea } >            
                
                <Text style = { Styles.commentTileTime } >{ date }</Text>

                <View style= { Styles.buttons } >
                    <ReplyButton />
                    <DeleteButton />
                </View>
            </View>
        </View>
    );
};

const Styles = StyleSheet.create({
        
    commentTile: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        minHeight: 100,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start"
    },
    replyImage: {
        width: 30,
        height: 30,
        tintColor: colors.mediumGrey,
        marginRight: 15,
        alignSelf: 'center'
    },
    infoArea: {
        width: 60,
        marginRight: 15
    },
    rightArea: {
        position: "absolute",
        right: 10,
        alignItems: "center",
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    buttons: {
        width: 95,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    likes: {
        width: "100%",
        marginTop: 5, 
        flexDirection: "row", 
        justifyContent: "center", 
        alignItems: "center"
    },
    likesImage: {
        height: 17,
        width: 17,
        resizeMode: "contain", 
        tintColor: colors.darkBlue, 
        marginRight: 5    
    },
    commentTileTime: {
        fontSize: 16,
        fontFamily: 'Inter',
        fontWeight: 400,
        color: colors.darkGrey,
        opacity: 0.5,
        paddingBottom: 15
    }
});