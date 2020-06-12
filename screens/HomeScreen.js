import React, {useState, useLayoutEffect, useEffect}from "react";
import {FlatList } from "react-native";
import CoursesTile from "../components/CoursesTile";
import {Button} from 'react-native-elements';
import {Ionicons} from '@expo/vector-icons';
import DB from '../api/DB_API';

export default HomeScreen = ({navigation}) => {

    const [currentCourses, setCurrentCourses] = useState([]);

    // Wird nur beim Laden der Seite einmalig ausgeführt
    useEffect(() => {
        DB.getCourseList((courseList) => {
            console.log(courseList);
            setCurrentCourses(courseList);
        });
    }, []);
    

    //Button fürs Hinzufügen der Fähigkeiten
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight : () => (
                <Button 
                    type ='clear'
                    icon={<Ionicons name='ios-add' size={32} color="rgb(0,122,255)"/>}
                    onPress={() => navigation.navigate("AddCourse", {title: "Course", category:''})}
                />)
        });
    }, [navigation]);


    const clickHandler = (id, title, date, members, minMembers, maxMembers) => {
        // DB.signOut(() => {console.log("SIGNED OUT");});
        navigation.navigate("Course", {itemId: id, itemTitle: title, itemDate: date, members: members, minMembers: minMembers, maxMembers: maxMembers});
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
                    title={itemData.item.title}
                    date={itemData.item.date}
                    minMembers={itemData.item.minMembers}
                    maxMembers={itemData.item.maxMembers}
                    members={itemData.item.members}
                />
            )
        }}
      />
  );
};


