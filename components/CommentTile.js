import React , {useState, useEffect} from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import Autolink from 'react-native-autolink';

import { icons, colors, boxes, texts } from '../Styles';
import DB from '../api/DB_API';
import ProfileImage from "./ProfileImage";

export default CommentTile = props => {

    const userId = props.userId;
    const date = props.timestamp.toDate().toLocaleDateString('de-DE');

    const colorStyle = {
        backgroundColor: props.index % 2 === 0 ? colors.white : colors.lightGrey
    }
    
    return (
    <View style={[boxes.commentTile, colorStyle]}>
        {props.isReply == true && 
            <Image
                style={boxes.commentReplyTile}
                source={icons.replyComment}
                resizeMode={"contain"}
            />
        }
        <View style={boxes.commentTileImage}>
            <ProfileImage
                userId={userId} 
                imageUrl={props.userUrl}
                onPress={props.onPress}
            />
            <View style={boxes.likesRow}>
                <Image
                    style={boxes.likesImage}
                    height={17}
                    width={17}
                    source={icons.like}
                />
                <Text style={texts.copy}>{props.likes}</Text>
            </View>
        </View>
        <View style={props.isReply ? boxes.commentReplyTileContent : boxes.commentTileContent}>
            <View style={boxes.commentTileHeader}>            
                <Text style = {texts.commentTileHeader}>{props.userName}</Text>
                <Text style = {texts.commentTileTime}>{date}</Text>
            </View>
            <Autolink 
                linkStyle={texts.link}
                style = {texts.copy}
                text={props.comment}
            />
        </View>
    </View>
    );
};