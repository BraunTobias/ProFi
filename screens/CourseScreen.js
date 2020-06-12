import React, {useState, useEffect, useLayoutEffect} from 'react';
import {View, Text, FlatList } from "react-native";
import IdeasTile from '../components/CoursesTile';
import {Button} from 'react-native-elements';
import {Ionicons} from '@expo/vector-icons';
import DB from '../api/DB_API';

export default CourseScreen = ({route, navigation}) => {
    const {itemId} = route.params;
    const {itemTitle} = route.params;
    const {itemDate} = route.params;
    const {members} = route.params;
    const {minMembers} = route.params;
    const {maxMembers} = route.params;

    const [currentIdeas, setCurrentIdeas] = useState([]);


    // Wird nur beim Laden der Seite einmalig ausgeführt
    useEffect(() => {
        DB.getIdeasList(itemId, (ideasList) => {
            setCurrentIdeas(ideasList);
            console.log(ideasList);
        });
    }, []);


    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: itemTitle,
            headerRight : () => (
                <Button 
                    type ='clear' 
                    icon={<Ionicons name='ios-add'size={32} color="rgb(0,122,255)"/>}
                    onPress={() =>navigation.navigate("AddProject", {title: "Project", category: selectedCourse.title})}
                />)
        });
    }, [navigation]);


    const clickHandler = (id, title) => {
        navigation.navigate("Project", {itemId: id, itemTitle: title});
    };

    
    return(
        <View>
            <Text>Datum: {itemDate + "\n"}Mitglieder: {members + "\n"}Gruppengröße: {minMembers}–{maxMembers} Personen</Text>
            <FlatList
            data={currentIdeas}
            renderItem={(itemData) => { 
                return (
                    <IdeasTile
                        text={itemData.item.title} 
                        onClick={clickHandler} 
                        id={itemData.item.id}
                        title={itemData.item.title}
                    />
                );
            }}
            />
        </View>
  );

}