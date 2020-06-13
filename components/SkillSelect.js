import React, {useLayoutEffect, useState} from 'react';
import {FlatList, View} from "react-native";
import {SKILLS} from'../data/dummy-data';
import SkillsTile from '../components/SkillsTile';
import {Button} from 'react-native-elements';
import {Ionicons} from '@expo/vector-icons';
import { Icon } from 'react-native-elements';
import { TouchableHighlight } from 'react-native-gesture-handler';
import DB from '../api/DB_API';

export default SkillSelect = props => {
    const [currentCategory, setCurrentCategory] = useState('Programmieren');
    const displayedSkill = SKILLS.filter(item => item.category === currentCategory);
    
    // const updateSelectedSkillsList = (text) => {
    //     // var list = props.selectedSkillsList;
    //     // if (list.indexOf(text) <= 0) {
    //     //     list.push(text);
    //     // } else {
    //     //     list = list.filter(item => item !== text);
    //     // }
    //     props.addSelectedSkill(text);
    // }
    const clickSkillHandler = (text) => {
        if (props.forIdea) {
            props.addSelectedSkill(text);
            console.log("For Idea");
        } else {
            DB.toggleAttributeState("skills", currentCategory, text, () => {console.log("Toggled state of " + text)});
            console.log("Not for Idea");
        }
    }

    return(
        <View style={{height: "100%"}}>
            {/* Fähigkeiten-Header: Icons */}
            <View style={{height: "15%", width: "100%", justifyContent: 'center', alignItems: "center", flexDirection: 'row', backgroundColor: '#aeb8c3'}}>
                {/* Programmierung */}
                <TouchableHighlight
                    onPress={()=>{setCurrentCategory('Programmieren')}}
                    underlayColor="#aeb8c3"
                    >
                    <Icon 
                        class="toggle"
                        raised
                        name={"ios-desktop"} 
                        size={35} 
                        type="ionicon"
                        color={"#222f56"} 
                    />
                </TouchableHighlight>

                {/* Design */}
                <TouchableHighlight 
                    onPress={()=>{setCurrentCategory('Design')}}
                    underlayColor="#aeb8c3"
                >
                <Icon 
                    raised 
                    name={"ios-color-palette"} 
                    size={35} 
                    type="ionicon"
                    color={"#222f56"} 
                />
                </TouchableHighlight>

                {/* Sozial */}
                <TouchableHighlight 
                    onPress={()=>{setCurrentCategory('Sozial')}}
                    underlayColor="#aeb8c3"
                >
                <Icon 
                    raised 
                    name={"ios-people"} 
                    size={35} 
                    type="ionicon"
                    color={"#222f56"} 
                />
                </TouchableHighlight>
                
                {/* Audio */}
                <TouchableHighlight 
                    onPress={()=>{setCurrentCategory('Audio')}}
                    underlayColor="#aeb8c3"
                >
                <Icon 
                    raised 
                    name={"ios-volume-high"} 
                    size={35} 
                    type="ionicon"
                    color={"#222f56"} 
                />
                </TouchableHighlight>
            </View>
            <FlatList style={{height: "90%"}}
                data={displayedSkill}
                renderItem={(itemData) => { 
                    return (
                        // FlatList
                        <SkillsTile
                            text={itemData.item.name}  
                            id={itemData.item.id}
                            onClick={clickSkillHandler}
                        />
                    );
                }}
            />
        </View>
  );
}