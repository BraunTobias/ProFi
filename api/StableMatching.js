// import {members, ideas} from './testData'; // Node cannot use import statement outside a module

// Daten
const skillValue = require('./skillValue');
const favValue = 5.5;
const maxMembers= 4;
const minMembers = 2;

var members = {
    "Anna": {
        skills : ["skill3", "skill6", "skill8"],
    },
    "Niklas": {
        skills : ["skill1", "skill5", "skill8"]
    },
    "Klaus": {
        skills : ["skill2", "skill4"]
    },
    "Bo": {
        skills : ["skill6"]
    },
    "Paul": {
        skills : ["skill7", "skill10"]
    },
    "Nina": {
        skills : ["skill4", "skill9"]
    },
    "Johannes": {
        skills : ["skill2", "skill3", "skill5", "skill9"]
    },
    "Clara": {
        skills : ["skill1", "skill7", "skill10"]
    },
    "Lena": {
        skills : ["skill3", "skill5"]
    },
    "Miriam": {
        skills : ["skill6", "skill10"]
    },
    "Melanie": {
        skills : ["skill2", "skill4", "skill5"]
    },
    "Tom": {
        skills : ["skill6", "skill9"]
    },
    "Ali": {
        skills : ["skill1", "skill8"]
    },
    "Oliver": {
        skills : ["skill2", "skill4", "skill7"]
    },
    "Theo": {
        skills : ["skill1", "skill3", "skill8", "skill10"]
    }
}
var ideas = {
    "ideaA": { 
        skills: ["skill1", "skill4", "skill7"],
        favs: ["Paul", "Miriam"],
        nogos: ["Klaus", "Oliver"]
    },
    "ideaB": {
        skills: ["skill4", "skill8", "skill10"],
        favs: [],
        nogos: ["Nina", "Miriam", "Theo"]
    },
    "ideaC": {
        skills: ["skill3", "skill6", "skill7"],
        favs: ["Klaus", "Bo", "Nina", "Johannes", "Oliver", "Theo"],
        nogos: []
    },
    "ideaD": {
        skills: ["skill2", "skill6", "skill9"],
        favs: ["Niklas", "Lena"],
        nogos: ["Clara", "Tom"]
    },
    "ideaE": {
        skills: ["skill1", "skill5", "skill7", "skill9"],
        favs: ["Anna", "Clara", "Melanie", "Tom", "Ali"],
        nogos: ["Bo", "Paul", "Lena"]
    }
}

var onlySkillScores = [];

// ___________________________________________________________________________________________________________________________________________________

const createScoreLists = () => {

    // Jedes Mitglied des Kurses durchgehen
    for (const memId in members) {

        // Score-Liste erstellen
        var scoreList = [];
        var onlySkills = [];
        // Alle Ideen durchgehen
        for (const ideaId in ideas) {

            var score = 0;

            // Wenn kein No-Go
            if (ideas[ideaId].nogos.indexOf(memId) < 0) {

                // In Idee geforderte Skills durchgehen
                ideas[ideaId].skills.forEach(skill => {

                    if (members[memId].skills.indexOf(skill) >= 0) {
                        // Wenn Skillüberschneidung vorhanden, Score erhöhen
                        score += skillValue.getSkillValue(skill);
                    }

                });

                onlySkills.push([ideaId, score]);

                // Wenn die Idee favorisiert wurde, Score erhöhen
                if (ideas[ideaId].favs.indexOf(memId) >= 0) {
                    score += favValue;
                }
                scoreList.push([ideaId, score]);
            }
            
        }

        // scoreList nach Scores sortieren
        scoreList.sort((a,b) => b[1] - a[1]);

        onlySkillScores.push([memId,onlySkills]);

        // fertige Score-Liste anhängen
        members[memId].scoreList = scoreList;

    }

}

const createIdeaLists = () =>{

    for (const ideaId in ideas) {
        
        var scoreList = [];

        onlySkillScores.forEach(member => {

            member[1].forEach(scorePair => {

                if(scorePair[0]==ideaId){
                    scoreList.push([member[0],scorePair[1]]);
                }
            });

        });

        // scoreList nach Scores sortieren
        scoreList.sort((a,b) => b[1] - a[1]);
        
        // fertige Score-Liste anhängen
        ideas[ideaId].scoreList = scoreList;
        console.log(ideaId + " : " +ideas[ideaId].scoreList);
    }
    
}

function stableMatching() {

    var matches = [];
    var unmatchedMembers = [];

    //Mathces Array mit Ideen füllen
    for (const ideaId in ideas) {
        matches.push([ideaId]);
    }

    for (const memId in members) {
       unmatchedMembers.push(memId);
    }

    var currentMember = 0;
    var unmatchable =[];
    

  while(unmatchedMembers.length > 0){


        //Erste Person
        for (let i = 0; i < members[unmatchedMembers[currentMember]].scoreList.length; i++) {
   
            //Ersten Eintrag in Liste abfragen 
            var currentProposal =members[unmatchedMembers[currentMember]].scoreList[i][0];
            var memberMatched = false;
            var ideaPreferenceList = ideas[currentProposal].scoreList;

            for (let scorePair= 0; scorePair < ideaPreferenceList.length; scorePair++) {
                var currentMemberScore =ideaPreferenceList[scorePair][1];
                //In Liste der Idee nach Member suchen, ob Score = 0
                if(ideaPreferenceList[scorePair][0]==unmatchedMembers[currentMember] && currentMemberScore!=0){
                    
                    //In Matches zufügen wenn nicht schon voll
                    matches.forEach(idea => {

                        if (idea[0] ==currentProposal && idea.length < (maxMembers+1)) {
                            idea.push(unmatchedMembers[currentMember]);

                            
                            console.log(unmatchedMembers[currentMember]+ " wird "+currentProposal+ "zugeordnet");
                        
                            unmatchedMembers.splice(currentMember,1);
                            memberMatched= true;    
                          
                        }
                        else if(idea[0] == currentProposal && idea.length == (maxMembers+1)){
                            console.log(unmatchedMembers[currentMember]+ " "+currentProposal+ " ist schon voll");

                            //wenn man besser ist als jeman in der schon vollen Gruppe
                            for (let j = 1; j < idea.length; j++) {
                                
                                for (let k= 0; k < ideaPreferenceList.length; k++) {
                                    
                                    if (ideaPreferenceList[k][0]== idea[j] && ideaPreferenceList[k][1]<currentMemberScore) {

                                        console.log(idea[j]+ " hat "+ideaPreferenceList[k][1]+"Punkte");
                                        console.log(unmatchedMembers[currentMember]+ " ist besser als "+idea[j]);
                                        unmatchedMembers.push(idea[j]);
                                        idea.splice(j,1,unmatchedMembers[currentMember]);
                                        
                                        unmatchedMembers.splice(currentMember,1);
                                        
                                        memberMatched= true;  
                                        
                                    }
                                    
                                }
                                if(memberMatched){
                                    break;
                                }

                            }

                        }
                        
                    });

                }
                else if(ideaPreferenceList[scorePair][0]==unmatchedMembers[currentMember] && ideaPreferenceList[scorePair][1]==0){

                    console.log(unmatchedMembers[currentMember]+ " hat keine Skills für "+currentProposal);
                }
                
                

                if(memberMatched){
                    break;
                }

                
            }
            if(i == members[unmatchedMembers[currentMember]].scoreList.length-1 && !memberMatched){
                    unmatchable.push(unmatchedMembers[currentMember]);
                    unmatchedMembers.splice(currentMember,1);
                    break;
                
            }

            
            if(unmatchedMembers.length ==0 || memberMatched){

                break;
            }
            

        }
           
    }

    //Jemand konnte nicht zugeordnet werden

    if (unmatchable.length > 0) {

        unmatchable.forEach(unmatchedPerson => {
            var smallestGroup= 0;

            //kleinste Gruppe finden
            for (let i = 0; i < matches.length; i++) {
                
                if(matches[smallestGroup].length > matches[i].length){
                    smallestGroup = i;
                }
                
            }

            // wenn nicht Nogo, zu kleinster gruppe zuordenen
            if (ideas[matches[smallestGroup][0]].nogos.indexOf(unmatchedPerson) < 0){
                matches[smallestGroup].push(unmatchedPerson);
            }
            else{

                // wenn das nicht geht gucken ob favorit schon voll ist, sonst da zuordnen
                for (let i = 0; i < matches.length; i++) {

                //TO Do was tun wenn Favorit voll?
                    if(matches[i][0] == members[unmatchedPerson].scoreList[0][0] && matches[i].length < (maxMembers+1)){
                        matches[i].push(unmatchedPerson);
                    }
                    
                }

            }
            

        });


        
    }

    


    console.log(matches);
    
}



createScoreLists();
createIdeaLists();
stableMatching();

// ___________________________________________________________________________________________________________________________________________________

// Ausgabe der Daten
var consoleLog = "----------- Score List -----------\n";
for (const memId in members) {
    outputMemId = "" + memId;
    while (outputMemId.length < 8) outputMemId = outputMemId + " ";
    consoleLog = consoleLog + outputMemId + ": ";
    for(const score in members[memId].scoreList) consoleLog = consoleLog + members[memId].scoreList[score] + " | "
    consoleLog = consoleLog + "\n";
}
console.log(consoleLog);