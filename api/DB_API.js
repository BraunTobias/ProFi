import * as firebase from 'firebase';
import 'firebase/firestore';
import {skillsList, prefsList} from './AttributesList';

const DB = {

    // Neu anmelden
    signUp: function(name, email, password, onSuccess, onError) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userInfo) => {
            firebase.firestore().collection("users").doc(userInfo.user.uid).set({
                username: name,
                email: email,
                password: password
            })        
            .then(() => {
                this.fillAttributesList();
                console.log("User account created & signed in!");
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
    fillAttributesList: function() {
        const currentUserID = firebase.auth().currentUser.uid;
        for (var category in skillsList) {
            firebase.firestore().collection("users").doc(currentUserID).collection("skills").doc(category).set(skillsList[category], {merge: true});        
        }
        for (var category in prefsList) {
            firebase.firestore().collection("users").doc(currentUserID).collection("prefs").doc(category).set(prefsList[category], {merge: true});        
        }
    },
    // Neue Attribute hinzufügen falls vorhanden
    updateAttributesList: async function(attributeType) {
        const currentUserID = firebase.auth().currentUser.uid;
        const oldAttributesArray = [];
        var newList = prefsList;

        if (attributeType == "skills") {
            newList = {
                "Audio": {
                    "Komposition": false,
                    "Voice Acting": false,
                    "Voice Acting2": false,
                },
                "Test": {
                    "Test1": false,
                    "Test2": false,
                    "Test3": false,
                }
            }
        }

        // Alle Attribut-Namen die der User schon hat in ein Array speichern
        const snapshot = await firebase.firestore().collection("users").doc(currentUserID).collection(attributeType).get();
        snapshot.forEach((doc) => {
            for (var att in doc.data()) {
                oldAttributesArray.push(att);
            }
        });    

        // Prüfen ob das Attribut aus der neuen Liste beim User schon existiert; wenn nicht, dann hinzufügen
        for (var category in newList) {
            console.log("---" + category + "---");
            for (var att in newList[category]) {
                console.log(att);
                if (oldAttributesArray.indexOf(att) < 0) {
                    console.log("Gibts noch nich");
                    firebase.firestore().collection("users").doc(currentUserID).collection(attributeType).doc(category).set({
                        [att]: false
                    }, {merge: true});
                }
            }
        }
    },

    // Einloggen
    logIn: function(email, password, onError) {
        // console.log("Logged in user with email: " + email + " and password: " + password);
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
        onSuccess(userInfo);
    },
    changeUsername: function(newName) {
        const currentUserID = firebase.auth().currentUser.uid;
        firebase.firestore().collection("users").doc(currentUserID).set({
            username: newName
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

    // Neuen Kurs erstellen (Objekt der Klasse course übergeben)
    addCourse: function(course) {
        const currentUserID = firebase.auth().currentUser.uid;

        firebase.firestore().collection("courses").add({
            title: course.title,
            date: course.date,
            minMembers: course.minMembers,
            maxMembers: course.maxMembers,
            members: [currentUserID],
            prospects: [currentUserID],
        });
    },

    // Neue Idee erstellen (Objekt der Klasse idea übergeben)
    addIdea: function(courseId, idea) {
        firebase.firestore().collection("courses").doc(courseId).collection("ideas").add({
            title: idea.title,
            interests: idea.interests,
            skills: idea.skills,
        });
    },
    
    // Gibt Liste mit allen Kursen des aktuellen Users für Home-Seite zurück
    getCourseList: async function(courseListRetrieved) {
        const courseList = [];//{"title": "Kurs", "date": "11.01.2221", "id": "XJYOaVAUvxhAm8lK96lR", "maxMembers": 4, "members": Array}];
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

    // Gibt Eigenschaften eines Kurses zurück (NICHT BENÖTIGT?)
    // getCourseInfo: async function(courseId, onSuccess) {
    //     const courseData = {};
    //     const snapshotDoc = await firebase.firestore().collection("courses").doc(courseId).get();
    //     if (snapshotDoc.data()) {
    //         courseList = snapshotDoc.data();
    //     }
    //     courseListRetrieved(courseList);
    // },

    // Gibt Liste mit allen Ideen für Kurs-Seite zurück
    getIdeasList: async function(courseId, ideasListRetrieved) {
        const ideasList = [];

        const snapshot = await firebase.firestore().collection("courses").doc(courseId).collection("ideas").get();
        snapshot.forEach((doc) => {
            const idea = doc.data();
            idea["id"] = doc.id;
            ideasList.push(idea);
        });    
        
        ideasListRetrieved(ideasList);
    },

    getTitle: async function(onSuccess) {
        const snapshot = await firebase.firestore().collection("courses").doc("courseId").collection("ideas").orderBy("added").get();
        onSuccess("Test");
    },

    // Der User wird zur Interessenten-Liste eines Kurses hinzugefügt bzw. entfernt
    addCourseToList: async function(courseId, onSuccess, onError) {
        var prospectsArray = [];
        const currentUserID = firebase.auth().currentUser.uid;
        var alreadyProspect = false;

        const snapshotDoc = await firebase.firestore().collection("courses").doc(courseId).get();

        // Wenn schon eine Members-Liste existiert (tut sie höchstwahrscheinlich) wird geprüft ob der User schon darin enthalten ist
        if (snapshotDoc.data().prospects) {
            prospectsArray = snapshotDoc.data().prospects;
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
            onSuccess();
        } else {
            onError("User ist schon am Kurs interessiert");
        }
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

            console.log(membersArray);
            onSuccess();
        } else {
            onError("User ist schon im Kurs");
        }
    },
    // Der Kurs wird nicht mehr angezeigt und der User ggf. aus dem Kurs abgemeldet
    removeCourseFromList: async function(courseId, OnSuccess) {
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
    },
    exitCourse: async function(courseId, OnSuccess) {
        const currentUserID = firebase.auth().currentUser.uid;

        const snapshotDoc = await firebase.firestore().collection("courses").doc(courseId).get();

        if (snapshotDoc.data().members) {
            const membersArray = snapshotDoc.data().members;
            const newMembersArray = membersArray.filter(item => item !== currentUserID);

            firebase.firestore().collection("courses").doc(courseId).set({
                members: newMembersArray
            }, {merge: true});        
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

        // HIER NOCH FILTERMÖGLICHKEIT EINBAUEN, UM NUR IN EINER IDEE BENÖTIGTE ANZUZEIGEN
    },

    // Skill bzw. Präferenz markieren bzw. entmarkieren
    toggleAttributeState: async function(attributeType, categoryName, attributeName, onSuccess) {
        const currentUserID = firebase.auth().currentUser.uid;
        const snapshot = await firebase.firestore().collection("users").doc(currentUserID).collection(attributeType).doc(categoryName).get();
        const snapshotData = snapshot.data();
        var newState = !snapshotData[attributeName];

        firebase.firestore().collection("users").doc(currentUserID).collection(attributeType).doc(categoryName).set({
            [attributeName]: newState
        }, {merge: true});
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



    // Profilnamen und -Bild erhalten

    // Alle Mitglieder und Ideen eines Kurses sammeln mitsamt deren Skills und Interessen
}

export default DB;