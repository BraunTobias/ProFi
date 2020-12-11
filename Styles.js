import { StyleSheet, Dimensions } from "react-native";

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
    notification: require("./assets/ui-icons/notification.png"),
    security: require("./assets/ui-icons/security.png"),
    date: require("./assets/ui-icons/date.png"),
    time: require("./assets/ui-icons/time.png"),
    info: require("./assets/ui-icons/info.png"),
    warning: require("./assets/ui-icons/warning.png"),
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