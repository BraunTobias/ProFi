import {useState}from "react";
import DB from "./DB_API";

export default ProFiFunction = (courseId, onFinish) => {

    // Kursdaten
    DB.collectCourseData(courseId, (courseData) =>
    {
        console.log(courseData);
        mainFunction(courseData);
    }, (error) => {console.log(error); onFinish()});


    const mainFunction = (courseData) => {
        
        const maxMembers = courseData.course.maxMembers;
        const minMembers = courseData.course.minMembers;
        const ideasIds = courseData.ideaIds;
        const ideaSkills = courseData.ideaSkills;
        const leftoverIdeaSkills = [];
        const ideaFavs = courseData.ideaFavs;
        const ideaNogos = courseData.ideaNogos;
        const memberIds = courseData.memberIds;
        const memberSkills = courseData.memberSkills;
        var freeTeamPositions = 0;
        var teams = [];
        var leftoverMembers = [];
        
        for (var i = 0; i < ideasIds.length; i++) {
          const ideaIFavs = shuffle(ideaFavs[i]);
          // const ideaIFavs = ideaFavs[i];
          const ideaISkills = ideaSkills[i];
          const ideaIMembers = [];
          
          // User, die eine Idee favorisiert haben, werden dieser anhand ihrer Fähigkeiten zugeordnet
          for (var j = 0; j < ideaIFavs.length; j++) {
            if (ideaISkills.length > 0) {
                const favMemberJ = ideaIFavs[j];
                var favMemberJSkills = [];
                const index = memberIds.indexOf(favMemberJ);
                if (index >= 0) {
                  favMemberJSkills = memberSkills[index];
                }
                for (var k = 0; k < favMemberJSkills.length; k++) {
                    const skillK = favMemberJSkills[k];
                    const skillKIndex = ideaISkills.indexOf(skillK);
                        if (skillKIndex >= 0) {
                            if (ideaIMembers.length < maxMembers) {
                                if (ideaIMembers.indexOf(favMemberJ) < 0) {
                                    ideaIMembers.push(favMemberJ);
                                } 
                            } else {
                              ideaISkills = [];
                            }
                            ideaISkills.splice(skillKIndex, 1);
                            break;
                        }
                }
                    
                if (leftoverMembers.indexOf(favMemberJ) < 0 && ideaIMembers.indexOf(favMemberJ) < 0) {
                  leftoverMembers.push(favMemberJ);
                }
              }
            }
            teams.push(ideaIMembers);
            leftoverIdeaSkills.push(ideaISkills);
          }
          
          // Für alle Fähigkeiten, die in einer Idee noch nicht besetzt sind, wird ein User hinzugefügt
          for (var i = 0; i < ideasIds.length; i++) {
            if (ideaFavs[i].length > 0) {
              var leftoverIdeaISkills = leftoverIdeaSkills[i];
              const ideaIMembers = teams[i];
              
              for (var j = 0; j < leftoverIdeaISkills.length; j++) {
                    const leftoverIdeaISkillJ = leftoverIdeaISkills[j];
                    for (var k = 0; k < leftoverMembers.length; k++) {
                      const leftoverMemberK = leftoverMembers[k];
                      const leftoverMemberKIndex = memberIds.indexOf(leftoverMemberK);
                      const leftoverMemberKSkills = [];

                      if (ideaNogos[i].indexOf(leftoverMemberK) < 0) {
                        if (leftoverMemberKIndex >= 0) {
                            leftoverMemberKSkills = memberSkills[leftoverMemberKIndex];
                            if (leftoverMemberKSkills.indexOf(leftoverIdeaISkillJ) >= 0) {
                                ideaIMembers.push(leftoverMemberK);
                                leftoverIdeaISkills[j] = "";
                                leftoverMembers[k] = "";
                                break;
                            }
                        }
                      }
                    }
                }
                leftoverIdeaISkills = leftoverIdeaISkills.filter(id => id != "");
                leftoverMembers = leftoverMembers.filter(id => id != "");
                teams[i] = ideaIMembers;
            }
        }

        // Wenn Ideen noch nicht ausgelastet sind, werden alle die sie favorisiert haben hinzugefügt
        for (var i = 0; i < ideasIds.length; i++) {
            const ideaIMembers = teams[i];
            const ideaIFavs = ideaFavs[i];

            for (var j = 0; j < ideaIFavs.length; j++) {
                if (ideaIMembers.length < maxMembers) {
                  const favMemberJ = ideaIFavs[j];
                  const favMemberJIndex = leftoverMembers.indexOf(favMemberJ);
                  if (favMemberJIndex >= 0) {
                      ideaIMembers.push(favMemberJ);
                      leftoverMembers[favMemberJIndex] = "";
                  }
              }
            }
            leftoverMembers = leftoverMembers.filter(id => id != "");
            teams[i] = ideaIMembers;
        }

        // alle übrigen User werden nach einer passenden Fähigkeit Gruppen zugeordnet, die noch einen Platz frei haben
        for (var i = 0; i < leftoverMembers.length; i++) {
            const leftoverMemberI = leftoverMembers[i];
            const leftoverMemberISkills = [];
            const leftoverMemberIIndex = memberIds.indexOf(leftoverMemberI);
            if (leftoverMemberIIndex >= 0) {
                leftoverMemberISkills = memberSkills[leftoverMemberIIndex];
            }
            for (var j = 0; j < leftoverMemberISkills.length; j++) {
                if (leftoverMembers[i] != "") {
                    const leftoverMemberISkillJ = leftoverMemberISkills[j];
                    for (var k = 0; k < ideaSkills.length; k++) {
                        if (teams[k].length > 0 && teams[k].length < maxMembers) {
                            const ideaKSkills = ideaSkills[k];
                            if (ideaKSkills.indexOf(leftoverMemberISkillJ) >= 0) {
                                teams[k].push(leftoverMemberI);
                                leftoverMembers[i] = "";
                                break;
                            }
                        }
                    }
                }
            }
        }
        leftoverMembers = leftoverMembers.filter(id => id != "");

        // Wenn Ideen noch nicht die Mindestanzahl erreicht haben, werden User hinzugefügt
        for (var i = 0; i < teams.length; i++) {
            while (teams[i].length > 0 && teams[i].length < minMembers && leftoverMembers.length > 0) {
                teams[i].push(leftoverMembers.pop());
            }
        }

        if (leftoverMembers.length > 0) {
            // Freie Plätze in Teams werden gezählt
            for (var i = 0; i < teams.length; i++) {
                if (teams[i].length > 0 && teams[i].length < maxMembers) {
                    freeTeamPositions += maxMembers - teams[i].length;
                }
            }

            if (leftoverMembers.length > freeTeamPositions) {
                const averageMembers = Math.floor((minMembers + maxMembers) / 2);

                while (leftoverMembers.length > averageMembers) {
                    teams.push(leftoverMembers.splice(0, averageMembers));
                }
                for (var i = 0; i < teams.length; i++) {
                    while (teams[i].length > 0 && teams[i].length < maxMembers && leftoverMembers.length > 0) {
                        teams[i].push(leftoverMembers.pop());
                    }
                }    
                // Umgang mit übrigen Mitgliedern noch nicht optimal
                if (leftoverMembers.length > 0) {
                    teams[i].push(leftoverMembers);
                }
            }
            else {
                for (var i = 0; i < teams.length; i++) {
                    while (teams[i].length > 0 && teams[i].length < maxMembers && leftoverMembers.length > 0) {
                        teams[i].push(leftoverMembers.pop());
                    }
                }    
            }
        }
        console.log("------------- ERGEBNIS -------------");
        console.log(teams);
        DB.saveIdeaTeams(courseId, ideasIds, teams, () => {
          onFinish();
        });

    }
}

// User blex: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle (array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}