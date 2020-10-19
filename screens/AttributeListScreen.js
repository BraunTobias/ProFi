import React, {useState, useEffect, useLayoutEffect} from 'react';

import AttributeList from '../components/AttributeList';
import DB from '../api/DB_API';

export default AttributeListScreen = ({route, navigation}) => {
    const {attributeType} = route.params;
    const {filter} = route.params;
    const {title} = route.params;

    const [skillsList, setSkillsList] = useState([]);

    useEffect(() => {
        DB.getAllAttributes("skills", filter, (attributesList) => {
            setSkillsList(attributesList);
        }, () => {});
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: title,
        });
    }, [navigation]);

    return(
        <AttributeList
            attributeType = {attributeType}
            attList={skillsList}
        />
    );
  
}