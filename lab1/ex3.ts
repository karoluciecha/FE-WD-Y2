// Demonstrating Primitive Types in TypeScript

// Boolean Type
let flag: boolean = true;
console.log("Boolean Value:", flag);

// String Type
let username: string = "John Doe";
console.log("String Value:", username);

// Number Type
let age: number = 30;
console.log("Number Value:", age);

// Array Type
let myArray: number[] = [1, 2, 3, 4, 5];

for (let i = 0; i < myArray.length; i++) {
    console.log("Element: " + myArray[i] + " is in myArray");
}

myArray.forEach((element) => {
    console.log("Element: " + element);
})

// Enum Type
enum Color {
    Red = "Red",
    Green = "Green",
    Blue = "Blue"
}
let favoriteColor: Color = Color.Green;
console.log("Enum Value:", favoriteColor);

// Any Type
let unknown: any = "Could be anything";
console.log("Any Type Value:", unknown);

// Void Type
function logMessage(message: string): void {
    console.log("Void Function Output:", message);
}
logMessage("This is a void function.");