import React, { useState, useEffect } from 'react';
import { View, Text, Modal, FlatList } from 'react-native';
import { TouchableHighlight, TouchableOpacity, Touchable } from 'react-native-web'
import { compareAsc, format } from 'date-fns';

import ButtonSmall from '../components/ButtonSmall';
import ButtonIcon from '../components/ButtonIcon';
import { icons, colors, boxes, texts } from '../Styles';





export default function DateModal ( props ) {

    const TODAY = new Date();
    const [currentDate, setCurrentDate] = useState(new Date());
    
    const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
    const days = {
        '2020': [
            [30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,1,2,3,4,5,6,7,8,9],
            [27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8],
            [27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8],
            [27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8],
            [27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8],
            [27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8],
            [27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8],
            [27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8],
            [27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8],
            [27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8],
            [27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8],
            [27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8],
        ],
        '2021': [
            [30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,1,2,3,4,5,6,7,8,9],
            [27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8],
            [27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8],
            [27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8],
            [27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8],
            [27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8],
            [27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8],
            [27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8],
            [27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8],
            [27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8],
            [27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8],
            [27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8],
        ]
    }
    
    const [day, setDay] = useState(TODAY.getDate());
    const [month, setMonth] = useState(TODAY.getMonth());
    const [year, setYear] = useState(TODAY.getFullYear());

    const daysV2 = [
        31,
        year % 4 === 0 ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
    ]
    
    const [firstDayOfTheWeek, setFirstDayOfTheWeek] = useState(new Date(year, month, 0).getDay());
    console.log('firstDayOfTheWeek: ' + firstDayOfTheWeek)
    const [lastDayOfTheWeek, setLastDayOfTheWeek] = useState(firstDayOfTheWeek + daysV2[month] % 6);
    console.log('lastDayOfTheWeek: ' + lastDayOfTheWeek)

    console.log('date: ' + format(currentDate, "dd.MM.yyyy"))
    console.log('day: ' + day + ', month: ' + month + ', year: ' + year)
    
    const DAY = (props) => {      
        if (props.dayNr < 7 && days[year][month][props.dayNr] > 21 || props.dayNr > 28  && days[year][month][props.dayNr] < 20) {
            return (
                // Inactive Tile
                <View
                    style= { { 
                        width: 40, 
                        height: 40, 
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: colors.whiteBlue
                    } }
                >
                    <Text style= { { color: colors.lightGrey } } >
                        { days[year][month][props.dayNr] }
                    </Text>
                </View>
            );
        } else if (days[year][month][props.dayNr] === day) {
            return (
                // Marked Tile
                <TouchableOpacity
                    style= { { 
                        width: 40, 
                        height: 40, 
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: colors.darkGrey,
                        borderRadius: 7,
                    } }
                    onPress= { () => { 
                        setDay(days[year][month][props.dayNr])
                    } }
                >
                    <Text style= { { color: colors.white } } >
                        { days[year][month][props.dayNr] }
                    </Text>
                </TouchableOpacity>
            );
        } else {
            return (
                // Active Tile
                <TouchableOpacity
                    style= { { 
                        width: 40, 
                        height: 40, 
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: colors.lightBlue
                    } }
                    onPress= { () => { 
                        setDay(days[year][month][props.dayNr])
                    } }
                >
                    <Text style= { { color: 'black' } } >
                        { days[year][month][props.dayNr] }
                    </Text>
                </TouchableOpacity>
            );
        }
    }

    const WEEK = (props) => {
        return (
            <View style= { boxes.unPaddedRow } >
                <DAY dayNr = { props.start } />
                <DAY dayNr = { props.start+1 } />
                <DAY dayNr = { props.start+2 } />
                <DAY dayNr = { props.start+3 } />
                <DAY dayNr = { props.start+4 } />
                <DAY dayNr = { props.start+5 } />
                <DAY dayNr = { props.start+6 } />
            </View>
        )
    }
    
    return (
        <View style= {{width: 400, height: 400, backgroundColor: colors.lightBlue}}>
            <View style= { [boxes.unPaddedRow, { alignItems: "center", } ] } >
                <ButtonIcon status= { 'active' } icon= { 'minus' } onPress= { () => { 
                    const newMonth = (month - 1 + 12 ) % 12
                    if (newMonth === 11) setYear(year - 1);
                    // console.log('newMonth: ' + newMonth);
                    setMonth(newMonth);
                } } />
                
                <Text style= { texts.subHeader } > { months[month] } { year } </Text>
                
                <ButtonIcon status= { 'active' } icon= { 'plus' } onPress= { () => { 
                    const newMonth = (month + 1) % 12
                    if (newMonth === 0) setYear(year + 1)
                    // console.log('newMonth: ' + newMonth);
                    setMonth(newMonth);
                } } />
            </View>

            {/* Daynames */}
            <View style= { boxes.unPaddedRow } >
                <View style={{width:40,height:40}}><Text>Mo</Text></View>
                <View style={{width:40,height:40}}><Text>Di</Text></View>
                <View style={{width:40,height:40}}><Text>Mi</Text></View>
                <View style={{width:40,height:40}}><Text>Do</Text></View>
                <View style={{width:40,height:40}}><Text>Fr</Text></View>
                <View style={{width:40,height:40}}><Text>Sa</Text></View>
                <View style={{width:40,height:40}}><Text>So</Text></View>
            </View>
            
            {/* Calendar */}
            < WEEK start= { 0 } />
            < WEEK start= { 7 } />
            < WEEK start= { 14 } />
            < WEEK start= { 21 } />
            < WEEK start= { 28 } />
            < WEEK start= { 35 } />
            
            <ButtonSmall
                title= { "OK" }
                icon= { "checkTrue" }
                onPress= { () => { props.onPress(false) } }
                // onPress={ () => { changeNewCourseDateHandler() }}
            />
        </View>
    )
}