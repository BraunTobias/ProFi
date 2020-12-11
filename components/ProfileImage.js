import React  from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { boxes, icons, colors } from "../Styles";

export default ProfileImage = props => {

    const source = props.imageUrl ? {uri: props.imageUrl} : icons.profilePlaceholder;

    return (
        <TouchableWithoutFeedback onPress={props.onPress}>
            <View style={[styles.profileImage, {marginRight: props.isLast ? 30 : props.marginRight ? props.marginRight : 7}]}>
                <Image 
                    style={styles.profileImage}
                    source={source}
                />
                {(props.loading || typeof(props.imageUrl) == "undefined") && 
                    <View style={styles.imageLoading}> 
                        <ActivityIndicator size={props.loading ? 'large' : 'small'}/>
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
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 111,
        justifyContent: "center",
        alignItems: "center"
    },
    profileImage: {
        height: "100%",
        marginRight: 7,
        aspectRatio: 1,
        backgroundColor: colors.lightBlue,
        borderRadius: 111,
    },
});