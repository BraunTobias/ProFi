import React, { useState, useEffect, useLayoutEffect } from 'react';
import {FlatList, View, Text, Modal} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

import { boxes, colors, styles, texts } from '../Styles';
import AttributeTile from '../components/AttributeTile';
import ScrollRow from '../components/ScrollRow';
import DB from '../api/DB_API';
import ButtonLarge from '../components/ButtonLarge';
import InfoModal from '../components/InfoModal';
import Padding from '../components/Padding';

export default AttributeScreen = ({route, navigation}) => {

    const {attributeType} = route.params;
    const currentUserId = DB.getCurrentUserId();
    
    // State Hooks
    const [currentCategory, setCurrentCategory] = useState("");
    const [categoriesList, setCategoriesList] = useState([]);
    const [displayedSkills, setDisplayedSkills] = useState([]);
    const [skillsInfoVisible, setSkillsInfoVisible] = useState(false);

    // Für Info-Modal
    const storeInfoReceived = async (info) => {
        try {
          await AsyncStorage.setItem(info, currentUserId);
          console.log(currentUserId)
        } catch(e) {console.log(e);}
    }
    const getInfoReceived = async () => {
        try {
          const skillsInfo = await AsyncStorage.getItem("skillsInfoReceived");
          console.log(skillsInfo);
          if (skillsInfo != currentUserId) setSkillsInfoVisible(true);
        } catch(e) {console.log(e);}
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: attributeType == "skills" ? "Fähigkeiten" : "Interessen",
        });
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            DB.getCategoriesFromAttribute(attributeType, (categoriesList) => {
                setCategoriesList(categoriesList);
                setCurrentCategory(categoriesList[0]);
                if(attributeType == "skills") getInfoReceived();
                DB.getUserAttributesFromCategory(attributeType, categoriesList[0], (attributesList) => {
                    setDisplayedSkills(attributesList);
                }, (error) => {console.log(error)});    
            });
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
            <InfoModal 
                visible={skillsInfoVisible}
                onPress={() => {setSkillsInfoVisible(false); storeInfoReceived("skillsInfoReceived");}}
                title={"Fähigkeiten-Auswahl"}
                copy="Durch das Auswählen einer Fähigkeit erklärst du dich bereit, diese bei Bedarf in einem Projekt zu übernehmen. 
                    Du musst sie noch nicht beherrschen, sondern nur bereit sein, dich damit auseinanderzusetzen."
            />
            <View style={boxes.subHeader}>
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