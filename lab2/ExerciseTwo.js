// Implements the TaskManager interface, ensuring that all required methods are defined
var TaskList = /** @class */ (function () {
    function TaskList() {
        // Defines tasks as an empty array of strings
        this.tasks = [];
    }
    // Function accepts a task string as input and returns current array length
    TaskList.prototype.addTask = function (task) {
        // Adds the task to the tasks array using .push() and calculates the length
        var length = this.tasks.push(task);
        // Printing a message to the console indicating insertion
        console.log("Task \"".concat(task, "\" added to the list.\n"));
        // Returns current length of the array
        return length;
    };
    // Declaring listAllTasks function
    // Function does not return anything
    TaskList.prototype.listAllTasks = function () {
        console.log("Tasks:");
        // Iterating over each task in the tasks array and printing each item to the console
        this.tasks.forEach(function (task) { return console.log(task); });
        console.log("");
    };
    // Function accepts a task string as input and returns current array length
    TaskList.prototype.deleteTask = function (task) {
        // If the string task is found in the tasks array indexOf() returns its index
        // If not found function returns -1
        var index = this.tasks.indexOf(task);
        if (index > -1) {
            // Removes the task from the array by removing its index
            // deleteCount is set to 1 to remove only the first instance of the task
            this.tasks.splice(index, 1);
            // Printing a message to the console indicating deletion
            console.log("Task \"".concat(task, "\" removed from the list.\n"));
        }
        else {
            console.log("Task \"".concat(task, "\" not found.\n"));
        }
        // Returning the number of elements in the array after the deletion
        return this.tasks.length;
    };
    return TaskList;
}());
// Testing
var myTasks = new TaskList();
myTasks.addTask("Do groceries");
myTasks.addTask("Dust the furniture");
myTasks.listAllTasks();
myTasks.deleteTask("Do groceries");
myTasks.deleteTask("Go to work");
myTasks.listAllTasks();
