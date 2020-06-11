import React, {useState} from "react";
import { StyleSheet, Text, TouchableOpacity} from "react-native";
import {Ionicons} from '@expo/vector-icons';

export default PreferencesTile = props => {
  const [currentIconState, setCurrentIconState] = useState(true);
  const [currentIcon, setCurrentIcon] = useState("ios-square-outline");
  const [currentIconSize, setCurrentIconSize] = useState(36);
  
  // Change Icon
  const changeIconHandler = (currentIconState) => {
    if (currentIconState) {
      setCurrentIcon("ios-checkbox")
      setCurrentIconSize(30)
      setCurrentIconState(false)
    }
    else {
      setCurrentIcon("ios-square-outline")
      setCurrentIconSize(36)
      setCurrentIconState(true)
    }
  }

  return (
    // FlatList
    <TouchableOpacity
        style={styles.itemContainer}
        onPress={()=>{changeIconHandler(currentIconState)}}
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
      fontSize:18,
      fontWeight: 'bold',
      textAlign: 'right',
      color: 'grey'
  }
});
