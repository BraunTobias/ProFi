import React, { useState, useEffect, useLayoutEffect, Fragment } from 'react';
import {FlatList, View, Text, SafeAreaView} from "react-native";

import { boxes, colors, styles, texts } from '../Styles';
import AttributeTile from '../components/AttributeTile';
import ScrollRow from '../components/ScrollRow';
import DB from '../api/DB_API';
import Padding from './Padding';
import SubHeader from '../components/SubHeader';
import FlexRow from '../components/FlexRow';
import SectionHeader from '../components/SectionHeader';

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
        <Fragment>
            <SafeAreaView style={{ flex: 0, backgroundColor: colors.lightBlue }} />
            <SafeAreaView style={{flex: 1, backgroundColor: colors.lightGrey}}>
                <SubHeader>
                    <Padding height={10}/>
                    <FlexRow padding>
                        <Text style={texts.separatorText}>Fähigkeiten auswählen</Text>
                    </FlexRow>
                    <ScrollRow
                        type="attributes"
                        data= {categoriesList}
                        currentCategory={currentCategory}
                        onPress={selectCategoryHandler}
                    />
                </SubHeader>
                <SectionHeader>
                    <Text style={texts.separatorText}>{currentCategory}</Text>
                </SectionHeader>
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
                    <Button
                        title={"Bestätigen"}
                        onPress={props.onDismiss}
                    />
                </View>
            </SafeAreaView>
        </Fragment>
    )
}