import React, {useLayoutEffect} from 'react';
import {FlatList , View, Text} from 'react-native';
import {COURSES , PROJECTIDEAS} from'../data/dummy-data';
import CoursesTile from '../components/CoursesTile';
import IdeasTile from '../components/IdeasTile';


export default ProjectScreen = ({route, navigation}) => {
    const {itemId} = route.params;
    const displayedProjects = PROJECTIDEAS.filter(item => item.id === itemId);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: displayedProjects.title
        });
    }, [navigation]);


    return(
        <FlatList
        data={displayedProjects}
        renderItem={(itemData) => { 
            return (
                <IdeasTile
                    text= {itemData.item.searched + "\n " + itemData.item.describtion} 
                />
            );
        }}
      />
  );

}