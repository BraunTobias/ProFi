import React, { useState, useEffect } from 'react';
import {FlatList, View, Text, RefreshControl} from "react-native";
import {SKILLS} from'../data/dummy-data';
import SkillsTile from './SkillsTile';
import CategoryIcon from './CategoryIcon';
import {Button} from 'react-native-elements';
import {Ionicons} from '@expo/vector-icons';
import { Icon } from 'react-native-elements';
import { TouchableHighlight } from 'react-native-gesture-handler';
import DB from '../api/DB_API';

export default AttributeScreen = ({route, navigation}) => {
    const {filter} = route.params;
    const {attributeType} = route.params;
    const [currentCategory, setCurrentCategory] = useState("Audio");
    const [categoriesList, setCategoriesList] = useState(["Audio"]);
    const [displayedSkills, setDisplayedSkills] = useState([]);
    // const displayedSkills = SKILLS.filter(item => item.category === currentCategory);
    
    // const updateSelectedSkillsList = (text) => {
    //     // var list = props.selectedSkillsList;
    //     // if (list.indexOf(text) <= 0) {
    //     //     list.push(text);
    //     // } else {
    //     //     list = list.filter(item => item !== text);
    //     // }
    //     props.addSelectedSkill(text);
    // }    
    useEffect(() => {
        DB.getCategoriesFromAttribute(attributeType, (categoriesList) => {
            console.log(categoriesList);
            setCategoriesList(categoriesList);
        });
        DB.getUserAttributesFromCategory(attributeType, currentCategory, filter, (attributesList) => {
            console.log(attributesList);
            setDisplayedSkills(attributesList);
        }, (error) => {console.log(error)});
    }, []);
    
    const getInfoFromDatabase = () => {
    }
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
                {/* Fähigkeiten-Header: Icons */}
                <FlatList
                    data={categoriesList}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(itemData) => { 
                        return (
                            <CategoryIcon
                                onClick={() => {clickCategoryHandler(itemData.item)}} 
                                title={itemData.item}
                                // imageUrl={itemData.item.imageUrl}
                            />
                        );
                    }}
                />

                <Text>{currentCategory}</Text>

                <FlatList style={{height: "90%"}}
                    data={displayedSkills}
                    keyExtractor={(item, index) => item[0]}
                    // refreshControl={
                    //     <RefreshControl
                    //     refreshing={this.state.refreshing}
                    //     onRefresh={this._onRefresh}
                    //     />
                    // }                        
                    renderItem={(itemData) => { 
                        return (
                            // FlatList
                            <SkillsTile
                                text={itemData.item[0]}  
                                state={itemData.item[1]}
                                onClick={clickSkillHandler}
                            />
                        );
                    }}
                />
            </View>
        );
  
}