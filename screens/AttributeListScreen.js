import React, {useState, useEffect, useLayoutEffect} from 'react';

import AttributeList from '../components/AttributeList';
import DB from '../api/DB_API';

export default AttributeListScreen = ({route, navigation}) => {
    const {attributeType} = route.params;
    const {filterList} = route.params;
    const {filterOpenCourse} = route.params;
    const {filterOpenIdea} = route.params;
    const {title} = route.params;

    const [attributesList, setAttributesList] = useState([]);

    useEffect(() => {
        DB.getAllAttributes(attributeType, filterList, filterOpenCourse, filterOpenIdea, (attributesList) => {
            setAttributesList(attributesList);
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
            attList = {attributesList}
        />
    );
  
}