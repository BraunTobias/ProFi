import React, { useState } from 'react';
import { View,  Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { icons, boxes, texts, colors } from '../Styles';

// Komponent für Zahlen-Eingaben beim Festlegen der Teamgröße beim Erstellen eines neuen Kurses
export default function NumberInput (props) {

    const MIN = 2;
    const MAX = 20;

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

        if (!error && parseInt(text) < 21) {
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
                    style= { [Styles.button, props.value <= 2 ? Styles.buttonInactive : Styles.buttonActive] } 
                    onPress= { () => { if (props.value > 2) { 
                        props.onChange(props.value - 1) 
                        setErrorVisible(false);
                        setOldText(props.value - 1) 
                    } } }
                >
                    <Image
                        style= { [Styles.icon, Styles.iconColor] }
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
                    style= { [Styles.button, props.value >= 20 ? Styles.buttonInactive : Styles.buttonActive] } 
                    onPress= { () => { if (props.value < 20) { 
                        props.onChange(props.value + 1) 
                        setErrorVisible(false);
                        setOldText(props.value + 1) 
                    } } }
                >
                    <Image
                        style= { [Styles.icon, Styles.iconColor] }
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
      alignItems: "center"
    },
    buttonActive: {
      backgroundColor:  colors.darkBlue
    },
    buttonInactive: {
        backgroundColor:  colors.lightBlue
    },
    icon: {
        width: 35,
        height: 35,
    },
    iconColor: {
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