import { StyleSheet, Dimensions } from "react-native";

const width = Dimensions.get('window').width; //full width

const darkBlue = '#222f56';
const lightBlue = '#f5f7f7';
const lightGrey = '#f2f3f4';
const grey = '#bdc6cf';
const darkGrey = '#aeb8c3';
const red = '#640023';
const black = '#333333';
const white = 'white';

const iconsize = 45;
const iconsizeAdd = 60;

const headerHeight = 100;
const padding = 25;

const styles = StyleSheet.create({
    
    flex: {
        flex: 1,
    },

    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'stretch',
    },

    column: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start', 
        alignItems: 'flex-start',
    },

    header: {
        height: headerHeight,
        backgroundColor: darkBlue
    },

    headerFake: {
        justifyContent: 'center', 
        alignItems: 'flex-start', 
        padding: padding,
        height: headerHeight - 24,
        backgroundColor: darkBlue
    },

    subHeader: {
        paddingHorizontal: padding,
        paddingVertical: padding/2,
        height: 220,
        width: width,
        backgroundColor: darkGrey,
    },

    subHeaderIdea: {
        paddingHorizontal: padding,
        paddingVertical: padding/2,
        width: width,
        backgroundColor: darkGrey,
        marginBottom: padding/2,
    },

    courseHeaderRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'stretch',
    },

    membersRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'stretch',
        height: 100,
    },

    commentRow: {
        paddingHorizontal: padding,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 0,
        alignItems: 'flex-end',
    },

    content: {
        flex: 1, 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: lightBlue
    },

    contentFake: {
        width: width,
        flex: 1, 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'stretch',
        padding: padding,
        backgroundColor: lightBlue
    },

    commentField: {
        width: '100%', 
        backgroundColor: 'white', 
        padding: 10, 
        marginTop: 10
    },

    modal: {
        justifyContent: 'flex-start', 
        alignItems: 'flex-start',
    },

    loginInput: {
        justifyContent: 'flex-start', 
        alignItems: 'flex-start',
        marginBottom: 0,
        //width: 300,
    },

    error: {
        flex: 1, 
        margin: 50, 
        marginTop: 130, 
        padding: 10, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'white'
    }
})

const buttons = StyleSheet.create({
    
    button1: {
        height: 50,
        width: 200,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: darkBlue,
        borderRadius:10,
    },
    
    buttonRow: {
        width: width/7*3,
        height: 50,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: darkBlue,
        borderRadius:10,
    },

    buttonRowGrey: {
        width: width/7*3,
        height: 50,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: lightGrey,
        borderRadius:10,
    }
})

const texts = StyleSheet.create({
    
    headerText: {
        fontSize: 24,
        letterSpacing: 0.5,
        fontWeight: 'bold',
        color: white
    },

    headline: {
        fontSize: 18,
        fontWeight: 'bold',
        color: black
    },

    text: {
        fontSize: 18,
        color: black
    },

    headlineCenter: {
        fontSize: 18,
        fontWeight: 'bold',
        color: black,
        textAlign: 'center'
    },

    inputText: {
        fontSize: 18,
        color: black
    },
    
    buttonBlue: {
        fontSize: 18, 
        color: white
    },

    buttonGrey: {
        fontSize: 18, 
        color: black
    },
})

export { styles, buttons, texts, darkBlue, lightBlue, darkGrey, grey, lightGrey, white, black, iconsize, iconsizeAdd }