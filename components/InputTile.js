import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import { styles, texts } from '../Styles';

export default InputTile = props => {
 return (
    <View style= { styles.loginInput } >
      <Text style= { texts.headline } >{ props.title }</Text>
      <TextInput
          style= { texts.inputText }
          textAlign= 'left'
          placeholder= { props.placeholderText }
          value= { props.value }
          onChangeText= { (text) => props.onChangeText(text)}
      />
    </View>
  );
};