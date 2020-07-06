import React, { useState, useEffect } from 'react';
import {FlatList, View, Text} from "react-native";
import SkillsTile from './SkillsTile';
import CategoryIcon from './CategoryIcon';
import { styles, texts } from '../Styles';
import DB from '../api/DB_API';

export default AttributeSelect = props => {
    const attributeType = props.attributeType;
    const filter = [];

    const [currentCategory, setCurrentCategory] = useState("");
    const [categoriesList, setCategoriesList] = useState([]);
    const [displayedSkills, setDisplayedSkills] = useState([]);
    
    useEffect(() => {
        DB.getCategoriesFromAttribute(attributeType, (categoriesList) => {
            setCategoriesList(categoriesList);
            setCurrentCategory(categoriesList[0]);

            DB.getNeutralAttributesFromCategory(attributeType, categoriesList[0], filter, (attributesList) => {
                setDisplayedSkills(attributesList);
            }, (error) => {console.log(error)});    
        });
    }, []);
    
    const clickCategoryHandler = (name) => {
        setCurrentCategory(name);
        DB.getNeutralAttributesFromCategory(attributeType, name, filter, (attributesList) => {
            setDisplayedSkills(attributesList);
        }, (error) => {console.log(error)});
    }

    return(
        <View style={{height: "100%"}}>
            <View style= { styles.subHeader } >
                <View style= {styles.membersRow} >
                        {/* Fähigkeiten-Header: Icons */}
                        <FlatList
                            style ={{paddingLeft: 15, paddingRight: 15}}
                            data={categoriesList}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={(itemData) => { 
                                return (
                                    <CategoryIcon
                                        onClick={() => {clickCategoryHandler(itemData.item)}} 
                                        title={itemData.item}
                                        isActive={currentCategory == itemData.item}
                                        isLast={itemData.index == categoriesList.length - 1 ? true : false}
                                    />
                                );
                            }}
                        />
                </View>
            </View>

            <Text style={[texts.headline, {paddingLeft: 20, padding: 10}]}>{currentCategory}</Text>

            <FlatList 
            style={{flex: 1, paddingBottom: 50}}
                data={displayedSkills}
                keyExtractor={(item, index) => item.toString()}
                renderItem={(itemData) => { 
                    return (
                        // FlatList
                        <SkillsTile
                            text={itemData.item}  
                            state={props.selectedAttributesList.indexOf(itemData.item) >= 0}
                            onClick={props.addSelectedAttribute}
                        />
                    );
                }}
            />
        </View>
    );
}