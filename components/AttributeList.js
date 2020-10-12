import React, { useState, useEffect, useLayoutEffect } from 'react';
import {FlatList, View, Text, SectionList} from "react-native";

import { boxes, colors, styles, texts } from '../Styles';
import DB from '../api/DB_API';

export default AttributeList = props => {

    const filterList = props.filterList;
    const attributeType = props.attributeType;
    const [attList, setAttList] = useState([]);

    useEffect(() => {
        DB.getAllAttributes(attributeType, filterList, (attributesList) => {
            setAttList(attributesList);
            console.log(attributesList.join(" , "))
            console.log("mache")
            console.log(filterList)
        }, () => {});
    }, []);
    
    return(
        <SectionList
            sections={attList}
            keyExtractor={(item, index) => index.toString()}
            renderSectionHeader={({ section }) => (
                <View style={boxes.separator}>
                    <Text style={texts.separatorText}>{section.key}</Text>
                </View>
            )}
            renderItem={({ item }) => { 
                return (
                    <View style={boxes.commentTileContent}>
                        <Text style={[texts.copy]}>{item}</Text> 
                    </View>
                );
            }}
        />
    );
  
}