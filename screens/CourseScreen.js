import React, {useLayoutEffect} from 'react';
import {FlatList } from "react-native";
import {COURSES , PROJECTIDEAS} from'../data/dummy-data';
import CoursesTile from '../components/CoursesTile';
import {Button} from 'react-native-elements';
import {Ionicons} from '@expo/vector-icons';

export default CourseScreen = ({route, navigation}) => {
    const {itemId} = route.params;
    const selectedCourse = COURSES.find(course => course.id === itemId);
    const displayedProjects = PROJECTIDEAS.filter(item => item.categoryId === itemId);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: selectedCourse.title,
            headerRight : () => (
                <Button 
                    type ='clear' 
                    icon={<Ionicons name='ios-add'size={32} color="rgb(0,122,255)"/>}
                    onPress={() =>navigation.navigate("AddProject", {title: "Project", category: selectedCourse.title})}
                />)
        });
    }, [navigation]);

    const clickHandler = id => {
        navigation.navigate("Project", {itemId: id});
      };

    return(
        <FlatList
        data={displayedProjects}
        renderItem={(itemData) => { 
            return (
                <CoursesTile
                    text={itemData.item.title} 
                    onClick={clickHandler} 
                    id={itemData.item.id}
                />
            );
        }}
      />
  );

}