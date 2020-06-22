import React, {useLayoutEffect, useState} from 'react';
import {FlatList, View} from "react-native";
import {PREFERENCES} from'../data/dummy-data';
import PreferencesTile from '../components/PreferencesTile';
import {Button} from 'react-native-elements';
import {Ionicons} from '@expo/vector-icons';
import { Icon } from 'react-native-elements';
import { TouchableHighlight } from 'react-native-gesture-handler';

export default PreferenceScreen = ({navigation}) => {
    const [currentCategory, setCurrentCategory] = useState('Zeitaufwand');
    const displayedPreference = PREFERENCES.filter(item => item.category === currentCategory);
    
    //Header
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Präferenzen",
            headerRight : () => (
                <Button 
                    type ='clear' 
                    icon={<Ionicons name='ios-checkmark'size={32} color="white"/>}
                    onPress={() =>navigation.navigate('Profil')}
                />)
                
        });
    }, [navigation]);
    
    return(
        <View>
            {/* Präferenzen-Header */}
            <View style={{justifyContent: 'center', flexDirection: 'row', backgroundColor: 'tomato'}}>
                {/*Zeitaufwand */}
                <TouchableHighlight 
                    onPress={()=>{setCurrentCategory('Zeitaufwand')}}
                    underlayColor="tomato"
                    >
                    <Icon 
                        class="toggle"
                        raised
                        name={"ios-alarm"} 
                        size={35} 
                        type="ionicon"
                        color={"tomato"} 
                    />
                </TouchableHighlight>

                {/* Kategorie */}
                <TouchableHighlight 
                    onPress={()=>{setCurrentCategory('Kategorie')}}
                    underlayColor="tomato"
                >
                <Icon 
                    raised 
                    name={"ios-list"} 
                    size={35} 
                    type="ionicon"
                    color={"tomato"} 
                />
                </TouchableHighlight>

                {/* Genre */}
                <TouchableHighlight 
                    onPress={()=>{setCurrentCategory('Genre')}}
                    underlayColor="tomato"
                >
                <Icon 
                    raised 
                    name={"ios-image"} 
                    size={35} 
                    type="ionicon"
                    color={"tomato"} 
                />
                </TouchableHighlight>
                
                {/* Gruppengröße */}
                <TouchableHighlight 
                    onPress={()=>{setCurrentCategory('Gruppengröße')}}
                    underlayColor="tomato"
                >
                <Icon 
                    raised 
                    name={"ios-people"} 
                    size={35} 
                    type="ionicon"
                    color={"tomato"} 
                />
                </TouchableHighlight>
            </View>
            <View>   
            <FlatList
                data={displayedPreference}
                renderItem={(itemData) => { 
                    return (
                        // FlatList
                        <PreferencesTile
                            text={itemData.item.name}  
                            id={itemData.item.id}
                        />
                    );
                }}
            />
            </View>
        </View>
  );
}