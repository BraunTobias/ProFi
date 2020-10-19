import React , {useState, useEffect} from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";

import { icons, colors, boxes, texts } from '../Styles';
import DB from '../api/DB_API';
import ProfileImage from "./ProfileImage";

export default CommentTile = props => {

    const userId = props.userId;
    const date = props.timestamp.toDate().toLocaleDateString('de-DE');
    const [currentUserName, setCurrentUserName] = useState("");
    const [currentUserImage, setCurrentUserImage] = useState("");

    const colorStyle = {
        backgroundColor: props.index % 2 === 0 ? colors.white : colors.lightGrey
    }
    
    useEffect(() => {
        DB.getUserInfoById(userId, (name, imageUrl) => {
            setCurrentUserName(name);
            if (imageUrl) setCurrentUserImage(imageUrl);
        });
    }, []);

    return (
    <View style={[boxes.commentTile, colorStyle]}>
        <View style={boxes.commentTileImage}>
            <ProfileImage
                userId={userId}
                imageUrl={currentUserImage}
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
        <View style={boxes.commentTileContent}>
            <View style={boxes.commentTileHeader}>            
                <Text style = {texts.commentTileHeader}>{currentUserName}</Text>
                <Text style = {texts.commentTileTime}>{date}</Text>
            </View>
            <Text style = {texts.copy}>{props.comment}</Text>
        </View>
    </View>
    );
};