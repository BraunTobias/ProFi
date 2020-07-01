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
import { styles, texts, buttons, lightGrey, lightBlue } from '../Styles';
import checktrue from '../assets/check-true.png';
import { color } from 'react-native-reanimated';

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
        <View style={{height: "90%"}}>
            <FlatList style={{height: "90%"}}
                data={attList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(itemData) => { 
                    return (
                        // FlatList
                        <View style={styles.contentAttribute}>
                            {/* Black Borders */}
                            <View style={styles.border}/>
                            <Text style={texts.textBoldAttribute}>{itemData.item[0]}</Text> 
                            <View style={styles.border}/>
                            <Text style={texts.textAttribute}>{itemData.item[1]}</Text>
                            {/* <Image
                                source={currentIcon}
                                style={styles.checkmark}
                            />  */}
                        </View>
                    );
                }}
            />
        </View>
    );
  
}