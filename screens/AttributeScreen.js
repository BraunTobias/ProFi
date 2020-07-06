import React, { useState, useEffect } from 'react';
import {FlatList, View, Text} from "react-native";
import SkillsTile from '../components/SkillsTile';
import CategoryIcon from '../components/CategoryIcon';
import { styles, texts } from '../Styles';
import DB from '../api/DB_API';

export default AttributeScreen = ({route, navigation}) => {
    const {filter} = route.params;
    const {attributeType} = route.params;
    const [currentCategory, setCurrentCategory] = useState("");
    const [categoriesList, setCategoriesList] = useState([]);
    const [displayedSkills, setDisplayedSkills] = useState([]);

    useEffect(() => {
        DB.getCategoriesFromAttribute(attributeType, (categoriesList) => {
            console.log(categoriesList);
            setCategoriesList(categoriesList);
            setCurrentCategory(categoriesList[0]);
            DB.getUserAttributesFromCategory(attributeType, categoriesList[0], filter, (attributesList) => {
                console.log(attributesList);
                setDisplayedSkills(attributesList);
            }, (error) => {console.log(error)});    
        });
    }, []);
    
    const clickSkillHandler = (text) => {
        DB.toggleAttributeState(attributeType, currentCategory, text, () => {
            console.log("Toggled state of " + text);
        });
    }
    const clickCategoryHandler = (name) => {
        setCurrentCategory(name);
        DB.getUserAttributesFromCategory(attributeType, name, filter, (attributesList) => {
            console.log(attributesList);
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
                                        />
                                    );
                                }}
                            />

                    </View>
                </View>
                
                <Text style={[texts.headline, {paddingLeft: 20, padding: 10}]}>{currentCategory}</Text>

                <FlatList style={{height: "90%"}}
                    data={displayedSkills}
                    keyExtractor={(item, index) => item[0] }
                    renderItem={(itemData) => { 
                        return (
                            <SkillsTile
                                text={itemData.item[0]}  
                                state={itemData.item[1]}
                                index = {itemData.index}
                                backgroundColor = {itemData.index % 2 === 0 ? "#ffffff" : "#f5f7f7"}
                                onClick={clickSkillHandler}
                            />
                        );
                    }}
                />
            </View>
        );
  
}