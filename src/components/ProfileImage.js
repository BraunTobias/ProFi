import React  from "react";
import { Image, TouchableOpacity, StyleSheet } from "react-native";
import { icons } from "../Styles";

export default function ProfileImage (props) {

    const source = props.imageUrl === "noImage" ? icons.profilePlaceholder : { uri: props.imageUrl };

    return (
        <TouchableOpacity 
            onPress= { () => props.onPress() }
        >
            <Image 
                style= { [ Styles.profileImage, { marginEnd: props.isLast ? 30 : 7 } ] }
                source= { source }
            />
        </TouchableOpacity>
    )
}

const Styles = StyleSheet.create({
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 111,
        aspectRatio: 1,
        marginRight: 7,
    },
})

