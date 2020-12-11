import React, { useState } from 'react';
import { View, TextInput, Text, Image, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';
// import { ,  } from 'react-native-gesture-handler';
import { icons, colors, boxes, texts } from '../Styles';
import FlexRow from './FlexRow';

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
            <View style={[styles.inputField, {
                  borderWidth: props.showError ? 1 : 0,
                  borderColor: props.showError ? colors.red : colors.lightBlue,
                  flexDirection: "row", 
                  justifyContent: "space-between", 
                  alignItems:"center"
            }]}>
                <Text style= {[texts.inputField, {
                  color: props.showError ? colors.red : colors.darkGrey
                }]}>
                  {props.value}
                </Text>
                <View style={styles.inputFieldIconBox}>
                    <Image
                      style={styles.inputFieldIcon}
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
          borderWidth: props.showError ? 1 : 0,
          borderColor: props.showError ? colors.red : colors.lightBlue,
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

const styles = StyleSheet.create({
  inputField: {
    minHeight: 40,
    paddingHorizontal: 10,
    marginVertical: 5,
    backgroundColor: colors.white,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: colors.lightBlue,
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
    backgroundColor: colors.darkBlue, 
  },
  inputFieldIcon: {
    height: 22, 
    width: 22, 
    tintColor: colors.white    
  },
});