import React  from "react";
import { Image, TouchableOpacity } from "react-native";
import { boxes, icons } from "../Styles";

export default function ProfileImage (props) {

    const source = props.imageUrl ? { uri: props.imageUrl } : icons.profilePlaceholder;

    return (
        <TouchableOpacity 
            onPress= { () => props.onPress() }
        >
            <Image 
                style= { [ boxes.profileImage, { marginEnd: props.isLast ? 30 : 7 } ] }
                source= { source }
            />
        </TouchableOpacity>
    )
}