/*var members = {
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
}*/

var members = {
    "Anton": {
        skills : ["skill1", "skill5", "skill8", "skill10"],
    },
    "Berta": {
        skills : ["skill1", "skill4", "skill7"],
    },
    "Charlotte": {
        skills : ["skill1", "skill2", "skill3", "skill4"],
    },
    "Dora": {
        skills : ["skill5", "skill6", "skill9"],
    },
    "Emil": {
        skills : ["skill6", "skill8", "skill9", "skill10"],
    },
    "Friedrich": {
        skills : ["skill1", "skill3", "skill5"],
    },
    "Gustav": {
        skills : ["skill1", "skill8", "skill9"],
    },
    "Heinrich": {
        skills : ["skill3", "skill4", "skill6"],
    },
    "Ida": {
        skills : ["skill1", "skill5", "skill9"],
    },
    "Julia": {
        skills : ["skill3", "skill7", "skill8", "skill10"],
    }
}
var ideas = {
    "ideaA": { 
        skills: ["skill1", "skill2", "skill5", "skill9"],
        missingSkills: ["skill1", "skill2", "skill5", "skill9"],
        favs: ["Anton", "Berta", "Heinrich"],
        nogos: ["Dora", "Friedrich", "Ida"],
        members: []
    },
    "ideaB": {
        skills: ["skill3", "skill4", "skill6", "skill7"],
        missingSkills: ["skill3", "skill4", "skill6", "skill7"],
        favs: ["Dora", "Friedrich", "Ida"],
        nogos: [],
        members: []
    },
    "ideaC": {
        skills: ["skill1", "skill5", "skill8", "skill10"],
        missingSkills: ["skill1", "skill5", "skill8", "skill10"],
        favs: ["Charlotte"],
        nogos: ["Berta"],
        members: []
    },
}


let values = {}; 

function countSkills(obj) {

    let allSkills = new Array(); 
    let skillCounts = new Array();

    for (const ID in obj) {

        obj[ID].skills.forEach(skill => {
            
            var index =allSkills.indexOf(skill); 

            if (index >= 0) {

                skillCounts[index][1]++;   
            }
            else{

                allSkills.push(skill);
                skillCounts.push([skill,1]);
            }            
        });
            
    }

    return skillCounts;
    
}

function calculateSkillValues() {

    let memberSkills =countSkills(members);
    let ideaSkills =countSkills(ideas);

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


                values[memberSkills[i][0]] = value;

            }
        }
       
        
    }

}

calculateSkillValues();


module.exports = {
    getSkillValue(skill) {

        return values[skill];
    }
}
  
