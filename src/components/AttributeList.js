import React from 'react';
import { FlatList, View, Text } from "react-native";

import { boxes, colors, texts } from '../Styles';

// Komponent anstatt der Section-List
export default function AttributeList (props) {

    // Die Liste aller Sektionen
    const SectionList = () => {
        return (
            <FlatList
                data= { props.attList }
                keyExtractor= { (item, index) => index.toString() }
                renderItem= { ( { item } ) => { 
                    return (
                        <View>
                            <Section 
                                item= { item }
                            />
                        </View>
                        
                    )
                }}
            />
        );
    }
    
    // Die Sektionsliste mit Sektions-Titel und folgender Inhaltsliste
    const Section = (props) => {
        return (
            <View>
                <View style= { boxes.separator } >
                    <Text style= { texts.separatorText } >{ props.item.key }</Text>
                </View>
                <FlatList
                    data= { props.item.data }
                    keyExtractor= { (item, index) => index.toString() }
                    renderItem= { ( { item, index } ) => { 
                        return (
                            <View style= { {
                                flexDirection: "row", 
                                justifyContent: "space-between", 
                                alignItems: "center",
                                backgroundColor: index % 2 === 0 ? colors.white : colors.lightGrey,
                            } } >
                                <Text style= { [texts.sectionListCopy] } >{ item.name }</Text> 
                            </View>
                        )
                    } }
                />
            </View>
        )
    }

    return <SectionList/>;
}