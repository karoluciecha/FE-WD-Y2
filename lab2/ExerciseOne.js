// Creating an array of strings called tasks
var tasks = [];
// Declaring addTask function
// Function recieves a string parameter called 'task' and returns a number
function addTask(task) {
    // Adding a task to the array called tasks
    tasks.push(task);
    console.log("Task \"".concat(task, "\" added to the list.\n"));
    // Returning the number of elements in the array after the insertion
    return tasks.length;
}
// Declaring listAllTasks function
// Function does not return anything
function listAllTasks() {
    console.log("Tasks:");
    // Iterating over each task in the tasks array and printing each item to the console
    tasks.forEach(function (task) { return console.log(task); });
    console.log("");
}
// Declaring addTask function
// Function recieves a string parameter called 'task' and returns a number
function deleteTask(task) {
    // If the string task is found in the tasks array indexOf() returns its index
    // If not found function returns -1
    var index = tasks.indexOf(task);
    if (index > -1) {
        // Removes the task from the array by removing its index
        // array.splice(startIndex, deleteCount);
        tasks.splice(index, 1);
        console.log("Task \"".concat(task, "\" removed from the list.\n"));
    }
    else {
        console.log("Task \"".concat(task, "\" not found.\n"));
    }
    // Returning the number of elements in the array after the deletion
    return tasks.length;
}
// Testing
addTask("Do groceries");
addTask("Dust the furniture");
listAllTasks();
deleteTask("Do groceries");
deleteTask("Go to work");
listAllTasks();
