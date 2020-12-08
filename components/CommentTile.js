import React , {useState, useEffect} from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import Autolink from 'react-native-autolink';
import { compareAsc, format } from 'date-fns';

import { icons, colors, boxes, texts } from '../Styles';
import DB from '../api/DB_API';
import ProfileImage from "./ProfileImage";

export default CommentTile = props => {

    const userId = props.userId;
    const date = format(props.timestamp.toDate(), "dd.MM.yy");

    const colorStyle = {
        backgroundColor: props.index % 2 === 0 ? colors.white : colors.lightGrey
    }
    
    return (
    <View style={[colorStyle, boxes.commentTile, {minHeight: props.likes > 0 ? 100 : 70, paddingHorizontal: props.replyPreview ? 0 : 15}]}>
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
            {props.likes > 0 && 
            <View style={boxes.likesRow}>
                <Image
                    style={boxes.likesImage}
                    height={17}
                    width={17}
                    source={icons.like}
                />
                <Text style={texts.copy}>{props.likes}</Text>
            </View>
            }
        </View>

        <View style={boxes.commentTileContent}>
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