const fs = require("fs");
const file = process.argv[2];
let se_file;
try{
    se_file = fs.readFileSync(`./${file}`,{encoding:"ascii"});
}catch{
    console.error(`Cannot load ${file}.`);
    process.exit(1);
}
const hex_splitted = se_file.split("");
if(hex_splitted.slice(0,4).join("") != "SEXE"){
    console.error("Not a Simple Executable file");
    process.exit(1);
}

const program_details = {
    seVersion: 0,
    codeType: 0,
    processorType: 0,
    programTitle: "",
    programDescription: "",
    programVersion: "",
    code: ""
};

const raw_program = hex_splitted.slice(4);
for(let i=0;i<raw_program.length;i++){
    const code = raw_program[i];
    if(code == "V"){
        program_details.seVersion = raw_program[++i].charCodeAt(0);
        continue;
    }else if(code == "T"){
        program_details.codeType = raw_program[++i].charCodeAt(0);
        continue;
    }else if(code == "P"){
        program_details.processorType = raw_program[++i].charCodeAt(0);
        continue;
    }else if(code == "L"){
        for(let j=0;j<30;j++) program_details.programTitle += raw_program[++i];
        continue;
    }else if(code == "D"){
        for(let j=0;j<50;j++) program_details.programDescription += raw_program[++i];
        continue;
    }else if(code == "X"){
        for(let j=0;j<10;j++) program_details.programVersion += raw_program[++i];
        continue;
    }else if(code == "C"){
        while(raw_program[++i] != "@" && i <= raw_program.length-1){
            program_details.code += raw_program[i];
        }
    }else{
        console.error("Invalid declaration: "+code);
        process.exit(1);
    }
}

process.title = program_details.programTitle || program_details.programDescription;
eval(program_details.code);