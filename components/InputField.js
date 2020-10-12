import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { icons, colors, boxes, texts } from '../Styles';

export default InputField = props => {

  // Wenn vorhanden, wird der Titel über dem Input-Feld angezeigt
  const titleText = () => {
    if (props.title) {
      return ( <Text style={texts.subHeader}>{ props.title }</Text> )
    } else {
      return (null);
    }
  }

  const mainField = () => {
    if (props.isDate) {
      return(
        <TouchableWithoutFeedback onPress={props.onPress}>
          <TextInput
              style= {boxes.inputField}
              autoCapitalize="none"
              textAlign= "left"
              placeholder= { props.placeholderText }
              value= { props.value }
              onChangeText= { text => props.onChangeText(text)}
              secureTextEntry= { props.secureTextEntry }
              pointerEvents={"none"}
          />
        </TouchableWithoutFeedback>
      )
    } else {
      return (
        <TextInput
            style= {[boxes.inputField, {height: props.multiline ? "auto" : 45, paddingTop: props.multiline ? 12 : 0, paddingBottom: props.multiline ? 12 : 0}]}
            autoCapitalize="none"
            textAlign= "left"
            placeholder= { props.placeholderText }
            value= { props.value }
            onChangeText= { text => props.onChangeText(text)}
            secureTextEntry= { props.secureTextEntry }
            multiline={props.multiline}
            maxLength={300}
        />
      )
    }
  }

  return (
    <View style={{width: "100%"}}>
        {titleText()}
        {mainField()}
    </View>
  );
};