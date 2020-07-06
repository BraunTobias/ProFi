import React from 'react';
import AttributeList from '../components/AttributeList';

export default AttributeListScreen = ({route, navigation}) => {
    const {filter} = route.params;
    
    return(
        <AttributeList
            filterList = {filter}
        />
    );
  
}