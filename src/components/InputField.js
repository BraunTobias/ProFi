import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, } from 'react-native';
import { texts, boxes, icons, colors } from '../Styles';

export default function InputField (props) {
  
  const [pwVisible, setPwVisible] = useState(false);
  const [textChanged, setTextChanged] = useState(false);
  
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
        <TouchableOpacity onPress= { props.onPress } >
          <View style= { [
            boxes.inputField,
            {
              flexDirection: "row", 
              justifyContent: "space-between", 
              alignItems:"center",
              // width: 400,
          } ] } >
            <TextInput
                style= {texts.inputField}
                autoCapitalize="none"
                textAlign= "left"
                placeholder= { props.placeholderText }
                value= { props.value }
                onChangeText= { text => props.onChangeText(text)}
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
    }
    else {
      return (
        <View style= { [ 
          boxes.inputField, 
          props.showError ? boxes.inputFieldError : {},
          {
            height: props.multiline ? 160 : 40, 
            width: props.multiline ? 400 : '100%', 
            paddingTop: props.multiline ? 6 : 0, 
            paddingBottom: props.multiline ? 12 : 0,
            flexDirection: 'row', 
        } ] } >
          <TextInput
            style= { [texts.inputField, { width: '100%' } ] }
            autoCapitalize="none"
            textAlign= "left"
            placeholder= { props.placeholderText }
            value= { props.value }
            onChangeText= { text => { props.onChangeText(text); setTextChanged(true) } }
            secureTextEntry= { props.secureTextEntry && !pwVisible }
            multiline={props.multiline}
            maxLength= { props.multiline ? 300 : 50 }
            numberOfLines={props.numberOfLines}
          />

          { props.isCloseable && 
            <TouchableOpacity style= { { right: 7, justifyContent: "center", } }
                onPress= { () => props.closeButton() }
            >
              <Image 
                style= { boxes.buttonClose }
                source= { icons.close }
                resizeMode= { "contain" }
              />
            </TouchableOpacity>
          }
          { props.secureTextEntry && textChanged &&
              <TouchableOpacity 
                style= { { right: 7, justifyContent: "center", } }
                onPress={() => setPwVisible(!pwVisible)}
              >
                <Image 
                  style= { {
                    height: 40,
                    width: 40,
                    tintColor: colors.mediumBlue,
                    borderRadius: 7,
                    justifyContent: "center",
                    alignItems: "center", 
                  } }
                  source={ pwVisible ? icons.passwordHide : icons.passwordShow }
                  resizeMode={"contain"}
                />
              </TouchableOpacity>
          }
          { props.needConfirmation && textChanged && 
            <TouchableOpacity
              style= { { right: 7, justifyContent: "center", paddingLeft: 7} }
              onPress= { (text) => { props.needConfirmation(text); setTextChanged(false) } }
            >
              <Image 
                style= { boxes.buttonClose }
                source= { icons.checkTrue }
                resizeMode= { "contain" }
              />
            </TouchableOpacity>
          }
        </View>
      )
    }
  }

  return (
    <View style={{
      // width: "100%"
    }}>
        {titleText()}
        {mainField()}
    </View>
  );
};