import React, {useState, useEffect, useLayoutEffect, useContext} from 'react';
import {View} from 'react-native';

import { icons, colors, boxes, texts } from '../Styles';
import AttributeList from '../components/AttributeList';
import DB from '../api/DB_API';
import FlexRow from '../components/FlexRow';
import { ThemeContext } from '../components/ThemeManager';

export default AttributeListScreen = ({route, navigation}) => {

    const {themeColors} = useContext(ThemeContext);

    const {filterList} = route.params;
    const {secondaryFilterList} = route.params;
    const {courseType} = route.params;
    const {courseId} = route.params;
    const {ideaId} = route.params;
    const {title} = route.params;
    const [skillsList, setSkillsList] = useState([]);
    const [interestsList, setInterestsList] = useState([]);
    const [viewedList, setViewedList] = useState([]);
    const [listLoading, setListLoading] = useState(true);

    useEffect(() => {
        DB.getAllAttributes("skills", filterList, courseType, courseId, ideaId, (attributesList) => {
            setSkillsList(attributesList);
            setViewedList(attributesList);
            setListLoading(false);
        });
        if (secondaryFilterList) {
            DB.getAllAttributes("interests", secondaryFilterList, courseType, courseId, ideaId, (attributesList) => {
                setInterestsList(attributesList);
            });
        }
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: title,
        });
    }, [navigation]);

    return(
        <View style={{flex: 1, backgroundColor: themeColors.base}}>
            { interestsList.length > 0 &&
                <FlexRow padding>
                    <Button
                        inactive={viewedList == interestsList}
                        title="Fähigkeiten"
                        icon={icons.info}
                        onPress={() => setViewedList(skillsList)}
                    />
                    <Padding width={10}/>
                    <Button
                        inactive={viewedList != interestsList}
                        title="Interessen"
                        icon={icons.info}
                        onPress={() => setViewedList(interestsList)}
                    />
                </FlexRow>
            }
            <AttributeList
                // attributeType = {attributeType}
                attList = {viewedList}
                loading={listLoading}
            />
        </View>
    )
  
}
