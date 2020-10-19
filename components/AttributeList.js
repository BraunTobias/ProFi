import React, { useState, useEffect, useLayoutEffect } from 'react';
import {FlatList, View, Text, SectionList} from "react-native";

import { boxes, colors, styles, texts } from '../Styles';

export default AttributeList = props => {

    return(
        <SectionList
            style={{backgroundColor: "white"}}
            sections={props.attList}
            keyExtractor={(item, index) => index.toString()}
            renderSectionHeader={({ section }) => (
                <View style={boxes.separator}>
                    <Text style={texts.separatorText}>{section.key}</Text>
                </View>
            )}
            renderItem={({ item }) => { 
                return (
                    <Text style={[texts.sectionListCopy]}>{item}</Text> 
                );
            }}
        />
    );
  
}