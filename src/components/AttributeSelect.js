import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, useWindowDimensions, ScrollView } from "react-native";

import { boxes, colors, texts } from '../Styles';
import AttributeTile from './AttributeTile';
import ScrollRow from './ScrollRow';
import ButtonLarge from './ButtonLarge';
import Padding from './Padding';
import DB from '../api/DB_API';

export default function AttributeScreen (props) {

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

    const clickAttributeHandler = (text) => {
        DB.toggleAttributeState(attributeType, currentCategory, text, () => {
            console.log("Att changed")
        });
    }

    return(
        <View style= { { 
            height: useWindowDimensions().height-365,
        } } >
            <View style= { boxes.subHeader } >
                <Padding
                    height= { 9.25 }
                />
                <View style= { boxes.paddedRow } >
                    <Text style= { texts.separatorText } >Fähigkeiten auswählen</Text>
                </View>
                <Padding
                    height= { 9.25 }
                />
                <ScrollRow
                    type= "attributes"
                    data= { categoriesList }
                    currentCategory= { currentCategory }
                    onPress= { (item) => { selectCategoryHandler (item) } }
                />
            </View>
            <View style= { boxes.separator } >
                <Text style= { texts.separatorText, { paddingHorizontal: 15 } } >{ currentCategory }</Text>
            </View>
            <FlatList 
                style= { { backgroundColor: colors.white, flexGrow: 1 } }
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
        </View>
    )
}