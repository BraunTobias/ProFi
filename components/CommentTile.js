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
    
    return (
    <View style={[styles.commentTile, {
        backgroundColor: props.index % 2 === 0 ? colors.white : colors.lightGrey,
        minHeight: props.likes > 0 ? 100 : 70, 
        paddingHorizontal: props.replyPreview ? 0 : 15
    }]}>
        {props.isReply == true && 
            <Image
                style={styles.commentReplyTile}
                source={icons.replyComment}
                resizeMode={"contain"}
            />
        }
        <View style={styles.commentTileImage}>
            <ProfileImage
                userId={userId} 
                imageUrl={props.userUrl}
                onPress={props.onPress}
            />
            {props.likes > 0 && 
            <View style={styles.likesRow}>
                <Image
                    style={styles.likesImage}
                    height={17}
                    width={17}
                    source={icons.like}
                />
                <Text style={texts.copy}>{props.likes}</Text>
            </View>
            }
        </View>

        <View style={styles.commentTileContent}>
            <View style={styles.commentTileHeader}>            
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

const styles = StyleSheet.create({
    commentTile: {
        width: "100%",
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    commentReplyTile: {
        width: 20, 
        height: 60, 
        marginRight: 5, 
        marginLeft: -5, 
        tintColor: colors.lightBlue
    },
    commentTileImage: {
        height: 60,
        width: 60,
        alignItems: "flex-start",
        justifyContent: "flex-start"
    },
    commentTileHeader: {
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "baseline",
        marginBottom: 2,
    },
    commentTileContent: {
        width: 0, 
        flexGrow: 1,
        justifyContent: "flex-start", 
        paddingStart: 7,
        marginLeft: 8,
        // borderLeftWidth: 1,
        borderColor: colors.lightBlue,
        flex: 1
    },
    likesRow: {
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
});