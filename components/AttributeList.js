import React, { useState, useEffect } from 'react';
import {FlatList, View, Text} from "react-native";
import DB from '../api/DB_API';
import { styles, texts } from '../Styles';

export default AttributeListScreen = props => {
    const filterList = props.filterList;
    const [attList, setAttList] = useState([]);

    useEffect(() => {
        DB.getAllAttributes("skills", filterList, (attributesList) => {
            setAttList(attributesList);
        }, () => {});
    }, []);
    
    return(
        <FlatList style={{height: "100%"}}
            data={attList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(itemData) => { 
                return (
                    <View style={styles.contentAttribute}>
                        <Text style={[texts.textBoldAttribute, ]}>{itemData.item[0]}</Text> 
                        <Text style={[texts.textAttribute, {backgroundColor: "white"}]}>{itemData.item[1]}</Text>
                    </View>
                );
            }}
        />
    );
  
}