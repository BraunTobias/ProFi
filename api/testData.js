const fs = require('fs');

var numberOfSkills = 10;
var numberOfMembers = 10;
var numberOfIdeas = 4;

var minMemberSkills = 3;
var maxMemberSkills = 5;
var minIdeaSkills = 3;
var maxIdeaSkills = 4;

var memberNames = [
    "Anton",
    "Berta",
    "Charlotte",
    "Dora",
    "Emil",
    "Friedrich",
    "Gustav",
    "Heinrich",
    "Ida",
    "Julia",
    "Konrad",
    "Ludwig",
    "Martha",
    "Nina",
    "Otto",
    "Paula",
    "Quentin",
    "Richard",
    "Sophie",
    "Theo",
    "Ulrike",
    "Vincent",
    "Wilhelm",
    "Xenia",
    "Yvonne",
    "Zoe"
]

var ideaNames = [
    "ideaA",
    "ideaB",
    "ideaC",
    "ideaD",
    "ideaE",
    "ideaF",
    "ideaG",
    "ideaH",
    "ideaI",
    "ideaJ",
    "ideaK",
    "ideaL",
    "ideaM",
    "ideaN",
    "ideaO",
    "ideaP",
    "ideaQ",
    "ideaR",
    "ideaS",
    "ideaT",
    "ideaU",
    "ideaV",
    "ideaW",
    "ideaX",
    "ideaY",
    "ideaZ"
]

var members = {};
var ideas = {};

const setMemberSkills = () => {
    for (const memberName of memberNames.slice(0, numberOfMembers - 1)) {
        members[memberName] = {};

        // Zufällige Skillzahlen generieren
        var skillAmount = 100000;
        while (skillAmount > numberOfSkills) {
            var skillAmount = Math.floor(Math.random() * (maxMemberSkills - minMemberSkills + 1)) + minMemberSkills; 
        }
        var skillNumbers = [];
        while(skillNumbers.length < skillAmount){
            var random = Math.floor(Math.random() * (numberOfSkills));
            if(skillNumbers.indexOf(random) === -1) skillNumbers.push(random);
        }

        var memberSkills = [];
        
        for (const skillNumber of skillNumbers) {
            memberSkills.push("skill" + skillNumber);
        }
        memberSkills.sort();

        members[memberName].skills = memberSkills;
        members[memberName].sorted = false;
    }
}

const setIdeaSkills = () => {
    for (const ideaName of ideaNames.slice(0, numberOfIdeas - 1)) {
        ideas[ideaName] = {};

        // Zufällige Skillzahlen generieren
        var skillAmount = 100000;
        while (skillAmount > numberOfSkills) {
            var skillAmount = Math.floor(Math.random() * (maxIdeaSkills - minIdeaSkills + 1)) + minIdeaSkills; 
        }
        var skillNumbers = [];
        while(skillNumbers.length < skillAmount){
            var random = Math.floor(Math.random() * (numberOfSkills));
            if(skillNumbers.indexOf(random) === -1) skillNumbers.push(random);
        }

        var ideaSkills = [];
        
        for (const skillNumber of skillNumbers) {
            ideaSkills.push("skill" + skillNumber);
        }
        ideaSkills.sort();

        ideas[ideaName].skills = ideaSkills;
        ideas[ideaName].missingSkills = ideaSkills;
        ideas[ideaName].members = [];
        ideas[ideaName].favs = [];
        ideas[ideaName].nogos = [];
    }    
}    

setIdeaPrefs = () => {
    for (const mem in members) {

        var ideaIds = Object.keys(ideas);
        var sameNumber = true;
        while (sameNumber) {
            var randomId1 = Math.floor(Math.random() * (ideaIds.length + 1));
            var randomId2 = Math.floor(Math.random() * (ideaIds.length + 1));
            if (randomId1 != randomId2) sameNumber = false;
        }
        console.log(randomId1 + ", " + randomId2);
        if (randomId1 < ideaIds.length) ideas[ideaIds[randomId1]].favs.push(mem); 
        if (randomId2 < ideaIds.length) ideas[ideaIds[randomId2]].nogos.push(mem);
    }
}

const generateData = (count) => {

    setMemberSkills();
    setIdeaSkills();
    setIdeaPrefs();
    
    console.log("------ Members ------");
    for (const mem in members) {
        console.log(mem);
        console.log(" Skills: " + members[mem].skills.join(", "));
    }
    console.log("------ Ideas ------");
    for (const idea in ideas) {
        console.log(idea);
        console.log(" Skills: " + ideas[idea].skills.join(", "));
        console.log(" Favs: " + ideas[idea].favs.join(", "));
        console.log(" Nogos: " + ideas[idea].nogos.join(", "));
    }

    const data = {"members": members, "ideas": ideas};

    fs.writeFile("Datensatz-" + count + ".tx t", JSON.stringify(data), (err) => {  
        // In case of a error throw err. 
        if (err) throw err; 
    }) 

    return(data);
}

generateData(1);
