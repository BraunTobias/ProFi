import React, {useLayoutEffect, useState} from 'react';
import {FlatList, View} from "react-native";
import {SKILLS} from'../data/dummy-data';
import SkillsTile from '../components/SkillsTile';
import {Button} from 'react-native-elements';
import {Ionicons} from '@expo/vector-icons';
import { Icon } from 'react-native-elements';
import { TouchableHighlight } from 'react-native-gesture-handler';

export default SkillScreen = ({navigation}) => {
    const [currentCategory, setCurrentCategory] = useState('Programmieren');
    const displayedSkill = SKILLS.filter(item => item.category === currentCategory);
    
    //Header
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Fähigkeiten",
            headerRight : () => (
                <Button 
                    type ='clear' 
                    icon={<Ionicons name='ios-checkmark'size={32} color="rgb(0,122,255)"/>}
                    onPress={() =>navigation.navigate('Profil')}
                />)
                
        });
    }, [navigation]);
    
    return(
        <View>
            {/* Fähigkeiten-Header: Icons */}
            <View style={{justifyContent: 'center', flexDirection: 'row', backgroundColor: 'tomato'}}>
                {/* Programmierung */}
                <TouchableHighlight 
                    onPress={()=>{setCurrentCategory('Programmieren')}}
                    underlayColor="tomato"
                    >
                    <Icon 
                        class="toggle"
                        raised
                        name={"ios-desktop"} 
                        size={35} 
                        type="ionicon"
                        color={"tomato"} 
                    />
                </TouchableHighlight>

                {/* Design */}
                <TouchableHighlight 
                    onPress={()=>{setCurrentCategory('Design')}}
                    underlayColor="tomato"
                >
                <Icon 
                    raised 
                    name={"ios-color-palette"} 
                    size={35} 
                    type="ionicon"
                    color={"tomato"} 
                />
                </TouchableHighlight>

                {/* Sozial */}
                <TouchableHighlight 
                    onPress={()=>{setCurrentCategory('Sozial')}}
                    underlayColor="tomato"
                >
                <Icon 
                    raised 
                    name={"ios-people"} 
                    size={35} 
                    type="ionicon"
                    color={"tomato"} 
                />
                </TouchableHighlight>
                
                {/* Audio */}
                <TouchableHighlight 
                    onPress={()=>{setCurrentCategory('Audio')}}
                    underlayColor="tomato"
                >
                <Icon 
                    raised 
                    name={"ios-volume-high"} 
                    size={35} 
                    type="ionicon"
                    color={"tomato"} 
                />
                </TouchableHighlight>
            </View>
            <View>   
            <FlatList
                data={displayedSkill}
                renderItem={(itemData) => { 
                    return (
                        // FlatList
                        <SkillsTile
                            text={itemData.item.name}  
                            id={itemData.item.id}
                        />
                    );
                }}
            />
            </View>
        </View>
  );
}