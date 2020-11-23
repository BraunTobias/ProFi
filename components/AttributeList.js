import React, { useState, useEffect, useLayoutEffect } from 'react';
import {FlatList, View, Text, SectionList, Image} from "react-native";

import { boxes, colors, styles, texts } from '../Styles';
import ProfileImage from './ProfileImage';
import ScrollRow from '../components/ScrollRow';
import SmallProfileRow from './SmallProfileRow';

export default AttributeList = props => {

    return(
        <SectionList
            style={{backgroundColor: colors.white}}
            sections={props.attList}
            keyExtractor={(item, index) => index.toString()}
            renderSectionHeader={({ section }) => (
                <View style={boxes.separator}>
                    <Text style={texts.separatorText}>{section.key}</Text>
                </View>
            )}
            renderItem={({ item }) => { 
                return (
                    <View style={boxes.attributeListTile}>
                        <Text style={[texts.sectionListCopy]}>{item.name}</Text> 
                        <SmallProfileRow
                            data= {item.users}
                            onPress={() => {}}
                        />
                    </View>
                );
            }}
        />
    );
  
}