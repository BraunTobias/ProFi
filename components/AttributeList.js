import React, { useState, useEffect, useLayoutEffect } from 'react';
import {FlatList, View, Text, SectionList, Image, ActivityIndicator, StyleSheet} from "react-native";

import { boxes, colors, texts } from '../Styles';
import ProfileImage from './ProfileImage';
import ScrollRow from '../components/ScrollRow';
import SmallProfileRow from './SmallProfileRow';
import SectionHeader from '../components/SectionHeader';

export default AttributeList = props => {

    return(
        <SectionList
            style={{backgroundColor: colors.white}}
            sections={props.attList}
            keyExtractor={(item, index) => index.toString()}
            renderSectionHeader={({ section }) => (
                <SectionHeader>
                    <Text style={texts.separatorText}>{section.key}</Text>
                </SectionHeader>
            )}
            renderItem={({ item }) => { 
                return (
                    <View style={styles.attributeListTile}>
                        <Text style={[texts.sectionListCopy]}>{item.name}</Text> 
                        <SmallProfileRow
                            data= {item.users}
                            onPress={() => {}}
                        />
                    </View>
                );
            }}
            ListFooterComponent={
                props.loading &&
                <View style={styles.listLoading}>
                    <ActivityIndicator size='small'/>
                </View>
            }
        />
    ); 
}

const styles = StyleSheet.create({
    attributeListTile: {
        width: "100%",
        height: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    listLoading: {
        height: 100,
        justifyContent: "center",
        alignItems: "center"
    },
});