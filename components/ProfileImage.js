import React  from "react";
import { Text, Image, TouchableOpacity } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { boxes, icons } from "../Styles";

export default ProfileImage = props => {

    const source = props.imageUrl ? {uri: props.imageUrl} : icons.profilePlaceholder;

    return (
        <TouchableWithoutFeedback onPress={props.onPress}>
            <Image 
                style={[boxes.profileImage, {marginEnd: props.isLast ? 30 : 7}]}
                source={source}
            />
        </TouchableWithoutFeedback>
    )
}