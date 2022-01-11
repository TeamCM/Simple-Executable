console.log("SE2EXE 1.0.0 by Miguel.exe");
const fs = require("fs");
const pkg = require("pkg");
const file = process.argv[2];
if(!fs.existsSync(`./${file}`)){
    console.error("File does not exist");
    process.exit(1);
}
const se_file = fs.readFileSync(`./${file}`,{encoding:"ascii"});
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

console.log("Creating temporary folder...");
const tmpFolder = fs.mkdtempSync(".se2exe-");
if(process.platform == "win32"){
    require("child_process").execSync(`attrib +h ${tmpFolder}`);
}

console.log("Creating files...");
fs.writeFileSync(`${tmpFolder}/${file}.js`,`process.title=${program_details.programTitle ? JSON.stringify(program_details.programTitle) : JSON.stringify(program_details.programDescription)};${program_details.code}`);
fs.writeFileSync(`${tmpFolder}/package.json`,`{
    "name": "se_program",
    "version": "1.0.0",
    "main": "${file}.js"
}`);
console.log("Compiling...");
process.chdir(tmpFolder);
pkg.exec([`${file}.js`]).then(() => {
    console.log("Finishing...");
    fs.rmSync(`${file}.js`);
    fs.rmSync("package.json");
    fs.readdirSync(".").forEach(f => fs.renameSync(f,`../${f}`));
    process.chdir("..");
    fs.rmdirSync(tmpFolder);
    console.log("Finished!");
}).catch(() => {
    console.error("Could not compile, aborting...");
    fs.rmdirSync(tmpFolder);
    process.exit(1);
});