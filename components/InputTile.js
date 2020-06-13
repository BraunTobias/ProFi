import React, {useState} from "react";
import { StyleSheet, View, TextInput} from "react-native";
import {Button} from 'react-native-elements'

export default InputTile = props => {

  const[currentInput, setCurrentInput] = useState("");

  const onChangeTextHandler = (enteredText) =>{
    setCurrentInput(enteredText);
  }

  return (
    // <View style={styles.itemContainer} >
    <TextInput 
      placeholder={props.placeholderText} 
      keyboardType={props.keyboardType}
      onChangeText={onChangeTextHandler} 
      value={currentInput}/>
    /* <Button 
      title= "Confirm"
      onPress={() => {props.onAdd(currentInput)}}            
    /> */
    // </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    marginVertical: 2,
    padding: 20,
    height: 100,
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "white",
  },
});
