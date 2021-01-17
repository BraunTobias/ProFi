import React, { useState, useEffect, useLayoutEffect, Fragment, useContext } from 'react';
import {FlatList, View, Text, SafeAreaView, StyleSheet} from "react-native";

import { texts } from '../Styles';
import AttributeTile from '../components/AttributeTile';
import ScrollRow from '../components/ScrollRow';
import DB from '../api/DB_API';
import Padding from './Padding';
import SubHeader from '../components/SubHeader';
import FlexRow from '../components/FlexRow';
import SectionHeader from '../components/SectionHeader';
import { ThemeContext } from '../components/ThemeManager';

export default AttributeScreen = (props) => {

    const {themeColors} = useContext(ThemeContext);

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
            <SafeAreaView style={{ flex: 0, backgroundColor: themeColors.base }} />
            <SafeAreaView style={{flex: 1, backgroundColor: themeColors.base}}>
                <SubHeader>
                    <Padding height={10}/>
                    <FlexRow padding>
                        <Text style={[texts.separatorText, {color: themeColors.textHl}]}>Fähigkeiten auswählen</Text>
                    </FlexRow>
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
                <View style={styles.modalButton}>
                    <Button
                        title={"Bestätigen"}
                        onPress={props.onDismiss}
                    />
                </View>
            </SafeAreaView>
        </Fragment>
    )
}
const styles = StyleSheet.create({
    modalButton: {
        width: "100%",
        paddingHorizontal: 15,
        paddingBottom: 13,
        paddingTop: 7,
    },
});