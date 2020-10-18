// import {members, ideas} from './testData'; // Node cannot use import statement outside a module

// Daten
// const skillValue = 1;
const favValue = 5.5;
const minMembers = 2;
const maxMembers = 4 ;

var members = {
   "Anna": {
        skills : ["skill3", "skill6", "skill8"],
        sorted : false
    },
    "Niklas": {
        skills : ["skill1", "skill5", "skill8"],
        sorted : false
    },
    "Klaus": {
        skills : ["skill2", "skill4"],
        sorted : false
    },
    "Bo": {
        skills : ["skill6"],
        sorted : false
    },
    "Paul": {
        skills : ["skill7", "skill10"],
        sorted : false
    },
    "Nina": {
        skills : ["skill4", "skill9"],
        sorted : false
    },
    "Johannes": {
        skills : ["skill2", "skill3", "skill5", "skill9"],
        sorted : false
    },
    "Clara": {
        skills : ["skill1", "skill7", "skill10"],
        sorted : false
    },
    "Lena": {
        skills : ["skill3", "skill5"],
        sorted : false
    },
    "Miriam": {
        skills : ["skill6", "skill10"],
        sorted : false
    },
    "Melanie": {
        skills : ["skill2", "skill4", "skill5"],
        sorted : false
    },
    "Tom": {
        skills : ["skill6", "skill9"],
        sorted : false
    },
    "Ali": {
        skills : ["skill1", "skill8"],
        sorted : false
    },
    "Oliver": {
        skills : ["skill2", "skill4", "skill7"],
        sorted : false
    },
    "Theo": {
        skills : ["skill1", "skill3", "skill8", "skill10"],
        sorted : false
    }
}
var ideas = {
    "ideaA": { 
        skills: ["skill1", "skill4", "skill7"],
        missingSkills: ["skill1", "skill4", "skill7"],
        favs: ["Paul", "Miriam"],
        nogos: ["Klaus", "Oliver"],
        members: []
    },
    "ideaB": {
        skills: ["skill4", "skill8", "skill10"],
        missingSkills: ["skill4", "skill8", "skill10"],
        favs: [],
        nogos: ["Nina", "Miriam", "Theo"],
        members: []
    },
    "ideaC": {
        skills: ["skill3", "skill6", "skill7"],
        missingSkills: ["skill3", "skill6", "skill7"],
        favs: ["Klaus", "Bo", "Nina", "Johannes", "Oliver", "Theo"],
        nogos: [],
        members: []
    },
    "ideaD": {
        skills: ["skill2", "skill6", "skill9"],
        missingSkills: ["skill2", "skill6", "skill9"],
        favs: ["Niklas", "Lena"],
        nogos: ["Clara", "Tom"],
        members: []
    },
    "ideaE": {
        skills: ["skill1", "skill5", "skill7", "skill9"],
        missingSkills: ["skill1", "skill5", "skill7", "skill9"],
        favs: ["Anna", "Clara", "Melanie", "Tom", "Ali"],
        nogos: ["Bo", "Paul", "Lena"],
        members: []
    }
}
// var members = {
//     "Anton": {
//         skills : ["skill1", "skill5", "skill8", "skill10"],
//     },
//     "Berta": {
//         skills : ["skill1", "skill4", "skill7"],
//     },
//     "Charlotte": {
//         skills : ["skill1", "skill2", "skill3", "skill4"],
//     },
//     "Dora": {
//         skills : ["skill5", "skill6", "skill9"],
//     },
//     "Emil": {
//         skills : ["skill6", "skill8", "skill9", "skill10"],
//     },
//     "Friedrich": {
//         skills : ["skill1", "skill3", "skill5"],
//     },
//     "Gustav": {
//         skills : ["skill1", "skill8", "skill9"],
//     },
//     "Heinrich": {
//         skills : ["skill3", "skill4", "skill6"],
//     },
//     "Ida": {
//         skills : ["skill1", "skill5", "skill9"],
//     },
//     "Julia": {
//         skills : ["skill3", "skill7", "skill8", "skill10"],
//     }
// }
// var ideas = {
//     "ideaA": { 
//         skills: ["skill1", "skill2", "skill5", "skill9"],
//         missingSkills: ["skill1", "skill2", "skill5", "skill9"],
//         favs: ["Anton", "Berta", "Heinrich"],
//         nogos: ["Dora", "Friedrich", "Ida"],
//         members: []
//     },
//     "ideaB": {
//         skills: ["skill3", "skill4", "skill6", "skill7"],
//         missingSkills: ["skill3", "skill4", "skill6", "skill7"],
//         favs: ["Dora", "Friedrich", "Ida"],
//         nogos: [],
//         members: []
//     },
//     "ideaC": {
//         skills: ["skill1", "skill5", "skill8", "skill10"],
//         missingSkills: ["skill1", "skill5", "skill8", "skill10"],
//         favs: ["Charlotte"],
//         nogos: ["Berta"],
//         members: []
//     },
// }
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
            
            if(memberSkills[i][0]== ideaSkills[j][0]){

                // Prozent von vorhandenen Member Skills, zu benötigten Idea Skills
                // Genau Abdeckung = 1; Selter Skill (häufiger benötigt, als vorhanden) > 1; Häufiger Skill < 1; 
                let percent = ideaSkills[j][1] / memberSkills[i][1];

                // Prozent * 10 für ganze Werte / 2, damit werte nicht übermäßig goß werden, abgerundet 
                //let value = Math.floor((percent * 10) /2);
                //aufgerundet
                let value = Math.ceil((percent * 10) /2);

                // Falls Skill so häufig vorkommt, dass er null wird, passiert bei weniger als 20%
                /*if(value <= 0){
                    value =1;
                }*/

                // Skill Values bei abrunden:
                // 0%-39% = 1
                // 40%-59% = 2
                // 60%-79% = 3
                // 80%-99% = 4
                // 100%-119% = 5
                // usw.

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
    for (var i = 1; i<= 10; i++) {

        if(skillValues["skill"+i]>0){
         console.log("skill" + i + " – Wert:  " + skillValues["skill" + i]);   
        }
        
    }

}

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
    ideas[ideaId].members.forEach(memId => {

        var score = 0;

        // In Idee geforderte Skills durchgehen
        ideas[ideaId].skills.forEach(skill => {

            // zählen wie oft der Skill schon in der Idee vorkommt
            var skillCoverage = 0;
            ideas[ideaId].members.forEach(memId2 => {
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

    var lowestUserId = ideaScoreList[ideaScoreList.length - 1][0];
    var newArray = ideas[ideaId].members.filter(id => id != lowestUserId);
    ideas[ideaId].members = newArray;

    // Rausgeworfener User wird zurückgegeben
    return (lowestUserId);
}

// ___________________________________________________________________________________________________________________________________________________

createUserScoreLists();

const stableMatching = () => {
    var unmatchableMembers = 0;
    var sortedMembers = 0;
    var i =0;
    // DAS ALLES MACHEN SOLANGE ES NOCH UNSORTIERTE MEMBERS GIBT
    while ((unmatchableMembers+sortedMembers)<= Object.keys(members).length) {
        console.log("---- Step " + i + " ----");
        i++;
        // Alle Mitglieder durchgehen
        for (const memId in members) {

            // Prüfen ob das Mitglied schon vergeben ist
            if (!members[memId].sorted) {

                if (members[memId].scoreList.length > 0) {

                    // console.log(memId + members[memId].scoreList);
                    var prefIdeaId = members[memId].scoreList[0][0];
    
                    console.log(memId + " zu " + prefIdeaId + " hinzufügen …");
                    // User-ID vorübergehend zur Idee hinzufügen
                    ideas[prefIdeaId].members.push(memId);
    
                    if (ideas[prefIdeaId].members.length <= minMembers) {
                        // Wenn die Idee noch nicht überfüllt ist, den User als sortiert markieren 
                        members[memId].sorted  = true;
                        sortedMembers +=1;
                    } else {
                        // Bei Überfüllung den User in der Idee anhand der Score-Liste vergleichen und den schlechtesten User löschen
                        overflowUserId = createSingleIdeaScoreList(prefIdeaId);
                        console.log("! "+ overflowUserId + " aus " + prefIdeaId + " rausgeworfen");
                        if (overflowUserId != memId) members[memId].sorted  = true;
    
                        // Den rausgeworfenen User als unsortiert markieren und die Idee aus seiner Scoreliste löschen
                        members[overflowUserId].sorted = false;
                        var oldScoreList = members[overflowUserId].scoreList;
                        var newScoreList = oldScoreList.filter(idea => idea[0] != prefIdeaId);
                        members[overflowUserId].scoreList = newScoreList;
                    
                    }
                }
                else{
                    unmatchableMembers+=1;
                }
            }
           
        }

        console.log(unmatchableMembers+sortedMembers);
    }

}

const updateMissingSkills = () => {

    for (const ideaId in ideas) {

        var missingSkillsList = ideas[ideaId].missingSkills;

        // Alle fehlenden Skills der Idee durchgehen
        for (const missingSkill of missingSkillsList) {

            for (const memberId of ideas[ideaId].members) {
                // Wenn der Skill schon bei einem Mitglied vorhanden ist, diesen aus missingSkills entfernen
                if (members[memberId].skills.indexOf(missingSkill) >= 0) {
                    // console.log(missingSkill + "fehlt nicht mehr");
                    missingSkillsList = missingSkillsList.filter(skill => skill != missingSkill);
                    break;
                } 
            }
        }
        ideas[ideaId].missingSkills = missingSkillsList;
    }
}

const bestRemainingMatch = () => {
    while(true) {

        // Ideen bestimmen, deren Skills noch nicht abgedeckt sind
        updateMissingSkills();
        calculateSkillValues();

        // Alle Scores von übrigen Usern zu nicht vollen Ideen abspeichern
        var missingScoreList = [];
    
        for (const memId in members) {
            if (!members[memId].sorted) {
    
                for (const ideaId in ideas) {
                    if (ideas[ideaId].missingSkills.length > 0 && ideas[ideaId].nogos.indexOf(memId) < 0) {
    
                        var score = 0;
                        // Score erhöhen wenn Favorit
                        if (ideas[ideaId].favs.indexOf(memId) >= 0) {
                            score += 0.5;
                        }
                        // Score erhöhen wenn User einen fehlenden Skill hat
                        for (const skill of ideas[ideaId].missingSkills) {
                            if (members[memId].skills.indexOf(skill) >= 0) {
                                score += skillValues[skill];
                            }
                        }
                        if (score > 0) {
                            missingScoreList.push([memId, ideaId, score]);
                        }
                    }
                }
            }
        }

        missingScoreList.sort((a,b) => b[2] - a[2]);
        // Wenn es keine Übereinstimmung mehr gibt, die Schleife beenden
        if (!missingScoreList[0] || missingScoreList[0][2] == 0) break;

        console.log("Score-Liste der übrigen User und Ideen:");
        for (array of missingScoreList) {
            console.log(array.join(", "));
        }
        
        // User mit höchster Übereinstimmung der entsprechenden Idee zuordnen, wenn diese noch nicht voll ist
        const topIdea = missingScoreList[0][1];
        while (ideas[topIdea].members.length >= maxMembers) {
            missingScoreList.shift();
            topIdea = missingScoreList[0][1];
            console.log("! " + topIdea + " ist schon voll, wird daher ignoriert");
        }
        const topMember = missingScoreList[0][0];
        ideas[topIdea].members.push(topMember);
        members[topMember].sorted = true;
        console.log("-> " + topMember + " zu " + topIdea + " hinzugefügt\n");
        // Nach jedem zugeordneten User muss alles neu kalkuliert werden, damit nicht mehrere User aufgrund des selben Skills zugeordnet werden, der dann gar nicht mehr fehlt

    }
}
const bestRemainingMatchFinal = () => {

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
                    missingScoreList.push([memId, ideaId, score]);
                }
            }
        }
    }

    missingScoreList.sort((a,b) => b[2] - a[2]);
    
    // User der Reihe nach ihrer passendsten Idee zuordnen, wenn diese noch nicht voll ist
    for (var i = 0; i < missingScoreList.length; i++) {
        if (missingScoreList[i][2] == 0) break;
        const topIdea = missingScoreList[i][1];
        const topMember = missingScoreList[i][0];
        if (ideas[topIdea].members.length < maxMembers && !members[topMember].sorted) {
            ideas[topIdea].members.push(topMember);
            members[topMember].sorted = true;
            console.log(topMember + " wird " + topIdea + " zugeordnet mit Score " + missingScoreList[i][2]);
        } 
    }
    console.log("");

    updateMissingSkills();
}

const resolveIncompleteIdeas = () => {

    // Ideen, deren Skills nicht abgedeckt sind, in Liste abspeichern zusammen mit Zahl der fehlenden Skills
    var incompleteIdeas = [];
    for (const ideasId in ideas) {
        if (ideas[ideasId].missingSkills.length > 0) {
            incompleteIdeas.push([ideasId, ideas[ideasId].missingSkills.length]);
        }
    }

    incompleteIdeas.sort((a,b) => b[1] - a[1]); 

    for (var i = 0; i < incompleteIdeas.length; i++) {
        console.log(incompleteIdeas[i][0] + " ist nicht abgedeckt");   
        // HIER SOLLTEN EVTL NOCH ANDERE FAKTOREN MIT REINSPIELEN? WIE VIELE FAVS? WIE VIEL ABGEDECKTE SKILLS?
    
        // Prüfen, ob die unvollständigste Idee aufgelöst werden kann 
        const ideaToResolve = incompleteIdeas[i][0];
        // Dafür müssen alle freien Plätze mit freien Usern verglichen werden
        var freeSpaces = 0;
        for (const ideaId in ideas) {
            if (ideaId != ideaToResolve) {
                freeSpaces += (maxMembers - ideas[ideaId].members.length);
            }
        }
        var freeUsers = 0;
        for (const memId in members) {
            if (!members[memId].sorted) freeUsers ++;
        }
        freeUsers += ideas[ideaToResolve].members.length;
    
        if (freeUsers <= freeSpaces) {
            console.log("… und kann aufgelöst werden\n");
            // In diesem Fall kann die Gruppe aufgelöst werden
            for (const memId of ideas[ideaToResolve].members) {
                members[memId].sorted = false;
            }
            delete ideas[ideaToResolve];
            // MUSS DIE IDEE NOCH AUS ALLEN SCORELISTEN ENTFERNT WERDEN?
        } 
    }

    
}

const printList = () => {
    var consoleLog = "----------- Team-Liste -----------\n";
    for (const ideaId in ideas) {
        outputIdeaId = "" + ideaId;
        while (outputIdeaId.length < 8) outputIdeaId = outputIdeaId + " ";
        consoleLog += outputIdeaId + ": ";
        for(const member in ideas[ideaId].members) consoleLog = consoleLog + ideas[ideaId].members[member] + " | "
        consoleLog += "\n";
    }
    console.log(consoleLog); 

    console.log("Noch unsortiert:");
    for (const memId in members) {
        if (!members[memId].sorted) {
            console.log(memId);
        }
    }
    console.log("");
}

const proFiFunction = () => {

    stableMatching();
    // HIER MÜSSEN IDEEN, DIE NICHT VOLL GEWORDEN SIND, NOCH ENTFERNT WERDEN
    printList();
    
    // Scorelisten neu erstellen: nur unsortierte User werden mit einbezogen
    //calculateSkillValues();
    
    // Alle optimal zueinanderpassenden übrigen User und Ideen zuordnen
    bestRemainingMatch();
    printList();
    
    // Prüfen, welche Ideen nicht alle Skills erfüllt haben und diese wenn möglich auflösen
    resolveIncompleteIdeas();
    printList();
    
    // Jetzt sind alle Ideen-Skills so weit es geht abgedeckt und die übrigen User müssen noch zugeordnet werden 
    // nun wieder auf Basis aller benötigten Skills und der Favoriten (diese haben nun Priorität).
    // es werden wieder Scores für alle User/Ideen gebildet und diese Liste abgearbeitet.
    console.log("---- Finale Zuordnung ----");
    bestRemainingMatchFinal();
    
    printList();
    for (const idea in ideas) {
        if (ideas[idea].missingSkills.length > 0) {
            console.log("Von " + idea + " sind nicht alle Skills abgedeckt!");
            console.log(ideas[idea].missingSkills + " fehlt");
        }
    }
}

proFiFunction();