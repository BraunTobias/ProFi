import React , {useState, useEffect} from "react";
import { StyleSheet, FlatList, Text, TouchableOpacity, View, Image } from "react-native";
import DB from '../api/DB_API';
import { styles, texts } from '../Styles';


export default AttributeListTile = props => {

  const colorStyle = {
    backgroundColor: props.backgroundColor
  }

  
  return (
        <FlatList style={{height: "90%"}}
            data={attList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(itemData) => { 
                return (
                    // FlatList
                    <View style={[styles.contentAttribute, colorStyle]}>
                        <Text style={texts.textBoldAttribute}>{itemData.item[0]}</Text> 
                        <Text style={texts.textAttribute}>{itemData.item[1]}</Text> 
                    </View>
                );
            }}
        />
    );
}