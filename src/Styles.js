import { format } from "date-fns";
import { Platform, Dimensions } from "react-native";

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full width

const colors = {
    darkBlue: '#222f56',
    mediumBlue: '#808aa5',
    lightBlue: '#ced7e4',
    whiteBlue: '#e5eaf0',
    lightGrey: '#f2f2f2',
    mediumGrey: '#d2d3d4',
    darkGrey: '#333333',
    red: '#640023',
    lightRed: '#a46073',
    white: 'white'
}

const iconsize = 35;
const iconsizeAdd = 60;

const headerHeight = 100;
const padding = 15;

const boxes = {
    mainContainer: {
        height: "100%",
        width: "100%",
        paddingHorizontal: 20,
        backgroundColor: colors.lightGrey,
        alignItems: "center",
        paddingTop: 15,
        // justifyContent: "center",
    },
    // modal: {
    //     flex: 1, 
    //     justifyContent: 'flex-start',
    //     flexDirection: 'column',
    // },
    header: {
        height: 80,
        backgroundColor: colors.darkBlue,
        minHeight: 60,
    },
    headerFake: {
        paddingHorizontal: '12.5%',
        height: "100%",
        width: "100%",
        height: 80,
        backgroundColor: colors.darkBlue,
        minHeight: 60,
        alignItems: 'center',
        flexDirection: "row",
        justifyContent: "space-between",
    },
    subHeader: {
        paddingTop: 15,
        backgroundColor: colors.lightBlue,
    },
    width: {
        width: '75%',
        alignSelf: 'center',
    },
    paddedRow: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 15,
    },
    unPaddedRow: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    centeredRow: {
        width: "100%",
        alignItems: "center",
    },
    inputField: {
        minHeight: 45,
        paddingLeft: 15,
        // paddingHorizontal: 0,
        marginVertical: 5,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderColor: colors.lightBlue,
        borderRadius: 7,
        fontFamily: 'Inter',
        fontWeight: 400,
        fontSize: 16,
        color: 'black',
    },
    buttonIcon: {
        width: 35,
        height: 35,
        tintColor: "white"
    },
    buttonIconInactive:{
        height: 45,
        width: 45,
        marginVertical: 5,
        marginHorizontal: 0,
        backgroundColor: colors.lightBlue,
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonIconActive:{
        height: 45,
        width: 45,
        marginVertical: 5,
        marginHorizontal: 0,
        backgroundColor: colors.darkBlue,
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonIconNeg: {
        height: 45,
        width: 45,
        marginVertical: 5,
        marginHorizontal: 0,
        backgroundColor: colors.red,
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonIconNegActive: {
        height: 45,
        width: 45,
        marginVertical: 5,
        marginHorizontal: 0,
        backgroundColor: colors.lightRed,
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonClose:{
        height: 30,
        width: 30,
        tintColor: colors.mediumBlue,
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonLogo: {
        width: 45,
        height: 45,
    },
    buttonIconColor: {
        height: 45,
        width: 45,
        marginVertical: 5,
        marginHorizontal: 0,
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center",
        
    },
    buttonSmall: {
        height: 45,
        width: 150,//('100%' - 40) / 2,
        paddingLeft: 15,
        paddingRight: 5,
        marginVertical: 5,
        backgroundColor: colors.darkBlue,
        borderRadius: 7,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    buttonSmallInactive: {
        height: 45,
        width: 150,//('100%' - 40) / 2,
        paddingLeft: 15,
        paddingRight: 5,
        marginVertical: 5,
        backgroundColor: colors.lightBlue,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: colors.white,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    buttonLargeSolid: {
        height: 45,
        width: "50%",
        paddingHorizontal: 10,
        marginVertical: 5,
        backgroundColor: colors.darkBlue,
        borderRadius: 7,
        justifyContent: "center",
    },
    buttonLargeTransparent: {
        height: 40,
        width: "50%",
        paddingHorizontal: 10,
        marginVertical: 5,
        backgroundColor: "none",
        borderRadius: 0,
        justifyContent: "center",
    },
    listTile: {
        paddingLeft: 15,
        paddingRight: 35,
        height: 90,
        //width: "100%",
        alignItems: "left",
        justifyContent: "center",
    },
    listTileHeader: {
        flexDirection: "row",
        justifyContent: "left",
    },
    listTileArrow: {
        position: "absolute",
        right: 15,
        width: 15,
        tintColor: colors.lightBlue,
        zIndex: -1
    },
    listTileIcon: {
        width: 22, 
        height: 22, 
        tintColor: colors.darkBlue, 
        marginEnd: 5,  
        marginTop: 0.5  
    },

    profileImage: {
            width: 60,
            height: 60,
            borderRadius: 111,
            aspectRatio: 1,
            marginRight: 7,
            //tintColor: colors.white
        // height: "100%",
        // marginRight: 7,
        // aspectRatio: 1,
        // backgroundColor: colors.lightBlue,
        // borderRadius: 111
    },
    profileViewImage: {
        width: width,
        height: 75,
        alignItems: "center",
        // borderRadius: 111
    },
    attributeImage: {
        width: 60,
        height: 60,
        // height: "100%",
        aspectRatio: 1,
        marginRight: 7,
        flex: 1,
        backgroundColor: colors.mediumGrey,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    attributeIcon: {
        width: "75%",
        height: "75%",
        tintColor: colors.mediumBlue,
    },
    attributeTile: {
        paddingLeft: 15,
        paddingRight: 35,
        height: 45,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    attributeCheckmark: {
        height: 25,
        width: 25,
        marginRight: 10,
        tintColor: colors.darkBlue
    },
    commentTile: {
        paddingLeft: 15,
        paddingRight: 35,
        paddingVertical: 10,
        minHeight: 100,
        // width: width,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    commentReplyTile: {
        width: 20, 
        height: 60, 
        marginRight: 15, 
        marginLeft: '17.5%', 
        tintColor: colors.lightBlue,
    },
    commentTileImage: {
        height: 60,
        width: 60,
        alignItems: "flex-start",
        justifyContent: "flex-start"
    },
    commentTileHeader: {
        // width: "100%",
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "baseline",
        marginBottom: 2,
    },
    commentTileContent: {
        width: width/4*3 - 140,
    },
    commentReplyTileContent: {
        width: width/4*3 -190, 
    },
    likesRow: {
        width: "100%",
        marginTop: 5, 
        flexDirection: "row", 
        justifyContent: "center", 
        alignItems: "center"
    },
    likesImage: {
        height: 17,
        width: 17,
        resizeMode: "contain", 
        tintColor: colors.darkBlue, 
        marginRight: 5    
    },
    separator: {
        paddingLeft: 15,
        paddingVertical: 7,
        borderBottomWidth: 1,
        borderColor: colors.darkBlue,
        // backgroundColor: colors.white
    },
    
}

const buttons = {
    
    buttonRow: {
        width: width/7*3,
        height: 45,
        paddingLeft: 15,
        paddingRight: 10,
        backgroundColor: colors.darkBlue,
        borderRadius:10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    buttonRowGrey: {
        width: width/7*3,
        height: 45,
        paddingLeft: 15,
        paddingRight: 10,
        backgroundColor: colors.mediumGrey,
        borderRadius:10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    buttonColumn: {
        width: "50%",
        height: 45,
        marginVertical: 10,
        backgroundColor: colors.darkBlue,
        borderRadius:10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    buttonSimple: {
        width: "50%",
        height: 45,
        marginVertical: 10,
        backgroundColor: colors.darkBlue,
        borderRadius:10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    buttonEvaluate: {
        height: 45,
        marginTop: 10,
        marginHorizontal: 15,
        backgroundColor: colors.darkBlue,
        borderRadius:10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
}

const texts = {
    copy: {
        fontFamily: 'Inter',
        fontWeight: 400,
        fontSize: 16,
        lineHeight: 20,
        color: colors.darkGrey,
    },
    header: {
        marginHorizontal: 200,
        fontFamily: 'Inter',
        fontWeight: 600,
        fontSize: 20,
        color: colors.white,
        textAlign: "center"
    },
    titleCentered: {
        fontFamily: 'Inter',
        fontWeight: 400,
        textAlign: "center",
        fontSize: 20,
        paddingBottom: 20
    },
    subHeader: {
        fontFamily: 'Inter',
        fontWeight: 600,
        color: colors.darkGrey,
        fontSize: 16,
    },
    subHeaderLarge: {
        fontFamily: 'Inter',
        fontWeight: 600,
        color: colors.darkBlue,
        fontSize: 18,
        paddingBottom: 3 
    },
    buttonSmall: {
        fontFamily: 'Inter',
        fontWeight: 500,
        fontSize: 16,
        color: "white",
        textAlign: "left",
        paddingRight: 7,
    },
    buttonLargeSolid: {
        fontFamily: 'Inter',
        fontWeight: 500,
        fontSize: 16,
        color: "white",
        textAlign: "center"
    },
    buttonLargeTransparent: {
        fontFamily: 'Inter',
        fontWeight: 400,
        fontSize: 16,
        color: colors.darkBlue,
        textAlign: "center",
    },

    listTileHeader: {
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: 20,
        color: colors.darkBlue,
        marginBottom: 5,
    },
    commentTileHeader: {
        fontFamily: 'Inter',
        fontWeight: 600,
        fontSize: 18,
        color: colors.darkBlue,
        marginBottom: 5,
    },
    
    headerWithBackIcon: {
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: 24,
        letterSpacing: 0.5,
        color: colors.white,
        marginLeft: (Platform.OS === 'android') ? -15 : 0,
        alignSelf: (Platform.OS === 'android') ? 'flex-start' : 'center'
    },

    headline: {
        fontSize: 22,
        fontFamily: 'Inter',
        fontWeight: 700,
        color: colors.darkBlue,
    },

    text: {
        fontFamily: 'Inter',
        fontWeight: 400,
        fontSize: 16,
        color: colors.darkGrey
    },

    textProfile: {
        fontFamily: 'Inter',
        fontWeight: 400,
        fontSize: 18,
        color: colors.darkGrey,
        marginTop: 15
    },

    textBoldAttribute: {
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: 24,
        color: colors.darkBlue,    
        paddingVertical: 7,
        paddingHorizontal: "5%"
    },

    textAttribute: {
        fontFamily: 'Inter',
        fontWeight: 400,
        fontSize: 18,
        color: colors.darkGrey,
        lineHeight: 25,
        textAlign: "justify",
        paddingVertical: 7,
        paddingHorizontal: "5%"
    },
    
    textBold: {
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: 18,
        color: colors.darkGrey,
    },

    headlineCenter: {
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: 18,
        color: colors.darkGrey,
        textAlign: 'center'
    },

    inputText: {
        fontFamily: 'Inter',
        fontWeight: 400,
        fontSize: 18,
        color: colors.darkGrey,
        backgroundColor: colors.white,
        width: "100%",
        paddingVertical: 5,
        paddingLeft: 5,
        marginTop: 3,
        borderRadius: 3,
    },

    inputTextProfile: {
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: 24,
        color: colors.darkGrey,
    },
    
    inputField: {
        fontFamily: 'Inter',
        fontWeight: 400,
        fontSize: 16,
    },

    buttonBlue: {
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: 17, 
        color: colors.white,
        maxWidth: "85%"
    },
    
    buttonBlueCenter: {
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: 17, 
        color: colors.white,
        textAlign: "center",
        width: "100%"
    },

    buttonGrey: {
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: 17, 
        color: colors.darkGrey,
    },

    separatorText: {
        fontFamily: 'Inter',
        fontWeight: 600,
        fontSize: 18,
        color: colors.darkBlue,
    },
}

const profileImage = {
      
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
    profilePlaceholder: require("./assets/ui-icons/user.png"),
    checkTrue: require("./assets/icons/check-true.png"),
    checkFalse: require("./assets/icons/check-false.png"),
    home: require("./assets/ui-icons/home.png"),
    profile: require("./assets/ui-icons/profile.png"),
    plus: require("./assets/ui-icons/plus.png"),
    minus: require("./assets/ui-icons/minus.png"),
    find: require("./assets/ui-icons/find.png"),
    exit: require("./assets/ui-icons/exit.png"),
    fav: require("./assets/ui-icons/favourite.png"),
    nogo: require("./assets/ui-icons/nogo.png"),
    delete: require("./assets/ui-icons/delete.png"),
    like: require("./assets/ui-icons/like.png"),
    reply: require("./assets/ui-icons/reply.png"),
    edit: require("./assets/ui-icons/edit.png"),
    date: require("./assets/ui-icons/date.png"),
    time: require("./assets/ui-icons/time.png"),
    info: require("./assets/ui-icons/info.png"),
    passwordShow: require("./assets/ui-icons/passwordShow.png"),
    passwordHide: require("./assets/ui-icons/passwordHide.png"),
    replyComment: require("./assets/ui-icons/replyComment.png"),
    close: require("./assets/ui-icons/close.png"),
    logo: require("./assets/logo.png"),
}

export { boxes, buttons, texts, colors, iconsize, iconsizeAdd, icons, profileImage, width, height }