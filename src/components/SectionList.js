import React from 'react';
import { FlatList, View, Text } from "react-native";
import { TouchableHighlight, ScrollView } from 'react-native-web'
import ListTile from "../components/ListTile";
import { colors, boxes, texts } from '../Styles';
import { format } from 'date-fns';

// Neue Komponente als Ersatz für das Section-List-Modul
export default function SectionList (datas) {

    const SectionList = () => {
        return (
            <ScrollView 
                style= { { overlow:'scroll' } }
                showsHorizontalScrollIndicator= { true }
                showsVerticalScrollIndicator= { true }
            >
                <View>
                    <FlatList
                        style= { { overflow: 'hidden' } }
                        data= { datas.data }
                        keyExtractor= { (item, index) => index.toString() }
                        renderItem= { ( { item } ) => { 
                            return (
                                <Section 
                                    sections= { item }
                                />
                            )
                        }}
                    />
                    <Text style= { [boxes.width, texts.errorLine] } >
                        Sollten deine Kurse nicht angezeigt werden, lade bitte die Seite neu.
                    </Text>
                </View>
            </ScrollView>
        );
    }

    const Section = (props) => {
        return (
            <View style= { [boxes.width, {  } ] }
            >
                <View style= { boxes.separator } >
                    <Text style= { texts.separatorText } >{ props.sections }</Text>
                </View>
                <FlatList
                    data= { datas.currentCourses[props.sections] }
                    keyExtractor= { (item, index) => index.toString() }
                    renderItem= { ( { item, index } ) => { 
                        return (
                            <TouchableHighlight
                                style= { { backgroundColor: index % 2 === 0 ? colors.white : colors.mediumGrey, } }
                                underlayColor= { colors.darkBlue }
                                onPress= { () => { datas.onPress(item) } }
                            >
                                <View
                                    style= { {
                                        flexDirection: "row", 
                                        justifyContent: "space-between", 
                                        alignItems: "center",
                                        
                                    } }
                                >
                                    <ListTile
                                        onPress= { () => { datas.onPress(item) } } 
                                        id= { item.id }
                                        title= { item.title }
                                        subtitle= {
                                            item.date ? 
                                            item.members.length + " Mitglieder, Gruppengröße " + 
                                            item.minMembers + "-" + item.maxMembers + "\n"
                                            + format(item.date.toDate(), "dd.MM.yyyy")
                                            :
                                            "Gruppengröße " + item.minMembers + "-" + item.maxMembers + "\n" + 
                                            "Kein Datum"
                                        }
                                        index = { index }
                                        isMember = { item.userIsMember }
                                        onExit = { () => datas.onExit(item.id, item.date ? 'courses' : 'openCourses') }
                                        delte = { datas.delete }
                                    />
                                </View>
                            </TouchableHighlight>
                        )
                    } }
                />
            </View>
        )
    }
    return <SectionList/>;
}