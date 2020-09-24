// Daten

const skillValue = 1;
const favValue = 5.5;

var members = {
        "uid1": {
            skills : ["skill1", "skill2", "skill3"],
        },
        "uid2": {
            skills : ["skill4", "skill5", "skill6"]
        },
        "uid3": {
            skills : ["skill1", "skill3", "skill5"]
        },
        "uid4": {
            skills : ["skill2", "skill4", "skill6"]
        },
}

var ideas = {
        "ideaId1": { 
            skills: ["skill1", "skill2", "skill4"],
            favs: ["uid1"],
            nogos: ["uid2"]
        },
        "ideaId2": {
            skills: ["skill3", "skill4", "skill6"],
            favs: ["uid3"],
            nogos: ["uid4"]
        },
}

// ___________________________________________________________________________________________________________________________________________________

const createScoreLists = () => {

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
                        score += skillValue;
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

createScoreLists();

// ___________________________________________________________________________________________________________________________________________________

// Ausgabe der Daten
for (const memId in members) {
    console.log(memId);
    console.log(members[memId].scoreList[0] + " | " + members[memId].scoreList[1]);
    console.log("-----------");
}