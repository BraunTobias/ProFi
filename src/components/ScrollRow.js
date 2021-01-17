import React from "react";
import { View, FlatList, ScrollView } from "react-native";

import AttributeImage from "./AttributeImage";
import ProfileImage from "./ProfileImage";

// Komponent für eine Icon-Leiste aus Profilbildern oder Attribut-Icons
export default function ScrollRow (props) {

    const data = props.data;

    return(
        <ScrollView
            horizontal= { true }

            style= { { width: '100%' } }
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
                            <View>
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
    );
};