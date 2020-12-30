import React  from "react";
import { Text, View, Image } from "react-native";
import Autolink from 'react-native-autolink';

import { icons, colors, boxes, texts } from '../Styles';
import ProfileImage from "./ProfileImage";
import Padding from '../components/Padding';

export default function CommentTile (props) {

    const userId = props.userId;
    const date = props.timestamp.toDate().toLocaleDateString('de-DE');

    const colorStyle = {
        backgroundColor: props.index % 2 === 0 ? colors.white : colors.lightGrey
    }
    
    return (
    <View style={[boxes.commentTile, colorStyle]}>
        
        <View style={boxes.commentTileImage}>
            <ProfileImage
                userId={userId} 
                imageUrl={props.userUrl}
                onPress= { () => { props.onPress() } }
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
        <Padding width= { 15 } />
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