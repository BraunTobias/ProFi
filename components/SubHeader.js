import React, {useContext} from "react";
import { View, StyleSheet } from "react-native";
import { ThemeContext } from '../components/ThemeManager';

export default SubHeader = (props) => {

    const {themeColors} = useContext(ThemeContext);

    return(
        <View style= {{ backgroundColor: themeColors.subheader, paddingVertical: 7 }}>
            {props.children}
        </View>
    );
};