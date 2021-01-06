import React, { useState, useContext } from 'react';
import { View, TextInput, Text, Image, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, ActivityIndicator } from 'react-native';
// import { ,  } from 'react-native-gesture-handler';
import { icons, colors, boxes, texts } from '../Styles';
import FlexRow from './FlexRow';
import { ThemeContext } from '../components/ThemeManager';

export default InputField = props => {

  const {themeColors} = useContext(ThemeContext);

  const [pwVisible, setPwVisible] = useState(false);

  // Wenn vorhanden, wird der Titel über dem Input-Feld angezeigt
  const titleText = () => {
    if (props.title) {
      return ( <Text style={[texts.subHeader, {color: themeColors.textCopy}]}>{ props.title }</Text> )
    } else {
      return (null);
    }
  }

  const mainField = () => {
    if (props.isButton) {
      return(
        <TouchableOpacity onPress={props.onPress}>
            <View style={[styles.inputField, {
                  backgroundColor: themeColors.textInput,
                  borderWidth: props.showError ? 1 : 0,
                  borderColor: props.showError ? themeColors.red : themeColors.textInactive,
                  flexDirection: "row", 
                  justifyContent: "space-between", 
                  alignItems:"center"
            }]}>
                {(props.value == "" && !props.loaded) && 
                  <ActivityIndicator style={{width: "100%"}} color={themeColors.textHl}/>
                }
                <Text style= {[texts.inputField, {
                  color: props.showError ? themeColors.red : props.value == "" ? themeColors.textInactive : themeColors.textCopy,
                }]}>
                  {props.value != "" ? props.value : props.placeholderText}
                </Text>
                <View style={[styles.inputFieldIconBox, { backgroundColor: themeColors.primary }]}>
                    <Image
                      style={[styles.inputFieldIcon, { tintColor: themeColors.textHighlight }]}
                      source={props.icon}
                      resizeMode={"contain"}
                    />
                </View>
            </View>
        </TouchableOpacity>
      )
    } else {
      return (
        <View style= {[styles.inputField, {
          backgroundColor: themeColors.textInput,
          borderWidth: props.showError ? 1 : 0,
          borderColor: props.showError ? themeColors.red : themeColors.textInactive,
          height: props.multiline ? "auto" : 40, 
          paddingTop: props.multiline ? 6 : 0, 
          paddingBottom: props.multiline ? 12 : 0,
        }]}>
          <TextInput
              style= {[texts.inputField, {
                color: props.showError ? themeColors.red : themeColors.textCopy
              }]}
              placeholderTextColor={props.showError ? themeColors.red : themeColors.textInactive}
              autoCapitalize={props.caps ? "characters" : "none"}
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
                    style={{height: 40, aspectRatio: 1, marginRight: 5, tintColor: themeColors.textInactive}}
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

const styles = StyleSheet.create({
  inputField: {
    minHeight: 40,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRadius: 7,
    justifyContent: "center",
    overflow: "hidden",
  },
  inputFieldIconBox: {
    height: 40, 
    width: 40,
    position: "absolute", 
    right: 0,
    borderBottomRightRadius: 7,
    borderTopRightRadius: 7,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  inputFieldIcon: {
    height: 22, 
    width: 22, 
  },
});