import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import {FlatList, View } from "react-native";

import AttributeTile from '../components/AttributeTile';
import ScrollRow from '../components/ScrollRow';
import DB from '../api/DB_API';
import InfoModal from '../components/InfoModal';
import SubHeader from '../components/SubHeader';
import SectionHeader from '../components/SectionHeader';
import { ThemeContext } from '../components/ThemeManager';

export default AttributeScreen = ({route, navigation}) => {

    const {themeColors} = useContext(ThemeContext);

    const {attributeType} = route.params;
    const currentUserId = DB.getCurrentUserId();
    
    // State Hooks
    const [currentCategory, setCurrentCategory] = useState("");
    const [categoriesList, setCategoriesList] = useState([]);
    const [displayedSkills, setDisplayedSkills] = useState([]);
    const [attInfoVisible, setAttInfoVisible] = useState(false);

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
                DB.getUserAttributesFromCategory(attributeType, categoriesList[0], (attributesList) => {
                    setDisplayedSkills(attributesList);
                }, (error) => {console.log(error)});    
                DB.getInfoReceived(attributeType, (isReceived) => {
                    setAttInfoVisible(!isReceived);
                    // console.log("Info zu " + attributeType + " erhalten: " + isReceived);
                })
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
                visible={attInfoVisible}
                onPress={() => {setAttInfoVisible(false); DB.setInfoReceived(attributeType);}}
                title={attributeType == "skills" ? "Fähigkeiten-Auswahl" : "Interessen-Auswahl"}
                copy={attributeType == "skills" ?
                        "Durch das Auswählen einer Fähigkeit erklärst du dich bereit, diese bei Bedarf in einem Projekt zu übernehmen. Du musst sie noch nicht beherrschen, sondern nur bereit sein, dich damit auseinanderzusetzen."
                        : "Die Interessen, die du auswählst, helfen uns dabei, dich mit passenden Leuten zusammenzubringen."
                    }
            />
            <SubHeader>
                <ScrollRow
                    type="attributes"
                    data= {categoriesList}
                    currentCategory={currentCategory}
                    onPress={selectCategoryHandler}
                />
            </SubHeader>
            <SectionHeader text={currentCategory}/>
            <FlatList 
                style= {{backgroundColor: themeColors.base, flexGrow: 1}}
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