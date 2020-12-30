import React, { useState  } from 'react';
import { View,  Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { icons, boxes, texts } from '../Styles';

export default function NumberInput (props) {

    const min = 2;
    const max = 20;

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
                    style= { props.value <= 2 ? boxes.buttonIconInactive : boxes.buttonIconActive } 
                    onPress= { () => { if (props.value > 2) { 
                        props.onChange(props.value - 1) 
                        setErrorVisible(false);
                        setOldText(props.value - 1) 
                        console.log(oldText)
                    } } }
                >
                    <Image
                        style= { boxes.buttonIcon }
                        source= { icons.minus }
                        resizeMode= { "contain" }
                    />
                </TouchableOpacity>
                
                {/* Textfeld */}
                <TextInput
                    style= { [ boxes.inputField, { height: 45, maxWidth: 45, marginHorizontal: 5, textAlign: "center" } ] }
                    maxLength={ 2 }
                    value= { props.value }
                    onChangeText= { text => checkText(text)}
                    onFocus= { (event) => { handleFocus(event) } }
                />

                {/* Button Plus */}
                <TouchableOpacity 
                    style= { props.value >= 20 ? boxes.buttonIconInactive : boxes.buttonIconActive } 
                    onPress= { () => { if (props.value < 20) { 
                        props.onChange(props.value + 1) 
                        setErrorVisible(false);
                        setOldText(props.value + 1) 
                        console.log(oldText)
                    } } }
                >
                    <Image
                        style= { boxes.buttonIcon }
                        source= { icons.plus }
                        resizeMode= { "contain" }
                    />
                </TouchableOpacity>
                
            </View>
            { errorVisible &&
                <Text style={[boxes.unPaddedRow, texts.errorLine]}>
                    Gib eine Zahl zwischen {min} und {max} ein.
                </Text>
            }
        </View>
    );
};