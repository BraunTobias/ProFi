import React from 'react';
import { View, TextInput, Text, Image } from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
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
    if (props.isButton) {
      return(
        <TouchableOpacity onPress={props.onPress}>
          <View style={[boxes.inputField, {flexDirection: "row", justifyContent: "space-between", alignItems:"center"}]}>
            <TextInput
                style= {texts.inputField}
                autoCapitalize="none"
                textAlign= "left"
                placeholder= { props.placeholderText }
                value= { props.value }
                onChangeText= { text => props.onChangeText(text)}
                secureTextEntry= { props.secureTextEntry }
                pointerEvents={"none"}
            />
            <Image
              style={boxes.inputFieldIcon}
              source={props.icon}
              resizeMode={"contain"}
            />
          </View>
        </TouchableOpacity>
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
            dataDetectorTypes={"link"}
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