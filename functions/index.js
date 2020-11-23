const functions = require('firebase-functions');
var fetch = require("node-fetch");

const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

// Test-Funktion
// exports.testNotification = functions.pubsub.schedule('* * * * *').timeZone('Europe/Berlin').onRun(async (context) => {
//     var notificationsArray = [];
//     notificationsArray.push({"to": "ExponentPushToken[1J5A-iFeQ9sgfdd3ziRD1j]", "title": "Test", "body": "Dies ist eine Test-Notification"});   

//     fetch("https://exp.host/--/api/v2/push/send", {
//         method: "POST",
//         headers: {
//             "Accept": "application/json",
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(notificationsArray)
//     });
// });



// Löschen von zu alten Kursen
exports.deleteOldCourses = functions.pubsub.schedule('0 9 * * *').timeZone('Europe/Berlin').onRun(async (context) => {
    const currentDate = new Date();

    var allCourseData = [];

    // Kurse durchsuchen und Datum checken
    const snapshotCourses = await db.collection("courses").get();
    snapshotCourses.forEach(courseDoc => {
        var courseData = courseDoc.data();
        courseData["id"] = courseDoc.id;
        allCourseData.push(courseData);
    });

    /* eslint-disable no-await-in-loop */
    for (const course of allCourseData) {
        if (course.date) {
            const teamDate = course.date.toDate();
            const timeDiff = (currentDate.getTime() - teamDate.getTime()) / (1000 * 3600 * 24);
            if ((course.prospects.length === 0 && timeDiff > 0) || timeDiff > 180) {
                // Wenn ein Kurs keine Interessenten hat und in der Vergangenheit liegt, wird er gelöscht
                // Alle Ideen und Kommentare löschen
                var allIdeaIds = [];
                const snapshotIdeas = await db.collection("courses").doc(course.id).collection("ideas").get();
                snapshotIdeas.forEach(ideaDoc => {
                    allIdeaIds.push(ideaDoc.id);
                });
                for (const ideaId of allIdeaIds) {
                    // Kommentare löschen
                    const snapshotComments = await db.collection("courses").doc(course.id).collection("ideas").doc(ideaId).collection("comments").get();
                    snapshotComments.forEach(commentDoc => {
                        db.collection("courses").doc(course.id).collection("ideas").doc(ideaId).collection("comments").doc(commentDoc.id).delete();
                    });
                    // Ideen löschen
                    db.collection("courses").doc(course.id).collection("ideas").doc(ideaId).delete();
                }
                // Kurs löschen
                db.collection("courses").doc(course.id).delete();
            } 
        }
    }
    /* eslint-enable no-await-in-loop */
});

// Löschen von alten Ideen
exports.deleteOldIdeas = functions.pubsub.schedule('0 9 * * *').timeZone('Europe/Berlin').onRun(async (context) => {
    const currentDate = new Date();
    var notificationsArray = [];

    var openCourseIds = [];

    // Offene Kurse durchsuchen und Datum checken
    const snapshotOpenCourses = await db.collection("openCourses").get();
    snapshotOpenCourses.forEach(openCourseDoc => {
        openCourseIds.push(openCourseDoc.id);
    });
    /* eslint-disable no-await-in-loop */
    for (const openCourseId of openCourseIds) {

        const allIdeaData = [];
        const snapshotIdeas = await db.collection("openCourses").doc(openCourseId).collection("ideas").get();
        snapshotIdeas.forEach(ideaDoc => {
            const ideaData = ideaDoc.data();
            ideaData["id"] = ideaDoc.id;
            if(ideaData.teamDate||ideaData.lastUpdated){
                allIdeaData.push(ideaData);
            }
        });
        
        for (const ideaData of allIdeaData) {

            if (ideaData.teamDate) {
                const teamDate = ideaData.teamDate.toDate();
                // TimeDiff = Verstrichene Zeit in Tagen
                const timeDiff = (currentDate.getTime() - teamDate.getTime()) / (1000 * 3600 * 24);
                functions.logger.log("Das Team " + ideaData.title + " wurde vor " + timeDiff + " Tagen eingeteilt …");          
                if (timeDiff > 21) {
                    functions.logger.log("… und wird gelöscht.");          
                    // Teams, die vor 3 Wochen eingeteilt wurden -> Team löschen
                    // Kommentare löschen
                    const snapshotComments = await db.collection("openCourses").doc(openCourseId).collection("ideas").doc(ideaData.id).collection("comments").get();
                    snapshotComments.forEach(commentDoc => {
                        db.collection("openCourses").doc(openCourseId).collection("ideas").doc(ideaData.id).collection("comments").doc(commentDoc.id).delete();
                    });
                    // Idee löschen
                    db.collection("openCourses").doc(openCourseId).collection("ideas").doc(ideaData.id).delete();
                } else if ((timeDiff >= 14 && timeDiff < 15) || (timeDiff >= 20)) {
                    functions.logger.log("… und wird bald gelöscht.");          
                    const snapshotCreatorDoc = await admin.firestore().collection("users").doc(ideaData.creator).get();
                    functions.logger.log("Await zuende");          
                    if (snapshotCreatorDoc) {
                        const creatorData = snapshotCreatorDoc.data();
                        if (creatorData.pushNotificationsAllowed.delete) {
                            functions.logger.log("Ersteller wird benachrichtigt");          
                            if (timeDiff >= 20) {
                                for (const token of creatorData.tokens) {
                                    // Teams, die vor 2 Wochen und 6 Tagen eingeteilt wurden
                                    notificationsArray.push({"to": token, "title": ideaData.title, "body": "Deine Idee wird morgen gelöscht. Falls sie noch wichtige Informationen enthält, bitte sichere diese anderweitig."});   
                                }
                            } else {
                                for (const token of creatorData.tokens) {
                                    // Teams, die vor 2 Wochen eingeteilt wurden
                                    notificationsArray.push({"to": token, "title": ideaData.title, "body": "Deine Idee wird in einer Woche gelöscht. Falls sie noch wichtige Informationen enthält, bitte sichere diese anderweitig."});   
                                }
                            }
                        } 
                    } else {
                        functions.logger.log("Ersteller nicht gefunden");          
                    }
                }
            } else if (ideaData.lastUpdated) {   
                const lastUpdated = ideaData.lastUpdated.toDate();  
                // TimeDiff = Verstrichene Zeit in Tagen
                const timeDiff = (currentDate.getTime() - lastUpdated.getTime()) / (1000 * 3600 * 24);
                functions.logger.log("Die Idee " + ideaData.title + " ist seit " + timeDiff + " Tagen inaktiv …");          
                if (timeDiff > 181) {
                    functions.logger.log("… und wird gelöscht.");          
                    // Offene Ideen die noch nicht eingeteilt wurden nach 1/2 Jahr Inaktivität löschen
                    // Kommentare löschen
                    const snapshotComments = await db.collection("openCourses").doc(openCourseId).collection("ideas").doc(ideaData.id).collection("comments").get();
                    snapshotComments.forEach(commentDoc => {
                        db.collection("openCourses").doc(openCourseId).collection("ideas").doc(ideaData.id).collection("comments").doc(commentDoc.id).delete();
                    });
                    // Idee löschen
                    db.collection("openCourses").doc(openCourseId).collection("ideas").doc(ideaData.id).delete();
                } else if (timeDiff > 180) {
                    // 1 Woche vor Ablauf den Ersteller benachrichtigen
                    const snapshotCreatorDoc = await admin.firestore().collection("users").doc(ideaData.creator).get();
                    if (snapshotCreatorDoc) {
                        const creatorData = snapshotCreatorDoc.data();
                        if (creatorData.pushNotificationsAllowed.delete) {
                            for (const token of creatorData.tokens) {
                                notificationsArray.push({"to": token, "title": ideaData.title, "body": "Deine Idee ist seit einem halben Jahr inaktiv und wird morgen gelöscht."});   
                            }
                        }
                    }
                } 
            }
        }
        /* eslint-enable no-await-in-loop */
    }
    functions.logger.log("Notifications Ende:");          
    functions.logger.log(notificationsArray);          

    fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(notificationsArray)
    })
});

// Änderung der verfügbaren Skills
exports.updateSkillsList = functions.firestore.document('{attributeType}/{categoryDoc}').onWrite(async (change, context) => {
    
    if (context.params.attributeType === "skills" || context.params.attributeType === "interests") {
        const attributeType = context.params.attributeType;
        const changedCategory = context.params.categoryDoc;
        const skillListBefore = change.before.data();
        const skillListAfter = change.after.data();
    
        var allUserIds = [];
        const snapshotUsers = await db.collection("users").get();
        snapshotUsers.forEach(userDoc => {
            allUserIds.push(userDoc.id);
        })
    
        if (skillListBefore && skillListAfter) {
            // Prüfen, ob ein Skill hinzugekommen ist
            for (const skill in skillListAfter) {
                if (typeof skillListBefore[skill] === 'undefined') {
                    functions.logger.log(skill + " wurde hinzugefügt");
                    // Bei allen Usern den neuen Skill einsetzen
                    for (const userId of allUserIds) {
                        db.collection("users").doc(userId).collection(attributeType).doc(changedCategory).set({
                            [skill]: false
                        }, {merge: true});
                    }
                }
            }
            // Prüfen, ob ein Skill gelöscht wurde
            for (const skill in skillListBefore) {
                if (typeof skillListAfter[skill] === 'undefined') {
                    functions.logger.log(skill + " wurde entfernt");
                    // Bei allen Usern den Skill entfernen
                    for (const userId of allUserIds) {
                        db.collection("users").doc(userId).collection(attributeType).doc(changedCategory).update({
                            [skill]: FieldValue.delete()
                        });
                    }
                }
            }
        } else if (!skillListBefore) {
            // Wenn eine Kategorie hinzugefügt wurde
            functions.logger.log("Kategorie " + changedCategory + " wurde erstellt");
            for (const userId of allUserIds) {
                db.collection("users").doc(userId).collection(attributeType).doc(changedCategory).set({});
            }
        } else if (!skillListAfter) {
            // Wenn eine Kategorie entfernt wurde
            functions.logger.log("Kategorie " + changedCategory + " wurde gelöscht");
            for (const userId of allUserIds) {
                db.collection("users").doc(userId).collection(attributeType).doc(changedCategory).delete();
            }
        }    
    }
});

// // Änderung der verfügbaren Interessen
// exports.updateSkillsList = functions.firestore.document('interests/{categoryDoc}').onWrite(async (change, context) => {
    
//     const changedCategory = context.params.categoryDoc;
//     const skillListBefore = change.before.data();
//     const skillListAfter = change.after.data();

//     var allUserIds = [];
//     const snapshotUsers = await db.collection("users").get();
//     snapshotUsers.forEach(userDoc => {
//         allUserIds.push(userDoc.id);
//     })

//     if (skillListBefore && skillListAfter) {
//         // Prüfen, ob ein Skill hinzugekommen ist
//         for (const skill in skillListAfter) {
//             if (typeof skillListBefore[skill] === 'undefined') {
//                 functions.logger.log(skill + " wurde hinzugefügt");
//                 // Bei allen Usern den neuen Skill einsetzen
//                 for (const userId of allUserIds) {
//                     db.collection("users").doc(userId).collection("skills").doc(changedCategory).set({
//                         [skill]: false
//                     }, {merge: true});
//                 }
//             }
//         }
//         // Prüfen, ob ein Skill gelöscht wurde
//         for (const skill in skillListBefore) {
//             if (typeof skillListAfter[skill] === 'undefined') {
//                 functions.logger.log(skill + " wurde entfernt");
//                 // Bei allen Usern den Skill entfernen
//                 for (const userId of allUserIds) {
//                     db.collection("users").doc(userId).collection("skills").doc(changedCategory).update({
//                         [skill]: FieldValue.delete()
//                     });
//                 }
//             }
//         }
//     } else if (!skillListBefore) {
//         // Wenn eine Kategorie hinzugefügt wurde
//         functions.logger.log("Kategorie " + changedCategory + " wurde erstellt");
//         for (const userId of allUserIds) {
//             db.collection("users").doc(userId).collection("skills").doc(changedCategory).set({});
//         }
//     } else if (!skillListAfter) {
//         // Wenn eine Kategorie entfernt wurde
//         functions.logger.log("Kategorie " + changedCategory + " wurde gelöscht");
//         for (const userId of allUserIds) {
//             db.collection("users").doc(userId).collection("skills").doc(changedCategory).delete();
//         }
//     }    
// });

// Jeden Tag prüfen, ob Deadline-Datum eingetreten ist
exports.pushNotificationDate = functions.pubsub.schedule('0 9 * * *').timeZone('Europe/Berlin').onRun(async (context) => {

        
    var notificationsArray = [];   
 
    const currentDate = new Date();
    
    const snapshotCourses = await db.collection("courses").get();

    var courses = [];

    // for (const courseSnap of snapshotCourses) {
    snapshotCourses.forEach((courseSnap) => {        
        const courseData = courseSnap.data();
        if (courseData.date) {
            var date = courseData.date.toDate();
            date.setHours(date.getHours() + 3);
            if (currentDate.toDateString() === date.toDateString()) {
                courses.push(courseData);
            }
        }
    })

    /* eslint-disable no-await-in-loop */
    for (const course of courses) {
        // Nachrichten an die Interessenten
        if (course.prospects) {
            for (const prospectId of course.prospects) {
                if (prospectId !== course.creator) {
                    functions.logger.log("Prospect: " + prospectId);
                    const snapshotUserDoc = await admin.firestore().collection("users").doc(prospectId).get();
                    if (snapshotUserDoc) {
                        const userData = snapshotUserDoc.data();
                        // functions.logger.log("userData: " + userData.toString());
                        if (userData && userData.pushNotificationsAllowed.evaluate) {
                            for (const token of userData.tokens) {
                                notificationsArray.push({"to": token, "title": course.title + " " + course.semester, "body": "Heute werden die Teams eingeteilt."});   
                            }
                        }
                    }
                }
            }
        }
        // Nachricht an den Ersteller
        if (course.creator) {
            const snapshotCreatorDoc = await admin.firestore().collection("users").doc(course.creator).get();
            if (snapshotCreatorDoc) {
                const creatorData = snapshotCreatorDoc.data();
                if (creatorData.pushNotificationsAllowed.evaluate) {
                    for (const token of creatorData.tokens) {
                        notificationsArray.push({"to": token, "title": course.title + " " + course.semester, "body": "Bitte teile heute die Teams ein."});   
                    }
                }
            }
        }
    }
    /* eslint-enable no-await-in-loop */

    fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(notificationsArray)
    })
});
  
// Benachrichtigung bei neuem Kommentar
exports.pushNotificationNewComment = functions.firestore.document('{courseType}/{docId}/ideas/{ideaId}/comments/{commentId}').onCreate(async (snap, context) => {

    const newCommentDoc = snap.data();
    const docId = context.params.docId;
    const ideaId = context.params.ideaId;
    const courseType = context.params.courseType;
    var notificationsArray = [];    
    functions.logger.log("Doc-ID: " + docId);
    functions.logger.log("Idea-ID: " + ideaId);

    // Namen des Kommentar-Erstellers sowie Kommentar abspeichern
    const commentCreator = newCommentDoc.name;
    const commentCreatorId = newCommentDoc.user;
    const commentText = newCommentDoc.text;

    const snapshotIdeaDoc = await db.collection(courseType).doc(docId).collection("ideas").doc(ideaId).get();
    if (snapshotIdeaDoc) {
        const ideaData = snapshotIdeaDoc.data();
        const ideaTitle = ideaData.title;

        // User-ID des Ideen-Erstellers herausfinden und dessen Token abspeichern
        if (ideaData.creator && ideaData.creator !== commentCreatorId) {
            const ideaCreator = ideaData.creator;
            const snapshotUserDoc = await db.collection("users").doc(ideaCreator).get();
            if (snapshotUserDoc) {
                const userData = snapshotUserDoc.data();
                if (userData.pushNotificationsAllowed.comment) {
                    for (const token of userData.tokens) {
                        notificationsArray.push({"to": token, "title": commentCreator + " in " + ideaTitle, "body": commentText});   
                    }
                }
            }    
            // Wenn der Kommentar eine Antwort war, bekommt der Autor des ursprünglichen Kommentars eine Nachricht
            if (newCommentDoc.replyTo) {
                const originalCommentId = newCommentDoc.replyTo;
                const snapshotOriginalCommentDoc = await db.collection(courseType).doc(docId).collection("ideas").doc(ideaId).collection("comments").doc(originalCommentId).get();
                if (snapshotOriginalCommentDoc) {
                    const originalCommentData = snapshotOriginalCommentDoc.data();
                    const originalCommentCreatorId = originalCommentData.user;
                    const snapshotOriginalCommentCreatorDoc = await db.collection("users").doc(originalCommentCreatorId).get();
                    if (snapshotOriginalCommentCreatorDoc && originalCommentCreatorId !== commentCreatorId && originalCommentCreatorId !== ideaCreator) {
                        const originalCommentCreatorData = snapshotOriginalCommentCreatorDoc.data();
                        if (originalCommentCreatorData.pushNotificationsAllowed.comment) {
                            for (const token of originalCommentData.tokens) {
                                notificationsArray.push({"to": token, "title": commentCreator + " in " + ideaTitle, "body": commentText});  
                            } 
                        }
                    }
                }
            }
            // Wenn es eine offene Idee ist, bekommen alle Mitglieder eine Nachricht
            /* eslint-disable no-await-in-loop */
            if (ideaData.members) {
                for (const memberId of ideaData.members) {
                    if (memberId !== commentCreatorId && memberId !== ideaCreator) {
                        const snapshotUserDoc = await admin.firestore().collection("users").doc(memberId).get();
                        if (snapshotUserDoc) {
                            const userData = snapshotUserDoc.data();
                            if (userData && userData.pushNotificationsAllowed.comment) {
                                for (const token of userData.tokens) {
                                    notificationsArray.push({"to": token, "title": commentCreator + " in " + ideaTitle, "body": commentText});   
                                }
                            }
                        }
                    }
                }
            }
            /* eslint-enable no-await-in-loop */
        }
    } 

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


