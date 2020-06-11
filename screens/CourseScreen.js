import React, {useState, useLayoutEffect} from 'react';
import {FlatList } from "react-native";
import {COURSES , PROJECTIDEAS} from'../data/dummy-data';
import CoursesTile from '../components/CoursesTile';
import {Button} from 'react-native-elements';
import {Ionicons} from '@expo/vector-icons';
import DB from '../api/DB_API';

export default CourseScreen = ({route, navigation}) => {
    const {itemId} = route.params;
    // const selectedCourse = COURSES.find(course => course.id === itemId);
    // const displayedProjects = PROJECTIDEAS.filter(item => item.categoryId === itemId);
    state = {
        Title: ""
    };
 
    const [currentIdeas, setCurrentIdeas] = useState([]);
    const [currentTitle, setCurrentTitle] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: this.state.Title,
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

    // DB.getIdeasList({itemId}, (ideasList) => {
    //     setCurrentIdeas(ideasList);
    // });

    DB.getTitle((title) => {
        this.setState({ Title: title });
    });

    return(
        <FlatList
        data={currentIdeas}
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