import React, {useState} from "react";
import { StyleSheet, Text, TouchableOpacity, Image} from "react-native";
import { darkGrey, lightBlue, icons } from "../Styles";

export default SkillsTile = props => {
  const [currentIcon, setCurrentIcon] = useState(props.state ? icons.checkTrue : icons.checkFalse);
  const [currentIconState, setCurrentIconState] = useState(props.state);
  const [currentIconSize, setCurrentIconSize] = useState(36);

  // Change Icon
  const changeIconHandler = () => {
    
    if (currentIconState) {
      setCurrentIcon(icons.checkFalse)
      setCurrentIconSize(30)
      setCurrentIconState(false)
    }
    else {
      setCurrentIcon(icons.checkTrue)
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
        <Text 
          style = {[styles.tileText, {color: currentIconState ? darkGrey : lightBlue}]}
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
      color: darkGrey
  },
  checkmark: {
    width: 22,
    height: 22
  }
});
