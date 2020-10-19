import { StyleSheet, Dimensions } from "react-native";

const width = Dimensions.get('window').width; //full width

const colors = {
    darkBlue: '#222f56',
    mediumBlue: '#808aa5',
    lightBlue: '#ced7e4',
    lightGrey: '#f2f3f4',
    darkGrey: '#333333',
    red: '#640023',
    white: 'white'
}

const icons = {
    profilePlaceholder: require("./assets/ui-icons/user.png"),
    checkTrue: require("./assets/ui-icons/check-true.png"),
    checkFalse: require("./assets/ui-icons/check-false.png"),
    home: require("./assets/ui-icons/home.png"),
    profile: require("./assets/ui-icons/profile.png"),
    plus: require("./assets/ui-icons/plus.png"),
    find: require("./assets/ui-icons/find.png"),
    exit: require("./assets/ui-icons/exit.png"),
    fav: require("./assets/ui-icons/favourite.png"),
    nogo: require("./assets/ui-icons/nogo.png"),
    delete: require("./assets/ui-icons/delete.png"),
    like: require("./assets/ui-icons/like.png"),
    reply: require("./assets/ui-icons/reply.png"),
}

const boxes = {
    mainContainer: {
        height: "100%",
        width: "100%",
        paddingHorizontal: 20,
        backgroundColor: colors.lightGrey,
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        height: 100,
        backgroundColor: colors.darkBlue,
    },
    subHeader: {
        backgroundColor: colors.lightBlue,
        paddingVertical: 7,
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
        paddingHorizontal: 10,
        marginVertical: 5,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderColor: colors.lightBlue,
        borderRadius: 7,
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
    },
    buttonSmall: {
        height: 45,
        width: (width - 40) / 2,
        paddingLeft: 15,
        paddingRight: 5,
        marginVertical: 5,
        backgroundColor: colors.darkBlue,
        borderRadius: 7,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "white",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    buttonSmallInactive: {
        height: 45,
        width: (width - 40) / 2,
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
        width: "100%",
        paddingHorizontal: 10,
        marginVertical: 5,
        backgroundColor: colors.darkBlue,
        borderRadius: 7,
        justifyContent: "center",
    },
    buttonLargeTransparent: {
        height: 40,
        width: "100%",
        paddingHorizontal: 10,
        marginVertical: 5,
        backgroundColor: "none",
        borderRadius: 0,
        justifyContent: "center",
    },
    buttonIcon: {
        width: 25,
        height: 25,
        marginEnd: 5,
        tintColor: "white"
    },
    numberInput: {
        flex: 1,
        alignItems: "center",
        maxWidth: (width - 50) / 2,
        marginRight: 0
    },
    numberInputButton: {
        width: 40, 
        height: 40,
        borderRadius: 7
    },
    attributePreviewTile: {
        height: 90,
        width: "100%",
        paddingLeft: 15,
        paddingRight: 35,
        paddingVertical: 10,
        marginTop: 10,
        marginBottom: 5,
        alignItems: "left",
        justifyContent: "center",
        backgroundColor: "white", 
        // borderBottomWidth: 1,
        // borderColor: colors.darkBlue,
        borderRadius: 7,
        shadowColor: colors.darkBlue,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 0,
    },
    listTile: {
        paddingLeft: 15,
        paddingRight: 35,
        height: 90,
        width: "100%",
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
    commentTile: {
        paddingLeft: 15,
        paddingRight: 35,
        paddingVertical: 10,
        minHeight: 100,
        width: "100%",
        flexDirection: "row",
        alignItems: "left",
        justifyContent: "top",
        backgroundColor: "red"
    },
    commentTileImage: {
        height: 60,
        width: 60,
        alignItems: "left",
        justifyContent: "flex-start"
    },
    commentTileHeader: {
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "baseline",
    },
    commentTileContent: {
        width: width - 90, 
        justifyContent: "center", 
        paddingStart: 15,
    },
    likesRow: {
        width: "100%",
        marginTop: 5, 
        flexDirection: "row", 
        justifyContent: "center", 
        alignItems: "center"
    },
    likesImage: {
        resizeMode: "contain", 
        tintColor: colors.darkBlue, 
        marginRight: 5    
    },
    swipeButton: {
        flex: 1,
        height: "100%",
        width: 60,
        alignItems: "center",
        justifyContent: "center",
    },
    swipeIcon: {
        width: "65%"
    },
    swipeRowOne: {
        height: "100%", 
        width: width * 0.8,
        backgroundColor: colors.red,
    },
    swipeRowTwo: {
        height: "100%", 
        width: width * 0.8,
        backgroundColor: colors.red,
        paddingRight: width * 0.8 -120,
        flexDirection: "row"
    },
    modal: {
        flex: 1, 
        justifyContent: "center",
    },
    modalScrollView: {
        flexGrow: 1,
    },
    modalButton: {
        width: "100%",
        paddingHorizontal: 15,
        paddingBottom: 25,
        paddingTop: 10,
        backgroundColor: colors.lightGrey
    },
    scrollRow: {
        height: 80,
        width: width,
        paddingVertical: 10,
    },
    profileImage: {
        height: "100%",
        marginRight: 7,
        aspectRatio: 1,
        backgroundColor: colors.lightBlue,
        borderRadius: 111
    },
    profileViewImage: {
        width: width,
        height: 150,
        alignItems: "center",
        borderRadius: 111
    },
    attributeImage: {
        height: "100%",
        aspectRatio: 1,
        marginRight: 7,
        flex: 1,
        backgroundColor: colors.lightGrey,
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center",
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
    },
    separator: {
        paddingHorizontal: 15,
        paddingVertical: 7,
        borderBottomWidth: 1,
        borderColor: colors.darkBlue,
        backgroundColor: "rgba(255,255,255,0.9)"
    },


}

const texts = {
    header: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 20,
        color: colors.white,
        textAlign: "center"
    },
    titleCentered: {
        fontFamily: 'Inter_400Regular',
        textAlign: "center",
        fontSize: 20,
        paddingBottom: 20
    },
    subHeader: {
        fontFamily: 'Inter_600SemiBold',
        color: colors.darkGrey,
        fontSize: 16,
    },
    buttonSmall: {
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
        color: "white",
        textAlign: "left",
    },
    buttonLargeSolid: {
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
        color: "white",
        textAlign: "center"
    },
    buttonLargeTransparent: {
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        color: colors.darkBlue,
        textAlign: "center",
    },
    listTileHeader: {
        fontSize: 20,
        color: colors.darkBlue,
        fontFamily: 'Inter_700Bold',
        marginBottom: 5,
    },
    commentTileHeader: {
        fontSize: 18,
        color: colors.darkBlue,
        fontFamily: 'Inter_600SemiBold',
        marginBottom: 5,
    },
    copy: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: 'Inter_400Regular',
        color: colors.darkGrey,
    },
    sectionListCopy: {
        fontSize: 16,
        lineHeight: 26,
        fontFamily: 'Inter_400Regular',
        color: colors.darkGrey,
        paddingStart: 15,
    },
    commentTileTime: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        color: colors.darkGrey,
        opacity: 0.5
    },
    numberInput: {
        fontSize: 18,
        fontFamily: 'Inter_400Regular',
        color: colors.darkGrey,
    },
    separatorText: {
        fontSize: 18,
        color: colors.darkBlue,
        fontFamily: 'Inter_600SemiBold',
    }
}

export { icons, colors, boxes, texts }