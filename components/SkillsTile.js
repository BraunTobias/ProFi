import React, {useState, useLayoutEffect, useCallback} from "react";
import { StyleSheet, Text, TouchableOpacity} from "react-native";
import {Ionicons} from '@expo/vector-icons';

export default SkillsTile = props => {
  const [currentIcon, setCurrentIcon] = useState(props.state ? "ios-checkbox" : "ios-square-outline");
  const [currentIconState, setCurrentIconState] = useState(props.state);
  const [currentIconSize, setCurrentIconSize] = useState(36);

  // Change Icon
  const changeIconHandler = () => {
    
    if (currentIconState) {
      setCurrentIcon("ios-square-outline")
      setCurrentIconSize(30)
      setCurrentIconState(false)
    }
    else {
      setCurrentIcon("ios-checkbox")
      setCurrentIconSize(36)
      setCurrentIconState(true)
    }
    props.onClick(props.text);
  }

  return (
    // FlatList
    <TouchableOpacity
        style={styles.itemContainer}
        onPress={changeIconHandler}
        >
        <Ionicons
            raised
            name={currentIcon} 
            size={currentIconSize} 
            type="ionicon"
            color={"tomato"}
        />
        <Text style = {styles.tileText}> {props.text} </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 2,
    padding: 20,
    height: 100,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "white",
  },
  tileText:{
      marginLeft: 15,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'right',
      color: 'grey'
  }
});
