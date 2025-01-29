// Function parameter and return types

// Part A: function counting characters in string
function countCharacters(input: string): number {
    return input.length;
}

console.log("Output from countCharacters function \" test 1 \": " + countCharacters(" test 1 ")); // Output: 8

// Part B: function counting characters in trimmed string
function countCharactersTrim(input: string): number {
    return input.trim().length;
}

console.log("Output from countCharactersTrim function \" test 1 \": " + countCharactersTrim(" test 1 ")); // Output: 6

// Part C: function counting characters in optionally trimmed string
function countCharactersTrimOption(input: string, option: boolean): number {
    if (option) return input.trim().length;
    return input.length;
}

console.log("Output from countCharactersTrimOption (true) function \" test 1 \": " + countCharactersTrimOption(" test 1 ", true)); // Output: 6
console.log("Output from countCharactersTrimOption (false) function \" test 1 \": " + countCharactersTrimOption(" test 1 ", false)); // Output: 8