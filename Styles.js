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
    edit: require("./assets/ui-icons/edit.png"),
    date: require("./assets/ui-icons/date.png"),
    time: require("./assets/ui-icons/time.png"),
    info: require("./assets/ui-icons/info.png"),
    passwordShow: require("./assets/ui-icons/passwordShow.png"),
    passwordHide: require("./assets/ui-icons/passwordHide.png"),
    replyComment: require("./assets/ui-icons/replyComment.png"),
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
        minHeight: 40,
        paddingHorizontal: 10,
        marginVertical: 5,
        backgroundColor: colors.white,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: colors.lightBlue,
        borderRadius: 7,
        justifyContent: "center",
        overflow: "hidden",
    },
    inputFieldError: {
        borderWidth: 1,
        borderColor: colors.red,
        borderBottomColor: colors.red
    },
    inputFieldIconBox: {
        height: 40, 
        width: 40,
        position: "absolute", 
        right: 0,
        borderBottomRightRadius: 7,
        borderTopRightRadius: 7,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.darkBlue, 
    },
    inputFieldIcon: {
        height: 22, 
        width: 22, 
        tintColor: colors.white    
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
        shadowColor: colors.white,
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
        shadowColor: colors.white,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
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
        tintColor: colors.white
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
        alignItems: "flex-start",
        justifyContent: "center",
        backgroundColor: colors.white, 
        borderColor: colors.red,
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
        alignItems: "flex-start",
        justifyContent: "center",
    },
    listTileHeader: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: -2,
        marginBottom: 2,
    },
    listTileArrow: {
        position: "absolute",
        right: 15,
        width: 15,
        tintColor: colors.lightBlue,
        zIndex: -1
    },
    listTileIcon: {
        width: 25, 
        height: 25, 
        tintColor: colors.darkBlue, 
        marginEnd: 7,  
    },
    attributeListTile: {
        width: "100%",
        height: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    commentTile: {
        paddingLeft: 15,
        paddingRight: 35,
        paddingVertical: 10,
        // minHeight: 100,
        // width: width,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    commentReplyTile: {
        width: 20, 
        height: 60, 
        marginRight: 5, 
        marginLeft: -5, 
        tintColor: colors.lightBlue
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
        width: width - 90, 
        justifyContent: "center", 
        paddingStart: 15,
    },
    commentReplyTileContent: {
        width: width - 110, 
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
        height: 17,
        width: 17,
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
        width: 40,
        tintColor: colors.white
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
        paddingBottom: 13,
        paddingTop: 7,
        backgroundColor: colors.lightGrey
    },
    scrollRow: {
        height: 80,
        width: width,
        paddingVertical: 10,
    },
    smallProfileRow: {
        height: 25,
        marginVertical: 3,
        marginHorizontal: 5,
        flexDirection: "row"
    },
    imageLoading: {
        position: "absolute",
        top: 0,
        height: "100%",
        aspectRatio: 1,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 111,
        justifyContent: "center",
        alignItems: "center"
    },
    profileImage: {
        height: "100%",
        marginRight: 7,
        aspectRatio: 1,
        backgroundColor: colors.lightBlue,
        borderRadius: 111,
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
        tintColor: colors.darkBlue
    },
    separator: {
        paddingHorizontal: 15,
        paddingVertical: 7,
        borderBottomWidth: 1,
        borderColor: colors.darkBlue,
        backgroundColor: colors.white
    },
    ideaFooter: {
        width: "100%",
        justifyContent: "center",
        flexDirection: "row",
        paddingTop: 10,
        paddingBottom: 15,
        borderTopWidth: 1,
        borderColor: colors.darkGrey,
        opacity: 0.5
    },
    line: {
        height: 1,
        width: "100%",
        backgroundColor: colors.mediumBlue,
    }


}

const texts = {
    header: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 20,
        color: colors.white,
        textAlign: "center",
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
    subHeaderLarge: {
        fontFamily: 'Inter_600SemiBold',
        color: colors.darkBlue,
        fontSize: 18,
        paddingBottom: 3
    },
    buttonSmall: {
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
        color: colors.white,
        textAlign: "left",
    },
    buttonLargeSolid: {
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
        color: colors.white,
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
    },
    commentTileHeader: {
        fontSize: 16,
        color: colors.darkBlue,
        fontFamily: 'Inter_600SemiBold',
        // marginBottom: 5,
    },
    copy: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: 'Inter_400Regular',
        color: colors.darkGrey,
    },
    link: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: 'Inter_400Regular',
        color: colors.darkBlue,
        textDecorationLine: 'underline'
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
        opacity: 0.5,
        position: "absolute",
        right: 0,
    },
    ideaFooter: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        color: colors.darkGrey,
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
    },
    inputField: {
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
    },
    errorLine: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        color: colors.red,
        marginBottom: 5
    }
}

export { icons, colors, boxes, texts }