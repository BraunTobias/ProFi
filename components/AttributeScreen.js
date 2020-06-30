import React, { useState, useEffect } from 'react';
import {FlatList, View, Text, RefreshControl} from "react-native";
import {SKILLS} from'../data/dummy-data';
import SkillsTile from './SkillsTile';
import CategoryIcon from './CategoryIcon';
import {Button} from 'react-native-elements';
import {Ionicons} from '@expo/vector-icons';
import { Icon } from 'react-native-elements';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { styles, buttons, texts, white, lightGrey, grey, black, iconsize, iconsizeAdd } from '../Styles';
import DB from '../api/DB_API';

export default AttributeScreen = ({route, navigation}) => {
    const {filter} = route.params;
    const {attributeType} = route.params;
    const [currentCategory, setCurrentCategory] = useState("");
    const [categoriesList, setCategoriesList] = useState([]);
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
                                            // imageUrl={itemData.item.imageUrl}
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
                            // FlatList
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