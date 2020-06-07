import React, {useLayoutEffect}from "react";
import {FlatList } from "react-native";
import CoursesTile from "../components/CoursesTile";
import { COURSES } from '../data/dummy-data';
import {Button} from 'react-native-elements';
import {Ionicons} from '@expo/vector-icons';

export default HomeScreen = ({navigation}) => {

    //Button fürs Hinzufügen der Fähigkeiten
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight : () => (
                <Button 
                    type ='clear'
                    icon={<Ionicons name='ios-add' size={32} color="rgb(0,122,255)"/>}
                    onPress={() =>navigation.navigate("AddCourse", {title: "Course", category:''})}
                />)
        });
    }, [navigation]);
    const courses = COURSES;

    const clickHandler = id => {
        navigation.navigate("Course", {itemId: id});
    };

  return (
      <FlatList
        data={courses}
        renderItem={(itemData) => { 
            return (
                //CourseTile = Style
                <CoursesTile
                    text={itemData.item.title + "\n "+ itemData.item.member + "\n "+ itemData.item.date}
                    onClick={clickHandler} 
                    id={itemData.item.id}
                />
            );
        }}
      />
  );
};


