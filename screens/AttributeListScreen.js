import React, {useLayoutEffect} from 'react';

import AttributeList from '../components/AttributeList';

export default AttributeListScreen = ({route, navigation}) => {
    const {attributeType} = route.params;
    const {filter} = route.params;
    const {title} = route.params;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: title,
        });
    }, [navigation]);

    return(
        <AttributeList
            filterList = {filter}
            attributeType = {attributeType}
        />
    );
  
}