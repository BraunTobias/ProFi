import * as firebase from 'firebase';
import 'firebase/firestore';
import "firebase/storage";
import * as Permissions from "expo-permissions";
import * as Notifications from 'expo-notifications'

import { compareAsc, format } from 'date-fns';

const DB = {

    
    togglePushNotifications: function(notificationTypeArray, isTrue) {
        const currentUserID = firebase.auth().currentUser.uid;
        for (const type of notificationTypeArray) {
            firebase.firestore().collection("users").doc(currentUserID).set({
                pushNotificationsAllowed: {
                    [type] : isTrue,
                }
            }, {merge: true});
        }
    },

    registerPushNotifications: async function(onSuccess, onError) {
        const currentUserID = firebase.auth().currentUser.uid;

        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            onError();
            return;
        }
        const token = await Notifications.getExpoPushTokenAsync();    

        const snapshotData = await firebase.firestore().collection("users").doc(currentUserID).get();
        if (snapshotData.data().tokens) {
            var tokenList = snapshotData.data().tokens;
            if (tokenList.indexOf(token.data) < 0) {
                tokenList.push(token.data);
                firebase.firestore().collection("users").doc(currentUserID).set({
                    tokens: tokenList,
                }, {merge: true});
            }
            onSuccess();
        }
    },
    removePushNotifications: async function(onSuccess) {
        const currentUserID = firebase.auth().currentUser.uid;

        try {
            const token = await Notifications.getExpoPushTokenAsync();    
        } catch(e) {
            onSuccess();
            return;
        }

        const snapshotData = await firebase.firestore().collection("users").doc(currentUserID).get();
        if (snapshotData.data().tokens) {
            var tokenList = snapshotData.data().tokens;
            tokenList = tokenList.filter(item => item != token.data);
            firebase.firestore().collection("users").doc(currentUserID).set({
                tokens: tokenList,
            }, {merge: true});
            onSuccess();
        }
    },

    // Kopiert von https://stackoverflow.com/questions/48006903/react-unique-id-generation
    guidGenerator: function() {
        var S4 = function() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    },

    // Neu anmelden
    signUp: function(name, email, password, onSuccess, onError) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userInfo) => {
            // console.log("User angelegt");
            this.fillAttributesList(userInfo.user.uid);
            firebase.firestore().collection("users").doc(userInfo.user.uid).set({
                username: name,
                bio: "",
                email: email,
                pushNotificationsAllowed: {
                    "evaluate" : true,
                    "courseChange" : true,
                    "comment" : true,
                    "delete" : true,
                    "attChange" : true,
                },
                tokens: [],
            })        
            .then(() => {
                 onSuccess();
            })
            .catch(error => {
                onError(error);
            });
        })
        .catch(error => {
            onError(error);
        });
    },
    // Listen fürs Profil ausfüllen 
    fillAttributesList: async function(uid) {

        const allSkills = await firebase.firestore().collection("skills").get();
        if (allSkills) {
            allSkills.forEach(categoryDoc => {
                firebase.firestore().collection("users").doc(uid).collection("skills").doc(categoryDoc.id).set(categoryDoc.data());        
            })
        }
        const allInterests = await firebase.firestore().collection("interests").get();
        if (allInterests) {
            allInterests.forEach(categoryDoc => {
                firebase.firestore().collection("users").doc(uid).collection("interests").doc(categoryDoc.id).set(categoryDoc.data());        
            })
        }
    },
    // Einloggen
    logIn: async function(email, password, onError) {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(e => {
            onError(e);
            console.log(e);
            return;
        })
        .then(async () => {
            if (firebase.auth().currentUser) {
                const currentUserID = firebase.auth().currentUser.uid;
                const snapshotDoc = await firebase.firestore().collection("users").doc(currentUserID).get();
                this.registerPushNotifications(() => {}, () => {});
            }
        })
    },
    // Ausloggen
    signOut: function(onSignedOut) {
        this.removePushNotifications(() => {
            firebase.auth().signOut()
            .then(() => {
                onSignedOut();
            });
        });
    },
    // Passwort zurücksetzen
    resetPassword: function(email, onSuccess, onError) {
        firebase.auth().sendPasswordResetEmail(email).then(function() {
            onSuccess();
          }).catch(function(error) {
            onError(error);
          });
    },
    getUserInfo: async function(onSuccess) {
        var userInfo = {};
        const currentUserID = firebase.auth().currentUser.uid;
        const snapshotDoc = await firebase.firestore().collection("users").doc(currentUserID).get();
        if (snapshotDoc.data()) {
            userInfo = snapshotDoc.data();
            userInfo.email = firebase.auth().currentUser.email;
        }
        onSuccess(userInfo, currentUserID);
    },
    getUserInfoById: async function(userId, onSuccess) {
        var userName = "";
        var userImage = "";
        var bio = "";
        var email = "";
        const snapshotDoc = await firebase.firestore().collection("users").doc(userId).get();
        if (snapshotDoc.data()) {
            const userInfo = snapshotDoc.data();
            userName = userInfo.username;
            userImage = userInfo.image;
            bio = userInfo.bio;
            email = userInfo.email;
        }
        onSuccess(userName, userImage, bio, email);
    },
    getCurrentUserId: function() {
        return(firebase.auth().currentUser.uid);
    },
    changeUsername: function(newName, newBio) {
        const currentUserID = firebase.auth().currentUser.uid;
        firebase.firestore().collection("users").doc(currentUserID).set({
            username: newName,
            bio: newBio
        }, {merge: true}); 
    },
    changeEmail: async function(oldEmail, newEmail, password, onSuccess, onError) {
        firebase.auth().signInWithEmailAndPassword(oldEmail, password)
        .then(async () => {
            firebase.auth().currentUser.updateEmail(newEmail)
            .then(() => {
                firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set({
                    email: newEmail
                }, {merge: true}); 
            })
            .then(() => {onSuccess()})
            .catch(e => {
                onError(e);
            });    
        })
        .catch(e => {
            onError(e);
        });
    },
    changePassword: function(email, oldPassword, newPassword, onSuccess, onError) {
        firebase.auth().signInWithEmailAndPassword(email, oldPassword)
        .then(async () => {
            firebase.auth().currentUser.updatePassword(newPassword)
            .then(() => {onSuccess()});
        })
        .catch(e => {
            onError(e);
        })
    },
    testProfileImage: async function(uri) {
        const response = await fetch(uri);
        // console.log("Success");
    },
    
    changeProfileImage: async function(newImageUri) {
        var oldImageName = "";
        const currentUserId = firebase.auth().currentUser.uid;
        const userDoc = await firebase.firestore().collection("users").doc(currentUserId).get();
        if (userDoc.data()) {
            oldImageName = userDoc.data().imageName;
        }
        const response = await fetch(newImageUri);
        // console.log(response);
        const blob = await response.blob();
        const imageName = this.guidGenerator();

        const uploadTask = firebase.storage().ref().child("images/" + imageName).put(blob);
        uploadTask.on("state_changed", (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("snapshot: " + snapshot.state + " " + progress + "% done");
        }, (error) => {
            // Fehler beim Hochladen
            console.log(error);
        }, () => {
            uploadTask.snapshot.ref.getDownloadURL()
            .then((downloadURL) => {
                console.log('File available at', downloadURL);
                firebase.firestore().collection("users").doc(currentUserId).set({
                    image: downloadURL,
                    imageName: imageName
                }, {merge: true}); 
            })
            .then(() => {
                if (oldImageName) {
                    firebase.storage().ref().child("images/" + oldImageName).delete()
                    .then(() => {
                        console.log("Deleted old image");
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                }
            })
        });
    },

    // Neuen Kurs erstellen
    addCourse: function(title, id, date, minMembers, maxMembers, onSuccess, onError) {
        const currentUserID = firebase.auth().currentUser.uid;

        // ID generieren aus Kürzel und Semester
        var semester;
        var year = date.getFullYear() - 2000;
        const month = date.getMonth();
        if (month >= 1 && month < 7 ) {
            // Sommersemester
            semester = "SS" + year;
        } else {
            // Wintersemester
            if (month == 0) year --;
            semester = "WS" + year;
        }
        const courseId = id + semester;

        // Checken ob es die ID schon gibt
        const courseWithId = firebase.firestore().collection("courses").doc(courseId);
        courseWithId.get()
        .then((docSnapshot) => {
            if (docSnapshot.exists) {
                onError("Den Kurs " + id + " gibt es in diesem Semester schon.");
            } else {
                firebase.firestore().collection("courses").doc(courseId).set({
                    creator: currentUserID,
                    title: title,
                    date: date,
                    minMembers: minMembers,
                    maxMembers: maxMembers,
                    prospects: [currentUserID],
                    members: [],
                    semester: semester
                })
                .then(() => {
                    onSuccess();
                });
            }
        });
    },
    // Neuen offenen Kurs erstellen
    addOpenCourse: function(title, id, minMembers, maxMembers, onSuccess, onError) {
        const currentUserID = firebase.auth().currentUser.uid;

        // Checken ob es die ID schon gibt
        const courseWithId = firebase.firestore().collection("openCourses").doc(id);
        courseWithId.get()
        .then((docSnapshot) => {
            if (docSnapshot.exists) {
                onError("Diese ID ist schon vergeben!");
            } else {
                firebase.firestore().collection("openCourses").doc(id).set({
                    creator: currentUserID,
                    title: title,
                    minMembers: minMembers,
                    maxMembers: maxMembers,
                    prospects: [currentUserID],
                })
                .then(() => {
                    onSuccess();
                });
            }
        });
    },
    // Neue Idee erstellen 
    addIdea: function(courseId, title, description, skills, interests, onSuccess) {
        const currentUserID = firebase.auth().currentUser.uid;

        firebase.firestore().collection("courses").doc(courseId).collection("ideas").add({
            title: title,
            description: description,
            interests: interests,
            skills: skills,
            favourites: [],
            nogos: [],
            creator: currentUserID
        })
        .then((docRef) => {
            // Man favorisiert seine neu erstellte Idee automatisch
            this.addPref("favourites", courseId, docRef.id, () => {
                onSuccess();
            })
        });
    },
    addOpenIdea: function(courseId, title, description, skills, interests, onSuccess) {
        const currentUserID = firebase.auth().currentUser.uid;

        firebase.firestore().collection("openCourses").doc(courseId).collection("ideas").add({
            title: title,
            description: description,
            interests: interests,
            skills: skills,
            members: [],
            creator: currentUserID
        }).then(() => {
            onSuccess();
        })
    },
    // Idee bearbeiten
    editIdea: function(courseId, ideaId, courseType, title, description, skills, interests, onSuccess, onError) {
        firebase.firestore().collection(courseType).doc(courseId).collection("ideas").doc(ideaId).set({
            title: title,
            description: description,
            interests: interests,
            skills: skills,
        }, {merge: true})
        .catch((e) => {onError(e)})
        .then(() => {
            onSuccess();
        });
    },
    // Kurs bearbeiten
    editCourse: async function(courseId, title, date, minMembers, maxMembers, onSuccess, onError) {
        const currentUserID = firebase.auth().currentUser.uid;

        const oldCourseSnapshotDoc = await firebase.firestore().collection("courses").doc(courseId).get();
        const oldCourseData = oldCourseSnapshotDoc.data();

        firebase.firestore().collection("courses").doc(courseId).set({
            title: title,
            date: date,
            minMembers: minMembers,
            maxMembers: maxMembers
        }, {merge: true})
        .catch((e) => {onError(e)})
        .then(async () => {
            onSuccess();

            // Alle Mitglieder des Kurses benachrichtigen
            var changeArray = [];
            var notificationsArray = [];
            if (oldCourseData) {
                if (oldCourseData.title != title) changeArray.push("Neuer Titel: " + title);
                if (format(oldCourseData.date.toDate(), "dd.MM.yyyy") != format(date, "dd.MM.yyyy")) changeArray.push("Neues Datum: " + format(date, "dd.MM.yyyy"));
                if (oldCourseData.minMembers != minMembers || oldCourseData.maxMembers != maxMembers) changeArray.push("Neue Gruppengröße: " + minMembers + "–" + maxMembers + " Personen");
                var changeString = changeArray.join("\n");
                for (memberId of oldCourseData.members) {
                    if (memberId != currentUserID && changeString != "") {
                        const userSnapshot = await firebase.firestore().collection("users").doc(memberId).get();
                        const userData = userSnapshot.data();
                        if (userData.pushNotificationsAllowed.courseChange) {
                            for (const token of userData.tokens) {
                                notificationsArray.push({"to": token, "title": ("Kurs "  + title + " geändert"), "body": changeString});   
                            }
                        } 
                    }
                }
                // NotificationsArray verschicken
                fetch("https://exp.host/--/api/v2/push/send", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(notificationsArray)
                });
            }
        });
    },

    // Neuen Kommentar erstellen
    addComment: async function(courseId, ideaId, courseType, commentText, replyTo, onSuccess) {
        var currentUserName = "Anonym";
        var currentUserImage  = "";
        const currentUserID = firebase.auth().currentUser.uid;
        const currentUserDoc = await firebase.firestore().collection("users").doc(currentUserID).get();
        if (currentUserDoc.data()) {
            currentUserName = currentUserDoc.data().username;
            currentUserImage = currentUserDoc.data().image;
        }
        firebase.firestore().collection(courseType).doc(courseId).collection("ideas").doc(ideaId).collection("comments").add({
            name: currentUserName,
            user: currentUserID,
            text: commentText,
            time: firebase.firestore.Timestamp.fromDate(new Date()),
            likes: [],
            replyTo: replyTo
        })
        .then(() => {
            onSuccess();
        });
    },
    
    // Gibt Liste mit allen Kursen des aktuellen Users für Home-Seite zurück
    getCourseList: async function(courseListRetrieved) {
        const courseList = {};
        const currentUserID = firebase.auth().currentUser.uid;
        
        // Neue Version für SectionList
        const coursesSnap = await firebase.firestore().collection("courses").where("prospects", "array-contains", currentUserID).get();
        var count = 1;
        coursesSnap.forEach((doc) => {
            const course = doc.data();
            course["id"] = doc.id;
            course["listKey"] = count;
            count ++;
            if (course.members && course.members.indexOf(currentUserID) >= 0) course.userIsMember = true;
            else course.userIsMember = false;
            if (courseList[course.semester]) courseList[course.semester].push(course);
            else courseList[course.semester] = [course];

            // Kursliste eines Semesters nach Datum sortieren
            courseList[course.semester].sort((a, b) => {
                if (b.date.toDate() > a.date.toDate()) return -1;
                else if (b.date.toDate() < a.date.toDate()) return 1;
                else return 0;
            });
        }); 
        var courseListSections = [];
        // Die Keys sind die Semester
        var keys = Object.keys(courseList);
        // Erst umgekehrt alphabetisch sortieren (W > S)
        keys.sort();
        keys.reverse();
        // Dann nach Zahlen sortieren
        keys.sort((a,b) => (b[2]+b[3]) - (a[2]+a[3]));
        for (var i = 0; i < keys.length; i++) {
            courseListSections.push({
                data: courseList[keys[i]],
                key: keys[i],
            });
        }
        // Offene Kurse hinzufügen
        var openCourseList = [];
        const openCoursesSnap = await firebase.firestore().collection("openCourses").where("prospects", "array-contains", currentUserID).get();
        openCoursesSnap.forEach((doc) => {
            const openCourse = doc.data();
            openCourse["id"] = doc.id;
            openCourse["listKey"] = count;
            count ++;
            openCourseList.push(openCourse);
        }); 
        if (openCourseList.length > 0) {
            courseListSections.push({
                data: openCourseList,
                key: "Freie Projekte",
            });
        }
        courseListRetrieved(courseListSections);
    },
    // Gibt Liste mit allen Ideen für Kurs-Seite zurück
    getIdeasList: async function(courseId, courseType, ideasListRetrieved) {
        const ideasList = [];
        const currentUserID = firebase.auth().currentUser.uid;

        const snapshot = await firebase.firestore().collection(courseType).doc(courseId).collection("ideas").get();
        snapshot.forEach((doc) => {
            const idea = doc.data();
            idea["id"] = doc.id;
            if (idea.members && idea.members.indexOf(currentUserID) >= 0) idea.userIsMember = true;
            if (idea.team && idea.team.indexOf(currentUserID) >= 0) {
                idea["myTeam"] = true;
                ideasList.unshift(idea);
            } else {
                idea["myTeam"] = false;
                ideasList.push(idea);
            }
        });    

        // Skill-Überschneidungen mit User zählen
        var userSkills = [];
        const snapshotUserAtt = await firebase.firestore().collection("users").doc(currentUserID).collection("skills").get();
        if (snapshotUserAtt) {
            snapshotUserAtt.forEach(categoryDoc => {
                const categoryData = categoryDoc.data();
                for (const attribute in categoryData) {
                    if (categoryData[attribute]) userSkills.push(attribute);
                }
            });
        }
        for (const idea of ideasList) {
            var userSkillCount = 0;
            for (const ideaSkill of idea.skills) {
                if (userSkills.indexOf(ideaSkill) >= 0) userSkillCount++;
            }
            idea.userSkillCount = userSkillCount;
        }
        // Liste nach Überschneidungen mit User-Skills sortieren
        ideasList.sort((a, b) => {
            if (a.myTeam) return -1;
            else if (b.myTeam) return 1;
            else return b.userSkillCount - a.userSkillCount;
        });
        
        ideasListRetrieved(ideasList);
    },
    // Gibt Liste mit allen Kommentaren für Idee-Seite zurück
    getCommentsList: async function(courseId, ideaId, courseType, commentsListRetrieved) {
        var commentsList = [];
        const snapshot = await firebase.firestore().collection(courseType).doc(courseId).collection("ideas").doc(ideaId).collection("comments").orderBy("time", "desc").get();
        // Erst normale Kommentare einordnen
        snapshot.forEach((doc) => {
            const comment = doc.data();
            if (comment.text == "Deleted") comment.text = "Gelöschter Kommentar";
            if (!comment.replyTo) {
                comment["id"] = doc.id;
                commentsList.push(comment);
            }
        });
        // Dann die Antworten den Kommentaren zusortieren
        snapshot.forEach((doc) => {
            const comment = doc.data();
            if (comment.replyTo) {
                comment["id"] = doc.id;
                var index = 0;
                //Index des ursprünglichen Kommentars finden und dort einsetzen
                for (const normalComment of commentsList) {
                    if (comment.replyTo == normalComment.id) index = commentsList.indexOf(normalComment);
                }
                commentsList.splice(index + 1, 0, comment);
            }
        });            
        for (var comment of commentsList) {
            await this.getUserInfoById(comment.user, (name, url) => {
                comment.name = name;
                comment.url = url;
            });
        }

        commentsListRetrieved(commentsList);
    },
    likeComment: async function(courseId, ideaId, commentId, courseType, onSuccess) {
        const currentUserID = firebase.auth().currentUser.uid;
        var newLikes = [];

        const snapshotDoc = await firebase.firestore().collection(courseType).doc(courseId).collection("ideas").doc(ideaId).collection("comments").doc(commentId).get();
        if (snapshotDoc.data().likes)               newLikes = snapshotDoc.data().likes;
        if (newLikes.indexOf(currentUserID) < 0)    newLikes.push(currentUserID);
        else                                        newLikes = newLikes.filter(item => item !== currentUserID);
        firebase.firestore().collection(courseType).doc(courseId).collection("ideas").doc(ideaId).collection("comments").doc(commentId).set({
            likes: newLikes
        }, {merge: true}); 
        onSuccess();
    },
    deleteComment: async function(courseId, ideaId, commentId, courseType, replyTo, onSuccess) {
        const currentUserID = firebase.auth().currentUser.uid;

        // Prüfen, ob der Kommentar Antworten hat – dann nicht komplett löschen
        var hasReplies = false;
        var otherReplies = false;
        const snapshot = await firebase.firestore().collection(courseType).doc(courseId).collection("ideas").doc(ideaId).collection("comments").get();
        snapshot.forEach(doc => {
            var commentData = doc.data();
            if (commentData.replyTo == commentId) {
                hasReplies = true;
            }
            if (doc.id != commentId && commentData.replyTo == replyTo) {
                otherReplies = true;
            }
        });
        if (hasReplies) {
            firebase.firestore().collection(courseType).doc(courseId).collection("ideas").doc(ideaId).collection("comments").doc(commentId).set({
                text: "Deleted",
                name: "Deleted",
                likes: []
            }, {merge: true}); 
            onSuccess();
        } else {
            firebase.firestore().collection(courseType).doc(courseId).collection("ideas").doc(ideaId).collection("comments").doc(commentId).delete();
        
            // Prüfen, ob der Kommentar die einzige Antwort auf einen gelöschten Kommentar war – dann diesen auch löschen
            if (replyTo && !otherReplies) {
                const snapshotDoc = await firebase.firestore().collection(courseType).doc(courseId).collection("ideas").doc(ideaId).collection("comments").doc(replyTo).get();
                if (snapshotDoc) {
                    const originalCommentData = snapshotDoc.data();
                    if (originalCommentData && originalCommentData.text == "Deleted") {
                        firebase.firestore().collection(courseType).doc(courseId).collection("ideas").doc(ideaId).collection("comments").doc(replyTo).delete();
                    }
                }
            }
            onSuccess();
        }
    },
    
    // Gibt Eigenschaften eines Kurses zurück
    getCourseData: async function(courseId, onSuccess) {
        var courseData = {};
        const snapshotDoc = await firebase.firestore().collection("courses").doc(courseId).get();
        if (snapshotDoc.data()) {
            courseData = snapshotDoc.data();
            var membersList = [];
            for (var memberId of courseData.members) {
                var member = {userId: memberId};
                await this.getUserInfoById(memberId, (name, url) => {
                    member.userName = name;
                    member.imageUrl = url;
                });
                membersList.push(member);
            }
            courseData.members = membersList;
            await this.getUserInfoById(courseData.creator, (name) => {
                courseData.creatorName = name;
            });
        }
        onSuccess(courseData);
    },
    // Gibt Eigenschaften einer Idee zurück
    getIdeaData: async function(courseId, ideaId, onSuccess) {
        var ideaData = {};
        const snapshotDoc = await firebase.firestore().collection("courses").doc(courseId).collection("ideas").doc(ideaId).get();
        if (snapshotDoc.data()) {
            ideaData = snapshotDoc.data();
            var sortedSkills = snapshotDoc.data().skills;
            sortedSkills.sort();
            ideaData.skills = sortedSkills;

            if (ideaData.team) {
                var teamList = [];
                for (var memberId of ideaData.team) {
                    var member = {userId: memberId};
                    await this.getUserInfoById(memberId, (name, url) => {
                        member.userName = name;
                        member.imageUrl = url;
                    });
                    teamList.push(member);
                }
                ideaData.team = teamList;    
            } else {
                ideaData.team = [];
            }
        }
        onSuccess(ideaData);
    },
    // Gibt Eigenschaften einer Idee zurück
    getOpenIdeaData: async function(courseId, ideaId, onSuccess) {
        var ideaData = {};
        const snapshotDoc = await firebase.firestore().collection("openCourses").doc(courseId).collection("ideas").doc(ideaId).get();
        if (snapshotDoc.data()) {
            ideaData = snapshotDoc.data();
            var sortedSkills = snapshotDoc.data().skills;
            sortedSkills.sort();
            ideaData.skills = sortedSkills;
            var membersList = [];
            for (var memberId of ideaData.members) {
                var member = {userId: memberId};
                await this.getUserInfoById(memberId, (name, url) => {
                    member.userName = name;
                    member.imageUrl = url;
                });
                membersList.push(member);
            }
            ideaData.members = membersList;
        }
        onSuccess(ideaData);
    },

    // Der User wird zur Interessenten-Liste eines Kurses hinzugefügt
    addCourseToList: async function(courseId, onSuccess, onError) {
        var prospectsArray = [];
        const currentUserID = firebase.auth().currentUser.uid;
        var alreadyProspect = false;

        // checken ob es die ID gibt
        var courseWithId = await firebase.firestore().collection("courses").doc(courseId).get();
        var courseType = "courses";
        if (!courseWithId.data()) {
            courseWithId = await firebase.firestore().collection("openCourses").doc(courseId).get();
            courseType = "openCourses";
        }
        if (courseWithId.data()) {
            // Wenn der User noch nicht im Kurs ist, wird er ans Array angehängt und dieses neu hochgeladen.
            prospectsArray = courseWithId.data().prospects;
            if (prospectsArray.indexOf(currentUserID) < 0) {
                prospectsArray.push(currentUserID);
                firebase.firestore().collection(courseType).doc(courseId).set({
                    prospects: prospectsArray
                }, {merge: true}); 

                // Der neue Kurs wird zurückgegeben um sofort angezeigt zu werden
                const addedCourse = courseWithId.data();
                addedCourse["id"] = courseWithId.id;
                if (addedCourse.date) addedCourse.date = format(addedCourse.date.toDate(), "dd.MM.yyyy");
                else addedCourse.date = "Kein Datum";
                onSuccess(addedCourse);
            } else {
                onError("Du hast diesen Kurs schon in deiner Liste.");
            }         
        } else {
            onError("Diese Kurs-ID existiert nicht.");
        }
    },

    // Der User wird zur Members-Liste eines Kurses hinzugefügt bzw. entfernt
    joinCourse: async function(courseId, onSuccess, onError) {
        var membersArray = [];
        const currentUserID = firebase.auth().currentUser.uid;

        const snapshotDoc = await firebase.firestore().collection("courses").doc(courseId).get();

        // Wenn schon eine Members-Liste existiert (tut sie höchstwahrscheinlich) wird geprüft ob der User schon darin enthalten ist
        if (snapshotDoc.data().members) {
            membersArray = snapshotDoc.data().members;
                // Wenn der User noch nicht im Kurs ist, wird er ans Array angehängt und dieses neu hochgeladen.
            if (membersArray.indexOf(currentUserID) < 0) {
                membersArray.push(currentUserID);
                firebase.firestore().collection("courses").doc(courseId).set({
                    members: membersArray
                }, {merge: true}); 
    
                onSuccess();
            } else {
                onError("User ist schon im Kurs");
            }
        }
    },
    // Der User wird zur Members-Liste einer Idee hinzugefügt bzw. entfernt
    joinOpenIdea: async function(courseId, ideaId, onSuccess, onError) {
        var membersArray = [];
        const currentUserID = firebase.auth().currentUser.uid;
        const currentDate = new Date();
        const snapshotDoc = await firebase.firestore().collection("openCourses").doc(courseId).collection("ideas").doc(ideaId).get();
        // Wenn schon eine Members-Liste existiert wird geprüft ob der User schon darin enthalten ist
        if (snapshotDoc.data().members) {
            membersArray = snapshotDoc.data().members;
            // Wenn der User noch nicht im Kurs ist, wird er ans Array angehängt und dieses neu hochgeladen.
            if (membersArray.indexOf(currentUserID) < 0) {
                membersArray.push(currentUserID);
                firebase.firestore().collection("openCourses").doc(courseId).collection("ideas").doc(ideaId).set({
                    members: membersArray,
                    lastUpdated: currentDate
                }, {merge: true}); 
                onSuccess();
            } else {
                onError("User ist schon im Kurs");
            }
        }
    },
    exitOpenIdea: async function(courseId, ideaId, onSuccess) {
        var membersArray = [];
        const currentUserID = firebase.auth().currentUser.uid;

        const snapshotDoc = await firebase.firestore().collection("openCourses").doc(courseId).collection("ideas").doc(ideaId).get();

        if (snapshotDoc.data().members) {
            membersArray = snapshotDoc.data().members;
            const newMembersArray = membersArray.filter(item => item !== currentUserID);
            firebase.firestore().collection("openCourses").doc(courseId).collection("ideas").doc(ideaId).set({
                members: newMembersArray
            }, {merge: true}); 
            onSuccess();
        }
    },
    // Der Kurs wird nicht mehr angezeigt und der User ggf. aus dem Kurs abgemeldet
    removeCourseFromList: async function(courseId, courseType, onSuccess) {
        const currentUserID = firebase.auth().currentUser.uid;

        const snapshotDoc = await firebase.firestore().collection(courseType).doc(courseId).get();

        if (snapshotDoc.data().prospects) {
            const prospectsArray = snapshotDoc.data().prospects;
            const newProspectsArray = prospectsArray.filter(item => item !== currentUserID);

            firebase.firestore().collection(courseType).doc(courseId).set({
                prospects: newProspectsArray
            }, {merge: true});        
        } 
        if (snapshotDoc.data().members) {
            const membersArray = snapshotDoc.data().members;
            const newMembersArray = membersArray.filter(item => item !== currentUserID);

            firebase.firestore().collection(courseType).doc(courseId).set({
                members: newMembersArray
            }, {merge: true});        
        }
        onSuccess();
    },

    exitCourse: async function(courseId, onSuccess) {
        const currentUserID = firebase.auth().currentUser.uid;

        const snapshotDoc = await firebase.firestore().collection("courses").doc(courseId).get();

        if (snapshotDoc.data().members) {
            const membersArray = snapshotDoc.data().members;
            const newMembersArray = membersArray.filter(item => item !== currentUserID);

            firebase.firestore().collection("courses").doc(courseId).set({
                members: newMembersArray
            }, {merge: true});     
            onSuccess();   
        }
    },
    // Sagt ob ein User im Kurs ist
    isMemberOfCourse: async function(courseId, onSuccess) {
        const currentUserID = firebase.auth().currentUser.uid;
        var isMember = false;

        const snapshotDoc = await firebase.firestore().collection("courses").doc(courseId).get();

        if (snapshotDoc.data().members) {
            membersArray = snapshotDoc.data().members;
            membersArray.forEach((memberId) => {
                if (memberId == currentUserID) {
                    isMember = true;
                }
            });
        }
        onSuccess(isMember);
    },

    // Liste aller Skills bzw. Präferenzen einer Kategorie ausgeben (zweidimensionales Array mit Info, ob der User diese hat oder nicht)
    getUserAttributesFromCategory: async function(attributeType, categoryName, onSuccess, onError) {
        const attributesList = [];
        const currentUserID = firebase.auth().currentUser.uid;
        const snapshot = await firebase.firestore().collection("users").doc(currentUserID).collection(attributeType).doc(categoryName).get();
        const snapshotData = snapshot.data();

        if (snapshotData) {            
            // Gibt Liste als (alphabetisch geordnetes) Array zurück
            for (var title in snapshotData) {
                attributesList.push([title, snapshotData[title]]);
            }
            attributesList.sort();
            onSuccess(attributesList);
        } else {
            onError("Kategorie nicht gefunden");
        }
    },

    // Liste aller Skills bzw. Präferenzen ausgeben (kann gefiltert werden)
    getAllAttributes: async function(attributeType, filterList, filterOpenCourse, filterOpenIdea, onSuccess, onError) {
        var attributesList = [];
        var memberAttributes = {};
        var memberImages = {};
        var ideaMembers;
        const currentUserID = firebase.auth().currentUser.uid;
        const snapshot = await firebase.firestore().collection("users").doc(currentUserID).collection(attributeType).get();
        if (filterOpenCourse && filterOpenIdea) {
            const snapshotIdeaDoc = await firebase.firestore().collection("openCourses").doc(filterOpenCourse).collection("ideas").doc(filterOpenIdea).get();
            ideaMembers = snapshotIdeaDoc.data().members;
            // Alle Mitglieder der Idee durchgehen und deren Attribute abspeichern
            for (const member of ideaMembers) {
                memberAttributes[member] = [];
                await this.getUserInfoById(member, (name, imageUrl) => {
                    memberImages[member] = imageUrl;
                })
                const snapshotUserAtt = await firebase.firestore().collection("users").doc(member).collection(attributeType).get();
                if (snapshotUserAtt) {
                    snapshotUserAtt.forEach(categoryDoc => {
                        const categoryData = categoryDoc.data();
                        for (const attribute in categoryData) {
                            if (categoryData[attribute] && filterList[0] && filterList.indexOf(attribute) >= 0) {
                                memberAttributes[member].push(attribute);
                            }
                        }
                    });
                }
            }
        }
        // Neue Version für SectionList
        snapshot.forEach((categoryDoc) => {
            const categoryName = categoryDoc.id;
            var categoryAttributes = [];
            // Attribute innerhalb Kategorie sortieren
            var attributesFromCategory = Object.keys(categoryDoc.data());
            attributesFromCategory.sort();
            for (var attribute of attributesFromCategory) {
                if (filterList[0] && filterList.indexOf(attribute) >= 0) {
                    var attributeObj = {};
                    attributeObj.name = attribute;
                    attributeObj.users = [];
                    // Prüfen ob Mitglieder der Idee (bei offenen Kursen) dieses Attribut haben
                    if (typeof ideaMembers !== 'undefined') {
                        for (const member of ideaMembers) {
                            if (memberAttributes[member].indexOf(attribute) >= 0) {
                                // Wenn der User das Attribut hat, wird er angehängt
                                attributeObj.users.push(memberImages[member]);
                            }
                        }
                    } 
                    categoryAttributes.push(attributeObj);

                }
            }
            if (categoryAttributes.length > 0) {
                attributesList.push({
                    data: categoryAttributes,
                    key: categoryName,
                });
            }
        });  
        onSuccess(attributesList);
    },
    
    getAttributesFromUser: async function(userId, onSuccess) {
        const attributesList = [];
        const skillSnapshot = await firebase.firestore().collection("users").doc(userId).collection("skills").get();
        const interestSnapshot = await firebase.firestore().collection("users").doc(userId).collection("interests").get();

        skillSnapshot.forEach((categoryDoc) => {
            for (const title in categoryDoc.data()) {
                if (categoryDoc.data()[title] == true) {
                    attributesList.push(title);
                }
            }
        });    
        interestSnapshot.forEach((categoryDoc) => {
            for (const title in categoryDoc.data()) {
                if (categoryDoc.data()[title] == true) {
                    attributesList.push(title);
                }
            }
        });    
        onSuccess(attributesList);
    },

    // Liste aller Skills bzw. Präferenzen einer Kategorie ausgeben (OHNE Info, ob der User diese hat oder nicht)
    getNeutralAttributesFromCategory: async function(attributeType, categoryName, onSuccess, onError) {
        const attributesList = [];
        const currentUserID = firebase.auth().currentUser.uid;
        const snapshot = await firebase.firestore().collection("users").doc(currentUserID).collection(attributeType).doc(categoryName).get();
        const snapshotData = snapshot.data();

        if (snapshotData) {            
            // Gibt Liste als (alphabetisch geordnetes) Array zurück
            for (var title in snapshotData) {
                // console.log("title: " + title);
                attributesList.push(title);
            }
            attributesList.sort();
            onSuccess(attributesList);
        } else {
            onError("Kategorie nicht gefunden");
        }
    },

    // Liste aller Katgorien von Skills oder Prefs
    getCategoriesFromAttribute: async function(attributeType, onSuccess) {
        const categoryList = [];
        const currentUserID = firebase.auth().currentUser.uid;
        const snapshot = await firebase.firestore().collection("users").doc(currentUserID).collection(attributeType).get();

        snapshot.forEach((doc) => {
            categoryList.push(doc.id);
        });    
        onSuccess(categoryList);
    },

    userAttributesToString: async function(onSuccess) {
        var skillString = "Bitte Fähigkeiten eintragen …";
        const skillArray = [];
        var interestString = "Bitte Interessen eintragen …";
        const interestArray = [];
        const currentUserID = firebase.auth().currentUser.uid;
   
        const snapshotSkills = await firebase.firestore().collection("users").doc(currentUserID).collection("skills").get();
        snapshotSkills.forEach((doc) => {
            const data = doc.data();
            for (var key in data) {
                if (data[key]) {
                    skillArray.push(key);
                }
            }
        });            
        const snapshotInterests = await firebase.firestore().collection("users").doc(currentUserID).collection("interests").get();
        snapshotInterests.forEach((doc) => {
            const data = doc.data();
            for (var key in data) {
                if (data[key]) {
                    interestArray.push(key);
                }
            }
        });            
        skillArray.sort();
        if (skillArray.length > 0) skillString = skillArray.join(", ");
        interestArray.sort();
        if (interestArray.length > 0) interestString = interestArray.join(", ");
    
        onSuccess(skillString, interestString);
    },

    // Skill bzw. Präferenz markieren bzw. entmarkieren
    toggleAttributeState: async function(attributeType, categoryName, attributeName, onSuccess) {
        const currentUserID = firebase.auth().currentUser.uid;
        const snapshot = await firebase.firestore().collection("users").doc(currentUserID).collection(attributeType).doc(categoryName).get();
        
        const snapshotData = snapshot.data();
        if (typeof snapshotData[attributeName] !== 'undefined') {
            var newState = !snapshotData[attributeName];

            firebase.firestore().collection("users").doc(currentUserID).collection(attributeType).doc(categoryName).set({
                [attributeName]: newState
            }, {merge: true});
    
        }
    },

    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    // Eine Idee innerhalb eines Kurses wird als Favorit / No-Go hinzuzgefügt und bei den anderen Ideen entfernt
    addPref: async function(prefType, courseId, ideaId, onSuccess) {
        if (prefType === "favourites" || prefType === "nogos") {
            var oppositePrefType;
            if (prefType === "favourites") {
                oppositePrefType = "nogos";
            } else {
                oppositePrefType = "favourites";
            }
            const currentUserID = firebase.auth().currentUser.uid;
            var prefArray = [];
    
            // Der alte Favorit des Users in diesem Kurs wird entfernt
            await this.deletePref(prefType, courseId, () => {});
            
            const snapshotDoc = await firebase.firestore().collection("courses").doc(courseId).collection("ideas").doc(ideaId).get();
            
            // Der gegensätzliche Pref-Type wird ggf. entfernt
            if (snapshotDoc.data()[oppositePrefType]) {
                const newOppositePrefArray = snapshotDoc.data()[oppositePrefType].filter(item => item !== currentUserID);
                firebase.firestore().collection("courses").doc(courseId).collection("ideas").doc(ideaId).set({
                    [oppositePrefType]: newOppositePrefArray
                }, {merge: true}); 
            }
            
            if (snapshotDoc.data()[prefType]) {
                prefArray = snapshotDoc.data()[prefType];
            }
            prefArray.push(currentUserID);
            firebase.firestore().collection("courses").doc(courseId).collection("ideas").doc(ideaId).set({
                [prefType]: prefArray
            }, {merge: true}); 
    
            // console.log(prefArray);
            onSuccess();            
        } else {
            console.log("Kein gültiger Pref-Typ");
        }
    },
    
    deletePref: async function(prefType, courseId, onSuccess) {
        if (prefType === "favourites" || prefType === "nogos") {
            const currentUserID = firebase.auth().currentUser.uid;

            const query = await firebase.firestore().collection("courses").doc(courseId).collection("ideas").where(prefType, "array-contains", currentUserID).get();
            query.forEach((doc) => {
                if (doc.data()[prefType]) {
                    const newPrefArray = doc.data()[prefType].filter(item => item !== currentUserID);
                    const ideaId = doc.id;
                    // console.log("idea id: " + ideaId);
                    firebase.firestore().collection("courses").doc(courseId).collection("ideas").doc(ideaId).set({
                        [prefType]: newPrefArray,
                    }, {merge: true}); 
                }
            });
            onSuccess();
        } else {
            console.log("Kein gültiger Pref-Typ");
        }
    },

    // Gibt zurück, welche Idee in diesem Kurs als Favorit bzw. No-Go markiert ist 
    prefIdeaTitle: async function(prefType, courseId, onSuccess) {
        const currentUserID = firebase.auth().currentUser.uid;
        const query = await firebase.firestore().collection("courses").doc(courseId).collection("ideas").where(prefType, "array-contains", currentUserID).get();
        query.forEach((doc) => {
            const ideaId = doc.id
            onSuccess(doc.data().title);
        });
    },


    // Funktion zum automatischen Erstellen eines Test-Kurses
    createTestCourse: async function() {
        const allUserIds = [];
        const snapshot = await firebase.firestore().collection("users").get();
        snapshot.forEach((userDoc) => {
            // const idea = userDoc.data();
            // idea["id"] = userDoc.id;
            allUserIds.push(userDoc.id);
        });    
        // console.log(allUserIds);

        const randomCreatorId = Math.floor((Math.random() * (allUserIds.length - 1)));
        firebase.firestore().collection("courses").doc("TEST").set({
            title: "Test-Kurs",
            date: "31.12.2020",
            minMembers: 2,
            maxMembers: 4,
            creator: "jO01nq0aMeMTAmTxgT7PY9lErqt1",
            prospects: [allUserIds[0], allUserIds[1], allUserIds[2], allUserIds[3], allUserIds[4], allUserIds[5]],
            members: [allUserIds[0], allUserIds[1], allUserIds[2], allUserIds[3], allUserIds[4], allUserIds[5]]
        })
        .then(() => {
            var randomCreatorId = Math.floor((Math.random() * (allUserIds.length - 1)));
            firebase.firestore().collection("courses").doc("TEST").collection("ideas").add({
                title: "Show-Idee",
                description: "Show-Idee Beschreibungstext",
                skills: ["Bühnenbild", "Rätsel Design", "Lichtwirkung", "Komposition"],
                favourites: [allUserIds[0], allUserIds[1]],
                nogos: [allUserIds[5]],
                creator: allUserIds[randomCreatorId]
            })
            randomCreatorId = Math.floor((Math.random() * (allUserIds.length - 1)));
            firebase.firestore().collection("courses").doc("TEST").collection("ideas").add({
                title: "Buch-Idee",
                description: "Buch-Idee Beschreibungstext",
                skills: ["Fotografie", "Illustration", "Texten", "Storytelling"],
                favourites: [allUserIds[2], allUserIds[3]],
                nogos: [allUserIds[4]],
                creator: allUserIds[randomCreatorId]
            })
            randomCreatorId = Math.floor((Math.random() * (allUserIds.length - 1)));
            firebase.firestore().collection("courses").doc("TEST").collection("ideas").add({
                title: "Programmier-Idee",
                description: "Programmier-Idee Beschreibungstext",
                skills: ["HTML", "CSS", "Git", "Smart Home"],
                favourites: [allUserIds[4], allUserIds[5]],
                nogos: [allUserIds[3]],
                creator: allUserIds[randomCreatorId]
            })
        });
    },

    // Alle Mitglieder und Ideen eines Kurses sammeln mitsamt deren Skills und Interessen
    collectCourseData: async function(courseId, onSuccess, onError) {
        var canEvaluate = true;
        var courseData = {};
        var ideaIds = [];
        var ideaSkills = [];
        var ideaFavs = [];
        var ideaNogos = [];
        var memberIds = [];
        var memberSkills = [];

        // Eigenschaften der Ideen abrufen
        const snapshot = await firebase.firestore().collection("courses").doc(courseId).collection("ideas").get();
        snapshot.forEach((ideaDoc) => {
            ideaIds.push(ideaDoc.id);
            if (!ideaDoc.data().skills) {
                canEvaluate = false;
                onError("Keine Idee vorhanden");
            }
            if (ideaDoc.data().team) {
                canEvaluate = false;
                onError("Teams wurden schon berechnet");
            }
            ideaSkills.push(ideaDoc.data().skills);
            ideaFavs.push(ideaDoc.data().favourites);
            ideaNogos.push(ideaDoc.data().nogos);
        });    

        // Eigenschaften der Mitglieder abrufen
        const snapshotDoc = await firebase.firestore().collection("courses").doc(courseId).get();

        if (snapshotDoc.data()) {
            memberIds = snapshotDoc.data().members;
            courseData["minMembers"] = snapshotDoc.data().minMembers;
            courseData["maxMembers"]= snapshotDoc.data().maxMembers;
        }
        for (var i = 0; i < memberIds.length; i++) {
            await this.getAttributesFromUser(memberIds[i], (attList) => {
                memberSkills.push(attList);
            })
        }
        const allData = {
            course: courseData,
            ideaIds: ideaIds,
            ideaSkills: ideaSkills,
            ideaFavs: ideaFavs,
            ideaNogos: ideaNogos,
            memberIds: memberIds,
            memberSkills: memberSkills,
        }
        if (canEvaluate) {
            onSuccess(allData);
        } 
    },

    // Nach der Berechnung werden die User den Ideen zugeordnet
    saveIdeaTeams: function(courseId, ideaIds, teams, onSuccess) {
        for (var i = 0; i < teams.length; i++) {
            if (teams[i].length > 0) {
                if (ideaIds[i] && ideaIds[i] != []) {
                    firebase.firestore().collection("courses").doc(courseId).collection("ideas").doc(ideaIds[i]).set({
                        team: teams[i],
                        // favourites: [],
                        // nogos: [],
                    }, {merge: true}); 
                } else {
                    firebase.firestore().collection("courses").doc(courseId).collection("ideas").doc("Idee" + i).set({
                        team: teams[i],
                        title: "Zusatz-Gruppe",
                        description: "Noch keine Idee vorhanden",
                    }, {merge: true}); 
                }
            }
        }
        firebase.firestore().collection("courses").doc(courseId).set({
            evaluated: true,
        }, {merge: true}); 
        onSuccess();
    },
    setOpenCourseTeam: async function(courseId, ideaId, onSuccess) {
        const currentDate = new Date();
        const snapshotDoc = await firebase.firestore().collection("openCourses").doc(courseId).collection("ideas").doc(ideaId).get()
        if (snapshotDoc) {
            const currentMembers = snapshotDoc.data().members;
            if (!snapshotDoc.data().team) {
                firebase.firestore().collection("openCourses").doc(courseId).collection("ideas").doc(ideaId).set({
                    team: currentMembers,
                    teamDate: currentDate,
                }, {merge: true}); 
                onSuccess();
            }
        }
    }


}

export default DB;