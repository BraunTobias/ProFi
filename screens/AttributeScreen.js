import React, { useState, useEffect, useLayoutEffect } from 'react';
import {FlatList, View, Text} from "react-native";

import { boxes, colors, styles, texts } from '../Styles';
import AttributeTile from '../components/AttributeTile';
import ScrollRow from '../components/ScrollRow';
import DB from '../api/DB_API';

export default AttributeScreen = ({route, navigation}) => {

    const {attributeType} = route.params;
    
    // State Hooks
    const [currentCategory, setCurrentCategory] = useState("");
    const [categoriesList, setCategoriesList] = useState([]);
    const [displayedSkills, setDisplayedSkills] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: attributeType == "skills" ? "Fähigkeiten" : "Interessen",
        });
    }, [navigation]);

    useEffect(() => {
        DB.getCategoriesFromAttribute(attributeType, (categoriesList) => {
            setCategoriesList(categoriesList);
            setCurrentCategory(categoriesList[0]);
            DB.getUserAttributesFromCategory(attributeType, categoriesList[0], (attributesList) => {
                setDisplayedSkills(attributesList);
            }, (error) => {console.log(error)});    
        });
    }, []);

    const selectCategoryHandler = (category) => {
        setCurrentCategory(category);
        DB.getUserAttributesFromCategory(attributeType, category, (attributesList) => {
            setDisplayedSkills(attributesList);
        }, (error) => {console.log(error)});
    }

    const clickAttributeHandler = (text) => {
        DB.toggleAttributeState(attributeType, currentCategory, text, () => {
        });
    }

    return(
        <View style={{flex: 1}}>
            <View style={boxes.subHeader}>
                <View style={boxes.paddedRow}>
                    <Text style={texts.copy}>Durch Auswählen einer Fähigkeit erklärst du dich bereit, diese ggf. in einem Projekt zu übernehmen. 
                        Du musst sie noch nicht beherrschen.</Text>
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
                keyExtractor={(item, index) => item[0] }
                renderItem={(itemData) => { 
                    return (
                        <AttributeTile
                            text={itemData.item[0]}  
                            state={itemData.item[1]}
                            index = {itemData.index}
                            backgroundColor = {itemData.index % 2 === 0 ? "#ffffff" : "#f5f7f7"}
                            onPress={clickAttributeHandler}
                        />
                    );
                }}
            />

        </View>
    )
}