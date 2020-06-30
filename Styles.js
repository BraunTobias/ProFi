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

const iconsize = 35;
const iconsizeAdd = 60;

const headerHeight = 100;
const padding = 25;

const styles = StyleSheet.create({
    
    flex: {
        flex: 1,
    },

    row: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    paddedRow: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
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
        // paddingHorizontal: padding,
        // paddingVertical: padding/4,
        // height: 220,
        // width: width,
        backgroundColor: darkGrey,
        paddingVertical: 15
    },

    subHeaderIdea: {
        paddingHorizontal: padding,
        paddingVertical: padding/2,
        width: width,
        backgroundColor: darkGrey,
        marginBottom: padding/2,
    },

    subHeaderProfile: {
        padding: 20, 
        flexDirection: "row", 
        justifyContent: 'flex-start', 
        alignItems: 'center', 
        backgroundColor: "#aeb8c3"
    },

    contentProfile: {
        flex: 1, 
        flexDirection: "column", 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    rightContentProfile: {
        flex: 2, 
        flexDirection: "column", 
        justifyContent: 'flex-end', 
        alignItems: 'flex-end',

    },

    contentButton: {
        flex: 1, 
        flexDirection: "row", 
        justifyContent: 'center', 
        alignItems: 'center',
        
    },

    courseHeaderRow: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'stretch',
        paddingHorizontal: 15
    },

    membersRow: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'stretch',
        // height: 100,
        paddingVertical: 15,
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
    },

    datepicker: {
        backgroundColor: white,
        borderBottomColor: grey,
        borderBottomWidth: 1,
        marginVertical: 1,
        marginHorizontal: 0,
        justifyContent: 'center',
        borderRadius: 2,
        height: 50
    }
})

const buttons = StyleSheet.create({
    
    button1: {
        height: 50,
        width: 150,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: darkBlue,
        borderRadius:10,
    },
    
    buttonRow: {
        width: width/7*3,
        height: 50,
        paddingHorizontal: 10,
        backgroundColor: darkBlue,
        borderRadius:10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    buttonColumn: {
        width: "50%",
        height: 50,
        marginVertical: 5,
        backgroundColor: darkBlue,
        borderRadius:10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    buttonRowGrey: {
        width: width/7*3,
        height: 50,
        paddingHorizontal: 10,
        backgroundColor: lightGrey,
        borderRadius:10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
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
        fontSize: 22,
        fontWeight: 'bold',
        color: darkBlue
    },

    text: {
        fontSize: 18,
        color: black
    },

    textProfile: {
        fontSize: 18,
        color: black,
        marginTop: 15
    },
    
    textBold: {
        fontSize: 18,
        color: black,
        fontWeight: "bold"
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

    inputTextProfile: {
        fontSize: 30,
        color: black,
        fontWeight: "bold"
    },
    
    buttonBlue: {
        fontSize: 18, 
        fontWeight: 'bold',
        color: white,
    },
    
    buttonBlueCenter: {
        fontSize: 18, 
        fontWeight: 'bold',
        color: white,
        textAlign: "center",
        width: "100%"
    },

    buttonGrey: {
        fontSize: 18, 
        fontWeight: 'bold',
        color: black,
    },
})

const profileImage = {
    view: {
        position: 'absolute',
        backgroundColor: 'transparent'
      },
      touchable: {
          alignItems: 'center',
          justifyContent: 'center'
      },
      imageContainer: {
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-evenly",
        },
      verticalContainer: {
          alignItems: "center",
      },
      cameraPreview: {
          width: 100,
          height: 100,
          borderRadius: 100,
      },
      imageTile: {
          shadowColor: "black",
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 10,
          borderRadius: 10,
          padding: 15,
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 30,
        }
}

const icons = {
    checkTrue: require("./assets/check-true.png"),
    checkFalse: require("./assets/check-false.png"),
    plus: require("./assets/icons/plus.png"),
    find: require("./assets/icons/find.png"),
}

export { styles, buttons, texts, darkBlue, lightBlue, darkGrey, grey, lightGrey, white, black, iconsize, iconsizeAdd, icons, profileImage }