// import {members, ideas} from './testData'; // Node cannot use import statement outside a module


// Daten
const favValue = 5.5;
const minMembers = 3;
const maxMembers = 3;

 var members ={"Anton":{"skills":["skill1","skill10","skill3","skill5","skill8"],"sorted":false,"interests":["interest2","interest4","interest6","interest7","interest9"]},"Berta":{"skills":["skill0","skill10","skill6","skill9"],"sorted":false,"interests":["interest0","interest4","interest6","interest9"]},"Charlotte":{"skills":["skill2","skill8"],"sorted":false,"interests":["interest1","interest4","interest9"]},"Dora":{"skills":["skill10","skill8"],"sorted":false,"interests":["interest3","interest5","interest6","interest7","interest8"]},"Emil":{"skills":["skill1","skill3","skill5","skill6"],"sorted":false,"interests":["interest0","interest1","interest2","interest4","interest7"]},"Friedrich":{"skills":["skill1","skill10","skill11","skill5","skill8"],"sorted":false,"interests":["interest0","interest6","interest8","interest9"]},"Gustav":{"skills":["skill1","skill2","skill4","skill8"],"sorted":false,"interests":["interest0","interest3","interest6","interest7","interest8"]},"Heinrich":{"skills":["skill11","skill3","skill5"],"sorted":false,"interests":["interest4","interest5","interest8"]},"Ida":{"skills":["skill10","skill3","skill4","skill6","skill8"],"sorted":false,"interests":["interest2","interest5","interest6","interest7"]},"Julia":{"skills":["skill10","skill9"],"sorted":false,"interests":["interest0","interest6","interest8"]},"Konrad":{"skills":["skill4","skill5","skill6","skill9"],"sorted":false,"interests":["interest0","interest1","interest5","interest7","interest9"]},"Ludwig":{"skills":["skill0","skill1","skill5","skill8","skill9"],"sorted":false,"interests":["interest3","interest4","interest8","interest9"]},"Martha":{"skills":["skill1","skill3"],"sorted":false,"interests":["interest1","interest2","interest3","interest5","interest9"]},"Nina":{"skills":["skill3","skill7"],"sorted":false,"interests":["interest1","interest3","interest4","interest5","interest7"]},"Otto":{"skills":["skill10","skill3","skill9"],"sorted":false,"interests":["interest0","interest1","interest4","interest6","interest9"]},"Paula":{"skills":["skill0","skill10","skill3","skill5"],"sorted":false,"interests":["interest3","interest6","interest9"]},"Quentin":{"skills":["skill0","skill10","skill11","skill8","skill9"],"sorted":false,"interests":["interest1","interest5","interest9"]},"Richard":{"skills":["skill0","skill1","skill2"],"sorted":false,"interests":["interest0","interest4","interest9"]},"Sophie":{"skills":["skill1","skill10","skill6","skill7"],"sorted":false,"interests":["interest0","interest2","interest4","interest7","interest9"]},"Theo":{"skills":["skill0","skill11","skill6","skill8"],"sorted":false,"interests":["interest1","interest7","interest9"]},"Ulrike":{"skills":["skill3","skill9"],"sorted":false,"interests":["interest1","interest3","interest6","interest8"]},"Vincent":{"skills":["skill0","skill3","skill6"],"sorted":false,"interests":["interest0","interest4","interest5","interest6"]},"Wilhelm":{"skills":["skill1","skill3","skill4"],"sorted":false,"interests":["interest0","interest3","interest4","interest5"]},"Xenia":{"skills":["skill0","skill2","skill3"],"sorted":false,"interests":["interest3","interest4","interest8"]},"Yvonne":{"skills":["skill1","skill10"],"sorted":false,"interests":["interest0","interest3","interest5","interest6","interest7"]},"Zoe":{"skills":["skill0","skill10","skill3","skill7","skill9"],"sorted":false,"interests":["interest0","interest7","interest8","interest9"]}};
 var ideas ={"ideaA":{"skills":["skill0","skill11","skill2","skill3","skill5","skill6","skill8","skill9"],"missingSkills":["skill0","skill11","skill2","skill3","skill5","skill6","skill8","skill9"],"team":[],"favs":["Anton","Nina","Vincent"],"nogos":["Gustav"],"commonInterests":[]},"ideaB":{"skills":["skill0","skill3","skill4","skill5","skill6","skill7"],"missingSkills":["skill0","skill3","skill4","skill5","skill6","skill7"],"team":[],"favs":["Heinrich","Ida","Yvonne"],"nogos":["Friedrich","Ulrike","Zoe"],"commonInterests":[]},"ideaC":{"skills":["skill0","skill1","skill10","skill11","skill4","skill6","skill7"],"missingSkills":["skill0","skill1","skill10","skill11","skill4","skill6","skill7"],"team":[],"favs":["Charlotte","Emil","Konrad","Otto","Sophie"],"nogos":["Quentin","Wilhelm"],"commonInterests":[]},"ideaD":{"skills":["skill0","skill1","skill10","skill2","skill3","skill4","skill5","skill9"],"missingSkills":["skill0","skill1","skill10","skill2","skill3","skill4","skill5","skill9"],"team":[],"favs":["Berta","Ludwig","Zoe"],"nogos":["Martha"],"commonInterests":[]},"ideaE":{"skills":["skill1","skill10","skill3","skill7","skill9"],"missingSkills":["skill1","skill10","skill3","skill7","skill9"],"team":[],"favs":["Friedrich","Julia","Theo","Ulrike","Wilhelm"],"nogos":["Dora","Richard","Sophie","Xenia"],"commonInterests":[]},"ideaF":{"skills":["skill0","skill1","skill10","skill11","skill2","skill4","skill7"],"missingSkills":["skill0","skill1","skill10","skill11","skill2","skill4","skill7"],"team":[],"favs":["Dora","Martha"],"nogos":["Charlotte","Emil","Ida","Julia","Ludwig","Nina","Otto","Paula"],"commonInterests":[]},"ideaG":{"skills":["skill0","skill10","skill11","skill3","skill6","skill7","skill8"],"missingSkills":["skill0","skill10","skill11","skill3","skill6","skill7","skill8"],"team":[],"favs":["Gustav","Richard","Xenia"],"nogos":["Berta","Heinrich","Konrad","Theo","Vincent"],"commonInterests":[]}};
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
            
            if(memberSkills[i][0]== ideaSkills[j][0]){

                // Prozent von vorhandenen Member Skills, zu benötigten Idea Skills
                // Genaue Abdeckung = 1; Selter Skill (häufiger benötigt, als vorhanden) > 1; Häufiger Skill < 1; 
                let percent = ideaSkills[j][1] / memberSkills[i][1];

                // Prozent * 10 für ganze Werte / 2, damit werte nicht übermäßig goß werden, aufgerundet
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
        console.log(skill+" – Wert:  "+ skillValues[skill]);
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
    var newArray = ideas[ideaId].team.filter(id => id != lowestUserId);
    ideas[ideaId].team = newArray;

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
    while ((unmatchableMembers+sortedMembers)< Object.keys(members).length) {
        console.log("---- Step " + i + " ----");
        i++;
        // Alle Mitglieder durchgehen
        for (const memId in members) {
            // Prüfen ob das Mitglied schon vergeben ist
            if (!members[memId].sorted && !members[memId].unmatchable) {

                //if (members[memId].scoreList.length > 0) {

                    // console.log(memId + members[memId].scoreList);
                    var prefIdeaId = members[memId].scoreList[0][0];
    
                    console.log(memId + " zu " + prefIdeaId + " hinzufügen …");
                    // User-ID vorübergehend zur Idee hinzufügen
                    ideas[prefIdeaId].team.push(memId);
    
                    if (ideas[prefIdeaId].team.length <= minMembers) {
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
                        if(newScoreList.length == 0){
                            unmatchableMembers+=1;
                            members[overflowUserId].unmatchable  = true;
                        }
                        members[overflowUserId].scoreList = newScoreList;
                    }
                //}
            }  
        }
        console.log(unmatchableMembers);
        console.log(sortedMembers);
    }
}

const updateMissingSkills = () => {

    for (const ideaId in ideas) {

        var missingSkillsList = ideas[ideaId].missingSkills;

        // Alle fehlenden Skills der Idee durchgehen
        for (const missingSkill of missingSkillsList) {

            for (const memberId of ideas[ideaId].team) {
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

const compareInterests = (idea) => {

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

                        if(commonInterest[0]== memberInterest){
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

const updateCommonInterests = () => {

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
            if(emptyIdeas[newIdea].team.length == 0){
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
        if(minMembers == maxMembers) emptyIdeaMemberCount = minMembers;

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
        sorted.forEach(memId2 => unsorted = unsorted.filter(memId => memId != memId2));
    }
    //Letzte Idee Anzahl der Member prüfen, sonst auflösen
    
    if(emptyIdeas[newIdea].team.length < minMembers){

        let missingForMinMembers=  1-(emptyIdeas[newIdea].team.length / minMembers);
        var lastMembers = emptyIdeas[newIdea].team;

        // bei über 25% fehlenden Leuten zur MindestAnzahl = auflösen
        //Sonst beibehalten
        if(missingForMinMembers > 0.25){
            let missingSkillsList=[];
            resolve(newIdea, true);

            console.log(lastMembers);
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

            // Dann die vorherigen Ideen durchgehen und missingSkills speichern
            for (const ideaId in ideas) {

                missingSkillsList.push([ideaId, ideas[ideaId].missingSkills.length]);
            } 
            //Wenn keine freien Plätze, auf die mit dem meisten Missing skills aufteilen
            missingSkillsList.sort((a,b) => b[1] - a[1]);   
            console.log(missingSkillsList);
            let i =0;

            lastMembers.forEach(member => {
                //Wenn Nogo dann nächste Idee 
                if(ideas[missingSkillsList[i][0]].nogos.indexOf(member) >= 0){
                    if(i == missingSkillsList.length -1){
                        i = 0;
                    }
                    else{
                        i+=1; 
                    } 
                } 
                ideas[missingSkillsList[i][0]].team.push(member); 
                console.log(member + " zu " + missingSkillsList[i][0]);
                members[member].sorted = true;
                i+=1; 
            });
        } 
    } 
}

const bestRemainingMatch = () => {
    while(true) {

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
        if (!missingScoreList[0] || missingScoreList[0][2] == 0) break;
        

        console.log("Score-Liste der übrigen User und Ideen:");
        for (array of missingScoreList) {
            console.log(array.join(", "));
        }
        
        // User mit höchster Übereinstimmung der entsprechenden Idee zuordnen, wenn diese noch nicht voll ist
        var topIdea = missingScoreList[0][1];
        while (ideas[topIdea].team.length >= maxMembers) {
            missingScoreList.shift();
            console.log("! " + topIdea + " ist schon voll, wird daher ignoriert");
            if(missingScoreList.length == 0) break;
            topIdea = missingScoreList[0][1]; 
        }
        if(missingScoreList.length == 0) break;
        var topMember = missingScoreList[0][0];
        ideas[topIdea].team.push(topMember);
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

    console.log(missingScoreList);
    
    // User der Reihe nach ihrer passendsten Idee zuordnen, wenn diese noch nicht voll ist
    for (var i = 0; i < missingScoreList.length; i++) {
        const topIdea = missingScoreList[i][1];
        const topMember = missingScoreList[i][0];
        if (ideas[topIdea].team.length < maxMembers && !members[topMember].sorted) {
            ideas[topIdea].team.push(topMember);
            members[topMember].sorted = true;
            console.log(topMember + " wird " + topIdea + " zugeordnet mit Score " + missingScoreList[i][2]);
        } 
    }
    console.log("");

    console.log("Konnten nicht zugeordnet werden:");
    var unsorted =[];
    for (const memId in members) {
        if (!members[memId].sorted) {
            console.log(memId);
            unsorted.push(memId);
        }
    }

    // Wenn es noch nicht zugeordnete Leute gibt
    if(unsorted.length > 0){
        //Bei unter 20% fehlenden Leuten zur MindestAnzahl = neue Idee < minMembers
        //Bei über 20% fehlenden Leuten zur mindest Anzahl = auf alte Ideen aufteilen > maxMembers
        let missingForMinMembers=  1-(unsorted.length / minMembers);

        if(missingForMinMembers <= 0.25){
            console.log("Wir brauchen eine neue Idee!");
            addEmptyIdeas(unsorted);
        }
        else{

            missingScoreList.sort((a,b) => b[2] - a[2]); 
            console.log(missingScoreList);
            //Hier über maximal anzahl gehen
            for (var i = 0; i < missingScoreList.length; i++) {
                const topIdea = missingScoreList[i][1];
                const topMember = missingScoreList[i][0];
                if (!members[topMember].sorted) {
                    ideas[topIdea].team.push(topMember);
                    members[topMember].sorted = true;
                    console.log(topMember + " wird " + topIdea + " zugeordnet mit Score " + missingScoreList[i][2]);
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
        if (ideaId != ideaToResolve) {
            freeSpaces += ((maxMembers+1)- ideas[ideaId].team.length);
        }
    }
    for (const ideaId in emptyIdeas) {
        if (ideaId != ideaToResolve) {
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
        console.log("… und kann aufgelöst werden\n");
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

    console.log(partialIdeas);

    for (var i = 0; i < partialIdeas.length; i++) {
        console.log(partialIdeas[i][0] + " hat weniger als " + minMembers +" Teilnehmer");   
    
        // Prüfen, ob die unvollständigste Idee aufgelöst werden kann 
        const ideaToResolve = partialIdeas[i][0];
        resolve(ideaToResolve, false); 
    }   
}

const resolveIncompleteIdeas = () => {

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
        console.log(incompleteIdeas[i][0] + " ist nicht abgedeckt, es fehlen: "+ incompleteIdeas[i][1] +" Skills");   
        // HIER SOLLTEN EVTL NOCH ANDERE FAKTOREN MIT REINSPIELEN? WIE VIELE FAVS? WIE VIEL ABGEDECKTE SKILLS?
    
        // Prüfen, ob die unvollständigste Idee aufgelöst werden kann 
        const ideaToResolve = incompleteIdeas[i][0];

        resolve(ideaToResolve, false); 
    }
}

const printList = () => {
    var consoleLog = "----------- Team-Liste -----------\n";
    for (const ideaId in ideas) {
        outputIdeaId = "" + ideaId;
        while (outputIdeaId.length < 8) outputIdeaId = outputIdeaId + " ";
        consoleLog += outputIdeaId + ": ";
        for(const member in ideas[ideaId].team) consoleLog = consoleLog + ideas[ideaId].team[member] + " | "
        consoleLog += "\n";
    }
    for (const ideaId in emptyIdeas) {
        outputIdeaId = "" + ideaId;
        while (outputIdeaId.length < 8) outputIdeaId = outputIdeaId + " ";
        consoleLog += outputIdeaId + ": ";
        for(const member in emptyIdeas[ideaId].team) consoleLog = consoleLog + emptyIdeas[ideaId].team[member] + " | "
        consoleLog += "\n";
    }
    console.log(consoleLog); 

    console.log("Noch unsortiert:");
    for (const memId in members) {
        if (!members[memId].sorted) {
            console.log(memId);
        }
    }
    console.log("");
}

const proFiFunction = () => {

    stableMatching();
    printList();
    
    // Alle optimal zueinanderpassenden übrigen User und Ideen zuordnen
    bestRemainingMatch();
    printList();

    // Ideen die nicht die Mindestanzahl erreicht haben löschen
    resolvePartiallyFilledIdeas();
    printList();

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
    // console.log(emptyIdeas);
    // console.log(ideas);
}

proFiFunction();