import React from "react";
import { View, FlatList, ScrollView } from "react-native";

import { boxes } from '../Styles';
import AttributeImage from "./AttributeImage";
import ProfileImage from "./ProfileImage";

export default function ScrollRow (props) {

    const data = props.data;

    return(
        <View>
            <ScrollView
                horizontal= { true }
                // indicatorStyle
                // showsHorizontalScrollIndicator= { false }
            >
                <FlatList 
                    style= { { padding: 15 } }
                    horizontal= { true }
                    showsHorizontalScrollIndicator= { false }
                    showsVerticalScrollIndicator= { false }
                    data= { data }
                    keyExtractor= { (item, index) => index.toString() }
                    renderItem= { (itemData) => { 
                        if (props.type === "attributes") {
                            return (
                                <AttributeImage
                                    imageUrl= { itemData.item.imageUrl }
                                    isLast= { itemData.index === data.length - 1 }
                                    title= { itemData.item }
                                    isActive= { props.currentCategory === itemData.item }
                                    onPress= { () => { props.onPress(itemData.item) } }
                                />
                            );
                        } else {
                            return (
                                <View
                                    //onMouseEnter= { (event) => { props.onEnter(itemData.index+1, itemData.item.userId, event.target); } }
                                    // onMouseLeave= { () => { props.onLeave(); } }
                                >
                                    <ProfileImage
                                        imageUrl= { itemData.item.imageUrl }
                                        isLast= { itemData.index === data.length - 1 }
                                        onPress= { () => { props.onPress(itemData.item.userId) } }
                                    />
                                </View>
                            );
                        }
                    }}
                />
            </ScrollView>
        </View>
    );
};