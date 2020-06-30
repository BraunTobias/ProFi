import React, {useState, useLayoutEffect, useCallback} from "react";
import { StyleSheet, Text, TouchableOpacity, Image} from "react-native";
import {Ionicons} from '@expo/vector-icons';
import checkfalse from '../assets/check-false.png';
import checktrue from '../assets/check-true.png';
import { black, darkGrey, icons } from "../Styles";

export default SkillsTile = props => {
  const [currentIcon, setCurrentIcon] = useState(props.state ? checktrue : checkfalse);
  const [currentIconState, setCurrentIconState] = useState(props.state);
  const [currentIconSize, setCurrentIconSize] = useState(36);

  // Change Icon
  const changeIconHandler = () => {
    
    if (currentIconState) {
      setCurrentIcon(checkfalse)
      setCurrentIconSize(30)
      setCurrentIconState(false)
    }
    else {
      setCurrentIcon(checktrue)
      setCurrentIconSize(36)
      setCurrentIconState(true)
    }
    props.onClick(props.text);
  }

  return (
    // FlatList
    <TouchableOpacity
        style={[styles.itemContainer, {backgroundColor: props.backgroundColor}]}
        onPress={changeIconHandler}
        >
          <Image
            source={currentIcon}
            style={styles.checkmark}
          />
        {/* <Ionicons
            raised
            name={currentIcon} 
            size={currentIconSize} 
            type="ionicon"
            color={"tomato"}
        /> */}
        <Text 
          style = {[styles.tileText, {color: currentIconState ? black : darkGrey}]}
        > {props.text} </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingLeft: 20,
    height: 50,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "white",
  },
  tileText:{
      marginLeft: 10,
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'right',
      color: black
  },
  checkmark: {
    width: 22,
    height: 22
  }
});
