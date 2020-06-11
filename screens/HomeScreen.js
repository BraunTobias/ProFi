import React, {useState, useLayoutEffect}from "react";
import {FlatList } from "react-native";
import CoursesTile from "../components/CoursesTile";
import { COURSES } from '../data/dummy-data';
import {Button} from 'react-native-elements';
import {Ionicons} from '@expo/vector-icons';
import DB from '../api/DB_API';

export default HomeScreen = ({navigation}) => {

    const [currentCourses, setCurrentCourses] = useState([]);

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

    DB.getCourseList((courseList) => {
        // console.log(courseList);
        setCurrentCourses(courseList);
        // courses = courseList;
        // console.log(courses);
    });

    const clickHandler = (id, title) => {
        // DB.signOut(() => {console.log("SIGNED OUT");});
        navigation.navigate("Course", {itemId: id}, {itemTitle: title});
    };

  return (
      <FlatList
        data = {currentCourses}
        renderItem={(itemData) => { 
            return (
                //CourseTile = Style
                <CoursesTile
                    text={itemData.item.title + "\n "+ itemData.item.date}
                    onClick={clickHandler} 
                    id={itemData.item.id}
                />
            )
        }}
      />
  );
};


