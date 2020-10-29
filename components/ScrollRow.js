import React from "react";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { icons, colors, boxes, texts } from '../Styles';
import AttributeImage from "./AttributeImage";

export default ScrollRow = props => {

    const data = props.data;
    return(
        <View style= { boxes.scrollRow }>
            <FlatList 
                style={{paddingLeft: 15}}
                data={data}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(itemData) => { 
                    if (props.type == "attributes") {
                        return (
                            <AttributeImage
                                imageUrl={itemData.item.imageUrl}
                                isLast={itemData.index == data.length - 1}
                                title={itemData.item}
                                isActive={props.currentCategory == itemData.item}
                                onPress={() => {props.onPress(itemData.item)}}
                            />
                        );
                    } else {
                        return (
                            <ProfileImage
                                imageUrl={itemData.item.imageUrl}
                                isLast={itemData.index == data.length - 1}
                                onPress={() => {props.onPress(itemData.item.userId)}}
                            />
                        );
                    }
                }}
            />
        </View>
    );
};