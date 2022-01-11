# Simple-Executable
A file format to executables meant to be easy to create, parse and execute.

## File Header:

```js
const program_details = {
    seVersion: 0,
    codeType: 0,
    processorType: 0,
    programTitle: "",
    programDescription: "",
    programVersion: "",
    code: ""
};
```

- Magic Number: `53 45 58 45` in hexadecimal (or SEXE in ASCII)

## Understanding File Header:
Every hexadecimal is a variable, so it dosent need to be in order, except with the `43`, the actual code and `40`, which it needs to be in the end.
Every variable has its own type, it can be a `int` or a `string` along with its own size (if is a string).

`56` is referred as the file format version, currently this value is 1.
`54` is referred as the type of code which the interpreter will run. Currently the possibles values are:
- `00` to machine code
- `01` to custom ones or not documented ones
- `02` to Lua binary.

`50` is referred as the processor type which will run. Currently the possibles values are:
- `00` to no instruction (all processors).
- `01` to Intel x86
- `02` to AMD x86-64
- `03` to Lua 5.2
- `04` to Lua 5.3

`4C` is referred as the program title which will be appear to the Processor Manager / Task Manager of the Operating System.
The length of the string is 30 characters long. If a string is minor than 30 characters, write after all the string with the byte `00`.

`44` is referred as the program description which can be read by a command or the Operating System shell.
The length of the string is 50 characters long. If a string is minor than 30 characters, write after all the string with the byte `00`.

`58` is referred as the program version which can be read by a command or the Operating System shell.
The length of the string is 10 characters long. If a string is minor than 30 characters, write after all the string with the byte `00`.

`43` is referred as the start of program code, will read until is the end of the file and finds a `40`.

`40` is referred as the end of the code, the end of code is valid when placed before the end of file.

### Note:
Simple Executable can support any codes (to ascii to binary ones)
