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

export default AttributeListScreen = ({route, navigation}) => {
    const {filter} = route.params;
    const {attributeType} = route.params;

    const [attList, setAttList] = useState([]);

    useEffect(() => {
        DB.getAllAttributes(attributeType, filter, (attributesList) => {
            setAttList(attributesList);
            console.log(attributesList);
        }, () => {});
    }, []);
    
    return(
        <View style={{height: "100%"}}>
            <FlatList style={{height: "90%"}}
                data={attList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(itemData) => { 
                    return (
                        // FlatList
                        <View>
                            <Text style={{fontWeight: "bold", fontSize: 24}}>{itemData.item[0]}</Text> 
                            <Text style={{fontSize: 18, lineHeight: 24}}>{itemData.item[1]}</Text> 
                        </View>
                    );
                }}
            />
        </View>
    );
  
}