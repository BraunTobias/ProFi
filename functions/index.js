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
exports.updateSkillsList = functions.firestore.document('skills/{categoryDoc}').onWrite(async (change, context) => {
    var notificationsArray = [];   

    const changedCategory = context.params.categoryDoc;
    const skillListBefore = change.before.data();
    const skillListAfter = change.after.data();

    var allUserIds = [];
    var allUserData = {};
    const snapshotUsers = await db.collection("users").get();
    snapshotUsers.forEach(userDoc => {
        allUserIds.push(userDoc.id);
        allUserData[userDoc.id] = userDoc.data();
    })

    /* eslint-disable no-await-in-loop */
    if (skillListBefore && skillListAfter) {
        // Prüfen, ob ein Skill hinzugekommen ist
        for (const skill in skillListAfter) {
            if (typeof skillListBefore[skill] === 'undefined') {
                functions.logger.log(skill + " wurde hinzugefügt");
                // Bei allen Usern den neuen Skill einsetzen
                // Alle User benachrichtigen, die schon Skills in der Kategorie haben
                for (const userId of allUserIds) {
                    const userCategoryDoc = await db.collection("users").doc(userId).collection("skills").doc(changedCategory).get();
                    if (userCategoryDoc) {
                        const userCategoryData = userCategoryDoc.data();
                        var hasSkill = false;
                        for (const skill of Object.values(userCategoryData)) {
                            if (skill) hasSkill = true;
                        }
                        if (hasSkill && allUserData[userId].pushNotificationsAllowed && allUserData[userId].pushNotificationsAllowed.attChange) {
                            for (const token of allUserData[userId].tokens) {
                                notificationsArray.push({"to": token, "title": "Neue Fähigkeit verfügbar", "body": "Es gibt jetzt die Fähigkeit " + skill + " in der Kategorie " + changedCategory + "."});   
                            }
                        }
                    }

                    db.collection("users").doc(userId).collection("skills").doc(changedCategory).set({
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
                // Alle User benachrichtigen, die den Skill hatten
                for (const userId of allUserIds) {
                    const userCategoryDoc = await db.collection("users").doc(userId).collection("skills").doc(changedCategory).get();
                    if (userCategoryDoc) {
                        const userCategoryData = userCategoryDoc.data();
                        if (userCategoryData[skill] && allUserData[userId].pushNotificationsAllowed && allUserData[userId].pushNotificationsAllowed.attChange) {
                            for (const token of allUserData[userId].tokens) {
                                notificationsArray.push({"to": token, "title": "Fähigkeit entfernt", "body": "Wir haben die Fähigkeit " + skill + " aus der App entfernt."});   
                            }
                        }
                    }

                    db.collection("users").doc(userId).collection("skills").doc(changedCategory).update({
                        [skill]: FieldValue.delete()
                    });
                }

            }
        }
    } else if (!skillListBefore) {
        // Wenn eine Kategorie hinzugefügt wurde
        functions.logger.log("Kategorie " + changedCategory + " wurde erstellt");
        for (const userId of allUserIds) {
            db.collection("users").doc(userId).collection("skills").doc(changedCategory).set({});
        }
    } else if (!skillListAfter) {
        // Wenn eine Kategorie entfernt wurde
        functions.logger.log("Kategorie " + changedCategory + " wurde gelöscht");
        for (const userId of allUserIds) {
            db.collection("users").doc(userId).collection("skills").doc(changedCategory).delete();
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
// Änderung der verfügbaren Interessen
exports.updateInterestsList = functions.firestore.document('interests/{categoryDoc}').onWrite(async (change, context) => {
    var notificationsArray = [];   

    const changedCategory = context.params.categoryDoc;
    const skillListBefore = change.before.data();
    const skillListAfter = change.after.data();

    var allUserIds = [];
    var allUserData = {};
    const snapshotUsers = await db.collection("users").get();
    snapshotUsers.forEach(userDoc => {
        allUserIds.push(userDoc.id);
        allUserData[userDoc.id] = userDoc.data();
    })

    /* eslint-disable no-await-in-loop */
    if (skillListBefore && skillListAfter) {
        // Prüfen, ob ein Skill hinzugekommen ist
        for (const skill in skillListAfter) {
            if (typeof skillListBefore[skill] === 'undefined') {
                functions.logger.log(skill + " wurde hinzugefügt");
                // Bei allen Usern den neuen Skill einsetzen
                // Alle User benachrichtigen, die schon Skills in der Kategorie haben
                for (const userId of allUserIds) {
                    const userCategoryDoc = await db.collection("users").doc(userId).collection("interests").doc(changedCategory).get();
                    if (userCategoryDoc) {
                        const userCategoryData = userCategoryDoc.data();
                        var hasSkill = false;
                        for (const skill of Object.values(userCategoryData)) {
                            if (skill) hasSkill = true;
                        }
                        if (hasSkill && allUserData[userId].pushNotificationsAllowed && allUserData[userId].pushNotificationsAllowed.attChange) {
                            for (const token of allUserData[userId].tokens) {
                                notificationsArray.push({"to": token, "title": "Neues Interesse verfügbar", "body": "Es gibt jetzt das Interesse " + skill + " in der Kategorie " + changedCategory + "."});   
                            }
                        }
                    }

                    db.collection("users").doc(userId).collection("interests").doc(changedCategory).set({
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
                // Alle User benachrichtigen, die den Skill hatten
                for (const userId of allUserIds) {
                    const userCategoryDoc = await db.collection("users").doc(userId).collection("interests").doc(changedCategory).get();
                    if (userCategoryDoc) {
                        const userCategoryData = userCategoryDoc.data();
                        if (userCategoryData[skill] && allUserData[userId].pushNotificationsAllowed && allUserData[userId].pushNotificationsAllowed.attChange) {
                            for (const token of allUserData[userId].tokens) {
                                notificationsArray.push({"to": token, "title": "Interesse entfernt", "body": "Wir haben das Interesse " + skill + " aus der App entfernt."});   
                            }
                        }
                    }

                    db.collection("users").doc(userId).collection("interests").doc(changedCategory).update({
                        [skill]: FieldValue.delete()
                    });
                }

            }
        }
    } else if (!skillListBefore) {
        // Wenn eine Kategorie hinzugefügt wurde
        functions.logger.log("Kategorie " + changedCategory + " wurde erstellt");
        for (const userId of allUserIds) {
            db.collection("users").doc(userId).collection("interests").doc(changedCategory).set({});
        }
    } else if (!skillListAfter) {
        // Wenn eine Kategorie entfernt wurde
        functions.logger.log("Kategorie " + changedCategory + " wurde gelöscht");
        for (const userId of allUserIds) {
            db.collection("users").doc(userId).collection("skills").doc(changedCategory).delete();
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

// Jeden Tag prüfen, ob Deadline-Datum eingetreten ist
exports.createTeams = functions.pubsub.schedule('* * * * *').timeZone('Europe/Berlin').onRun(async (context) => {

    var notificationsArray = [];   
    var dueCourses = {};

    const currentDate = new Date();
    
    function proFiFunction(members, ideas, minMembers, maxMembers, onSuccess) {
        // Daten
        const favValue = 5.5;
        var emptyIdeas=[];
        // ___________________________________________________________________________________________________________________________________________________

        var skillValues = {};

        function calculateSkillValues() {

            skillValues=[];

            let memberSkills =[];
            let ideaSkills=[];

            let allMemberSkills = new Array(); 
            let allIdeaSkills = new Array(); 

            //Skills zählen

            for (const ID in members) {

                if (!members[ID].sorted) {

                    members[ID].skills.forEach(skill => {

                        var index =allMemberSkills.indexOf(skill); 

                        if (index >= 0) {

                            memberSkills[index][1]++;   
                        }
                        else{

                            allMemberSkills.push(skill);
                            memberSkills.push([skill,1]);
                        }            
                    });
                }      
            }

            for (const ID in ideas) {    

                ideas[ID].missingSkills.forEach(skill => {

                    var index =allIdeaSkills.indexOf(skill); 

                    if (index >= 0) {

                        ideaSkills[index][1]++;   
                    }
                    else{

                        allIdeaSkills.push(skill);
                        ideaSkills.push([skill,1]);
                    }            
                }); 
            }

            for (let i = 0; i < memberSkills.length; i++) {

                for (let j = 0; j < ideaSkills.length; j++) {
                    
                    if(memberSkills[i][0]=== ideaSkills[j][0]){

                        // Prozent von vorhandenen Member Skills, zu benötigten Idea Skills
                        // Genaue Abdeckung = 1; Selter Skill (häufiger benötigt, als vorhanden) > 1; Häufiger Skill < 1; 
                        let percent = ideaSkills[j][1] / memberSkills[i][1];

                        // Prozent * 5, aufgerundet
                        let value = Math.ceil(percent * 5);

                        // Skill Values bei aufrunden:
                        // 0%-20% = 1
                        // 21%-40% = 2
                        // 41%-60% = 3
                        // 61%-80% = 4
                        // 81%-100% = 5
                        // usw.

                        skillValues[memberSkills[i][0]] = value;
                    }
                }        
            }

            // Werte ausgeben
            for (const skill in skillValues) {
                // console.log(skill+" – Wert:  "+ skillValues[skill]);
            } 
        }
        functions.logger.log("-1");

        calculateSkillValues();

        // ___________________________________________________________________________________________________________________________________________________

        const createUserScoreLists = () => {

            // Jedes Mitglied des Kurses durchgehen
            for (const memId in members) {

                // Score-Liste erstellen
                var scoreList = [];
                // Alle Ideen durchgehen
                for (const ideaId in ideas) {

                    var score = 0;

                    // Wenn kein No-Go
                    if (ideas[ideaId].nogos.indexOf(memId) < 0) {

                        // In Idee geforderte Skills durchgehen
                        ideas[ideaId].skills.forEach(skill => {

                            if (members[memId].skills.indexOf(skill) >= 0) {
                                // Wenn Skillüberschneidung vorhanden, Score erhöhen
                                score += skillValues[skill];
                            }
                        });

                        // Wenn die Idee favorisiert wurde, Score erhöhen
                        if (ideas[ideaId].favs.indexOf(memId) >= 0) {
                            score += favValue;
                        }
                        scoreList.push([ideaId, score]);
                    }
                    
                }

                // scoreList nach Scores sortieren
                scoreList.sort((a,b) => b[1] - a[1]);

                // fertige Score-Liste anhängen
                members[memId].scoreList = scoreList;

            }
        }

        const createSingleIdeaScoreList = (ideaId) => {

            // Score-Liste erstellen
            var ideaScoreList = [];
            // Alle Mitglieder die schon in der Idee sind durchgehen
            ideas[ideaId].team.forEach(memId => {

                var score = 0;

                // In Idee geforderte Skills durchgehen
                ideas[ideaId].skills.forEach(skill => {

                    // zählen wie oft der Skill schon in der Idee vorkommt
                    var skillCoverage = 0;
                    ideas[ideaId].team.forEach(memId2 => {
                        if (members[memId2].skills.indexOf(skill) >= 0) {
                            skillCoverage += 1;
                        }
                    });

                    const skillValue = 5 - skillCoverage;

                    if (members[memId].skills.indexOf(skill) >= 0) {
                        // Wenn Skillüberschneidung vorhanden, Score erhöhen
                        if (skillValue > 0) score += skillValue;
                    }
                });

                ideaScoreList.push([memId, score]);
            });
            
            ideaScoreList.sort((a,b) => b[1] - a[1]);
            // console.log(ideaScoreList);

            var lowestUserId = ideaScoreList[ideaScoreList.length - 1][0];
            var newArray = ideas[ideaId].team.filter(id => id !== lowestUserId);
            ideas[ideaId].team = newArray;

            // Rausgeworfener User wird zurückgegeben
            return (lowestUserId);
        }

        // ___________________________________________________________________________________________________________________________________________________

        createUserScoreLists();

        function stableMatching() {
            var unmatchableMembers = 0;
            var sortedMembers = 0;
            var i =0;
            functions.logger.log("Length:");
            functions.logger.log(Object.keys(members).length);
            
            // DAS ALLES MACHEN SOLANGE ES NOCH UNSORTIERTE MEMBERS GIBT
            while ((unmatchableMembers+sortedMembers) < Object.keys(members).length) {
                // console.log("---- Step " + i + " ----");

                i++;
                // Alle Mitglieder durchgehen
                for (const memId in members) {
                    // Prüfen ob das Mitglied schon vergeben ist
                    if (!members[memId].sorted && !members[memId].unmatchable) {

                        // if (members[memId].scoreList.length > 0) {

                            // console.log(memId + members[memId].scoreList);
                            var prefIdeaId = members[memId].scoreList[0][0];
            
                            // console.log(memId + " zu " + prefIdeaId + " hinzufügen …");
                            // User-ID vorübergehend zur Idee hinzufügen
                            ideas[prefIdeaId].team.push(memId);
            
                            if (ideas[prefIdeaId].team.length <= minMembers) {
                                // Wenn die Idee noch nicht überfüllt ist, den User als sortiert markieren 
                                members[memId].sorted  = true;
                                sortedMembers +=1;
                            } else {
                                // Bei Überfüllung den User in der Idee anhand der Score-Liste vergleichen und den schlechtesten User löschen
                                overflowUserId = createSingleIdeaScoreList(prefIdeaId);
                                // console.log("! "+ overflowUserId + " aus " + prefIdeaId + " rausgeworfen");
                                if (overflowUserId !== memId) members[memId].sorted = true;
                                functions.logger.log("Overflow User: " + overflowUserId);
            
                                // Den rausgeworfenen User als unsortiert markieren und die Idee aus seiner Scoreliste löschen
                                members[overflowUserId].sorted = false // FEHLER;
                                var oldScoreList = members[overflowUserId].scoreList;
                                var newScoreList = oldScoreList.filter(idea => idea[0] !== prefIdeaId);
                                functions.logger.log(newScoreList);
                                if(newScoreList.length === 0){
                                    functions.logger.log("newScoreList.length = 0");
                                    unmatchableMembers+=1;
                                    members[overflowUserId].unmatchable  = true;
                                }
                                members[overflowUserId].scoreList = newScoreList;
                            }
                            functions.logger.log(unmatchableMembers+sortedMembers);
                            functions.logger.log(members);
                        // }
                        // functions.logger.log("1. if");
                    }  
                }

                // console.log(unmatchableMembers+sortedMembers);
            }
        }

        function updateMissingSkills() {

            for (const ideaId in ideas) {

                var missingSkillsList = ideas[ideaId].missingSkills;

                // Alle fehlenden Skills der Idee durchgehen
                for (const missingSkill of missingSkillsList) {

                    for (const memberId of ideas[ideaId].team) {
                        // Wenn der Skill schon bei einem Mitglied vorhanden ist, diesen aus missingSkills entfernen
                        if (members[memberId].skills.indexOf(missingSkill) >= 0) {
                            // console.log(missingSkill + "fehlt nicht mehr");
                            missingSkillsList = missingSkillsList.filter(skill => skill !== missingSkill);
                            break;
                        } 
                    }
                }
                ideas[ideaId].missingSkills = missingSkillsList;
            }
        }

        function compareInterests(idea) {

            var commonInterestsList = idea.commonInterests;

                //Jeden Zugeorneten Teilnehmer durchgehen
                for (const memberId of idea.team) {

                    //Wurde der Teilnehmer schon gezählt?
                    if(!members[memberId].interestsCounted){

                        //Alle Interessen des Teilnehmers durchegen
                        members[memberId].interests.forEach(memberInterest => {

                            let isAlreadyInList = false
                            //Wenn schon vorhanden zählen wie oft
                            for (let i = 0; i < commonInterestsList.length; i++) {
                                const commonInterest = commonInterestsList[i];

                                if(commonInterest[0]=== memberInterest){
                                    commonInterestsList[i][1]+=1;
                                    isAlreadyInList= true;
                                }
                        
                            }
                            //Wenn nicht vorhanden hinzufügen
                            if(!isAlreadyInList){
                                commonInterestsList.push([memberInterest, 1]);
                            }
                        });

                        members[memberId].interestsCounted = true;
                    }     
                }
                //Interessenliste in Idee fest speichern
                return commonInterestsList;

        }

        function updateCommonInterests() {

            //Jede Idee durchgehen
            for (const ideaId in ideas) {

                ideas[ideaId].commonInterests = compareInterests(ideas[ideaId]);
            } 

            //Jede  leere Idee durchgehen
            for (const ideaId in emptyIdeas) {

                emptyIdeas[ideaId].commonInterests = compareInterests(emptyIdeas[ideaId]);
                    
            } 
        }

        function addEmptyIdeas(unsorted) {
            var newIdeaNumber =0;

            while (unsorted.length > 0) {
                var sorted =[];
                newIdeaNumber +=1;
                var newIdea ="empty"+newIdeaNumber;

                emptyIdeas[newIdea]={
                skills: [],
                missingSkills: [],
                favs: [],
                nogos: [],
                team: [],
                commonInterests: []
                }
                var scoreList = [];

                //Für jeden undortierten Teilnehmer neue Ideen erstellen
                unsorted.forEach(memId => {

                    //erster Teilnehmer in Idee speichern
                    if(emptyIdeas[newIdea].team.length === 0){
                        emptyIdeas[newIdea].team.push(memId);
                        //Erste skills speichern
                        members[memId].skills.forEach(skill => {
                            emptyIdeas[newIdea].skills.push(skill);    
                        });
                        //Erste Interessen speichern
                        members[memId].interests.forEach(interest => {
                            emptyIdeas[newIdea].commonInterests.push([interest,1]);
                            members[memId].interestsCounted = true;    
                        });
                        sorted.push(memId);
                        members[memId].sorted = true;
                    }
                    else if(emptyIdeas[newIdea].team.length < maxMembers){
                        var score = 0;

                        //Score erhöhen wenn User ein gemeinsames Interesse hat 
                        for (const interest of emptyIdeas[newIdea].commonInterests) {
                                
                            if (members[memId].interests.indexOf(interest[0]) >= 0) {
                                score += 1;
                            }
                        }
                        scoreList.push([memId, score]);
                    }   
                });

                //ScoreListe sortieren, höchste Punkte zuerst
                scoreList.sort((a,b) => b[1] - a[1] ); 
                
                //Bis Maximal Anzahl -1 aus Liste in Idee sortieren
                //wenn min = max dann mindest Anzahl
                let emptyIdeaMemberCount =  maxMembers-1;
                if(minMembers === maxMembers) emptyIdeaMemberCount = minMembers;

                scoreList.forEach(member => {

                    if(emptyIdeas[newIdea].team.length < emptyIdeaMemberCount){
                        emptyIdeas[newIdea].team.push(member[0]);
                        members[member[0]].skills.forEach(skill => {
                            if(emptyIdeas[newIdea].skills.indexOf(skill) < 0) emptyIdeas[newIdea].skills.push(skill);    
                        });
                        sorted.push(member[0]);
                        members[member[0]].sorted = true;
                    }
                    
                });

                //Sortierte User aus Liste löschen
                sorted.forEach(memId2 => unsorted = unsorted.filter(memId => memId !== memId2));
            }
            //Letzte Idee Anzahl der Member prüfen, sonst auflösen
            
            if(emptyIdeas[newIdea].team.length < minMembers){

                let missingForMinMembers=  1-(emptyIdeas[newIdea].team.length / minMembers);
                var lastMembers = emptyIdeas[newIdea].team;

                // bei über 20% fehlenden Leuten zur MindestAnzahl = auflösen
                //Sonst beibehalten
                if(missingForMinMembers > 0.25){
                    let missingSkillsList=[];
                    resolve(newIdea, true);

                    // console.log(lastMembers);
                    //Auf Ideen mit freien Plätzen aufteilen
                    //Erst leere Idee durchgehen
                    for (const ideaId in emptyIdeas) {

                        lastMembers.forEach(member => {

                            if(emptyIdeas[ideaId].team.length < maxMembers && !members[member].sorted){
                                emptyIdeas[ideaId].team.push(member); 
                                members[member].sorted = true;
                            } 
                        });
                    }

                    if (Object.keys(ideas).length > 0) {
                        // Dann die vorherigen Ideen durchgehen und missingSkills speichern
                        for (const ideaId in ideas) {
                            missingSkillsList.push([ideaId, ideas[ideaId].missingSkills.length]);
                        } 
                        //Wenn keine freien Plätze, auf die mit dem meisten Missing skills aufteilen
                        missingSkillsList.sort((a,b) => b[1] - a[1]);   
                        // console.log(missingSkillsList);
                        let i =0;

                        lastMembers.forEach(member => {
                            if (!members[member].sorted) {
                                //Wenn Nogo dann nächste Idee 
                                if(ideas[missingSkillsList[i][0]].nogos.indexOf(member) >= 0){
                                    if(i === missingSkillsList.length -1){
                                        i = 0;
                                    }
                                    else{
                                        i+=1; 
                                    } 
                                } 
                                ideas[missingSkillsList[i][0]].team.push(member); 
                                // console.log(member + " zu " + missingSkillsList[i][0]);
                                members[member].sorted = true;
                                i+=1; 
                            }
                        });
                    } else {
                        for (const ideaId in emptyIdeas) {

                            lastMembers.forEach(member => {
    
                                if(!members[member].sorted){
                                    emptyIdeas[ideaId].team.push(member); 
                                    members[member].sorted = true;
                                } 
                            });
                        }    
                    }
                } 
            } 
        }

        function bestRemainingMatch() {
            var isTrue = true;
            while(isTrue) {

                // Ideen bestimmen, deren Skills noch nicht abgedeckt sind
                updateMissingSkills();
                updateCommonInterests();
                calculateSkillValues();

                // Alle Scores von übrigen Usern zu nicht vollen Ideen abspeichern
                var missingScoreList = [];
            
                for (const memId in members) {
                    if (!members[memId].sorted) {
            
                        for (const ideaId in ideas) {
                            if (ideas[ideaId].missingSkills.length > 0 && ideas[ideaId].nogos.indexOf(memId) < 0) {
            
                                var skillScore = 0;
                                var interestScore=0;
                                // Score erhöhen wenn Favorit
                                if (ideas[ideaId].favs.indexOf(memId) >= 0) {
                                    skillScore += 0.5;
                                }
                                // Score erhöhen wenn User einen fehlenden Skill hat
                                for (const skill of ideas[ideaId].missingSkills) {
                                    if (members[memId].skills.indexOf(skill) >= 0) {
                                        skillScore += skillValues[skill];
                                    }
                                }
                                //Score erhöhen wenn User ein gemeinsames Interesse hat 
                                for (const interest of ideas[ideaId].commonInterests) {
                                    
                                    if (members[memId].interests.indexOf(interest[0]) >= 0) {

                                        if(interest[1] > 1) interestScore += interest[1]-1; 
                            
                                    }
                                }
                                if (skillScore+interestScore > 0) {
                                    missingScoreList.push([memId, ideaId, skillScore,interestScore]);
                                }
                            }
                        }
                    }
                }

                // Erst nach Skills dann Interessen sortieren
                missingScoreList.sort((a,b) =>{
                    if(a[2] === b[2]){
            
                        return b[3] - a[3]  
                    }
            
                    return b[2] - a[2]  
                });
                // Wenn es keine Übereinstimmung mehr gibt, die Schleife beenden
                if (!missingScoreList[0] || missingScoreList[0][2] === 0) break;
                

                // console.log("Score-Liste der übrigen User und Ideen:");
                for (array of missingScoreList) {
                    // console.log(array.join(", "));
                }
                
                // User mit höchster Übereinstimmung der entsprechenden Idee zuordnen, wenn diese noch nicht voll ist
                var topIdea = missingScoreList[0][1];
                while (ideas[topIdea].team.length >= maxMembers) {
                    missingScoreList.shift();
                    // console.log("! " + topIdea + " ist schon voll, wird daher ignoriert");
                    if(missingScoreList.length === 0) break;
                    topIdea = missingScoreList[0][1]; 
                }
                if(missingScoreList.length === 0) break;
                var topMember = missingScoreList[0][0];
                ideas[topIdea].team.push(topMember);
                members[topMember].sorted = true;
                // console.log("-> " + topMember + " zu " + topIdea + " hinzugefügt\n");
                // Nach jedem zugeordneten User muss alles neu kalkuliert werden, damit nicht mehrere User aufgrund des selben Skills zugeordnet werden, der dann gar nicht mehr fehlt

            }
        }

        function bestRemainingMatchFinal() {

            // Alle Scores von übrigen Usern zu allen Ideen abspeichern
            var missingScoreList = [];

            for (const memId in members) {
                if (!members[memId].sorted) {

                    for (const ideaId in ideas) {
                        if (ideas[ideaId].nogos.indexOf(memId) < 0) {

                            var score = 0;
                            // Score erhöhen wenn Favorit
                            if (ideas[ideaId].favs.indexOf(memId) >= 0) {
                                score += 5;
                            }
                            // Score erhöhen wenn User einen geforderten Skill hat
                            for (const skill of ideas[ideaId].skills) {
                                if (members[memId].skills.indexOf(skill) >= 0) {
                                    score += 1;
                                }
                            }
                            //Score erhöhen wenn User ein gemeinsames Interesse hat 
                            for (const interest of ideas[ideaId].commonInterests) {
                                    
                                if (members[memId].interests.indexOf(interest[0]) >= 0) {

                                    if(interest[1] > 1) score += interest[1]-1; 
            
                                }
                            }
                            missingScoreList.push([memId, ideaId, score, ideas[ideaId].team.length]);
                        }
                    }
                }
            }

            //Priorisiert das Ideen füllen vor dem Höchsten Score -> führt zu ausgeglicheneren Gruppengrößen
            missingScoreList.sort((a,b) =>{
                if(a[3] === b[3]){

                    return b[2] - a[2]  
                }

                return a[3] - b[3]  
            }); 

            // console.log(missingScoreList);
            
            // User der Reihe nach ihrer passendsten Idee zuordnen, wenn diese noch nicht voll ist
            for (var i = 0; i < missingScoreList.length; i++) {
                const topIdea = missingScoreList[i][1];
                const topMember = missingScoreList[i][0];
                if (ideas[topIdea].team.length < maxMembers && !members[topMember].sorted) {
                    ideas[topIdea].team.push(topMember);
                    members[topMember].sorted = true;
                    // console.log(topMember + " wird " + topIdea + " zugeordnet mit Score " + missingScoreList[i][2]);
                } 
            }
            // console.log("");

            // console.log("Konnten nicht zugeordnet werden:");
            var unsorted =[];
            for (const memId in members) {
                if (!members[memId].sorted) {
                    // console.log(memId);
                    unsorted.push(memId);
                }
            }

            // Wenn es noch nicht zugeordnete Leute gibt
            if(unsorted.length > 0){
                //Bei unter 20% fehlenden Leuten zur MindestAnzahl = neue Idee < minMembers
                //Bei über 20% fehlenden Leuten zur mindest Anzahl = auf alte Ideen aufteilen > maxMembers
                let missingForMinMembers=  1-(unsorted.length / minMembers);

                if(missingForMinMembers <= 0.25){
                    // console.log("Wir brauchen eine neue Idee!");
                    addEmptyIdeas(unsorted);
                }
                else{

                    missingScoreList.sort((a,b) => b[2] - a[2]); 
                    // console.log(missingScoreList);
                    //Hier über maximal anzahl gehen
                    for (var j = 0; j < missingScoreList.length; j++) {
                        const topIdea = missingScoreList[j][1];
                        const topMember = missingScoreList[j][0];
                        if (!members[topMember].sorted) {
                            ideas[topIdea].team.push(topMember);
                            members[topMember].sorted = true;
                            // console.log(topMember + " wird " + topIdea + " zugeordnet mit Score " + missingScoreList[i][2]);
                        } 
                    }
                }
            }

            updateMissingSkills();
            updateCommonInterests();
        }

        function resolve(ideaToResolve, isEmptyIdea){

            // Dafür müssen alle freien Plätze mit freien Usern verglichen werden
            var freeSpaces = 0;
            for (const ideaId in ideas) {
                if (ideaId !== ideaToResolve) {
                    freeSpaces += ((maxMembers+1)- ideas[ideaId].team.length);
                }
            }
            for (const ideaId in emptyIdeas) {
                if (ideaId !== ideaToResolve) {
                    freeSpaces += ((maxMembers+1)- emptyIdeas[ideaId].team.length);
                }
            }
            var freeUsers = 0;
            
            for (const memId in members) {
                if (!members[memId].sorted) freeUsers ++;
            }

            if(isEmptyIdea){
                freeUsers += emptyIdeas[ideaToResolve].team.length;
            }
            else{
                freeUsers += ideas[ideaToResolve].team.length;
            }
            

            if (freeUsers <= freeSpaces) {
                // console.log("… und kann aufgelöst werden\n");
                // In diesem Fall kann die Gruppe aufgelöst werden

                if(isEmptyIdea){
                    for (const memId of emptyIdeas[ideaToResolve].team) {
                        members[memId].sorted = false;
                    }
                    delete emptyIdeas[ideaToResolve];
                }
                else{
                    for (const memId of ideas[ideaToResolve].team) {
                    members[memId].sorted = false;
                    }
                    delete ideas[ideaToResolve];
                }
                
                // MUSS DIE IDEE NOCH AUS ALLEN SCORELISTEN ENTFERNT WERDEN?
            }
        }

        function resolvePartiallyFilledIdeas() {

            var partialIdeas = [];
            for (const ideasId in ideas) {
                if (ideas[ideasId].team.length < minMembers) {
                    partialIdeas.push([ideasId, ideas[ideasId].missingSkills.length,ideas[ideasId].team.length]);
                }
            }

            //Sortiere ungefüllte Ideen erst nach Anzahl der fehlenden Skills, dann bei Gleichstand nach Anzahl der Mitglieder
            partialIdeas.sort((a,b) =>{
                if(a[1] === b[1]){

                    return a[2] - b[2]  
                }
                return b[1] - a[1]  
            }); 

            // console.log(partialIdeas);

            for (var i = 0; i < partialIdeas.length; i++) {
                // console.log(partialIdeas[i][0] + " hat weniger als " + minMembers +" Teilnehmer");   
            
                // Prüfen, ob die unvollständigste Idee aufgelöst werden kann 
                const ideaToResolve = partialIdeas[i][0];
                resolve(ideaToResolve, false); 
            }   
        }

        function resolveIncompleteIdeas() {

            // Ideen, deren Skills nicht abgedeckt sind, in Liste abspeichern zusammen mit Zahl der fehlenden Skills
            var incompleteIdeas = [];
            for (const ideasId in ideas) {
                //Toleranz von 20% bei nicht abgedeckten Skills
                var tolerance = 0.2;
                if (ideas[ideasId].missingSkills.length > 0 && ideas[ideasId].missingSkills.length/ideas[ideasId].skills.length >= tolerance) {
                    incompleteIdeas.push([ideasId, ideas[ideasId].missingSkills.length]);
                }
            }

            //Als erstes die Ideen mit den meisten Fehlenden skills löschen
            incompleteIdeas.sort((a,b) => b[1] - a[1]); 

            for (var i = 0; i < incompleteIdeas.length; i++) {
                // console.log(incompleteIdeas[i][0] + " ist nicht abgedeckt, es fehlen: "+ incompleteIdeas[i][1] +" Skills");   
                // HIER SOLLTEN EVTL NOCH ANDERE FAKTOREN MIT REINSPIELEN? WIE VIELE FAVS? WIE VIEL ABGEDECKTE SKILLS?
            
                // Prüfen, ob die unvollständigste Idee aufgelöst werden kann 
                const ideaToResolve = incompleteIdeas[i][0];

                resolve(ideaToResolve, false); 
            }
        }

        function printList() {
            // var consoleLog = "----------- Team-Liste -----------\n";
            for (const ideaId in ideas) {
                outputIdeaId = "" + ideaId;
                while (outputIdeaId.length < 8) outputIdeaId = outputIdeaId + " ";
                // consoleLog += outputIdeaId + ": ";
                for(const member in ideas[ideaId].team) consoleLog = consoleLog + ideas[ideaId].team[member] + " | "
                // consoleLog += "\n";
            }
            for (const ideaId in emptyIdeas) {
                outputIdeaId = "" + ideaId;
                while (outputIdeaId.length < 8) outputIdeaId = outputIdeaId + " ";
                // consoleLog += outputIdeaId + ": ";
                for(const member in emptyIdeas[ideaId].team) consoleLog = consoleLog + emptyIdeas[ideaId].team[member] + " | "
                // consoleLog += "\n";
            }
            // console.log(consoleLog); 

            // console.log("Noch unsortiert:");
            for (const memId in members) {
                if (!members[memId].sorted) {
                    // console.log(memId);
                }
            }
            // console.log("");
        }
        if (Object.keys(ideas).length > 0) {
            functions.logger.log("0");
            stableMatching();
            // printList();
            functions.logger.log("1");
    
            // Alle optimal zueinanderpassenden übrigen User und Ideen zuordnen
            bestRemainingMatch();
            // printList();
            functions.logger.log("2");
    
            // Ideen die nicht die Mindestanzahl erreicht haben löschen
            resolvePartiallyFilledIdeas();
            // printList();
            functions.logger.log("3");
    
            // Alle optimal zueinanderpassenden übrigen User und Ideen zuordnen
            bestRemainingMatch();
            // printList();
            functions.logger.log("4");
    
            // Prüfen, welche Ideen nicht alle Skills erfüllt haben und diese wenn möglich auflösen
            resolveIncompleteIdeas();
            // printList();
    
            // Jetzt sind alle Ideen-Skills so weit es geht abgedeckt und die übrigen User müssen noch zugeordnet werden 
            // nun wieder auf Basis aller benötigten Skills und der Favoriten (diese haben nun Priorität).
            // es werden wieder Scores für alle User/Ideen gebildet und diese Liste abgearbeitet.
            // console.log("---- Finale Zuordnung ----");
            bestRemainingMatchFinal();
        } else {
            addEmptyIdeas(Object.keys(members));
            updateCommonInterests();
        }
 
        // printList();
        for (const idea in ideas) {
            if (ideas[idea].missingSkills.length > 0) {
                // console.log("Von " + idea + " sind nicht alle Skills abgedeckt!");
                // console.log(ideas[idea].missingSkills + " fehlt");
            }
        }
        // console.log(emptyIdeas);
        functions.logger.log(ideas);
        functions.logger.log(emptyIdeas);

        onSuccess(ideas, emptyIdeas);
    }
    async function notifyUser(id, message) {
        
        const snapshotUserDoc = await db.collection("users").doc(id).get();
        functions.logger.log("notify user " + id);
        if (snapshotUserDoc) {
            const userData = snapshotUserDoc.data();
            if (userData && userData.pushNotificationsAllowed && userData.pushNotificationsAllowed.evaluate && userData.tokens) {
                for (const token of userData.tokens) {
                    notificationsArray.push({"to": token, "title": "Du wurdest eingeteilt!", "body": message});   
                    functions.logger.log("sending notification to " + token);
                }
            }
        }
        return;
    }

    const snapshotCourses = await db.collection("courses").get();
    snapshotCourses.forEach(courseSnap => {        
        const courseData = courseSnap.data();
        if (courseData.date) {
            var date = courseData.date.toDate();
            // Alle Kurse werden abgespeichert, die in der Vergangenheit liegen und noch nicht berechnet sind / werden
            if (currentDate.getTime() > date.getTime() && !courseData.evaluated && !courseData.evaluating) {
                dueCourses[courseSnap.id] = courseData;
            }
        }
    })
    functions.logger.log(dueCourses);

    /* eslint-disable no-await-in-loop */

    for (const id in dueCourses) {
        // Evaluating für den Kurs setzen
        db.collection("courses").doc(id).set({
            evaluating: true
        }, {merge: true});

        const courseIdeasObj = {};
        const courseMembersObj = {};
        const minMembers = dueCourses[id].minMembers;
        const maxMembers = dueCourses[id].maxMembers;
        
        // Alle Ideen des Kurses abrufen
        const snapshotIdeas = await db.collection("courses").doc(id).collection("ideas").get();
        if (snapshotIdeas) {
            snapshotIdeas.forEach(ideaSnap => {
                // Ideen in neuem Objekt speichern
                const ideaData = ideaSnap.data();
                const thisIdeaObj = {};
                thisIdeaObj.title = ideaData.title;
                thisIdeaObj.skills = ideaData.skills;
                thisIdeaObj.missingSkills = ideaData.skills;
                thisIdeaObj.team = [];
                thisIdeaObj.favs = ideaData.favourites;
                thisIdeaObj.nogos = ideaData.nogos;
                thisIdeaObj.commonInterests = [];
                courseIdeasObj[ideaSnap.id] = thisIdeaObj;
            }); 
        } else {
            functions.logger.log("Kurs hat keine Ideen");
        }
        // User-Infos abrufen
        for (const userId of dueCourses[id].members) {
            const userSkills =[];
            const userInterests =[];

            const snapshotUserSkills = await db.collection("users").doc(userId).collection("skills").get();
            const snapshotUserInterests = await db.collection("users").doc(userId).collection("interests").get();

            snapshotUserSkills.forEach(categoryDoc => {
                categoryData = categoryDoc.data();
                for (const skill in categoryData) {
                    if (categoryData[skill]) userSkills.push(skill);
                }
            });
            snapshotUserInterests.forEach(categoryDoc => {
                categoryData = categoryDoc.data();
                for (const interest in categoryData) {
                    if (categoryData[interest]) userInterests.push(interest);
                }
            });

            courseMembersObj[userId] = {
                skills: userSkills,
                interests: userInterests,
                sorted: false
            };
        }

        functions.logger.log(courseIdeasObj);
        functions.logger.log(courseMembersObj);

        proFiFunction(courseMembersObj, courseIdeasObj, minMembers, maxMembers, async (ideas, emptyIdeas) => {
            functions.logger.log("________ EMPTY IDEAS 1 ________");
            functions.logger.log(emptyIdeas);

            // Leere Ideen erstellen
            for (const emptyIdea in emptyIdeas) {
                functions.logger.log("________ EMPTY IDEAS 2 ________");
                functions.logger.log(emptyIdeas[emptyIdea]);

                var interestList = [];
                for (interest of emptyIdeas[emptyIdea].commonInterests) {
                    if (interest[1] > 1) {
                        interestList.push(interest[0]);
                    }
                }
                functions.logger.log(interestList);

                db.collection("courses").doc(id).collection("ideas").add({
                    title: "Team ohne Idee",
                    description: "Diese Idee wurde automatisch erstellt",
                    creator: "ProFi-Algorithmus",
                    interests: interestList,
                    skills: emptyIdeas[emptyIdea].skills,
                    team: emptyIdeas[emptyIdea].team
                }, {merge: true});
            }

            // Teams für bestehende Ideen speichern
            for (const ideaId in ideas) {
                functions.logger.log("________ IDEAS ________");
                functions.logger.log(ideas[ideaId]);

                db.collection("courses").doc(id).collection("ideas").doc(ideaId).set({
                    team: ideas[ideaId].team
                }, {merge: true});
            }

            // Evaluated für den Kurs setzen
            db.collection("courses").doc(id).set({
                evaluating: false,
                evaluated: true
            }, {merge: true});
            
            // User benachrichtigen
            for (const emptyIdea in emptyIdeas) {
                for (const userId of emptyIdeas[emptyIdea].team) {
                    await notifyUser(userId, "Du wurdest einem Team im Kurs " + dueCourses[id].title + " zugeteilt!");
                }
            }
            for (const ideaId in ideas) {
                for (const userId of ideas[ideaId].team) {
                    await notifyUser(userId, "Du wurdest der Idee " + ideas[ideaId].title + " im Kurs " + dueCourses[id].title + " zugeteilt!");
                }
            }

            functions.logger.log("SENDING ALL");
            fetch("https://exp.host/--/api/v2/push/send", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(notificationsArray)
            })        
        });

        
    }
    /* eslint-enable no-await-in-loop */

});
  
// Benachrichtigung bei neuem Kommentarisc
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


// import {members, ideas} from './testData'; // Node cannot use import statement outside a module
const runtimeOpts = {
    timeoutSeconds: 60,
    memory: '512MB'
  }
  
exports.proFiFunction = functions.runWith(runtimeOpts).pubsub.schedule('3 * * * *').timeZone('Europe/Berlin').onRun(async (context) => {

    



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


