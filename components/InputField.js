import React, { useState } from 'react';
import { View, TextInput, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
// import { ,  } from 'react-native-gesture-handler';
import { icons, colors, boxes, texts } from '../Styles';

export default InputField = props => {

  const [pwVisible, setPwVisible] = useState(false);

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
          <View style={[boxes.inputField, props.showError ? boxes.inputFieldError : {}, {flexDirection: "row", justifyContent: "space-between", alignItems:"center"}]}>
            <TextInput
                style= {[texts.inputField, {color: props.showError ? colors.red : colors.darkGrey}]}
                autoCapitalize="none"
                textAlign= "left"
                placeholder= { props.placeholderText }
                value= { props.value }
                onChangeText= { text => props.onChangeText(text)}
                pointerEvents={"none"}
            />
            <View style={boxes.inputFieldIconBox}>
              <Image
                style={boxes.inputFieldIcon}
                source={props.icon}
                resizeMode={"contain"}
              />
            </View>
          </View>
        </TouchableOpacity>
      )
    } else {
      return (
        <View style= {[boxes.inputField, props.showError ? boxes.inputFieldError : {}, {
          height: props.multiline ? "auto" : 40, 
          paddingTop: props.multiline ? 6 : 0, 
          paddingBottom: props.multiline ? 12 : 0,
          }]}>
          <TextInput
              style= {texts.inputField}
              placeholderTextColor={props.showError ? colors.red : colors.lightBlue}
              autoCapitalize="none"
              textAlign= "left"
              placeholder= { props.placeholderText }
              value= { props.value }
              onChangeText= { text => props.onChangeText(text)}
              secureTextEntry= { props.secureTextEntry && !pwVisible}
              multiline={props.multiline}
              maxLength={300}
          />
          {props.secureTextEntry && 
              <TouchableOpacity 
                  style={{position: "absolute", right: 0}}
                  onPress={() => setPwVisible(!pwVisible)}
              >
                  <Image 
                    style={{height: 40, aspectRatio: 1, marginRight: 5, tintColor: colors.mediumBlue}}
                    source={pwVisible ? icons.passwordHide : icons.passwordShow}
                    resizeMode={"contain"}
                  />
              </TouchableOpacity>
          }
        </View>
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