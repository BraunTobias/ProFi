import React, { useState  } from 'react';
import { View,  Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { icons, boxes, texts, colors } from '../Styles';

// Komponent zur numerischen Zeiteingabe beim Erstellen eines neuen Kurses
export default function TimeInput (props) {

    const MIN = 0;
    const MAX = props.type === 'hours' ? 23 : 55;
    const STEP = props.type === 'hours' ? 1 : 5;

    // StateHooks
    const [oldText, setOldText] = useState(2);
    const [errorVisible, setErrorVisible] = useState(false);

    const checkText = (text) => {
        console.log(text)
        const numbers = '0123456789';
        var error = false;

        setErrorVisible(false);

        if (text !== '') {
            for (var i=0; i < text.length; i++) {
                if (numbers.indexOf(text[i]) === -1) error = true;
            }
        }

        if (!error && parseInt(text) < MAX) {
            props.onChange(parseInt(text))
            setOldText(parseInt(text))
        }
        else {
            setErrorVisible(true)
        }

        console.log(oldText)
    }

    const handleFocus = (event) => {
        event.target.select();
    }
    
    return (
        <View>
            <Text style={texts.subHeader}>{props.title}</Text>
            <View style={boxes.unPaddedRow}>
                
                {/* Button Minus */}
                <TouchableOpacity 
                    style= { Styles.button } 
                    onPress= { () => { 
                        if (props.value > MIN) { 
                            props.onChange(props.value - STEP) 
                            setErrorVisible(false);
                            setOldText(props.value - STEP) 
                            console.log(oldText)
                        } else if (props.value <= MIN) {
                            props.onChange(MAX) 
                            setErrorVisible(false);
                            setOldText(MAX) 
                            console.log(oldText)
                    } } }
                >
                    <Image
                        style= { Styles.icon }
                        source= { icons.minus }
                        resizeMode= { "contain" }
                    />
                </TouchableOpacity>
                
                {/* Textfeld */}
                <TextInput
                    style= { [ Styles.inputField, Styles.inputText ] }
                    maxLength={ 2 }
                    value= { props.value }
                    onChangeText= { text => checkText(text)}
                    onFocus= { (event) => { handleFocus(event) } }
                />

                {/* Button Plus */}
                <TouchableOpacity 
                    style= { Styles.button } 
                    onPress= { () => {
                        if (props.value < MAX) { 
                            props.onChange(props.value + STEP) 
                            setErrorVisible(false);
                            setOldText(props.value + STEP) 
                            console.log(oldText)
                        } else if (props.value >= MAX) {
                            props.onChange(MIN) 
                            setErrorVisible(false);
                            setOldText(MIN) 
                            console.log(oldText)
                } } }
                >
                    <Image
                        style= { Styles.icon }
                        source= { icons.plus }
                        resizeMode= { "contain" }
                    />
                </TouchableOpacity>
                
            </View>
            { errorVisible &&
                <Text style={[boxes.unPaddedRow, texts.errorLine]}>
                    Gib eine Zahl zwischen {MIN} und {MAX} ein.
                </Text>
            }
        </View>
    );
};

const Styles = StyleSheet.create({
    
    button: {
      height: 45,
      width: 45,
      paddingHorizontal: 15,
      marginVertical: 5,
      marginHorizontal: 0,
      borderRadius: 7,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor:  colors.darkBlue
    },
    icon: {
        width: 35,
        height: 35,
        tintColor:  colors.white
    },
    inputField: {
        height: 45,
        width: 45,
        marginVertical: 5,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderColor: colors.lightBlue,
        borderRadius: 7,
    },
    inputText: {
        fontFamily: 'Inter',
        fontWeight: 400,
        fontSize: 16,
        color: 'black',
        textAlign: 'center'
    }
});