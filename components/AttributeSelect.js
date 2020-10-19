import React, { useState, useEffect, useLayoutEffect } from 'react';
import {FlatList, View, Text} from "react-native";

import { boxes, colors, styles, texts } from '../Styles';
import AttributeTile from '../components/AttributeTile';
import ScrollRow from '../components/ScrollRow';
import DB from '../api/DB_API';
import Padding from './Padding';

export default AttributeScreen = (props) => {

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
        <View style={{flex: 1}}>
            <View style={boxes.subHeader}>
                <Padding
                    height={50}
                />
                <View style={boxes.paddedRow}>
                    <Text style={texts.separatorText}>Fähigkeiten auswählen</Text>
                </View>
                <ScrollRow
                    type="attributes"
                    data= {categoriesList}
                    currentCategory={currentCategory}
                    onPress={selectCategoryHandler}
                />
            </View>
            <View style={boxes.separator}>
                <Text style={texts.separatorText}>{currentCategory}</Text>
            </View>
            <FlatList 
                style= {{backgroundColor: colors.white, flexGrow: 1}}
                data={displayedSkills}
                keyExtractor={(item, index) => item }
                renderItem={(itemData) => { 
                    return (
                        <AttributeTile
                            text={itemData.item}  
                            state={props.selectedAttributesList.indexOf(itemData.item) >= 0}
                            index = {itemData.index}
                            backgroundColor = {itemData.index % 2 === 0 ? "#ffffff" : "#f5f7f7"}
                            onPress={() => {props.addAttribute(itemData.item)}}
                        />
                    );
                }}
            />
            <View style={boxes.modalButton}>
                <ButtonLarge
                    title={"Bestätigen"}
                    onPress={props.onDismiss}
                />
            </View>
        </View>
    )
}