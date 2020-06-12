import React, {useState, useLayoutEffect} from 'react';
import {FlatList , View, Text} from 'react-native';
import CoursesTile from '../components/CoursesTile';
import IdeasTile from '../components/IdeasTile';

export default ProjectScreen = ({route, navigation}) => {
    const {itemId} = route.params;
    const {itemTitle} = route.params;

    const [currentComments, setCurrentComments] = useState([]);

    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: itemTitle
        });
    }, [navigation]);


    return(
        <FlatList
        data={currentComments}
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