import React, {useEffect} from 'react';
import { Appearance, AppearanceProvider, useColorScheme } from 'react-native-appearance';

export const ThemeContext = React.createContext();

export const ThemeProvider = ({children}) => {

    // Das sind die vordefinierten Farbwerte
    const lightColors = {
        mode: "light",
        // Kacheln
        tile1: 'white', 
        tile2: '#f2f3f4', 
        // Texte
        textHl: '#222f56',
        textCopy: '#333333',
        textHighlight: 'white',
        textInactive: '#808aa5',
        buttonInactive: '#f2f3f4',
        textInput: 'white',
        // Generelle Farben
        base: '#f2f3f4',
        separator: '#f2f3f4', 
        contrast: '#808aa5',
        primary: '#222f56',
        secondary: '#ced7e4',
        subheader: '#ced7e4',
        red: '#640023',
    }
    const darkColors = {
        mode: "dark",
        // Kacheln
        tile1: '#121212', 
        tile2: '#121212', 
        // Texte
        textHl: '#ededed',
        textCopy: '#ededed',
        textHighlight: '#ededed',
        textInactive: '#424549',
        buttonInactive: '#424549',
        textInput: '#212121',
        // Generelle Farben
        base: '#121212', 
        contrast: '#808aa5',
        separator: '#212121',
        primary: '#0f182d',
        secondary: '#212121',
        subheader: '#1c1c1c',
        red: '#910038',
    }

    // In diesem State werden die aktuellen Farbwerte gespeichert
    const [themeColors, setThemeColors] = React.useState(lightColors);

    // Beim Laden der App wird je nach Systemeinstellung des Handys das Farbschema festgelegt
    useEffect(() => {
        let colorScheme = Appearance.getColorScheme();
        if (colorScheme == "dark") {
            setThemeColors(darkColors);
        } else {
            setThemeColors(lightColors);
        }        
    }, []);

    // Bei Änderung des Farbschemas am Handy wird es entsprechend neu festgelegt
    Appearance.addChangeListener(({ colorScheme }) => {
        if (colorScheme == "dark") {
            console.log(colorScheme);
            setThemeColors(darkColors);
        } else {
            console.log(colorScheme);
            setThemeColors(lightColors);
        }
    });

    return(
        <ThemeContext.Provider value={{ themeColors }}>
            {children}
        </ThemeContext.Provider>
    )
}