import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-web'

import ButtonIcon from '../components/ButtonIcon';
import { colors, boxes, texts } from '../Styles';

// Komponent zur Datumsauswahl
export default function DateModal ( values ) {

    const TODAY = new Date();
    const [currentDate, setCurrentDate] = useState( new Date( new Date().getTime() + 24 * 60 *60 *1000 ) );

    const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    const [day, setDay] = useState(values.currentDate? values.currentDate.getDate() : TODAY.getDate() +1);
    const [month, setMonth] = useState(values.currentDate? values.currentDate.getMonth() : TODAY.getMonth());
    const [year, setYear] = useState(values.currentDate? values.currentDate.getFullYear() : TODAY.getFullYear());
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
   
    // Element für das Feld der Tage
    var shownDay = 1;
    const DAY = (props) => {      
        
        var active = false;
        var shownWeekday;

        // Tage des letzten Monats
        if ( (daysV2[(month - 1 + 11) % 11] - props.day + 1) <= daysV2[(month - 1 + 11) % 11] && props.week === 0){
            shownWeekday = (daysV2[(month - 1 + 11) % 11] - props.day + 1)
            active = false;
        }
        // vergangene Tage des Monats
        else if (shownDay <= TODAY.getDate() && TODAY.getMonth() >= month && TODAY.getFullYear() >= year) {
            shownWeekday = shownDay;
            active = false;
            if ( shownDay <= daysV2[month]) shownDay += 1;

        }
        // auswählbare Tage
        else if (shownDay <= daysV2[month]){
            shownWeekday = shownDay;
            active = true;
            if ( shownDay <= daysV2[month]) shownDay += 1;
        }
        // Tage des nächsten Monats
        else { 
            shownDay += 1;
            shownWeekday = shownDay % daysV2[month] - 1;
            active = false;
        }
        
        if (!active) {
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
                        { shownWeekday }
                    </Text>
                </View>
            );
        } else if (shownWeekday === day) {
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
                >
                    <Text style= { { color: colors.white } } >
                        { shownWeekday }
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
                        setDay(shownWeekday);
                        setCurrentDate(new Date(year, month, shownWeekday));
                        values.onPress(new Date(year, month, shownWeekday));
                    } }
                >
                    <Text style= { { color: 'black' } } >
                        { shownWeekday }
                    </Text>
                </TouchableOpacity>
            );
        }
    }

    // Element für die Reihe von Tagen einer Woche
    const WEEK = (props) => {
        return (
            <View style= { boxes.unPaddedRow } >
                <DAY day= { firstDayOfTheWeek } week= { props.week } />
                <DAY day= { firstDayOfTheWeek - 1 } week= { props.week } />
                <DAY day= { firstDayOfTheWeek - 2 } week= { props.week } />
                <DAY day= { firstDayOfTheWeek - 3 } week= { props.week } />
                <DAY day= { firstDayOfTheWeek - 4 } week= { props.week } />
                <DAY day= { firstDayOfTheWeek - 5 } week= { props.week } />
                <DAY day= { firstDayOfTheWeek - 6 } week= { props.week } />
            </View>
        );
    }

    // Button zum Navigieren zum vorherigen Monat, wenn der vorherige Monat nicht ein vergangener ist
    const BACKBUTTON = (props)  => {
        if (month === TODAY.getMonth() && year === TODAY.getFullYear()) {
            return (
                <ButtonIcon status= { 'inactive' } icon= { 'minus' } onPress= { () => {} } />
            );
        }
        else {
            return (
                <ButtonIcon status= { 'active' } icon= { 'minus' } onPress= { () => props.onPress() } />
                
            );
        };
    }
    
    return (
        <View style= { {
            paddingTop: 5
        } } >
            <View
                transparent= {true}
                style= {{
                    width: 400, 
                    height: 360,
                    paddingHorizontal: 15,
                    paddingTop: 10,
                    borderRadius: 8,
                    backgroundColor: colors.lightBlue, 
            }}>
                <View style= { [boxes.unPaddedRow, { alignItems: "center", } ] } >
                    
                    {/* Button zum vorherigen Monat */}
                    <BACKBUTTON onPress= { () => { 
                        var newMonth = month - 1
                        var newYear = year;
                        if (newMonth === -1) {
                            newMonth = 11;
                            newYear --;
                            setFirstDayOfTheWeek(new Date(newYear, newMonth, 0).getDay());
                            setYear(newYear);
                            values.onPress( currentDate );
                        }
                        else setFirstDayOfTheWeek(new Date(year, newMonth, 0).getDay());
                        setMonth(newMonth);
                    } }/>

                    {/* Titel aus Monatsname und Jahr */}
                    <Text style= { texts.subHeader } > { months[month] } { year } </Text>
                    
                    {/* Button zum folgenden Monat */}
                    <ButtonIcon status= { 'active' } icon= { 'plus' } onPress= { () => { 
                        const newMonth = (month + 1 ) % 12
                        var newYear = year;
                        if (newMonth === 0) {
                            newYear ++;
                            setYear(newYear);
                            setFirstDayOfTheWeek(new Date(newYear, 0, 0).getDay());
                            values.onPress( currentDate );
                        }
                        else setFirstDayOfTheWeek(new Date(year, newMonth, 0).getDay());
                        setMonth(newMonth);
                    } } />
                </View>

                {/* Namen der Wochentage */}
                <View style= { boxes.unPaddedRow } >
                    <View style= { styles.naming } ><Text>Mo</Text></View>
                    <View style= { styles.naming } ><Text>Di</Text></View>
                    <View style= { styles.naming } ><Text>Mi</Text></View>
                    <View style= { styles.naming } ><Text>Do</Text></View>
                    <View style= { styles.naming } ><Text>Fr</Text></View>
                    <View style= { styles.naming } ><Text>Sa</Text></View>
                    <View style= { styles.naming } ><Text>So</Text></View>
                </View>
                
                {/* Kalender */}
                <WEEK weekStart= { firstDayOfTheWeek } week= { 0 } />
                <WEEK weekStart= { firstDayOfTheWeek } week= { 7 } />
                <WEEK weekStart= { firstDayOfTheWeek } week= { 14 } />
                <WEEK weekStart= { firstDayOfTheWeek } week= { 21 } />
                <WEEK weekStart= { firstDayOfTheWeek } week= { 28 } />
                <WEEK weekStart= { firstDayOfTheWeek } week= { 35 } />
                
                {/* Space between */}
                <View style={{height:10}}/>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    naming: {
        width:40,
        height:40,
        alignItems: "center",
        justifyContent: "center",
    }
})