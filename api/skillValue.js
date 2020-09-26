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

    let values = new Array(); 

    let memberSkills =countSkills(members);
    let ideaSkills =countSkills(ideas);

    for (let i = 0; i < memberSkills.length; i++) {

        for (let j = 0; j < ideaSkills.length; j++) {
            
            if(memberSkills[i][0]== ideaSkills[j][0]){

                let percent = ideaSkills[j][1] / memberSkills[i][1];

                //TO DO Weter irgenwie Mitteln auf ganze Werte


                values.push([memberSkills[i][0], percent]);
                console.log(memberSkills[i][0] +": "+ideaSkills[j][1]+" / "+memberSkills[i][1]);

            }
        }
       
        
    }
    
    console.log(values);

}

calculateSkillValues();