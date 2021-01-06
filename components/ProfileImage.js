import React, {useContext}  from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { boxes, icons, colors } from "../Styles";
import { ThemeContext } from '../components/ThemeManager';

export default ProfileImage = props => {

    const {themeColors} = useContext(ThemeContext);

    const source = (props.imageUrl && props.imageUrl != "noImage") ? {uri: props.imageUrl} : themeColors.mode == "dark" ? icons.profilePlaceholderDark : icons.profilePlaceholder;

    return (
        <TouchableWithoutFeedback onPress={props.onPress}>
            <View style={[styles.profileImage, {marginRight: props.isLast ? 30 : props.marginRight ? props.marginRight : 7, backgroundColor: themeColors.base}]}>
                <Image 
                    style={[styles.profileImage, {backgroundColor: themeColors.secondary}]}
                    source={source}
                />
                {(props.loading || typeof(props.imageUrl) == "undefined") && 
                    <View style={[styles.imageLoading, {
                        backgroundColor: themeColors.mode == "dark" ? "rgba(14, 14, 14, 0.8)" : "rgba(255, 255, 255, 0.8)",
                    }]}> 
                        <ActivityIndicator size={props.loading ? 'large' : 'small'} color={themeColors.textHl}/>
                    </View>
                }
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    imageLoading: {
        position: "absolute",
        top: 0,
        height: "100%",
        aspectRatio: 1,
        borderRadius: 111,
        justifyContent: "center",
        alignItems: "center"
    },
    profileImage: {
        height: "100%",
        marginRight: 7,
        aspectRatio: 1,
        borderRadius: 111,
    },
});