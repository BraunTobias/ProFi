import * as firebase from 'firebase';
import 'firebase/firestore';
import "firebase/storage";
import {skillsList} from '../data/AttributesList';

const DB = {
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
            console.log("User angelegt");
            this.fillAttributesList(userInfo.user.uid);
            firebase.firestore().collection("users").doc(userInfo.user.uid).set({
                username: name,
                bio: "",
                email: email,
                password: password
            })        
            .then(() => {
                console.log("User account created & signed in!");
                console.log("skills eingesetzt");
    
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
    fillAttributesList: function(uid) {
        for (var category in skillsList) {
            console.log("SKILLS: " + category + skillsList[category]);
            firebase.firestore().collection("users").doc(uid).collection("skills").doc(category).set(skillsList[category], {merge: true});        
        }

    },
    // Neue Attribute hinzufügen falls vorhanden
    updateAttributesList: async function() {
        const currentUserID = firebase.auth().currentUser.uid;
        var oldAttributesArray = [];

        // Alle Attribut-Namen die der User schon hat in ein Array speichern
        const snapshot = await firebase.firestore().collection("users").doc(currentUserID).collection("skills").get();
        snapshot.forEach((doc) => {
            for (var att in doc.data()) {
                oldAttributesArray.push(att);
            }
        });    

        // Prüfen ob das Attribut aus der neuen Liste beim User schon existiert; wenn nicht, dann hinzufügen
        for (var category in skillsList) {
            console.log("---" + category + "---");
            for (var att in skillsList[category]) {
                console.log(att);
                const index = oldAttributesArray.indexOf(att);
                if (index < 0) {
                    console.log("Gibts noch nich");
                    firebase.firestore().collection("users").doc(currentUserID).collection("skills").doc(category).set({
                        [att]: false
                    }, {merge: true});
                } else {
                    // Alle verwendeten Attribute als der alten Liste entfernen. Nur die die nicht mehr benötigt werden bleiben übrig
                    oldAttributesArray.splice(index, 1);
                }
            }
        }
        // Skills vom User löschen, die nicht mehr in der SkillsList sind
        for (var oldAtt in oldAttributesArray) {
            console.log("Wird gelöscht: " + oldAttributesArray);
            for (var category in skillsList) {
                firebase.firestore().collection("users").doc(currentUserID).collection("skills").doc(category).update({
                    [oldAttributesArray[oldAtt]]: firebase.firestore.FieldValue.delete()
                });
            }
        }
        
    },

    // Einloggen
    logIn: function(email, password, onError) {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(e => {
            onError(e);
        })
    },
    // Ausloggen
    signOut: function(onSignedOut) {
        firebase.auth().signOut()
        .then(() => {
            console.log("Signed Out");
            onSignedOut();
        });
    },
    getUserInfo: async function(onSuccess) {
        var userInfo = {};
        const currentUserID = firebase.auth().currentUser.uid;
        const snapshotDoc = await firebase.firestore().collection("users").doc(currentUserID).get();
        if (snapshotDoc.data()) {
            userInfo = snapshotDoc.data();
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
    changeEmail: function(newEmail, onError) {
        var oldEmail = "";
        const currentUser = firebase.auth().currentUser;
        currentUser.updateEmail(newEmail)
        .then(() => {
            firebase.firestore().collection("users").doc(currentUser.uid).set({
                email: newEmail
            }, {merge: true}); 
        })
        .catch(async (error) => {
            const snapshotDoc = await firebase.firestore().collection("users").doc(currentUser.uid).get();
            if (snapshotDoc.data()) {
                oldEmail = snapshotDoc.data().email;
            }
            onError(error, oldEmail);
        });
    },
    changePassword: function(newPassword, onError) {
        var oldPassword = "";
        const currentUser = firebase.auth().currentUser;
        currentUser.updatePassword(newPassword)
        .then(() => {
            firebase.firestore().collection("users").doc(currentUser.uid).set({
                password: newPassword
            }, {merge: true}); 
        })
        .catch(async (error) => {
            const snapshotDoc = await firebase.firestore().collection("users").doc(currentUser.uid).get();
            if (snapshotDoc.data()) {
                oldPassword = snapshotDoc.data().password;
            }
            onError(error, oldPassword);
        });
    },
    testProfileImage: async function(uri) {
        const response = await fetch(uri);
        console.log("Success");
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

    // Neuen Kurs erstellen (Objekt der Klasse course übergeben)
    addCourse: function(title, id, date, minMembers, maxMembers, onSuccess, onError) {
        const currentUserID = firebase.auth().currentUser.uid;

        // Checken ob es die ID schon gibt
        const courseWithId = firebase.firestore().collection("courses").doc(id)
        courseWithId.get()
        .then((docSnapshot) => {
            if (docSnapshot.exists) {
                onError("Diese ID ist schon vergeben!");
            } else {
                firebase.firestore().collection("courses").doc(id).set({
                    founder: currentUserID,
                    title: title,
                    date: date,
                    minMembers: minMembers,
                    maxMembers: maxMembers,
                    prospects: [currentUserID],
                    members: []
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
    // Neuen Kommentar erstellen
    addComment: async function(courseId, ideaId, commentText, onSuccess) {
        var currentUserName = "Anonym";
        var currentUserImage  = "";
        const currentUserID = firebase.auth().currentUser.uid;
        const currentUserDoc = await firebase.firestore().collection("users").doc(currentUserID).get();
        if (currentUserDoc.data()) {
            currentUserName = currentUserDoc.data().username;
            currentUserImage = currentUserDoc.data().image;
        }
        firebase.firestore().collection("courses").doc(courseId).collection("ideas").doc(ideaId).collection("comments").add({
            name: currentUserName,
            image: currentUserImage,
            user: currentUserID,
            text: commentText,
            time: firebase.firestore.Timestamp.fromDate(new Date()),
        })
        .then(() => {
            onSuccess();
        });
    },
    
    // Gibt Liste mit allen Kursen des aktuellen Users für Home-Seite zurück
    getCourseList: async function(courseListRetrieved) {
        const courseList = [];
        const currentUserID = firebase.auth().currentUser.uid;
        
        // Liste aller Kurse nach User-ID filtern und abspeichern
        const query = await firebase.firestore().collection("courses").where("prospects", "array-contains", currentUserID).get();
        query.forEach((doc) => {
            const course = doc.data();
            course["id"] = doc.id;
            courseList.push(course);
            // console.log(doc.id);
        });
        courseListRetrieved(courseList);
    },
    // Gibt Liste mit allen Ideen für Kurs-Seite zurück
    getIdeasList: async function(courseId, ideasListRetrieved) {
        const ideasList = [];

        const snapshot = await firebase.firestore().collection("courses").doc(courseId).collection("ideas").get();
        snapshot.forEach((doc) => {
            const idea = doc.data();
            idea["id"] = doc.id;
            if (idea.team && idea.team.indexOf(firebase.auth().currentUser.uid) >= 0) {
                idea["myTeam"] = true;
            } else {
                idea["myTeam"] = false;
            }
            ideasList.push(idea);
        });    
        
        ideasListRetrieved(ideasList);
    },
    // Gibt Liste mit allen Kommentaren für Idee-Seite zurück
    getCommentsList: async function(courseId, ideaId, commentsListRetrieved) {
        const commentsList = [];

        const snapshot = await firebase.firestore().collection("courses").doc(courseId).collection("ideas").doc(ideaId).collection("comments").orderBy("time", "desc").get();
        snapshot.forEach((doc) => {
            const comment = doc.data();
            comment["id"] = doc.id;
            commentsList.push(comment);
            console.log("He")
        });            
        commentsListRetrieved(commentsList);
    },
    
    // Gibt Eigenschaften eines Kurses zurück
    getCourseData: async function(courseId, onSuccess) {
        var courseData = {};
        const snapshotDoc = await firebase.firestore().collection("courses").doc(courseId).get();
        if (snapshotDoc.data()) {
            courseData = snapshotDoc.data();
        }
        onSuccess(courseData);
    },
    // Gibt Eigenschaften einer Idee zurück
    getIdeaData: async function(courseId, ideaId, onSuccess) {
        var ideaData = {};
        const snapshotDoc = await firebase.firestore().collection("courses").doc(courseId).collection("ideas").doc(ideaId).get();
        if (snapshotDoc.data()) {
            ideaData = snapshotDoc.data();
        }
        onSuccess(ideaData);
    },

    // Der User wird zur Interessenten-Liste eines Kurses hinzugefügt bzw. entfernt
    addCourseToList: async function(courseId, onSuccess, onError) {
        var prospectsArray = [];
        const currentUserID = firebase.auth().currentUser.uid;
        var alreadyProspect = false;

        // checken ob es die ID gibt
        const courseWithId = firebase.firestore().collection("courses").doc(courseId)
        courseWithId.get()
        .then((docSnapshot) => {
            if (docSnapshot.exists) {
                if (docSnapshot.data().prospects) {
                    prospectsArray = docSnapshot.data().prospects;
                    prospectsArray.forEach((prospectId) => {
                        if (prospectId == currentUserID) {
                            alreadyProspect = true;
                        }
                    });
                }
                // Wenn der User noch nicht im Kurs ist, wird er ans Array angehängt und dieses neu hochgeladen.
                if (!alreadyProspect) {
                    prospectsArray.push(currentUserID);
                    firebase.firestore().collection("courses").doc(courseId).set({
                        prospects: prospectsArray
                    }, {merge: true}); 
        
                    console.log(prospectsArray);

                    // Der neue Kurs wird zurückgegeben um sofort angezeigt zu werden
                    const addedCourse = docSnapshot.data();
                    addedCourse["id"] = docSnapshot.id;
                    onSuccess(addedCourse);
                } else {
                    onError("User ist schon am Kurs interessiert");
                }         
            } else {
                onError("Diese ID existiert nicht.");
            }
        });
    },

    // Der User wird zur Members-Liste eines Kurses hinzugefügt bzw. entfernt
    joinCourse: async function(courseId, onSuccess, onError) {
        var membersArray = [];
        const currentUserID = firebase.auth().currentUser.uid;
        var alreadyMember = false;

        const snapshotDoc = await firebase.firestore().collection("courses").doc(courseId).get();

        // Wenn schon eine Members-Liste existiert (tut sie höchstwahrscheinlich) wird geprüft ob der User schon darin enthalten ist
        if (snapshotDoc.data().members) {
            membersArray = snapshotDoc.data().members;
            membersArray.forEach((memberId) => {
                if (memberId == currentUserID) {
                    alreadyMember = true;
                }
            });
        }
        // Wenn der User noch nicht im Kurs ist, wird er ans Array angehängt und dieses neu hochgeladen.
        if (!alreadyMember) {
            membersArray.push(currentUserID);
            firebase.firestore().collection("courses").doc(courseId).set({
                members: membersArray
            }, {merge: true}); 

            onSuccess();
        } else {
            onError("User ist schon im Kurs");
        }
    },
    // Der Kurs wird nicht mehr angezeigt und der User ggf. aus dem Kurs abgemeldet
    removeCourseFromList: async function(courseId, onSuccess) {
        const currentUserID = firebase.auth().currentUser.uid;

        const snapshotDoc = await firebase.firestore().collection("courses").doc(courseId).get();

        if (snapshotDoc.data().prospects) {
            const prospectsArray = snapshotDoc.data().prospects;
            const newProspectsArray = prospectsArray.filter(item => item !== currentUserID);

            firebase.firestore().collection("courses").doc(courseId).set({
                prospects: newProspectsArray
            }, {merge: true});        
        } 
        if (snapshotDoc.data().members) {
            const membersArray = snapshotDoc.data().members;
            const newMembersArray = membersArray.filter(item => item !== currentUserID);

            firebase.firestore().collection("courses").doc(courseId).set({
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
    getUserAttributesFromCategory: async function(attributeType, categoryName, filterList, onSuccess, onError) {
        const attributesList = [];
        const currentUserID = firebase.auth().currentUser.uid;
        const snapshot = await firebase.firestore().collection("users").doc(currentUserID).collection(attributeType).doc(categoryName).get();
        const snapshotData = snapshot.data();

        if (snapshotData) {            
            // Gibt Liste als (alphabetisch geordnetes) Array zurück
            for (var title in snapshotData) {
                if (filterList.length == 0 || filterList.indexOf(title) >= 0) {
                    attributesList.push([title, snapshotData[title]]);
                }
            }
            attributesList.sort();
            onSuccess(attributesList);
        } else {
            onError("Kategorie nicht gefunden");
        }
    },

    // Liste aller Skills bzw. Präferenzen ausgeben (kann gefiltert werden)
    getAllAttributes: async function(attributeType, filterList, onSuccess, onError) {
        const attributesList = [];
        const currentUserID = firebase.auth().currentUser.uid;

        const snapshot = await firebase.firestore().collection("users").doc(currentUserID).collection(attributeType).get();

        snapshot.forEach((categoryDoc) => {
            const tempArray = [categoryDoc.id];
            const tempAtt = [];
            for (const title in categoryDoc.data()) {
                if (filterList.length == 0 || filterList.indexOf(title) >= 0) {
                    console.log("title: " + title);
                    tempAtt.push(title);
                }
            }
            if (tempAtt.length > 0) {
                const tempAttString = tempAtt.join("\n");
                tempArray.push(tempAttString);
                attributesList.push(tempArray);
            }
        });    
        onSuccess(attributesList);
    },

    getAttributesFromUser: async function(userId, onSuccess) {
        const attributesList = [];
        const snapshot = await firebase.firestore().collection("users").doc(userId).collection("skills").get();

        snapshot.forEach((categoryDoc) => {
            const tempArray = [categoryDoc.id];
            const tempAtt = [];
            for (const title in categoryDoc.data()) {
                if (categoryDoc.data()[title] == true) {
                    attributesList.push(title);
                }
            }
        });    
        onSuccess(attributesList);
    },

    // Liste aller Skills bzw. Präferenzen einer Kategorie ausgeben (OHNE Info, ob der User diese hat oder nicht)
    getNeutralAttributesFromCategory: async function(attributeType, categoryName, filterList, onSuccess, onError) {
        const attributesList = [];
        const currentUserID = firebase.auth().currentUser.uid;
        const snapshot = await firebase.firestore().collection("users").doc(currentUserID).collection(attributeType).doc(categoryName).get();
        const snapshotData = snapshot.data();

        if (snapshotData) {            
            // Gibt Liste als (alphabetisch geordnetes) Array zurück
            for (var title in snapshotData) {
                console.log("title: " + title);
                if (filterList.length == 0 || filterList.indexOf(title) >= 0) {
                    attributesList.push(title);
                }
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
        var skillString = "Bitte Fähigkeiten eintragen";
        const skillArray = [];
        var prefString = "Bitte Präferenzen eintragen";
        const prefArray = [];
        var prefCount = 0;
        const currentUserID = firebase.auth().currentUser.uid;
   
        const snapshotSkills = await firebase.firestore().collection("users").doc(currentUserID).collection("skills").get();
        snapshotSkills.forEach((doc) => {
            const data = doc.data();
            for (var key in data) {
                if (data[key]) {
                    skillArray.push(key);
                }
            }
            skillArray.sort();
            skillString = skillArray.join(", ");
            console.log(skillString);
        });            
        const snapshotPrefs = await firebase.firestore().collection("users").doc(currentUserID).collection("prefs").get();
        snapshotPrefs.forEach((doc) => {
            const data = doc.data();
            for (var key in data) {
                if (data[key]) {
                    prefCount += key.length;
                        if (prefCount > 70) {
                            break;
                        }
                    prefArray.push(key);
                }
            }
            prefArray.sort();
            prefString = prefArray.join(", ") + " …";
            console.log(prefString);
        });            

        
        onSuccess(skillString, prefString);
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
    
        } else {
            console.log("nee")
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
    
            console.log(prefArray);
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
                    console.log("idea id: " + ideaId);
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
        console.log(allUserIds);

        const randomCreatorId = Math.floor((Math.random() * (allUserIds.length - 1)));
        firebase.firestore().collection("courses").doc("TEST").set({
            title: "Test-Kurs",
            date: "31.12.2020",
            minMembers: 2,
            maxMembers: 4,
            founder: "jO01nq0aMeMTAmTxgT7PY9lErqt1",
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
                if (ideaIds[i]) {
                    firebase.firestore().collection("courses").doc(courseId).collection("ideas").doc(ideaIds[i]).set({
                        team: teams[i],
                        favourites: null,
                        nogos: null,
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


}

export default DB;