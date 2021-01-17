const icons = {
    profilePlaceholder: require("./assets/ui-icons/user.png"),
    profilePlaceholderDark: require("./assets/ui-icons/userDark.png"),
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
        alignItems: "center",
        justifyContent: "center",
    },
}

const texts = {
    header: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 20,
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
        fontSize: 16,
    },
    subHeaderLarge: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 18,
        paddingBottom: 3 
    },
    buttonSmall: {
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
        textAlign: "left",
    },
    buttonLargeSolid: {
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
        textAlign: "center"
    },
    buttonLargeTransparent: {
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        textAlign: "center",
    },
    listTileHeader: {
        fontSize: 20,
        fontFamily: 'Inter_700Bold',
    },
    commentTileHeader: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
    },
    copy: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: 'Inter_400Regular',
    },
    link: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: 'Inter_400Regular',
        textDecorationLine: 'underline'
    },
    sectionListCopy: {
        fontSize: 16,
        lineHeight: 26,
        fontFamily: 'Inter_400Regular',
        paddingStart: 15,
    },
    commentTileTime: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        opacity: 0.5,
        position: "absolute",
        right: 0,
    },
    ideaFooter: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
    },
    numberInput: {
        fontSize: 18,
        fontFamily: 'Inter_400Regular',
    },
    separatorText: {
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold',
    },
    inputField: {
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
    },
    errorLine: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        marginBottom: 5
    }
}

export { icons, boxes, texts }