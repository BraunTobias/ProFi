import React  from "react";
import { View } from "react-native";

export default function Padding (props) {

    return (
        <View style= {  { 
            height: props.height ? props.height : 0,
            width: props.width? props.width : 0,
        } } />
    )
}