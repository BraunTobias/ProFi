const functions = require('firebase-functions');
var fetch = require("node-fetch");

const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

exports.pushNotificationNewComment = functions.firestore.document('courses/{docId}/ideas/{ideaId}/comments/{commentId}').onCreate(async (snap, context) => {

    const newCommentDoc = snap.data();
    const docId = context.params.docId;
    const ideaId = context.params.ideaId;
    var notificationsArray = [];    
    functions.logger.log("Doc-ID: " + docId);
    functions.logger.log("Idea-ID: " + ideaId);

    // Namen des Kommentar-Erstellers sowie Kommentar abspeichern
    const commentCreator = newCommentDoc.name;
    const commentText = newCommentDoc.text;

    // User-ID des Ideen-Erstellers herausfinden und dessen Token abspeichern
    const snapshotIdeaDoc = await db.collection("courses").doc(docId).collection("ideas").doc(ideaId).get();
    if (snapshotIdeaDoc) {
        const ideaData = snapshotIdeaDoc.data();
        const ideaTitle = ideaData.title;
        if (ideaData.creator) {
            const ideaCreator = ideaData.creator;
            const snapshotUserDoc = await db.collection("users").doc(ideaCreator).get();
            if (snapshotUserDoc) {
                const userData = snapshotUserDoc.data();
                if (userData.token && userData.pushNotificationsAllowed) {
                    notificationsArray.push({"to": userData.token, "title": commentCreator + " in " + ideaTitle, "body": commentText});   
                }
            }
            // Wenn der Kommentar eine Antwort war, bekommt der Autor des ursprünglichen Kommentars eine Nachricht
            if (newCommentDoc.replyTo) {
                const originalCommentId = newCommentDoc.replyTo;
                const snapshotOriginalCommentDoc = await db.collection("courses").doc(docId).collection("ideas").doc(ideaId).collection("comments").doc(originalCommentId).get();
                if (snapshotOriginalCommentDoc) {
                    const originalCommentData = snapshotOriginalCommentDoc.data();
                    const originalCommentCreatorId = originalCommentData.user;
                    const snapshotOriginalCommentCreatorDoc = await db.collection("users").doc(originalCommentCreatorId).get();
                    if (snapshotOriginalCommentCreatorDoc) {
                        const originalCommentCreatorData = snapshotOriginalCommentCreatorDoc.data();
                        if (originalCommentCreatorData.token && originalCommentCreatorData.pushNotificationsAllowed) {
                            notificationsArray.push({"to": originalCommentCreatorData.token, "title": commentCreator + " in " + ideaTitle, "body": commentText});   
                        }
                    }
                }
            }
        }
    } 

    // notificationsArray.push({"to": docData.token, "title": docData.username + " hat deine Idee kommmentiert", "body": "Hi " + docData.username + "!"});   

    // if (snapshotIdeaDoc) {
    //     snapshot.forEach(doc => {
    //         const docData = doc.data();
    //         if (docData.token) {
    //             notificationsArray.push({"to": docData.token, "title": docData.username + " hat deine Idee kommmentiert", "body": "Hi " + docData.username + "!"});                   
    //             functions.logger.log(docData.token);
    //         }
    //     });
    // } 
    fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(notificationsArray)
    })
    functions.logger.log("Array: " + notificationsArray.toString());
});

// exports.pushNotificationToAllUsers = functions.firestore.document('courses/{docId}').onCreate(async (snap, context) => {
//     var notificationsArray = [];    
//     const snapshot = await db.collection("users").get();
//     if (snapshot) {
//         snapshot.forEach(doc => {
//             const docData = doc.data();
//             if (docData.token) {
//                 notificationsArray.push({"to": docData.token, "title": docData.username + " hat deine Idee kommmentiert", "body": "Hi " + docData.username + "!"});                   
//                 functions.logger.log(docData.token);
//             }
//         });
//     } 
//     fetch("https://exp.host/--/api/v2/push/send", {
//         method: "POST",
//         headers: {
//             "Accept": "application/json",
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(notificationsArray)
//     })
//     functions.logger.log("Array: " + notificationsArray.toString());
// });


