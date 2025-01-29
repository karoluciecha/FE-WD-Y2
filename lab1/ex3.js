// Demonstrating Primitive Types in TypeScript
// Boolean Type
var flag = true;
console.log("Boolean Value:", flag);
// String Type
var username = "John Doe";
console.log("String Value:", username);
// Number Type
var age = 30;
console.log("Number Value:", age);
// Array Type
var myArray = [1, 2, 3, 4, 5];
for (var i = 0; i < myArray.length; i++) {
    console.log("Element: " + myArray[i] + " is in myArray");
}
myArray.forEach(function (element) {
    console.log("Element: " + element);
});
// Enum Type
var Color;
(function (Color) {
    Color["Red"] = "Red";
    Color["Green"] = "Green";
    Color["Blue"] = "Blue";
})(Color || (Color = {}));
var favoriteColor = Color.Green;
console.log("Enum Value:", favoriteColor);
// Any Type
var unknown = "Could be anything";
console.log("Any Type Value:", unknown);
// Void Type
function logMessage(message) {
    console.log("Void Function Output:", message);
}
logMessage("This is a void function.");
