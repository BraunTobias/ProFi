import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, ScrollView } from "react-native";

import { boxes, colors, texts } from '../Styles';
import AttributeTile from './AttributeTile';
import ScrollRow from './ScrollRow';
import Padding from './Padding';
import DB from '../api/DB_API';

// Komponent zum Auswählen der Fähigkeiten oder Interessen
export default function AttributeSelect (props) {

    const attributeType = props.attributeType;

    // State Hooks
    const [currentCategory, setCurrentCategory] = useState("");
    const [categoriesList, setCategoriesList] = useState([]);
    const [displayedSkills, setDisplayedSkills] = useState([]);

    useEffect(() => {
        DB.getCategoriesFromAttribute(attributeType, (categoriesList) => {
            setCategoriesList(categoriesList);
            setCurrentCategory(categoriesList[0]);
            DB.getNeutralAttributesFromCategory(attributeType, categoriesList[0], (attributesList) => { 
                setDisplayedSkills(attributesList);
            }, (error) => {console.log(error)});
        });
    }, []);

    const selectCategoryHandler = (category) => {
        setCurrentCategory(category);
        DB.getNeutralAttributesFromCategory(attributeType, category, (attributesList) => {
            setDisplayedSkills(attributesList);
        }, (error) => {console.log(error)});
    }

    return(
        <View style= { { 
            width: '50%',
            height: '100%'
        } } >
            {/* Header */}
            <View style= { [boxes.subHeader, {
                borderTopLeftRadius: 7,
                borderTopRightRadius: 7
            } ] } >
                {/* Header-Title */}
                <View style= { boxes.paddedRow } >
                    <Text style= { texts.separatorText } >{ attributeType === 'skills' ? "Fähigkeiten auswählen" : "Interessen auswählen" }</Text>
                </View>
                <Padding height= { 9.25 } />
                {/* Attribut-Kategorien-Symbole */}
                <ScrollRow
                    type= "attributes"
                    data= { categoriesList }
                    currentCategory= { currentCategory }
                    onPress= { (item) => { selectCategoryHandler (item) } }
                />
            </View>
            {/* Attribut-Auswahl */}
            {/* Attribut-Titel */}
            <View style= { boxes.separator } >
                <Text style= { texts.separatorText, { paddingHorizontal: 15 } } >{ currentCategory }</Text>
            </View>
            {/* Attribut-Liste */}
            <ScrollView contentContainerStyle= { { 
                height: '100%'
            } } >
                <FlatList 
                    style= { { backgroundColor: colors.lightGrey, flexGrow: 1 } }
                    data= { displayedSkills }
                    keyExtractor= { (item, index) => item }
                    renderItem= { (itemData) => { 
                        return (
                            <AttributeTile
                                text= { itemData.item }
                                state= { props.selectedAttributesList.indexOf(itemData.item) >= 0 }
                                index = { itemData.index }
                                backgroundColor = { itemData.index % 2 === 0 ? "#ffffff" : "#f5f7f7" }
                                onPress= { () => { 
                                    props.changeAttribute(itemData.item, currentCategory);
                                } }
                            />
                        );
                } } />
            </ScrollView>
        </View>
    )
}