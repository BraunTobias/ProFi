import React, { useContext } from 'react';
import { View, Text, SectionList, ActivityIndicator, StyleSheet} from "react-native";

import { texts } from '../Styles';
import ProfileImage from './ProfileImage';
import ScrollRow from '../components/ScrollRow';
import SmallProfileRow from './SmallProfileRow';
import SectionHeader from '../components/SectionHeader';
import { ThemeContext } from '../components/ThemeManager';

export default AttributeList = props => {

    const {themeColors} = useContext(ThemeContext);

    return(
        <SectionList
            style={{backgroundColor: themeColors.base}}
            sections={props.attList}
            keyExtractor={(item, index) => index.toString()}
            renderSectionHeader={({ section }) => (
                <SectionHeader text={section.key}/>
            )}
            renderItem={({ item }) => { 
                return (
                    <View style={styles.attributeListTile}>
                        <Text style={[texts.sectionListCopy, {color: themeColors.textCopy}]}>{item.name}</Text> 
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
                    <ActivityIndicator size='small' color={themeColors.textHl}/>
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