import React, { useState, useContext } from 'react';
import { 
    View, 
    TouchableOpacity, 
    TouchableWithoutFeedback, 
    Text, 
    TextInput, 
    Keyboard, 
    Alert, 
    StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { LogInContext } from '../data/LogInContext';
//import FUNCTIONS from '../data/dummy-data';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

//Styles für das TextField mit Tags
const useStyles = makeStyles((theme) => ({
    root: {
      width: 500,
      '& > * + *': {
        marginTop: theme.spacing(3),
      },
    },
}));


export default FunctionsScreen = (props)  => {
    const [authentication, setAuthentication, user, setUser] = useContext(LogInContext);
    //const functions = FUNCTIONS;
    const userProp = props.user;

    //Tags
    const classes = useStyles();

    return (
        <View>
            {/* Fähigkeiten-Header */}
            <View style={{ backgroundColor: 'tomato' }}>
                <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white' }}>Fähigkeiten</Text>
            </View>
            {/* Fähigkeiten-Body */}
            {/* Tags */}
            <View className={classes.root}>
                <Text>               
                    <Autocomplete
                        multiple
                        id="tags-standard"
                        options={skills}
                        getOptionLabel={(option) => option.title}
                        defaultValue={[skills[1]]}
                        renderInput={(params) => (
                            <TextField
                                    {...params}
                                    variant="standard"
                                    label="Fähigkeiten"
                                    placeholder="füge deine Fähigkeiten hinzu"
                            /> 
                        )}
                    />
                </Text>
                {/* TextField mit Text zu umranden bringt auch nichts beim Fehler */}
            </View>
 
            {/* <View>
                {/* <FlatList
                    data={userProp.functions.design}
                    renderItem={(itemData) => { 
                        return (
                            <TouchableOpacity>
                                <Text> {itemData.item} </Text>
                            </TouchableOpacity>
                        );
                    }}
                /> */}
        </View>
    )
}

const skills = [
    { name: 'Java'},
    { name: 'blender'},
    { name: 'C#'}
];