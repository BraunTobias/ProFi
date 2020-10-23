import React  from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { boxes, icons } from "../Styles";

export default ProfileImage = props => {

    const source = props.imageUrl ? {uri: props.imageUrl} : icons.profilePlaceholder;

    return (
        <TouchableWithoutFeedback onPress={props.onPress}>
            <View style={boxes.profileImage}>
                <Image 
                    style={[boxes.profileImage, {marginEnd: props.isLast ? 30 : 7}]}
                    source={source}
                />
                {props.loading && 
                    <View style={boxes.imageLoading}> 
                        <ActivityIndicator size='large'/>
                    </View>
                }
            </View>
        </TouchableWithoutFeedback>
    )
}